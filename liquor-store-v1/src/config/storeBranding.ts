/** Sentence-style name: copyright, alt text, document title. */
export const STORE_NAME = 'United Liquors';

/** Accessible label for brand logo mark. */
export const STORE_LOGO_ALT = 'United Liquors — Home';

/** Hero storefront image (IMG_8021 — not in carousel). */
export const HERO_IMAGE_URL = '/store/hero.jpeg';

export const HERO_IMAGE_ALT = `${STORE_NAME} storefront in New Lenox, IL`;

/** Visit Us carousel — storefront photos in `public/store/` */
export const STORE_CAROUSEL_IMAGES: readonly string[] = [
  '/store/store-02.jpeg',
  '/store/store-03.jpeg',
  '/store/store-04.jpeg',
  '/store/store-05.jpeg',
  '/store/store-06.jpeg',
  '/store/store-07.jpeg',
  '/store/store-08.jpeg',
  '/store/store-09.jpeg',
  '/store/store-10.jpeg',
  '/store/store-11.jpeg',
  '/store/store-12.jpeg',
  '/store/store-extra.jpg',
] as const;

export const STORE_CAROUSEL_ALT = `United Liquors storefront photo`;
