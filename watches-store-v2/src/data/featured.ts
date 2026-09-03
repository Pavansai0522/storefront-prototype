export type FeaturedProduct = {
  productId: string;
  sortOrder: number;
  brand: string;
  name: string;
  price: string;
  priceInr: number;
  emi: string;
  image: string;
  type: 'watch' | 'toy' | 'accessory';
  colors: string[];
};
