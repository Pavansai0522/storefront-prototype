import React from 'react';
import { ToyCategoryTiles } from '../components/ToyCategoryTiles';
import { FeaturedToys } from '../components/FeaturedToys';
export function Toys() {
  return (
    <div className="min-h-[80vh] pb-12 pt-24">
      <ToyCategoryTiles />
      <FeaturedToys />
    </div>);

}