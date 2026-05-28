import React from 'react';
import { ToyCategoryTiles } from '../components/ToyCategoryTiles';
import { FeaturedToys } from '../components/FeaturedToys';
export function Toys() {
  return (
    <div className="bg-brand-bg pb-12 pt-24">
      <ToyCategoryTiles />
      <FeaturedToys />
    </div>);

}