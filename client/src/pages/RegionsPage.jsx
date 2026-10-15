import React from 'react';
import VietnamCulturalMap from '../components/map/VietnamCulturalMap';

export default function RegionsPage() {
  return (
    <div className="w-full h-full flex-1 flex flex-col bg-[#F9F8F6] overflow-hidden">
      <VietnamCulturalMap className="flex-1 w-full h-full" />
    </div>
  );
}
