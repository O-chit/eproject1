import React from 'react';

export default function CraftCardSkeleton({ count = 4 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="border border-[#E6E2DA] bg-[#FFFFFF] overflow-hidden flex flex-col justify-between"
          aria-hidden="true"
        >
          <div>
            {/* Shimmer Image */}
            <div className="aspect-[4/3] bg-[#EAE6DF] relative overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
            </div>

            {/* Shimmer Content */}
            <div className="p-5 space-y-3">
              <div className="flex justify-between">
                <div className="h-3 w-20 bg-[#EAE6DF] rounded"></div>
                <div className="h-3 w-16 bg-[#EAE6DF] rounded"></div>
              </div>
              <div className="h-5 w-3/4 bg-[#EAE6DF] rounded"></div>
              <div className="h-3 w-full bg-[#EAE6DF] rounded"></div>
              <div className="h-3 w-2/3 bg-[#EAE6DF] rounded"></div>

              <div className="pt-3 border-t border-[#E6E2DA]/60 space-y-2">
                <div className="h-3 w-1/2 bg-[#EAE6DF] rounded"></div>
                <div className="h-2.5 w-1/3 bg-[#EAE6DF] rounded"></div>
              </div>
            </div>
          </div>

          <div className="p-5 pt-0">
            <div className="h-8 w-full bg-[#EAE6DF] rounded"></div>
          </div>
        </div>
      ))}
    </>
  );
}
