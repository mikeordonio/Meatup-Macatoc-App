export type ShopStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export interface Shop {
  id: string;
  ownerId: string;
  ownerName: string;
  name: string;
  address: string;
  serviceArea: string;
  contactNumber: string;
  description: string;
  imageUrl: string;
  status: ShopStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ShopInput {
  name: string;
  address: string;
  serviceArea: string;
  contactNumber: string;
  description: string;
  imageUrl: string;
}
