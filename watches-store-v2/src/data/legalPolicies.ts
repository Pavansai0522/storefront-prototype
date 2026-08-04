export type LegalPolicyId = 'terms' | 'privacy' | 'refund';

export type LegalSection = {
  heading?: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type LegalPolicy = {
  id: LegalPolicyId;
  path: string;
  title: string;
  intro: string;
  sections: LegalSection[];
  closing?: string;
};

export const LEGAL_POLICIES: Record<LegalPolicyId, LegalPolicy> = {
  terms: {
    id: 'terms',
    path: '/terms',
    title: 'Terms & Conditions',
    intro:
      'Welcome to PR Watch & Mobiles. By using our website, you agree to the following terms and conditions.',
    sections: [
      {
        bullets: [
          'All products listed are subject to availability.',
          'Prices may change without prior notice.',
          'We reserve the right to cancel any order due to stock or pricing errors.',
          'Customers must provide accurate information during purchase.',
          'Warranty claims are subject to brand/manufacturer policies.',
          'Misuse of the website or fraudulent activities may result in account suspension.',
        ],
      },
    ],
    closing: 'By continuing to use our website, you accept these terms.',
  },
  privacy: {
    id: 'privacy',
    path: '/privacy',
    title: 'Privacy Policy',
    intro:
      'At PR Watch & Mobiles, we value your privacy and are committed to protecting your personal information.',
    sections: [
      {
        heading: 'We may collect',
        bullets: ['Name', 'Phone number', 'Email address', 'Delivery address'],
      },
      {
        paragraphs: [
          'This information is used only for order processing, communication, and improving our services.',
          'We do not sell or share your personal data with third parties except for delivery or payment processing purposes.',
          'Your data is kept secure and confidential.',
        ],
      },
    ],
  },
  refund: {
    id: 'refund',
    path: '/refund',
    title: 'Refund Policy',
    intro: 'We want you to be satisfied with your purchase.',
    sections: [
      {
        heading: 'Returns are accepted only if',
        bullets: [
          'Product is damaged during delivery',
          'Wrong product received',
          'Manufacturing defect',
        ],
      },
      {
        heading: 'Conditions',
        bullets: [
          'Return request must be made within 2–3 days of delivery',
          'Product must be unused with original packaging',
          'Refund will be processed after product inspection',
          'Refunds may take 5–7 working days depending on payment method',
        ],
      },
      {
        paragraphs: [
          'Note: Some products may not be eligible for return due to hygiene or brand policies.',
        ],
      },
    ],
  },
};

export const LEGAL_FOOTER_LINKS: { label: string; path: string }[] = [
  { label: 'Terms & Conditions', path: '/terms' },
  { label: 'Privacy Policy', path: '/privacy' },
  { label: 'Refund Policy', path: '/refund' },
];
