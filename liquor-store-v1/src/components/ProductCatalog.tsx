import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, SlidersHorizontal, ChevronLeft } from 'lucide-react';
import { ProductImage } from './ProductImage';
import { StockPill } from './StockPill';
import { liquorCategoryLabel } from '../constants/liquorCategories';
import { STORE_PHONE_TEL } from '../config/store';
import type { LiquorCategory } from '../types/product.types';
export interface Product {
  id: string | number;
  name: string;
  brand: string;
  category: LiquorCategory;
  price: number;
  badge?: string;
  image: string;
  /** Defaults to true when omitted (catalog from API may omit). */
  inStock?: boolean;
}
interface ProductCatalogProps {
  title: string;
  description?: string;
  products: Product[];
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionLabel?: string;
  emptyActionHref?: string;
}
export function ProductCatalog({
  title,
  description,
  products,
  emptyTitle = 'No products found',
  emptyDescription = 'Try adjusting your search or filters.',
  emptyActionLabel = 'Clear Filters',
  emptyActionHref,
}: ProductCatalogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const categories = [
  'All',
  ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];
    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
        p.name.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query)
      );
    }
    // Filter
    if (selectedCategory !== 'All') {
      result = result.filter((p) => p.category === selectedCategory);
    }
    // Sort
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // 'featured' - keep original order
        break;
    }
    return result;
  }, [products, searchQuery, selectedCategory, sortBy]);
  return (
    <div className="min-h-screen bg-background py-12 sm:py-20 md:py-24">
      <div className="container mx-auto">
        <div className="mb-8 sm:mb-12">
          <Link
            to="/"
            className="mb-6 inline-flex min-h-[44px] items-center gap-1.5 rounded-md py-2 pr-2 text-sm font-medium text-muted transition-colors hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold">
            <ChevronLeft className="h-5 w-5 shrink-0" aria-hidden />
            <span>Back to home</span>
          </Link>
          <h1 className="mb-4 font-display text-2xl font-bold sm:text-4xl md:text-5xl">
            {title}
          </h1>
          {description ? (
            <p className="max-w-2xl text-base text-muted sm:text-lg md:text-xl">{description}</p>
          ) : null}
          <div className="w-24 h-1 bg-gold rounded-full mt-6"></div>
        </div>

        {/* Controls Bar */}
        <div className="mb-8 flex flex-col items-stretch gap-4 rounded-xl border border-border bg-card p-4 md:flex-row md:items-center md:justify-between">
          {/* Search */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="min-h-[44px] w-full touch-manipulation rounded-lg border border-border bg-background py-3 pl-10 pr-4 text-base text-foreground outline-none transition-all focus:border-gold focus:ring-1 focus:ring-gold" />
            
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {/* Mobile Filter Toggle */}
            <button
              type="button"
              className="flex min-h-[44px] touch-manipulation items-center justify-center gap-2 rounded-lg border border-border px-4 py-3 text-base text-foreground sm:hidden"
              onClick={() => setIsFilterOpen(!isFilterOpen)}>
              
              <SlidersHorizontal className="w-5 h-5" />
              Filters
            </button>

            {/* Category Filter */}
            <div
              className={`sm:block ${isFilterOpen ? 'block' : 'hidden'} w-full sm:w-auto`}>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="min-h-[44px] w-full touch-manipulation cursor-pointer appearance-none rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground outline-none focus:border-gold focus:ring-1 focus:ring-gold sm:w-auto"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23C9A84C'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center',
                  backgroundSize: '1.2em'
                }}>
                
                {categories.map((cat) =>
                <option key={cat} value={cat}>
                    {liquorCategoryLabel(cat)}
                  </option>
                )}
              </select>
            </div>

            {/* Sort */}
            <div className="w-full sm:w-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="min-h-[44px] w-full touch-manipulation cursor-pointer appearance-none rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground outline-none focus:border-gold focus:ring-1 focus:ring-gold sm:w-auto"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23C9A84C'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center',
                  backgroundSize: '1.2em'
                }}>
                
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-muted">
          Showing {filteredAndSortedProducts.length}{' '}
          {filteredAndSortedProducts.length === 1 ? 'result' : 'results'}
        </div>

        {/* Product Grid */}
        {filteredAndSortedProducts.length > 0 ?
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {filteredAndSortedProducts.map((product) => {
              const inStock = product.inStock !== false;
              return (
          <div
            key={product.id}
            className="bg-card border border-border rounded-xl overflow-hidden group hover:border-gold transition-colors duration-300 flex flex-col">
            
                <div className="relative flex h-52 items-center justify-center bg-background/50 p-4 sm:h-64 sm:p-6">
                  {product.badge &&
              <div className="absolute top-4 left-4 bg-gold text-background text-xs font-bold px-3 py-1 rounded z-10">
                      {product.badge}
                    </div>
              }
                  <ProductImage src={product.image} alt={product.name} />
              
                </div>

                <div className="flex flex-grow flex-col justify-between space-y-4 p-4 sm:p-6">
                  <div>
                    <h3 className="mb-1 line-clamp-2 font-display text-lg font-bold text-foreground sm:text-xl">
                      {product.name}
                    </h3>
                    <p className="line-clamp-1 text-sm text-muted">
                      {product.brand}
                    </p>
                  </div>

                  <div>
                    <div className="flex w-full min-w-0 items-center justify-between gap-2 border-t border-border/60 pt-3 sm:gap-3">
                      <span className="text-xl font-bold tabular-nums text-gold sm:text-2xl">
                        ${product.price.toFixed(2)}
                      </span>
                      <StockPill inStock={inStock} />
                    </div>

                    <a
                      href={STORE_PHONE_TEL}
                      className="mt-4 flex min-h-[44px] w-full touch-manipulation items-center justify-center rounded border border-gold py-3 text-center font-bold text-gold transition-colors duration-300 hover:bg-gold hover:text-background"
                    >
                      Call to Order
                    </a>
                  </div>
                </div>
              </div>
          );
            })}
          </div> :

        <div className="rounded-xl border border-border bg-card px-4 py-12 text-center sm:py-24 sm:px-6">
            <h3 className="text-2xl font-display font-bold mb-2">
              {emptyTitle}
            </h3>
            <p className="text-muted">{emptyDescription}</p>
            {emptyActionHref ? (
              emptyActionHref.startsWith('tel:') ? (
                <a
                  href={emptyActionHref}
                  className="mt-6 inline-flex min-h-[44px] items-center rounded bg-gold px-6 py-2 font-bold text-background transition-colors hover:bg-gold-hover"
                >
                  {emptyActionLabel}
                </a>
              ) : (
                <Link
                  to={emptyActionHref}
                  className="mt-6 inline-flex min-h-[44px] items-center rounded bg-gold px-6 py-2 font-bold text-background transition-colors hover:bg-gold-hover"
                >
                  {emptyActionLabel}
                </Link>
              )
            ) : (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSortBy('featured');
                }}
                className="mt-6 inline-flex min-h-[44px] items-center rounded bg-gold px-6 py-2 font-bold text-background transition-colors hover:bg-gold-hover"
              >
                {emptyActionLabel}
              </button>
            )}
          </div>
        }
      </div>
    </div>);

}