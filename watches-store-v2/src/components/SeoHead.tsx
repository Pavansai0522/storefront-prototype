import { useEffect } from 'react';
import { clientConfig } from '../config/client-config';
import { STORE_NAME } from '../config/storeBranding';

const SCRIPT_ID = 'pr-watches-local-business-jsonld';

export function SeoHead(): null {
  useEffect(() => {
    document.title = clientConfig.seo.title;

    const sameAs = [clientConfig.social.instagramUrl, clientConfig.social.youtubeUrl].filter(
      (url): url is string => Boolean(url),
    );

    const localBusinessJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Store',
      name: STORE_NAME,
      description: clientConfig.seo.description,
      telephone: clientConfig.contact.phoneDisplay,
      address: {
        '@type': 'PostalAddress',
        streetAddress: clientConfig.location.addressLines[1],
        addressLocality: 'Chilakaluripet',
        addressRegion: 'Andhra Pradesh',
        postalCode: '522616',
        addressCountry: 'IN',
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
          ],
          opens: '09:30',
          closes: '22:00',
        },
      ],
      url: window.location.origin,
      image: clientConfig.seo.ogImage,
      sameAs,
    };

    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(localBusinessJsonLd);

    return () => {
      script?.remove();
    };
  }, []);

  return null;
}
