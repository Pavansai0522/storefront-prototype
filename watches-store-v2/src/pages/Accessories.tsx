import React from 'react';
import { AccessoryCategoryTiles } from '../components/AccessoryCategoryTiles';
import { FeaturedAccessories } from '../components/FeaturedAccessories';
export function Accessories() {
  return (
    <div className="bg-brand-bg pb-12 pt-24">
      <AccessoryCategoryTiles />
      <FeaturedAccessories />
    </div>);

}