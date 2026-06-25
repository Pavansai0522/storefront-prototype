import type { ProductSeedItem } from './types';

/** Prices are US cents (liquor-store-v1 maps price_inr as shelf cents). */
function usd(cents: number): number {
  return cents;
}

const BOTTLE =
  'https://images.unsplash.com/photo-1569529465841-dfecdab7503a?w=400&h=400&fit=crop';
const WINE =
  'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=400&fit=crop';
const BEER =
  'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=400&fit=crop';

/** Sample spirits catalog for liquor-store-v1 storefronts. */
export function liquorCatalogItems(): ProductSeedItem[] {
  return [
    {
      name: "Jack Daniel's Old No. 7",
      brand: 'Jack Daniel\'s',
      priceInr: usd(2699),
      imageUrl: BOTTLE,
      category: 'Whisky',
      isAccessory: false,
      featuredGroup: 'deal',
      featuredSort: 0,
    },
    {
      name: 'Jameson Irish Whiskey',
      brand: 'Jameson',
      priceInr: usd(3299),
      imageUrl: BOTTLE,
      category: 'Whisky',
      isAccessory: false,
    },
    {
      name: 'Macallan 12 Double Cask',
      brand: 'Macallan',
      priceInr: usd(8999),
      imageUrl: BOTTLE,
      category: 'Scotch',
      isAccessory: false,
    },
    {
      name: 'Glenfiddich 15 Solera',
      brand: 'Glenfiddich',
      priceInr: usd(7499),
      imageUrl: BOTTLE,
      category: 'Scotch',
      isAccessory: false,
      featuredGroup: 'deal',
      featuredSort: 1,
    },
    {
      name: 'Pappy Van Winkle 15',
      brand: 'Old Rip Van Winkle',
      priceInr: usd(24999),
      imageUrl: BOTTLE,
      category: 'Rare Bottles',
      isAccessory: false,
    },
    {
      name: 'Moët & Chandon Impérial',
      brand: 'Moët',
      priceInr: usd(5499),
      imageUrl: WINE,
      category: 'Wine',
      isAccessory: false,
    },
    {
      name: 'Caymus Cabernet Sauvignon',
      brand: 'Caymus',
      priceInr: usd(8999),
      imageUrl: WINE,
      category: 'Wine',
      isAccessory: false,
    },
    {
      name: 'Grey Goose Vodka',
      brand: 'Grey Goose',
      priceInr: usd(3999),
      imageUrl: BOTTLE,
      category: 'Vodka',
      isAccessory: false,
    },
    {
      name: 'Hendrick\'s Gin',
      brand: 'Hendrick\'s',
      priceInr: usd(4299),
      imageUrl: BOTTLE,
      category: 'Vodka',
      isAccessory: false,
      featuredGroup: 'deal',
      featuredSort: 2,
    },
    {
      name: 'Sierra Nevada Pale Ale 6-pack',
      brand: 'Sierra Nevada',
      priceInr: usd(1199),
      imageUrl: BEER,
      category: 'Beer',
      isAccessory: false,
    },
    {
      name: 'Guinness Draught 4-pack',
      brand: 'Guinness',
      priceInr: usd(999),
      imageUrl: BEER,
      category: 'Beer',
      isAccessory: false,
    },
    {
      name: 'Patrón Silver Tequila',
      brand: 'Patrón',
      priceInr: usd(4999),
      imageUrl: BOTTLE,
      category: 'Tequila',
      isAccessory: false,
    },
    {
      name: 'Bacardi Superior Rum',
      brand: 'Bacardi',
      priceInr: usd(2199),
      imageUrl: BOTTLE,
      category: 'Rum',
      isAccessory: false,
    },
    {
      name: 'Hennessy VS',
      brand: 'Hennessy',
      priceInr: usd(4599),
      imageUrl: BOTTLE,
      category: 'Rum',
      isAccessory: false,
    },
  ];
}
