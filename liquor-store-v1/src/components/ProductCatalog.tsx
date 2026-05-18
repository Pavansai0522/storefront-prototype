import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, SlidersHorizontal, ChevronDown, ChevronLeft } from 'lucide-react';
import { StockPill } from './StockPill';
import { liquorCategoryLabel } from '../constants/liquorCategories';
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
}
export function ProductCatalog({
  title,
  description,
  products
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
    <div className="py-24 bg-background min-h-screen">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <Link
            to="/"
            className="mb-6 inline-flex min-h-[44px] items-center gap-1.5 rounded-md py-2 pr-2 text-sm font-medium text-muted transition-colors hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold">
            <ChevronLeft className="h-5 w-5 shrink-0" aria-hidden />
            <span>Back to home</span>
          </Link>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            {title}
          </h1>
          {description &&
          <p className="text-xl text-muted max-w-2xl">{description}</p>
          }
          <div className="w-24 h-1 bg-gold rounded-full mt-6"></div>
        </div>

        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8 bg-card p-4 rounded-xl border border-border">
          {/* Search */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2.5 text-foreground focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all" />
            
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {/* Mobile Filter Toggle */}
            <button
              className="sm:hidden flex items-center justify-center gap-2 px-4 py-2.5 border border-border rounded-lg text-foreground"
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
                className="w-full sm:w-auto bg-background border border-border rounded-lg px-4 py-2.5 text-foreground focus:border-gold focus:ring-1 focus:ring-gold outline-none appearance-none cursor-pointer"
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
                className="w-full sm:w-auto bg-background border border-border rounded-lg px-4 py-2.5 text-foreground focus:border-gold focus:ring-1 focus:ring-gold outline-none appearance-none cursor-pointer"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedProducts.map((product) => {
              const inStock = product.inStock !== false;
              return (
          <div
            key={product.id}
            className="bg-card border border-border rounded-xl overflow-hidden group hover:border-gold transition-colors duration-300 flex flex-col">
            
                <div className="relative h-64 bg-background/50 p-6 flex items-center justify-center">
                  {product.badge &&
              <div className="absolute top-4 left-4 bg-gold text-background text-xs font-bold px-3 py-1 rounded z-10">
                      {product.badge}
                    </div>
              }
                  <img
                src={product.image}
                alt={product.name}
                className="h-full object-contain mix-blend-screen opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
              
                </div>

                <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-display font-bold text-foreground mb-1 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-muted truncate">
                      {product.brand}
                    </p>
                  </div>

                  <div>
                    <div className="flex w-full min-w-0 items-center justify-between gap-3 border-t border-border/60 pt-3">
                      <span className="text-2xl font-bold text-gold tabular-nums">
                        ${product.price.toFixed(2)}
                      </span>
                      <StockPill inStock={inStock} />
                    </div>

                    <button className="mt-4 w-full py-3 border border-gold text-gold hover:bg-gold hover:text-background font-bold rounded transition-colors duration-300 min-h-[44px]">
                      Call to Order
                    </button>
                  </div>
                </div>
              </div>
          );
            })}
          </div> :

        <div className="text-center py-24 bg-card rounded-xl border border-border">
            <h3 className="text-2xl font-display font-bold mb-2">
              No products found
            </h3>
            <p className="text-muted">Try adjusting your search or filters.</p>
            <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSortBy('featured');
            }}
            className="mt-6 px-6 py-2 bg-gold text-background font-bold rounded hover:bg-gold-hover transition-colors">
            
              Clear Filters
            </button>
          </div>
        }
      </div>
    </div>);

}