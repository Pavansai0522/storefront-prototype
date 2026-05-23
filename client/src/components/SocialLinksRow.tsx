import React from 'react';
import {
  Facebook,
  Instagram,
  MessageCircle,
  Send,
  Youtube,
  type LucideIcon,
} from 'lucide-react';
import { useStoreConfig } from '../context/StoreDataContext';

type SocialLinkItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export interface SocialLinksRowProps {
  className?: string;
  buttonClassName?: string;
}

export function SocialLinksRow({
  className = 'flex flex-wrap justify-center gap-3 md:justify-start',
  buttonClassName = 'inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-brand-surface text-brand-muted transition-colors hover:bg-brand-blue hover:text-white',
}: SocialLinksRowProps): JSX.Element {
  const { social } = useStoreConfig();

  const links: SocialLinkItem[] = [
    { href: social.instagram, label: 'Instagram', icon: Instagram },
    { href: social.youtube, label: 'YouTube', icon: Youtube },
    { href: social.facebook, label: 'Facebook', icon: Facebook },
    { href: social.whatsappChannel, label: 'WhatsApp Channel', icon: MessageCircle },
    { href: social.telegram, label: 'Telegram', icon: Send },
  ].filter((item) => item.href.length > 0);

  return (
    <div className={className}>
      {links.map(({ href, label, icon: Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClassName}
          aria-label={label}>
          <Icon className="h-5 w-5" aria-hidden />
        </a>
      ))}
    </div>
  );
}
