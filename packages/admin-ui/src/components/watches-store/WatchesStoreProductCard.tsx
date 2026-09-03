import { WATCHES_STORE_DISPLAY_NAME } from '../../constants/watchesClientBranding';

type WatchesStoreProductCardProps = {
  image: string;
  brand: string;
  name: string;
  price: string;
  emi: string;
  type: 'watch' | 'toy' | 'accessory';
  /** Shown in the prefilled WhatsApp message (matches pr-watches storefront wording). */
  storeLabel?: string;
};

export function WatchesStoreProductCard({
  image,
  brand,
  name,
  price,
  type,
  storeLabel = WATCHES_STORE_DISPLAY_NAME,
}: WatchesStoreProductCardProps): JSX.Element {
  const whatsappMessage = encodeURIComponent(`Hi, I'm interested in ${name} from ${storeLabel}`);
  const whatsappUrl = `https://wa.me/917416958315?text=${whatsappMessage}`;

  return (
    <div className="min-w-[280px] w-[280px] shrink-0 snap-center transition-transform duration-300 hover:-translate-y-1 md:min-w-[320px] md:w-[320px]">
      <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#141414] shadow-none transition-all duration-300 hover:border-[#CBA860]/30 hover:shadow-lg hover:shadow-[#CBA860]/10">
        <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-[#141414] p-6 group">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-contain mix-blend-normal transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute left-4 top-4 rounded-full border border-white/[0.08] bg-[#0A0A0A] px-3 py-1">
            <span className="text-xs font-bold uppercase tracking-wider text-white">{brand}</span>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-6">
          <h3 className="mb-2 line-clamp-1 text-lg font-semibold text-white" title={name}>
            {name}
          </h3>

          <div className="mb-6 flex items-end justify-between">
            <div>
              <p
                className={`text-xl font-bold ${type === 'watch' ? 'text-white' : 'text-[#CBA860]'}`}
              >
                {price}
              </p>
              {/* EMI not currently offered
              <p className="mt-1 text-xs text-gray-400">
                {type === 'watch' ? (
                  `EMI: ${emi}/mo`
                ) : (
                  <span className="rounded border border-white/[0.08] bg-[#141414] px-2 py-0.5 text-[10px] uppercase tracking-wider">
                    {emi}
                  </span>
                )}
              </p>
              */}
            </div>
          </div>

          <div className="mt-auto">
            {type === 'watch' ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 py-3 font-medium text-white transition-colors hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Enquire on WhatsApp
              </a>
            ) : (
              <div className="flex gap-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center rounded-xl bg-[#CBA860] py-3 font-medium text-black transition-colors hover:bg-[#FCDD82] focus:outline-none focus:ring-2 focus:ring-[#CBA860]"
                >
                  Buy Now
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center rounded-xl border border-white/[0.08] bg-transparent py-3 font-medium text-white transition-colors hover:border-[#CBA860]/50 focus:outline-none focus:ring-2 focus:ring-white"
                >
                  Enquire
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
