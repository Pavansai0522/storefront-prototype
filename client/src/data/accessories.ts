export type AccessoryCategoryId = 'audio' | 'cables' | 'wearables' | 'power';

export interface AccessoryProduct {
  id: number;
  itemCode: string;
  categoryId: AccessoryCategoryId;
  name: string;
  detail: string;
  priceDisplay: string;
  priceValue: number;
  tags: string[];
  img: string;
}

export interface AccessoryCategoryMeta {
  id: AccessoryCategoryId;
  title: string;
  description: string;
  priceFromLabel: string;
}

export const ACCESSORY_CATEGORIES: AccessoryCategoryMeta[] = [
  {
    id: 'audio',
    title: 'Audio & buds',
    description:
      'TWS, neckbands, and studio cans — tap a category to browse with filters.',
    priceFromLabel: '₹899'
  },
  {
    id: 'cables',
    title: 'Cables & hubs',
    description: 'Fast charge Type‑C, braided cables, and travel adapters.',
    priceFromLabel: '₹299'
  },
  {
    id: 'wearables',
    title: 'Wearables',
    description: 'Smartwatches and bands that pair perfectly with new phones.',
    priceFromLabel: '₹1,999'
  },
  {
    id: 'power',
    title: 'Power & protection',
    description: 'Power banks, wireless pads, tempered glass, and rugged cases.',
    priceFromLabel: '₹499'
  }
];

/** Demo images — reuse proven URLs from the phone catalog for reliable loads */
const IMG_POOL: string[] = [
  'https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1520923642038-b4259acecbd7?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1601784551446-20c9e07cd8d3?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=600&q=80'
];

function buildCatalog(): AccessoryProduct[] {
  const rows: Omit<AccessoryProduct, 'id'>[] = [];

  const audioNames = [
    ['MW-AUD-101', 'AuraBuds Lite TWS', 'Open-fit buds, great for calls on the go.', 899, ['TWS', 'Budget', 'Calls']],
    ['MW-AUD-102', 'Pulse ANC Neckband', 'ANC neckband with 40h playback.', 1499, ['ANC', 'Neckband', 'Long battery']],
    ['MW-AUD-103', 'StudioFold Over-Ear', 'Foldable wired studio pair for travel.', 2199, ['Wired', 'Travel', 'Studio']],
    ['MW-AUD-104', 'BassDrop Mini TWS', 'Pocket case, punchy bass.', 699, ['TWS', 'Budget', 'Bass']],
    ['MW-AUD-105', 'ClearVoice Pro Buds', 'Dual-mic ENC for windy streets.', 1299, ['TWS', 'Calls', 'ANC']],
    ['MW-AUD-106', 'GamePods Low-Latency', 'Gaming mode under 60ms latency.', 1799, ['TWS', 'Gaming', 'Low latency']],
    ['MW-AUD-107', 'SilkBand Comfort Fit', 'Soft neckband for all-day wear.', 999, ['Neckband', 'Comfort', 'Budget']],
    ['MW-AUD-108', 'RoadRunner Sports Buds', 'IPX7 sweat-proof hooks.', 1599, ['Sports', 'TWS', 'Waterproof']],
    ['MW-AUD-109', 'Vintage 3.5mm On-Ear', 'Retro look, warm sound.', 1199, ['Wired', 'Retro', 'Studio']],
    ['MW-AUD-110', 'NightShift Sleep Buds', 'Tiny tips for side-sleepers.', 1899, ['Sleep', 'TWS', 'Comfort']],
    ['MW-AUD-111', 'PodCase Duo Pack', 'Two sets for siblings — demo twin pack.', 2499, ['TWS', 'Bundle', 'Family']],
    ['MW-AUD-112', 'HushKids Volume Cap', 'Safe max volume for kids.', 799, ['Kids', 'Wired', 'Safety']],
    ['MW-AUD-113', 'StageMic Karaoke Set', 'Bud + mic combo for home parties.', 2299, ['Party', 'Mic', 'TWS']],
    ['MW-AUD-114', 'Commuter ANC Pro', 'Hybrid ANC + transparency mode.', 2699, ['ANC', 'TWS', 'Commute']],
    ['MW-AUD-115', 'DeskPod USB Speakerphone', 'For laptop meetings at the shop.', 3499, ['Speaker', 'Calls', 'USB']],
    ['MW-AUD-116', 'VinylTip Replacement Pack', '6 pairs foam tips — tell us item code at counter.', 399, ['Accessories', 'Tips', 'Budget']],
    ['MW-AUD-117', 'AirFeel Open-Ear Clip', 'Clip-on open audio for cyclists.', 1999, ['Open-ear', 'Sports', 'Safety']],
    ['MW-AUD-118', 'CafeLo-Fi Wired Buds', 'Warm tuning for lo-fi playlists.', 649, ['Wired', 'Budget', 'Studio']],
    ['MW-AUD-119', 'TwinShare Splitter', 'Share one jack with a friend.', 299, ['Wired', 'Travel', 'Budget']],
    ['MW-AUD-120', 'BoomBar Mini Soundbar', 'Bluetooth bar for small desks.', 3999, ['Speaker', 'Bluetooth', 'Desk']]
  ] as const;

  const cableNames = [
    ['MW-CBL-201', 'TurboC 60W Braided 1m', 'E-marker chip, laptop safe.', 449, ['USB-C', 'Fast charge', 'Braided']],
    ['MW-CBL-202', 'TurboC 60W Braided 2m', 'Extra reach for bedside.', 549, ['USB-C', 'Fast charge', 'Long']],
    ['MW-CBL-203', 'Legacy A-to-C 18W', 'For older bricks + new phones.', 199, ['USB-A', 'Budget', 'Travel']],
    ['MW-CBL-204', 'Lightning MFi 1m White', 'Apple-certified spare cable.', 1299, ['Lightning', 'Apple', 'MFi']],
    ['MW-CBL-205', '4-in-1 Travel Snake', 'C/A/Lightning/Micro tips.', 799, ['Travel', 'Multi-tip', 'Bundle']],
    ['MW-CBL-206', 'HDMI 2.1 Short 0.5m', 'For TV stick behind wall mount.', 599, ['HDMI', 'TV', 'Short']],
    ['MW-CBL-207', 'USB-C Hub 5-in-1', 'HDMI + USB3 + SD + PD pass.', 2499, ['Hub', 'USB-C', 'Desk']],
    ['MW-CBL-208', 'Coiled Car C-to-C', 'Stays tidy on dash.', 699, ['Car', 'USB-C', 'Coiled']],
    ['MW-CBL-209', 'OTG Micro Reader', 'MicroUSB OTG + card reader.', 349, ['OTG', 'Budget', 'Legacy']],
    ['MW-CBL-210', 'DisplayPort to HDMI', 'Office monitor adapter.', 899, ['Display', 'HDMI', 'Desk']],
    ['MW-CBL-211', 'Flat Ribbon C-to-C', 'Slim under door gaps.', 429, ['USB-C', 'Slim', 'Travel']],
    ['MW-CBL-212', 'MagRing Cable Organiser', 'Silicone wrap 3-pack.', 249, ['Organiser', 'Bundle', 'Budget']],
    ['MW-CBL-213', 'RJ45 Cat6 Flat 3m', 'Neat run along skirting.', 399, ['Ethernet', 'Home', 'Long']],
    ['MW-CBL-214', 'AV Aux Braided 1.5m', '3.5mm TRRS for car aux.', 299, ['Aux', 'Car', 'Braided']],
    ['MW-CBL-215', 'PD Splitter Y-Cable', 'Charge two small devices slowly.', 499, ['USB-C', 'Split', 'Travel']],
    ['MW-CBL-216', 'USB-C to VGA', 'Old projector rescue kit.', 749, ['USB-C', 'Office', 'Adapter']],
    ['MW-CBL-217', 'Thunderbolt 4 Passive 0.8m', 'Dock-grade short run.', 1999, ['Thunderbolt', 'Desk', 'Pro']],
    ['MW-CBL-218', 'Printer USB-B 2m', 'Classic printer cable.', 279, ['Printer', 'USB-B', 'Office']],
    ['MW-CBL-219', 'SIM Eject + Pin Lanyard', 'Shop counter favourite.', 99, ['Tool', 'SIM', 'Budget']],
    ['MW-CBL-220', 'Velcro Cable Ties 10pc', 'Reusable ties for bag packing.', 149, ['Organiser', 'Bundle', 'Budget']]
  ] as const;

  const wearNames = [
    ['MW-WEA-301', 'PulseBand HR Lite', 'Steps, sleep, SpO2 basics.', 1999, ['Band', 'Health', 'Budget']],
    ['MW-WEA-302', 'OrbitWatch AMOLED 42', 'Always-on face, 5ATM.', 7999, ['Smartwatch', 'AMOLED', 'Waterproof']],
    ['MW-WEA-303', 'StrideRun GPS Watch', 'Dual-band GPS for joggers.', 6499, ['Sports', 'GPS', 'Smartwatch']],
    ['MW-WEA-304', 'KidsSafe Geo Band', 'Geo-fence alerts for parents.', 2499, ['Kids', 'Band', 'Safety']],
    ['MW-WEA-305', 'SteelLink Premium Band', 'Metal strap for 22mm lugs.', 1299, ['Strap', 'Premium', 'Fashion']],
    ['MW-WEA-306', 'NightOLED Square', 'Retro square UI trend.', 4999, ['Smartwatch', 'Fashion', 'AMOLED']],
    ['MW-WEA-307', 'CoachTimer Stopwatch', 'Coaches lap memory x50.', 1599, ['Sports', 'Stopwatch', 'Budget']],
    ['MW-WEA-308', 'GlideSwim Lap Counter', 'Pool mode with chlorine resist.', 3499, ['Sports', 'Swim', 'Waterproof']],
    ['MW-WEA-309', 'DeskStand Watch Charger', 'Magsafe-style puck + stand.', 899, ['Charger', 'Desk', 'Wearables']],
    ['MW-WEA-310', 'Silicone Rainbow Strap', '7 colours swap pack.', 699, ['Strap', 'Bundle', 'Fashion']],
    ['MW-WEA-311', 'Hybrid HR Steel 46', 'Classic hands + smart layer.', 9999, ['Hybrid', 'Premium', 'Calls']],
    ['MW-WEA-312', 'HikeAltimeter Rugged', 'Barometer + compass.', 5499, ['Outdoor', 'GPS', 'Rugged']],
    ['MW-WEA-313', 'YogaBreathe Coach', 'Breathing haptics.', 2999, ['Wellness', 'Band', 'Health']],
    ['MW-WEA-314', 'GolfShot Rangefinder Watch', 'Yardage demo mode.', 8999, ['Sports', 'GPS', 'Premium']],
    ['MW-WEA-315', 'PetStep Collar Tag', 'Lightweight activity tag.', 899, ['Pets', 'Budget', 'Health']],
    ['MW-WEA-316', 'OfficeMeet Silent Alarm', 'Buzz-only meetings mode.', 1799, ['Band', 'Office', 'Quiet']],
    ['MW-WEA-317', 'Vintage Leather 20mm', 'Brown stitch strap.', 999, ['Strap', 'Fashion', 'Leather']],
    ['MW-WEA-318', 'Triathlon QuickSwap Kit', 'Band + bike mount demo.', 4499, ['Sports', 'Bundle', 'Triathlon']],
    ['MW-WEA-319', 'NightGlow Watch Protector', 'Edge bumper clear case.', 399, ['Protection', 'Budget', 'Wearables']],
    ['MW-WEA-320', 'DockTwin Dual Charger', 'Charge watch + buds together.', 1599, ['Charger', 'Desk', 'Bundle']]
  ] as const;

  const powerNames = [
    ['MW-PWR-401', 'BrickBoost 20W USB-C', 'Compact wall brick.', 499, ['Charger', 'Wall', 'Budget']],
    ['MW-PWR-402', 'BrickBoost 65W GaN', 'Laptop + phone from one port.', 1999, ['GaN', 'Fast charge', 'Travel']],
    ['MW-PWR-403', 'AirMat Qi 15W Pad', 'Non-slip ring.', 1299, ['Wireless', 'Desk', 'Qi']],
    ['MW-PWR-404', 'TankPower 20000 22.5W', 'Two USB-A + one C.', 1799, ['Power bank', 'Travel', 'USB-C']],
    ['MW-PWR-405', 'TankPower 10000 Slim', 'Pocket slimline.', 999, ['Power bank', 'Slim', 'Budget']],
    ['MW-PWR-406', 'CarSnap 45W Dual C', 'Dash friendly.', 1499, ['Car', 'Fast charge', 'GaN']],
    ['MW-PWR-407', 'GlassGuard Tempered 2-pack', '9H with alignment frame.', 399, ['Protection', 'Glass', 'Bundle']],
    ['MW-PWR-408', 'ArmorCase Clear Mag', 'Show phone colour + magnets.', 799, ['Case', 'MagSafe', 'Clear']],
    ['MW-PWR-409', 'GripRing Stand Case', 'Ring kickstand matte black.', 699, ['Case', 'Kickstand', 'Budget']],
    ['MW-PWR-410', 'DeskLoop Cable Manager', 'Weighted loop for desk.', 449, ['Organiser', 'Desk', 'Cable']],
    ['MW-PWR-411', 'SolarTrail 10W Panel', 'Camping trickle demo unit.', 2499, ['Outdoor', 'Solar', 'Travel']],
    ['MW-PWR-412', 'LensPen Camera Kit', 'Pocket lens + screen pen.', 349, ['Cleaning', 'Camera', 'Budget']],
    ['MW-PWR-413', 'FolioWallet Mag Case', 'Cards + stand.', 1199, ['Case', 'Wallet', 'Travel']],
    ['MW-PWR-414', 'NightLight USB Hub', 'Soft lamp + 3 USB-A.', 899, ['Desk', 'USB-A', 'Home']],
    ['MW-PWR-415', 'RuggedShell Bumper', 'Corner airbags.', 649, ['Case', 'Rugged', 'Protection']],
    ['MW-PWR-416', 'IceGel Phone Cooler', 'Clip fan for gaming phones.', 1999, ['Gaming', 'Cooling', 'USB-C']],
    ['MW-PWR-417', 'PrivacyTilt Screen Guard', 'Anti-spy tempered.', 599, ['Privacy', 'Glass', 'Office']],
    ['MW-PWR-418', 'TravelRoll Tech Pouch', 'Cables + bank + buds slot.', 799, ['Travel', 'Organiser', 'Bundle']],
    ['MW-PWR-419', 'RetroFlip Leather Case', 'Flip cover nostalgia.', 899, ['Case', 'Leather', 'Fashion']],
    ['MW-PWR-420', 'BenchCharge 6-Port USB', 'Shop counter charging tree.', 2999, ['Desk', 'Multi-port', 'Shop']]
  ] as const;

  const push = (
    categoryId: AccessoryCategoryId,
    list: readonly (readonly [string, string, string, number, readonly string[]])[],
    offset: number
  ): void => {
    list.forEach((entry, i) => {
      const [itemCode, name, detail, priceValue, tags] = entry;
      rows.push({
        itemCode,
        categoryId,
        name,
        detail,
        priceDisplay: priceValue.toLocaleString('en-IN'),
        priceValue,
        tags: [...tags],
        img: IMG_POOL[(offset + i) % IMG_POOL.length]
      });
    });
  };

  push('audio', audioNames, 0);
  push('cables', cableNames, 2);
  push('wearables', wearNames, 4);
  push('power', powerNames, 6);

  return rows.map((row, idx) => ({ ...row, id: idx + 1 }));
}

export const ACCESSORY_ITEMS: AccessoryProduct[] = buildCatalog();

export function isAccessoryCategoryId(value: string): value is AccessoryCategoryId {
  return (
    value === 'audio' ||
    value === 'cables' ||
    value === 'wearables' ||
    value === 'power'
  );
}

export function getAccessoryCategoryMeta(
  id: AccessoryCategoryId
): AccessoryCategoryMeta | undefined {
  return ACCESSORY_CATEGORIES.find((c) => c.id === id);
}

export function getTagsForCategory(categoryId: AccessoryCategoryId): string[] {
  const set = new Set<string>();
  ACCESSORY_ITEMS.filter((p) => p.categoryId === categoryId).forEach((p) => {
    p.tags.forEach((t) => set.add(t));
  });
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

export const ACCESSORY_PRICE_RANGES: { label: string; min: number; max: number }[] =
  [
    { label: 'Under ₹500', min: 0, max: 500 },
    { label: '₹500 – ₹1,500', min: 500, max: 1500 },
    { label: '₹1,500 – ₹3,500', min: 1500, max: 3500 },
    { label: '₹3,500 – ₹8,000', min: 3500, max: 8000 },
    { label: 'Above ₹8,000', min: 8000, max: Infinity }
  ];
