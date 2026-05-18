import React from 'react';
import { ProductCatalog } from '../components/ProductCatalog';
import { allProducts } from '../data/products';
export function Beer() {
  const beerProducts = allProducts.filter((p) => p.category === 'Beer');
  return (
    <ProductCatalog
      title="Beer & Craft"
      description="From crisp lagers to hoppy IPAs, find your perfect brew in our extensive beer selection."
      products={beerProducts} />);


}