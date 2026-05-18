import { clientConfig } from '../config/client-config';

export function instagramUrl(): string {
  return clientConfig.social.instagramUrl;
}

export function youtubeUrl(): string {
  return clientConfig.social.youtubeUrl;
}

export function facebookUrl(): string {
  return clientConfig.social.facebookUrl;
}
