import { Injectable, inject } from '@angular/core';
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';

import { Product, ProductInput } from '../models/product.model';
import { firestore } from './firebase';
import { AuthService } from './auth.service';
import { ShopService } from './shop.service';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly authService = inject(AuthService);
  private readonly shopService = inject(ShopService);

  async createProduct(input: ProductInput): Promise<Product> {
    this.validateInput(input);
    const profile = this.authService.currentProfile;
    if (!profile || profile.role !== 'shopOwner') {
      throw new Error('Only shop owners can manage products.');
    }

    const shop = (await this.shopService.getOwnerShops()).find((item) => item.id === input.shopId);
    if (!shop || shop.status !== 'approved') {
      throw new Error('Products can only be added to an approved shop.');
    }

    const timestamp = new Date().toISOString();
    const productData = {
      ...input,
      shopName: shop.name,
      ownerId: profile.uid,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    const reference = await addDoc(collection(firestore, 'products'), productData);
    return { id: reference.id, ...productData };
  }

  async updateProduct(productId: string, input: ProductInput): Promise<void> {
    this.validateInput(input);
    const profile = this.authService.currentProfile;
    if (!profile || profile.role !== 'shopOwner') {
      throw new Error('Only shop owners can manage products.');
    }

    const shop = (await this.shopService.getOwnerShops()).find((item) => item.id === input.shopId);
    if (!shop || shop.status !== 'approved') {
      throw new Error('Products can only belong to an approved shop.');
    }

    await updateDoc(doc(firestore, 'products', productId), {
      ...input,
      shopName: shop.name,
      updatedAt: new Date().toISOString(),
    });
  }

  async convertProductImageToBase64(file: File): Promise<string> {
    const profile = this.authService.currentProfile;
    if (!profile || profile.role !== 'shopOwner') {
      throw new Error('Only shop owners can upload product images.');
    }
    if (!file.type.startsWith('image/')) {
      throw new Error('Only image files can be uploaded.');
    }
    if (file.size > 700 * 1024) {
      throw new Error('Product images must be 700 KB or smaller when stored in Firestore.');
    }

    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result !== 'string') {
          reject(new Error('Unable to convert the image to Base64.'));
          return;
        }
        resolve(reader.result);
      };
      reader.onerror = () => reject(new Error('Unable to read the image file.'));
      reader.readAsDataURL(file);
    });
  }

  async getOwnerProducts(): Promise<Product[]> {
    const profile = this.authService.currentProfile;
    if (!profile || profile.role !== 'shopOwner') {
      return [];
    }

    const snapshot = await getDocs(
      query(collection(firestore, 'products'), where('ownerId', '==', profile.uid)),
    );
    return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as Product);
  }

  async getAvailableProducts(): Promise<Product[]> {
    const approvedShops = await this.shopService.getApprovedShops();
    const shopIds = approvedShops.map((shop) => shop.id);
    const productSnapshots = [];

    for (let index = 0; index < shopIds.length; index += 30) {
      productSnapshots.push(
        getDocs(
          query(
            collection(firestore, 'products'),
            where('shopId', 'in', shopIds.slice(index, index + 30)),
          ),
        ),
      );
    }

    const snapshots = await Promise.all(productSnapshots);
    return snapshots.flatMap((snapshot) => snapshot.docs
      .map((item) => ({ id: item.id, ...item.data() }) as Product)
      .filter((product) => product.isAvailable && product.availableQuantityKg > 0));
  }

  private validateInput(input: ProductInput): void {
    if (!input.name.trim() || !input.description.trim()) {
      throw new Error('Product name and description are required.');
    }
    if (!Number.isFinite(input.pricePerKilogram) || input.pricePerKilogram <= 0) {
      throw new Error('Price must be greater than zero.');
    }
    if (!Number.isFinite(input.availableQuantityKg) || input.availableQuantityKg < 0
      || Math.round(input.availableQuantityKg * 4) !== input.availableQuantityKg * 4) {
      throw new Error('Quantity must be zero or a multiple of 0.25 kg.');
    }
  }
}
