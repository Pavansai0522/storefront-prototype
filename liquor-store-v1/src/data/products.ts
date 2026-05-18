import { Product } from '../components/ProductCatalog';

export const allProducts: Product[] = [
// Spirits
{
  id: 1,
  name: "Jack Daniel's Old No.7",
  brand: 'Tennessee Whiskey',
  category: 'Whisky',
  price: 29.99,
  badge: 'BESTSELLER',
  image:
  'https://images.unsplash.com/photo-1527281400683-1aae777175f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
},
{
  id: 2,
  name: 'Johnnie Walker Black',
  brand: 'Blended Scotch Whisky',
  category: 'Scotch',
  price: 39.99,
  badge: 'FEATURED',
  image:
  'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
},
{
  id: 3,
  name: 'Grey Goose Vodka',
  brand: 'Premium French Vodka',
  category: 'Vodka',
  price: 44.99,
  badge: 'FEATURED',
  inStock: false,
  image:
  'https://images.unsplash.com/photo-1614315584646-992144d03e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
},
{
  id: 6,
  name: 'Don Julio Blanco',
  brand: '100% Agave Tequila',
  category: 'Tequila',
  price: 54.99,
  badge: 'FEATURED',
  image:
  'https://images.unsplash.com/photo-1527281400683-1aae777175f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
},
{
  id: 7,
  name: "Hendrick's Gin",
  brand: 'Scottish Gin',
  category: 'Vodka',
  price: 34.99,
  image:
  'https://images.unsplash.com/photo-1614315584646-992144d03e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
},
{
  id: 8,
  name: 'Macallan 12 Year',
  brand: 'Single Malt Scotch',
  category: 'Scotch',
  price: 79.99,
  badge: 'PREMIUM',
  image:
  'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
},
{
  id: 15,
  name: 'Glenfiddich 15 Year',
  brand: 'Speyside Single Malt',
  category: 'Scotch',
  price: 64.99,
  badge: 'FEATURED',
  image:
  'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
},
{
  id: 16,
  name: 'Lagavulin 16 Year',
  brand: 'Islay Single Malt',
  category: 'Scotch',
  price: 99.99,
  badge: 'PREMIUM',
  image:
  'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
},
{
  id: 17,
  name: 'Oban 14 Year',
  brand: 'West Highland Single Malt',
  category: 'Scotch',
  price: 74.99,
  image:
  'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
},
{
  id: 18,
  name: 'Pappy Van Winkle Family Reserve 15 Year',
  brand: 'Kentucky Straight Bourbon',
  category: 'Rare Bottles',
  price: 899.99,
  badge: 'RARE',
  image:
  'https://images.unsplash.com/photo-1527281400683-1aae777175f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
},
{
  id: 19,
  name: 'Yamazaki 12 Year',
  brand: 'Japanese Single Malt',
  category: 'Rare Bottles',
  price: 249.99,
  badge: 'RARE',
  image:
  'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
},
{
  id: 20,
  name: 'The Macallan 18 Sherry Oak',
  brand: 'Highland Single Malt',
  category: 'Rare Bottles',
  price: 449.99,
  badge: 'RARE',
  image:
  'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
},
{
  id: 21,
  name: 'Bacardi Superior',
  brand: 'White Rum',
  category: 'Rum',
  price: 14.99,
  image:
  'https://images.unsplash.com/photo-1614315584646-992144d03e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
},
{
  id: 22,
  name: 'Hennessy VS',
  brand: 'Cognac',
  category: 'Rum',
  price: 42.99,
  badge: 'BESTSELLER',
  image:
  'https://images.unsplash.com/photo-1614315584646-992144d03e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
},

// Wine
{
  id: 4,
  name: 'Caymus Cabernet',
  brand: 'Napa Valley Red Wine',
  category: 'Wine',
  price: 89.99,
  badge: 'PREMIUM',
  image:
  'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
},
{
  id: 9,
  name: 'Veuve Clicquot Brut',
  brand: 'Champagne',
  category: 'Wine',
  price: 64.99,
  badge: 'BESTSELLER',
  image:
  'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
},
{
  id: 10,
  name: 'Meiomi Pinot Noir',
  brand: 'California Red Wine',
  category: 'Wine',
  price: 22.99,
  image:
  'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
},
{
  id: 11,
  name: 'Kim Crawford Sauvignon Blanc',
  brand: 'New Zealand White Wine',
  category: 'Wine',
  price: 17.99,
  image:
  'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
},

// Beer
{
  id: 5,
  name: 'Corona Extra 12pk',
  brand: 'Mexican Lager Beer',
  category: 'Beer',
  price: 18.99,
  badge: 'BESTSELLER',
  image:
  'https://images.unsplash.com/photo-1614315584646-992144d03e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
},
{
  id: 12,
  name: 'Guinness Draught 6pk',
  brand: 'Irish Stout',
  category: 'Beer',
  price: 11.99,
  inStock: false,
  image:
  'https://images.unsplash.com/photo-1614315584646-992144d03e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
},
{
  id: 13,
  name: 'Blue Moon Belgian White 6pk',
  brand: 'Wheat Ale',
  category: 'Beer',
  price: 10.99,
  image:
  'https://images.unsplash.com/photo-1614315584646-992144d03e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
},
{
  id: 14,
  name: 'Sierra Nevada Pale Ale 6pk',
  brand: 'Craft Beer',
  category: 'Beer',
  price: 12.99,
  image:
  'https://images.unsplash.com/photo-1614315584646-992144d03e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
}];