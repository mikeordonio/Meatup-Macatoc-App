import { CartService } from './cart.service';
import { Product } from '../models/product.model';

const product: Product = {
  id: 'product-1',
  shopId: 'shop-1',
  shopName: 'Test Shop',
  ownerId: 'owner-1',
  name: 'Pork belly',
  category: 'pork',
  description: 'Fresh pork belly',
  pricePerKilogram: 300,
  availableQuantityKg: 2,
  imageBase64: '',
  isAvailable: true,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

describe('CartService', () => {
  it('accepts quarter-kilogram quantities and calculates shop totals', () => {
    const service = new CartService();

    service.add(product, 0.25);

    expect(service.items[0].quantityKg).toBe(0.25);
    expect(service.totalForShop('shop-1')).toBe(75);
  });

  it('rejects quantities that are not quarter-kilogram increments', () => {
    const service = new CartService();

    expect(() => service.add(product, 0.3)).toThrow('0.25 kg increments');
  });

  it('rejects quantities above available stock', () => {
    const service = new CartService();

    expect(() => service.add(product, 2.25)).toThrow('exceeds available stock');
  });
});
