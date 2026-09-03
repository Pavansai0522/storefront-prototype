import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
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
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setSelectedColor('');
    setImageFailed(false);
  }, [productId]);

  const colors = product?.colors ?? [];
  const activeColor = selectedColor && colors.includes(selectedColor) ? selectedColor : (colors[0] ?? '');
  const imageSrc = optimizeImageUrl(product?.image ?? '', 960);
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
          <div className="overflow-hidden rounded-2xl border border-brand-border bg-brand-card">
            <div className="relative aspect-square w-full bg-brand-surface">
              {showImage ? (
                <img
                  src={imageSrc}
                  alt=""
                  className="h-full w-full object-contain p-6"
                  onError={() => setImageFailed(true)}
                />
              ) : (
                <div className="h-full w-full bg-brand-bg/40" aria-hidden />
              )}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-brand-muted">{product.brand}</p>
            <h1 className="mb-4 font-bebas text-4xl tracking-wide text-black md:text-5xl">{product.name}</h1>
            <div className="mb-8 h-1 w-24 rounded-full bg-brand-purple" />
            <p className="font-bebas text-4xl tracking-wide text-brand-purple">{product.priceLabel}</p>
            <p className="mt-2 text-sm text-brand-text">{product.emiLabel}</p>

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
