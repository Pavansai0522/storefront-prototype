import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AddToCartButton } from '../components/AddToCartButton';
import { ProductWhatsAppActions } from '../components/ProductWhatsAppActions';
import { Spinner } from '../components/Spinner';
import { btnShop } from '../constants/buttonStyles';
import { useStoreData } from '../context/StoreDataContext';
import { optimizeImageUrl } from '../utils/optimizeImageUrl';

export function ProductDetailPage(): JSX.Element {
  const { productId } = useParams<{ productId: string }>();
  const { getProductById, catalogLoading } = useStoreData();
  const product = productId ? getProductById(productId) : null;
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setSelectedColor('');
    setSelectedImageIndex(0);
    setImageFailed(false);
  }, [productId]);

  useEffect(() => {
    setImageFailed(false);
  }, [selectedImageIndex]);

  const colors = product?.colors ?? [];
  const gallery = product?.images ?? [];
  const activeColor = selectedColor && colors.includes(selectedColor) ? selectedColor : (colors[0] ?? '');
  const safeImageIndex = gallery.length === 0 ? 0 : Math.min(selectedImageIndex, gallery.length - 1);
  const activeImage = gallery[safeImageIndex] ?? product?.image ?? '';
  const imageSrc = optimizeImageUrl(activeImage, 960);
  const showImage = Boolean(product) && imageSrc.trim().length > 0 && !imageFailed;

  if (catalogLoading && !product) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-brand-bg pb-16 pt-28">
        <Spinner size="md" label="Loading product…" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-brand-bg pb-16 pt-28 md:pb-24 md:pt-32">
        <div className="storefront-shell max-w-3xl text-center">
          <h1 className="mb-4 font-bebas text-4xl tracking-wide text-black md:text-5xl">Product not found</h1>
          <p className="mb-8 text-brand-text">This item is no longer in the catalog.</p>
          <Link to="/watches" className={btnShop}>
            Shop watches
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-bg pb-16 pt-28 md:pb-24 md:pt-32">
      <div className="storefront-shell">
        <nav className="mb-6 text-sm text-brand-muted">
          <Link to="/" className="hover:text-brand-purple">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-brand-text">{product.name}</span>
        </nav>

        <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
          <div
            className="relative h-[min(400px,70vw)] w-full overflow-hidden rounded-2xl border border-brand-border bg-brand-surface sm:rounded-3xl sm:h-[400px] md:h-[500px]"
            role="region"
            aria-roledescription="carousel"
            aria-label={`${product.name} photos`}
          >
            {gallery.length > 0
              ? gallery.map((src, i) => (
                  <img
                    key={`${src}-${i}`}
                    src={optimizeImageUrl(src, 960)}
                    alt=""
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                      i === safeImageIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                    loading={i === 0 ? 'eager' : 'lazy'}
                    onError={() => {
                      if (i === safeImageIndex) {
                        setImageFailed(true);
                      }
                    }}
                  />
                ))
              : showImage
                ? (
                    <img
                      src={imageSrc}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                      onError={() => setImageFailed(true)}
                    />
                  )
                : (
                    <div className="h-full w-full bg-brand-bg/40" aria-hidden />
                  )}

            {gallery.length > 1 ? (
              <>
                <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-1">
                  {gallery.map((_, i) => (
                    <button
                      key={`dot-${i}`}
                      type="button"
                      aria-label={`Show photo ${i + 1}`}
                      aria-current={i === safeImageIndex ? true : undefined}
                      onClick={() => setSelectedImageIndex(i)}
                      className="flex h-11 w-11 items-center justify-center"
                    >
                      <span
                        className={`block rounded-full transition-all ${
                          i === safeImageIndex
                            ? 'h-3 w-3 bg-brand-purple'
                            : 'h-2 w-2 bg-brand-text/30 hover:bg-brand-text/50'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  aria-label="Previous photo"
                  onClick={() =>
                    setSelectedImageIndex(
                      (p) => (p - 1 + gallery.length) % gallery.length,
                    )
                  }
                  className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-brand-border bg-brand-bg/90 text-brand-text shadow-sm hover:bg-brand-bg sm:left-3"
                >
                  <ChevronLeft size={18} className="text-brand-text" aria-hidden />
                </button>
                <button
                  type="button"
                  aria-label="Next photo"
                  onClick={() => setSelectedImageIndex((p) => (p + 1) % gallery.length)}
                  className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-brand-border bg-brand-bg/90 text-brand-text shadow-sm hover:bg-brand-bg sm:right-3"
                >
                  <ChevronRight size={18} className="text-brand-text" aria-hidden />
                </button>
              </>
            ) : null}
          </div>

          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-brand-muted">{product.brand}</p>
            <h1 className="mb-4 font-bebas text-4xl tracking-wide text-black md:text-5xl">{product.name}</h1>
            <div className="mb-8 h-1 w-24 rounded-full bg-brand-purple" />
            <p className="font-bebas text-4xl tracking-wide text-brand-purple">{product.priceLabel}</p>
            {/* EMI not currently offered
            <p className="mt-2 text-sm text-brand-text">{product.emiLabel}</p>
            */}

            {product.description ? (
              <p className="mt-6 whitespace-pre-wrap text-base leading-relaxed text-brand-text">
                {product.description}
              </p>
            ) : null}

            {colors.length > 0 ? (
              <fieldset className="mt-8">
                <legend className="mb-3 text-sm font-semibold text-brand-text">Select color</legend>
                <div className="flex flex-wrap gap-3">
                  {colors.map((hex) => {
                    const selected = activeColor === hex;
                    return (
                      <button
                        key={hex}
                        type="button"
                        aria-label={`Select color ${hex}`}
                        aria-pressed={selected}
                        onClick={() => setSelectedColor(hex)}
                        className={`h-11 w-11 rounded-full border-2 ${
                          selected ? 'border-brand-purple ring-2 ring-brand-purple/30' : 'border-brand-border'
                        }`}
                        style={{ backgroundColor: hex }}
                      />
                    );
                  })}
                </div>
              </fieldset>
            ) : null}

            <div className="mt-8 max-w-md space-y-3">
              <AddToCartButton
                productId={product.id}
                name={product.name}
                brand={product.brand}
                priceInr={product.priceInr}
                priceLabel={product.priceLabel}
                image={product.image}
                color={activeColor || undefined}
              />
              <ProductWhatsAppActions
                productName={product.name}
                priceLabel={product.priceLabel}
                color={activeColor || undefined}
                variant="card"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
