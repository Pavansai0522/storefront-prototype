import { PageTransition } from '../components/PageTransition';
import { TEMPLATES } from '../constants/templates';
import { WATCHES_STORE_DISPLAY_NAME } from '../constants/watchesClientBranding';
import { WatchesStoreFeaturedSection } from '../components/watches-store/WatchesStoreFeaturedSection';

const WATCHES_TEMPLATE_LABEL = TEMPLATES.find((t) => t.value === 'watches-store-v2')?.label ?? 'PR Watches & Mobiles (v2)';

export function WatchesTemplatePreview(): JSX.Element {
  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="admin-page-heading">{WATCHES_STORE_DISPLAY_NAME}</h1>
          <p className="admin-page-subtitle mt-2 max-w-3xl">
            Live preview of the watches client template (ported from{' '}
            <span className="text-white">Downloads/pr-watches</span>, now in-repo as{' '}
            <span className="text-white">watches-store-v2/</span>). Assign{' '}
            <span className="text-white">{WATCHES_TEMPLATE_LABEL}</span> when creating a client. Run the full storefront with{' '}
            <span className="font-mono text-gray-300">npm run dev:watches</span> (port 3002).
          </p>
        </div>

        <div className="admin-card-static overflow-hidden rounded-xl border border-white/10">
          <div className="border-b border-white/10 bg-brand-bg px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-saffron">
              Client preview · horizontal collection
            </p>
          </div>
          <div className="bg-[#0A0A0A]">
            <WatchesStoreFeaturedSection storeLabel={WATCHES_STORE_DISPLAY_NAME} />
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
