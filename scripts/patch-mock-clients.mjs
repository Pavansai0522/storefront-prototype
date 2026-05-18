import fs from 'node:fs';

const p = 'admin/src/mock/clients.ts';
let s = fs.readFileSync(p, 'utf8');
if (s.includes('client-watches-1')) {
  console.log('client-watches-1 already present');
  process.exit(0);
}

const block = `,
  {
    id: 'client-watches-1',
    storeName: 'PR Watches & Gadgets',
    slug: 'pr-watches-gadgets',
    status: 'active',
    monthlyFee: 299,
    template: 'watches-store-v2',
    liveUrl: 'http://localhost:3002',
    whatsappNumber: '+91 74169 58315',
    address: 'Chilakaluripet, Andhra Pradesh 522616',
    primaryColor: '#6C3FE8',
    logo: '',
    adminEmail: 'owner@prwatches.example',
    adminTempPassword: 'Welcome#2026',
    adminLastLoginAt: '2026-05-14T10:00:00',
    productsCount: 0,
    productsLastUpdatedAt: null,
    accessoriesLastUpdatedAt: null,
    siteActive: true,
    billing: {
      planMonthlyInr: 299,
      paidUntil: '2026-06-14',
      nextDue: '2026-06-14',
      amount: 299,
      lastPaid: '2026-05-14',
      paymentHistory: [historyPaid('2026-05-14', 299, 'inv-prw-0526')],
    },
    instagram: '@prwatchesgadgets',
    facebook: 'facebook.com/prwatchesgadgets',
    timings: 'Mon-Sat 10:00-21:00, Sun 11:00-20:00',
    notes: [],
  }`;

s = s.replace(/\];\s*$/, `${block}\n];\n`);
fs.writeFileSync(p, s, 'utf8');
console.log('Added client-watches-1');
