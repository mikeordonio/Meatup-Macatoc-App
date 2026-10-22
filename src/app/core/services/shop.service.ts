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

import { Shop, ShopInput, ShopStatus } from '../models/shop.model';
import { firestore } from './firebase';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ShopService {
  private readonly authService = inject(AuthService);

  async createShop(input: ShopInput): Promise<Shop> {
    const profile = this.authService.currentProfile;
    if (!profile || profile.role !== 'shopOwner') {
      throw new Error('Only shop owners can submit a shop.');
    }
    const existingShops = await this.getOwnerShops();
    if (existingShops.length > 0) {
      throw new Error('Each shop owner can register only one shop. Edit your existing shop instead.');
    }

    const timestamp = new Date().toISOString();
    const shopData = {
      ...input,
      ownerId: profile.uid,
      ownerName: profile.name,
      status: 'pending' as ShopStatus,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    const reference = await addDoc(collection(firestore, 'shops'), shopData);
    return { id: reference.id, ...shopData };
  }

  async updateShop(shopId: string, input: ShopInput): Promise<void> {
    const profile = this.authService.currentProfile;
    if (!profile || profile.role !== 'shopOwner') {
      throw new Error('Only shop owners can edit a shop.');
    }

    await updateDoc(doc(firestore, 'shops', shopId), {
      ...input,
      updatedAt: new Date().toISOString(),
    });
  }

  async getOwnerShops(): Promise<Shop[]> {
    const profile = this.authService.currentProfile;
    if (!profile || profile.role !== 'shopOwner') {
      return [];
    }

    const snapshot = await getDocs(
      query(collection(firestore, 'shops'), where('ownerId', '==', profile.uid)),
    );
    return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as Shop);
  }

  async getApprovedShops(): Promise<Shop[]> {
    const snapshot = await getDocs(
      query(collection(firestore, 'shops'), where('status', '==', 'approved')),
    );
    return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as Shop);
  }

  async getAllShops(): Promise<Shop[]> {
    const snapshot = await getDocs(collection(firestore, 'shops'));
    return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as Shop);
  }

  async updateStatus(shopId: string, status: ShopStatus): Promise<void> {
    if (this.authService.currentProfile?.role !== 'admin') {
      throw new Error('Only administrators can change shop status.');
    }

    await updateDoc(doc(firestore, 'shops', shopId), {
      status,
      updatedAt: new Date().toISOString(),
    });
  }
}
