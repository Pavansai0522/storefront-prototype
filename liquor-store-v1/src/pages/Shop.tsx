import React from 'react';
import { ProductCatalog } from '../components/ProductCatalog';
import { allProducts } from '../data/products';
export function Shop() {
  return (
    <ProductCatalog
      title="All Products"
      description="Browse our complete collection of premium spirits, fine wines, and craft beers."
      products={allProducts} />);


}