import React from 'react';
import VietnamCulturalMap from '../components/map/VietnamCulturalMap';

export default function RegionsPage() {
  return (
    <div className="w-full h-full flex-1 flex flex-col bg-[#0B0F19] overflow-hidden">
      <VietnamCulturalMap className="flex-1 w-full h-full" />
    </div>
  );
}
