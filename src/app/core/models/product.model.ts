export type ProductCategory = 'pork' | 'chicken';

export interface Product {
  id: string;
  shopId: string;
  shopName: string;
  ownerId: string;
  name: string;
  category: ProductCategory;
  description: string;
  pricePerKilogram: number;
  availableQuantityKg: number;
  imageBase64: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductInput {
  shopId: string;
  name: string;
  category: ProductCategory;
  description: string;
  pricePerKilogram: number;
  availableQuantityKg: number;
  imageBase64: string;
  isAvailable: boolean;
}
