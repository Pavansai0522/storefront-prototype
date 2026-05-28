import React from 'react';
import { WatchCategoryTiles } from '../components/WatchCategoryTiles';
import { FeaturedWatches } from '../components/FeaturedWatches';
export function Watches() {
  return (
    <div className="bg-brand-bg pb-12 pt-24">
      <WatchCategoryTiles />
      <FeaturedWatches />
    </div>);

}