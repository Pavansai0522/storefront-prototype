export type FeaturedProduct = {
  id: number;
  brand: string;
  name: string;
  price: string;
  emi: string;
  image: string;
  type: 'watch' | 'toy' | 'accessory';
};

const W1 =
  'https://images.unsplash.com/photo-1584302360444-1453c11c9c8f?auto=format&fit=crop&q=80&w=600';
const W2 =
  'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=600';
const W3 =
  'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80&w=600';
const W4 =
  'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&q=80&w=600';
const T1 =
  'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?auto=format&fit=crop&q=80&w=600';
const T2 =
  'https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&q=80&w=600';

export const FEATURED_WATCHES: FeaturedProduct[] = [
  { id: 1, brand: 'CASIO', name: 'G-Shock GA-2100', price: '₹8,999', emi: '₹750', image: W1, type: 'watch' },
  { id: 2, brand: 'TITAN', name: 'Edge Ceramic', price: '₹12,499', emi: '₹1,042', image: W2, type: 'watch' },
  { id: 3, brand: 'FOSSIL', name: 'Gen 6 Smartwatch', price: '₹24,999', emi: '₹2,083', image: W3, type: 'watch' },
  { id: 4, brand: 'APPLE', name: 'Watch SE (GPS)', price: '₹29,999', emi: '₹2,500', image: W4, type: 'watch' },
  { id: 5, brand: 'SAMSUNG', name: 'Galaxy Watch 6', price: '₹27,999', emi: '₹2,333', image: W3, type: 'watch' },
  { id: 6, brand: 'NOISE', name: 'ColorFit Pro 5', price: '₹3,499', emi: '₹292', image: W1, type: 'watch' },
  { id: 7, brand: 'FIRE-BOLTT', name: 'Ninja Call Pro', price: '₹1,999', emi: '₹167', image: W2, type: 'watch' },
  { id: 8, brand: 'TITAN', name: 'Raga Rose Gold', price: '₹6,495', emi: '₹542', image: W2, type: 'watch' },
];

export const FEATURED_TOYS: FeaturedProduct[] = [
  { id: 101, brand: 'LEGO', name: 'Classic Bricks Box 10698', price: '₹2,499', emi: 'Best Seller', image: T1, type: 'toy' },
  { id: 102, brand: 'HOT WHEELS', name: '5-Car Pack', price: '₹699', emi: 'Kids Favorite', image: T2, type: 'toy' },
  { id: 103, brand: 'SYMA', name: 'Remote Control Racing Car', price: '₹1,899', emi: 'New Arrival', image: T2, type: 'toy' },
  { id: 104, brand: 'FUNSKOOL', name: 'Soft Plush Teddy (Large)', price: '₹1,299', emi: 'Gift Pick', image: T1, type: 'toy' },
  { id: 105, brand: 'SMARTIVITY', name: 'STEM Robotics Kit', price: '₹1,899', emi: 'Learning', image: T2, type: 'toy' },
  { id: 106, brand: 'PLAYSHIFU', name: 'Orboot Earth Globe', price: '₹2,999', emi: 'Educational', image: T1, type: 'toy' },
];
