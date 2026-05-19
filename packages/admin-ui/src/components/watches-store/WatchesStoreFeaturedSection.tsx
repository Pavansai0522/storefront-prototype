import { WATCHES_CATALOG } from './watchesCatalog';
import { WatchesStoreProductCard } from './WatchesStoreProductCard';

type WatchesStoreFeaturedSectionProps = {
  storeLabel?: string;
};

export function WatchesStoreFeaturedSection({
  storeLabel,
}: WatchesStoreFeaturedSectionProps): JSX.Element {
  return (
    <section
      id="watches"
      className="relative z-10 overflow-hidden bg-[#0A0A0A] py-16 md:py-20"
      aria-label="Featured watches"
    >
      <div className="container mx-auto mb-12 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-4xl tracking-wide text-white md:text-5xl">
              Featured watches
            </h2>
            <div className="mt-4 h-1 w-24 rounded-full bg-white" />
          </div>
        </div>
      </div>

      <div className="no-scrollbar w-full snap-x snap-mandatory overflow-x-auto px-4 pb-8 sm:px-6 lg:px-8">
        <div className="flex w-max gap-6">
          {WATCHES_CATALOG.map((watch) => (
            <WatchesStoreProductCard
              key={watch.id}
              type="watch"
              brand={watch.brand}
              name={watch.name}
              price={watch.price}
              emi={watch.emi}
              image={watch.image}
              storeLabel={storeLabel}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
