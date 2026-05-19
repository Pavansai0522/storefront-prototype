export type FeaturedProduct = {
  id: number;
  brand: string;
  name: string;
  price: string;
  emi: string;
  image: string;
  type: 'watch' | 'toy' | 'accessory';
};
