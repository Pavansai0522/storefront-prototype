export type LegalPolicyId = 'terms' | 'privacy';

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
      "Welcome to Aruna's Eagle. By using this website, you agree to the following terms. Please read them carefully.",
    sections: [
      {
        heading: 'About this website',
        paragraphs: [
          'This website provides information about our family restaurant, food menu, Atithi Function Hall, and Atithi Residence guest rooms in Chilakaluripeta.',
          'Menu items, prices, and availability shown online are indicative only and may change without prior notice.',
        ],
      },
      {
        heading: 'Orders, bookings & enquiries',
        bullets: [
          'Table reservations, takeaway requests, function hall bookings, and room enquiries are confirmed only after direct communication with our staff by phone or WhatsApp.',
          'You agree to provide accurate contact details when reaching out to us.',
          'We reserve the right to decline or modify a booking based on availability, kitchen capacity, or operational requirements.',
          'Quoted prices are in Indian Rupees (₹). Applicable taxes and service charges may apply as per local regulations.',
        ],
      },
      {
        heading: 'Dining & hospitality',
        bullets: [
          'We serve non-vegetarian and select vegetarian dishes. Please inform our staff of any dietary requirements or allergies before ordering.',
          'Guests are expected to conduct themselves respectfully on our premises, including the dining room, function hall, and guest rooms.',
          'We are not responsible for loss or damage to personal belongings on our premises, except where required by applicable law.',
        ],
      },
      {
        heading: 'Website use',
        bullets: [
          'Content on this site (text, images, branding) belongs to Aruna\'s Eagle and may not be copied or reused without permission.',
          'We may update or suspend parts of the website at any time without notice.',
          'Misuse of the website — including false enquiries, harassment, or attempts to disrupt our services — may result in us refusing further contact.',
        ],
      },
      {
        heading: 'Limitation of liability',
        paragraphs: [
          'We strive to keep information on this website accurate, but we do not guarantee that all content is complete or error-free at all times.',
          'To the fullest extent permitted by law, Aruna\'s Eagle shall not be liable for indirect or consequential loss arising from use of this website or reliance on online information alone.',
        ],
      },
      {
        heading: 'Governing law',
        paragraphs: [
          'These terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of courts in Andhra Pradesh.',
        ],
      },
    ],
    closing: 'By continuing to use this website, you accept these terms and conditions.',
  },
  privacy: {
    id: 'privacy',
    path: '/privacy',
    title: 'Privacy Policy',
    intro:
      "At Aruna's Eagle, we respect your privacy. This policy explains what information we collect and how we use it when you visit our website or contact us.",
    sections: [
      {
        heading: 'Information we may collect',
        bullets: [
          'Name',
          'Phone number',
          'Email address (if you provide one)',
          'Messages you send us via phone, WhatsApp, or email',
          'Booking or enquiry details (dates, party size, room requirements, menu preferences)',
        ],
      },
      {
        heading: 'How we use your information',
        bullets: [
          'To respond to table reservations, takeaway requests, and general enquiries',
          'To coordinate function hall and guest room bookings',
          'To communicate about your visit, order, or event',
          'To improve our service and website experience',
        ],
      },
      {
        heading: 'WhatsApp & phone communication',
        paragraphs: [
          'If you contact us on WhatsApp or by phone, your messages and contact details are used only to handle your enquiry or order.',
          'We do not use your information for unsolicited marketing unless you have agreed to receive updates from us.',
        ],
      },
      {
        heading: 'Sharing of information',
        paragraphs: [
          'We do not sell or rent your personal information to third parties.',
          'We may share limited information only when necessary — for example, with payment or delivery partners if applicable, or when required by law.',
        ],
      },
      {
        heading: 'Data retention & security',
        paragraphs: [
          'We keep contact and booking records only as long as needed for business, accounting, or legal purposes.',
          'We take reasonable steps to protect your information, though no method of electronic communication is completely secure.',
        ],
      },
      {
        heading: 'Your choices',
        bullets: [
          'You may request correction or deletion of your contact details, subject to legal and operational requirements.',
          'You may stop communicating with us at any time by discontinuing contact on phone or WhatsApp.',
        ],
      },
      {
        heading: 'Contact us',
        paragraphs: [
          'For privacy-related questions, contact the proprietor or write to us using the email and phone numbers listed on our website.',
        ],
      },
    ],
    closing: 'We may update this privacy policy from time to time. Continued use of the website after changes constitutes acceptance of the updated policy.',
  },
};

export const LEGAL_FOOTER_LINKS: { label: string; path: string }[] = [
  { label: 'Terms & Conditions', path: '/terms' },
  { label: 'Privacy Policy', path: '/privacy' },
];
