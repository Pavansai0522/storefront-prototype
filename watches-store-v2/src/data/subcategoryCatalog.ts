import type { CatalogTileItem, SubcategoryCatalogKey } from '../types/catalogTile.types';

const W = [
  'https://images.unsplash.com/photo-1584302360444-1453c11c9c8f?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=400',
];

const T = [
  'https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1536010302167-e8d83f1d9207?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=400',
];

const A = [
  'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1545127398-14661f10bc88?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=400',
];

type ProductDef = {
  id: string;
  name: string;
  brand: string;
  priceInr: number;
};

function toItems(defs: ProductDef[], images: string[]): CatalogTileItem[] {
  return defs.map((d, i) => ({
    id: d.id,
    name: d.name,
    brand: d.brand,
    priceInr: d.priceInr,
    priceLabel: `₹${d.priceInr.toLocaleString('en-IN')}`,
    image: images[i % images.length],
  }));
}

const SMART_WATCHES: ProductDef[] = [
  { id: 'sw-1', name: 'Apple Watch SE (GPS, 44mm)', brand: 'Apple', priceInr: 29999 },
  { id: 'sw-2', name: 'Samsung Galaxy Watch 6', brand: 'Samsung', priceInr: 27999 },
  { id: 'sw-3', name: 'Noise ColorFit Pro 5', brand: 'Noise', priceInr: 3499 },
  { id: 'sw-4', name: 'Fire-Boltt Ninja Call Pro', brand: 'Fire-Boltt', priceInr: 1999 },
  { id: 'sw-5', name: 'Boat Wave Call 2', brand: 'Boat', priceInr: 2499 },
  { id: 'sw-6', name: 'Fossil Gen 6 Wellness', brand: 'Fossil', priceInr: 24999 },
  { id: 'sw-7', name: 'Amazfit Bip 5', brand: 'Amazfit', priceInr: 6999 },
  { id: 'sw-8', name: 'Realme Watch 3 Pro', brand: 'Realme', priceInr: 3999 },
  { id: 'sw-9', name: 'Garmin Forerunner 55', brand: 'Garmin', priceInr: 19999 },
  { id: 'sw-10', name: 'Huawei Watch Fit 3', brand: 'Huawei', priceInr: 8999 },
  { id: 'sw-11', name: 'Crossbeats Orbit', brand: 'Crossbeats', priceInr: 2999 },
  { id: 'sw-12', name: 'pTron Force X10', brand: 'pTron', priceInr: 1499 },
];

const DIAL_WATCHES: ProductDef[] = [
  { id: 'dw-1', name: 'Casio G-Shock GA-2100', brand: 'Casio', priceInr: 8999 },
  { id: 'dw-2', name: 'Titan Edge Ceramic', brand: 'Titan', priceInr: 12499 },
  { id: 'dw-3', name: 'Fastrack Reflex', brand: 'Fastrack', priceInr: 2495 },
  { id: 'dw-4', name: 'Timex Weekender', brand: 'Timex', priceInr: 3995 },
  { id: 'dw-5', name: 'Citizen Eco-Drive', brand: 'Citizen', priceInr: 18999 },
  { id: 'dw-6', name: 'Fossil Grant Chronograph', brand: 'Fossil', priceInr: 14995 },
  { id: 'dw-7', name: 'Sonata Super Fibre', brand: 'Sonata', priceInr: 1995 },
  { id: 'dw-8', name: 'Titan Raga Rose Gold', brand: 'Titan', priceInr: 6495 },
  { id: 'dw-9', name: 'Casio Enticer', brand: 'Casio', priceInr: 5495 },
  { id: 'dw-10', name: 'Maxima Attivo', brand: 'Maxima', priceInr: 1299 },
  { id: 'dw-11', name: 'Daniel Klein Classic', brand: 'Daniel Klein', priceInr: 3999 },
  { id: 'dw-12', name: 'Tissot Everytime', brand: 'Tissot', priceInr: 32999 },
];

const KIDS_WATCHES: ProductDef[] = [
  { id: 'kw-1', name: 'Zoop Disney Princess', brand: 'Zoop', priceInr: 899 },
  { id: 'kw-2', name: 'Skmei Digital Kids', brand: 'Skmei', priceInr: 699 },
  { id: 'kw-3', name: 'Ben 10 Omnitrix Watch', brand: 'Ben 10', priceInr: 1299 },
  { id: 'kw-4', name: 'Marvel Spiderman LED', brand: 'Marvel', priceInr: 1499 },
  { id: 'kw-5', name: 'Titan Zoop Unicorn', brand: 'Titan', priceInr: 995 },
  { id: 'kw-6', name: 'Fastrack Kids Reflex', brand: 'Fastrack', priceInr: 1995 },
  { id: 'kw-7', name: 'Noise Play Kids', brand: 'Noise', priceInr: 2499 },
  { id: 'kw-8', name: 'Hello Kitty Analog', brand: 'Hello Kitty', priceInr: 799 },
  { id: 'kw-9', name: 'Chhota Bheem Digital', brand: 'Green Gold', priceInr: 899 },
  { id: 'kw-10', name: 'Paw Patrol Adventure', brand: 'Paw Patrol', priceInr: 1199 },
  { id: 'kw-11', name: 'Frozen Elsa Watch', brand: 'Disney', priceInr: 1099 },
  { id: 'kw-12', name: 'Batman Utility Watch', brand: 'DC', priceInr: 1399 },
];

const RC_TOYS: ProductDef[] = [
  { id: 'rc-1', name: 'Syma Remote Helicopter', brand: 'Syma', priceInr: 2499 },
  { id: 'rc-2', name: 'Hot Wheels Track Set', brand: 'Hot Wheels', priceInr: 1899 },
  { id: 'rc-3', name: 'Maisto RC Sports Car', brand: 'Maisto', priceInr: 1599 },
  { id: 'rc-4', name: 'Traxxas Rustler Body', brand: 'Traxxas', priceInr: 8999 },
  { id: 'rc-5', name: 'Lego Technic Race Buggy', brand: 'Lego', priceInr: 3499 },
  { id: 'rc-6', name: 'DJI Mini Drone Toy', brand: 'DJI', priceInr: 12999 },
  { id: 'rc-7', name: 'RC Monster Truck 1:16', brand: 'AdraxX', priceInr: 2199 },
  { id: 'rc-8', name: 'Battleship RC Boat', brand: 'Zest 4 Toyz', priceInr: 1799 },
  { id: 'rc-9', name: 'RC Fighter Jet Glider', brand: 'Wishkey', priceInr: 999 },
  { id: 'rc-10', name: 'Off-Road Rock Crawler', brand: 'Exceed', priceInr: 4499 },
  { id: 'rc-11', name: 'RC Stunt Spin Car', brand: 'Toyshine', priceInr: 1299 },
  { id: 'rc-12', name: 'RC Train Set Deluxe', brand: 'Funskool', priceInr: 2999 },
];

const SOFT_TOYS: ProductDef[] = [
  { id: 'sf-1', name: 'Giant Teddy Bear 4ft', brand: 'Archies', priceInr: 2499 },
  { id: 'sf-2', name: 'Unicorn Plush Pillow', brand: 'Tickles', priceInr: 899 },
  { id: 'sf-3', name: 'Minion Soft Toy', brand: 'Fun Zoo', priceInr: 699 },
  { id: 'sf-4', name: 'Panda Hug Pillow', brand: 'Mirada', priceInr: 1199 },
  { id: 'sf-5', name: 'Mickey Mouse Plush', brand: 'Disney', priceInr: 999 },
  { id: 'sf-6', name: 'Doraemon Soft Toy', brand: 'Joyk', priceInr: 799 },
  { id: 'sf-7', name: 'Heart Cushion Pair', brand: 'Archies', priceInr: 599 },
  { id: 'sf-8', name: 'Elephant Jumbo Plush', brand: 'Tickles', priceInr: 1499 },
  { id: 'sf-9', name: 'Puppy Dog Soft Toy', brand: 'Fun Zoo', priceInr: 549 },
  { id: 'sf-10', name: 'Giraffe Neck Pillow', brand: 'Mirada', priceInr: 649 },
  { id: 'sf-11', name: 'Bunny Rabbit Large', brand: 'Joyk', priceInr: 899 },
  { id: 'sf-12', name: 'Superhero Plush Set', brand: 'Marvel', priceInr: 1999 },
];

const EDUCATION_TOYS: ProductDef[] = [
  { id: 'ed-1', name: 'Lego Classic 10698', brand: 'Lego', priceInr: 2499 },
  { id: 'ed-2', name: 'Smartivity Hydraulic Crane', brand: 'Smartivity', priceInr: 1899 },
  { id: 'ed-3', name: 'Skillmatics Brain Games', brand: 'Skillmatics', priceInr: 499 },
  { id: 'ed-4', name: 'PlayShifu Orboot Earth', brand: 'PlayShifu', priceInr: 2999 },
  { id: 'ed-5', name: 'Funskool Giggles Stack', brand: 'Funskool', priceInr: 699 },
  { id: 'ed-6', name: 'Abacus Learning Kit', brand: 'Flintobox', priceInr: 899 },
  { id: 'ed-7', name: 'Magnetic Tiles 60pc', brand: 'Playmags', priceInr: 2199 },
  { id: 'ed-8', name: 'Science Experiment Box', brand: 'Butterfly Edufields', priceInr: 1299 },
  { id: 'ed-9', name: 'Wooden Alphabet Puzzle', brand: 'Skillofun', priceInr: 449 },
  { id: 'ed-10', name: 'Coding Robot Starter', brand: 'Avishkaar', priceInr: 3999 },
  { id: 'ed-11', name: 'Solar System Model', brand: 'Ekta', priceInr: 599 },
  { id: 'ed-12', name: 'Chess & Checkers Combo', brand: 'Funskool', priceInr: 399 },
];

const CABLES: ProductDef[] = [
  { id: 'cb-1', name: 'Boat Type-C 1.2m', brand: 'Boat', priceInr: 299 },
  { id: 'cb-2', name: 'Apple USB-C to Lightning', brand: 'Apple', priceInr: 1990 },
  { id: 'cb-3', name: 'Mi Braided USB-C', brand: 'Mi', priceInr: 399 },
  { id: 'cb-4', name: 'Portronics Konnect L', brand: 'Portronics', priceInr: 349 },
  { id: 'cb-5', name: 'AmazonBasics Micro USB', brand: 'AmazonBasics', priceInr: 249 },
  { id: 'cb-6', name: 'Anker PowerLine III', brand: 'Anker', priceInr: 899 },
  { id: 'cb-7', name: 'Fast Charge 3-in-1', brand: 'Boat', priceInr: 699 },
  { id: 'cb-8', name: 'Lightning 2m MFi', brand: 'Belkin', priceInr: 1499 },
  { id: 'cb-9', name: 'Type-C to C 100W', brand: 'Anker', priceInr: 1199 },
  { id: 'cb-10', name: 'Magnetic Charge Cable', brand: 'Portronics', priceInr: 499 },
  { id: 'cb-11', name: 'Retractable 4-in-1', brand: 'Ugreen', priceInr: 799 },
  { id: 'cb-12', name: 'Car Charger Dual USB', brand: 'Mi', priceInr: 449 },
];

const HEADPHONES: ProductDef[] = [
  { id: 'hp-1', name: 'Sony WH-CH520', brand: 'Sony', priceInr: 4990 },
  { id: 'hp-2', name: 'JBL Tune 770NC', brand: 'JBL', priceInr: 6999 },
  { id: 'hp-3', name: 'Boat Rockerz 450', brand: 'Boat', priceInr: 1499 },
  { id: 'hp-4', name: 'Noise Buds VS104', brand: 'Noise', priceInr: 1299 },
  { id: 'hp-5', name: 'Sennheiser HD 400S', brand: 'Sennheiser', priceInr: 6990 },
  { id: 'hp-6', name: 'Realme Buds T300', brand: 'Realme', priceInr: 2299 },
  { id: 'hp-7', name: 'Apple EarPods USB-C', brand: 'Apple', priceInr: 1990 },
  { id: 'hp-8', name: 'Boult Audio Z40', brand: 'Boult', priceInr: 999 },
  { id: 'hp-9', name: 'Skullcandy Dime 2', brand: 'Skullcandy', priceInr: 2999 },
  { id: 'hp-10', name: 'OnePlus Nord Buds 2r', brand: 'OnePlus', priceInr: 2799 },
  { id: 'hp-11', name: 'boAt Airdopes 141', brand: 'Boat', priceInr: 999 },
  { id: 'hp-12', name: 'JBL Go 4 Speaker', brand: 'JBL', priceInr: 3999 },
];

const PHONE_ACCESSORIES: ProductDef[] = [
  { id: 'pa-1', name: 'Spigen Ultra Hybrid Case', brand: 'Spigen', priceInr: 1499 },
  { id: 'pa-2', name: 'Ringke Fusion Clear', brand: 'Ringke', priceInr: 899 },
  { id: 'pa-3', name: 'Tempered Glass iPhone 15', brand: 'DailyObjects', priceInr: 499 },
  { id: 'pa-4', name: 'PopSocket Grip Black', brand: 'PopSocket', priceInr: 699 },
  { id: 'pa-5', name: 'Nilkin CamShield Pro', brand: 'Nilkin', priceInr: 799 },
  { id: 'pa-6', name: 'MagSafe Wallet Stand', brand: 'Case-Mate', priceInr: 1999 },
  { id: 'pa-7', name: 'Car Phone Mount', brand: 'Portronics', priceInr: 599 },
  { id: 'pa-8', name: 'Samsung Silicone Case', brand: 'Samsung', priceInr: 1299 },
  { id: 'pa-9', name: 'Anti-Dust Plug Set', brand: 'Ambrane', priceInr: 199 },
  { id: 'pa-10', name: 'Selfie Ring Light Clip', brand: 'Digitek', priceInr: 449 },
  { id: 'pa-11', name: 'Leather Flip Cover', brand: 'Flipkart SmartBuy', priceInr: 399 },
  { id: 'pa-12', name: 'Wireless Power Bank 10K', brand: 'Mi', priceInr: 1999 },
];

const GADGETS: ProductDef[] = [
  { id: 'gd-1', name: 'Portronics Power Bank 20K', brand: 'Portronics', priceInr: 1499 },
  { id: 'gd-2', name: 'Mi Smart Band 8', brand: 'Mi', priceInr: 2799 },
  { id: 'gd-3', name: 'Realme Pad Mini Cover', brand: 'Realme', priceInr: 999 },
  { id: 'gd-4', name: 'Anker Nano Charger 30W', brand: 'Anker', priceInr: 2499 },
  { id: 'gd-5', name: 'Ubon Bluetooth Speaker', brand: 'Ubon', priceInr: 899 },
  { id: 'gd-6', name: 'TP-Link WiFi Extender', brand: 'TP-Link', priceInr: 1999 },
  { id: 'gd-7', name: 'Fire TV Stick Lite', brand: 'Amazon', priceInr: 3999 },
  { id: 'gd-8', name: 'USB LED Desk Lamp', brand: 'Wipro', priceInr: 649 },
  { id: 'gd-9', name: 'Wireless Mouse', brand: 'Logitech', priceInr: 695 },
  { id: 'gd-10', name: 'Tripod with Phone Holder', brand: 'Digitek', priceInr: 799 },
  { id: 'gd-11', name: 'Smart Plug WiFi', brand: 'Wipro', priceInr: 899 },
  { id: 'gd-12', name: 'Memory Card 128GB', brand: 'SanDisk', priceInr: 1099 },
];

export const SUBCATEGORY_CATALOG: Record<SubcategoryCatalogKey, CatalogTileItem[]> = {
  'smart-watches': toItems(SMART_WATCHES, W),
  'dial-watches': toItems(DIAL_WATCHES, W),
  'kids-watches': toItems(KIDS_WATCHES, W),
  'rc-toys': toItems(RC_TOYS, T),
  'soft-toys': toItems(SOFT_TOYS, T),
  'education-toys': toItems(EDUCATION_TOYS, T),
  cables: toItems(CABLES, A),
  headphones: toItems(HEADPHONES, A),
  'phone-accessories': toItems(PHONE_ACCESSORIES, A),
  gadgets: toItems(GADGETS, A),
};

export function getSubcategoryCatalog(key: SubcategoryCatalogKey): CatalogTileItem[] {
  return SUBCATEGORY_CATALOG[key];
}
