import React from 'react';
import { ProductCatalog } from '../components/ProductCatalog';
import { allProducts } from '../data/products';
export function Wine() {
  const wineProducts = allProducts.filter((p) => p.category === 'Wine');
  return (
    <ProductCatalog
      title="Wine & Champagne"
      description="Explore our exquisite collection of reds, whites, and sparkling wines from around the world."
      products={wineProducts} />);


}