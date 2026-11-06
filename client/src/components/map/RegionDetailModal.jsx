'use client';

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

/**
 * RegionDetailModal
 * Cultural Region Detail Modal Component
 */
const CRAFT_THUMBNAILS = {
  1: '/demo/craft/antique_vietnamese_bronze_incense_burner_with_dragon_handles_and_foo_dog_finial/screen.png',
  2: '/demo/craft/artisan_handwoven_bamboo_fruit_basket_and_lidded_box_from_phu_vinh_craft/screen.png',
  3: '/demo/craft/artisan_handwoven_natural_sedge_and_seagrass_storage_basket_from_kim_son/screen.png',
  4: '/demo/craft/artisan_hand_turned_rustic_terracotta_water_jar_and_tea_bowl_from_bau_truc_cham/screen.png',
  5: '/demo/craft/artisan_hand_turned_rustic_vietnamese_stoneware_celadon_tea_bowl_with_natural/screen.png',
  6: '/demo/craft/authentic_vietnamese_lotus_silk_scarf_woven_from_natural_lotus_stem_fibers_in/screen.png',
  7: '/demo/craft/exquisite_traditional_vietnamese_lacquer_tea_tray_from_ha_thai_village_deep/screen.png',
  8: '/demo/craft/exquisite_traditional_vietnamese_non_la_conical_hat_with_subtle_poem/screen.png',
  9: '/demo/craft/exquisite_vietnamese_traditional_lacquer_vase_with_inlaid_natural_eggshell_and/screen.png',
  10: '/demo/craft/exquisite_vietnamese_traditional_silk_lantern_from_hoi_an_teardrop_shape_with/screen.png',
  11: '/demo/craft/hand_carved_vietnamese_ironwood_sculpture_of_mythical_dragon_turtle_from_la/screen.png',
  12: '/demo/craft/masterpiece_vietnamese_hand_carved_mahogany_wood_tea_box_with_mother_of_pearl/screen.png',
  13: '/demo/craft/masterpiece_vietnamese_hand_chased_solid_silver_tea_canister_from_dong_xam/screen.png',
  14: '/demo/craft/masterpiece_vietnamese_lacquer_bowl_coated_in_multi_layered_gold_leaf_and_deep/screen.png',
  15: '/demo/craft/museum_quality_product_photography_of_an_authentic_vietnamese_blue_and_white/screen.png',
  16: '/demo/craft/original_dong_ho_vietnamese_folk_woodcut_print_of_a_rooster_and_hen_on_textured/screen.png',
  17: '/demo/craft/product_photography_of_an_authentic_vietnamese_crackle_glaze_ceramic_teapot_set/screen.png',
  18: '/demo/craft/traditional_cham_ethnic_handwoven_brocade_textile_scarf_with_intricate/screen.png',
  19: '/demo/craft/traditional_hand_forged_vietnamese_carbon_steel_kitchen_knife_and_iron_scissors/screen.png',
  20: '/demo/craft/traditional_vietnamese_bamboo_transverse_flute_sao_truc_and_bamboo_birdcage/screen.png',
  21: '/demo/craft/traditional_vietnamese_carved_horn_comb_and_spoon_crafted_from_natural_water/screen.png',
  22: '/demo/craft/traditional_vietnamese_conical_hat_non_quai_thao_kinh_bac_flat_hat_with/screen.png',
  23: '/demo/craft/traditional_vietnamese_handwoven_natural_hemp_fabric_runner_from_hmong_ethnic/screen.png',
  24: '/demo/craft/traditional_vietnamese_mother_of_pearl_inlaid_rosewood_jewelry_box_from_chuyen/screen.png',
  25: '/demo/craft/traditional_vietnamese_woodblock_print_of_bat_tien_eight_immortals_on_handmade/screen.png',
  26: '/demo/craft/vietnamese_folk_art_woodblock_print_of_to_nu_four_beauties_playing_instruments/screen.png',
  27: '/demo/craft/vietnamese_hand_chased_solid_silver_hairpin_and_filigree_flower_brooch_from/screen.png',
  28: '/demo/craft/vietnamese_traditional_hand_cast_bronze_bell_with_archaic_dong_son_bird_and_sun/screen.png'
};

const CRAFT_SLUG_THUMBNAILS = {
  'bat-trang': '/demo/craft/product_photography_of_an_authentic_vietnamese_crackle_glaze_ceramic_teapot_set/screen.png',
  'van-phuc': '/demo/craft/authentic_vietnamese_lotus_silk_scarf_woven_from_natural_lotus_stem_fibers_in/screen.png',
  'dong-ho': '/demo/craft/original_dong_ho_vietnamese_folk_woodcut_print_of_a_rooster_and_hen_on_textured/screen.png',
  'y-yen': '/demo/craft/antique_vietnamese_bronze_incense_burner_with_dragon_handles_and_foo_dog_finial/screen.png',
  'chu-dau': '/demo/craft/artisan_hand_turned_rustic_vietnamese_stoneware_celadon_tea_bowl_with_natural/screen.png',
  'lung-tam': '/demo/craft/traditional_vietnamese_handwoven_natural_hemp_fabric_runner_from_hmong_ethnic/screen.png',
  'phuc-sen': '/demo/craft/traditional_hand_forged_vietnamese_carbon_steel_kitchen_knife_and_iron_scissors/screen.png',
  'mai-chau': '/demo/craft/traditional_cham_ethnic_handwoven_brocade_textile_scarf_with_intricate/screen.png',
  'cham-bac-dao': '/demo/craft/vietnamese_hand_chased_solid_silver_hairpin_and_filigree_flower_brooch_from/screen.png',
  'thanh-tien': '/demo/craft/vietnamese_folk_art_woodblock_print_of_to_nu_four_beauties_playing_instruments/screen.png',
  'non-bai-tho': '/demo/craft/exquisite_traditional_vietnamese_non_la_conical_hat_with_subtle_poem/screen.png',
  'nga-son': '/demo/craft/artisan_handwoven_natural_sedge_and_seagrass_storage_basket_from_kim_son/screen.png',
  'thai-yen': '/demo/craft/hand_carved_vietnamese_ironwood_sculpture_of_mythical_dragon_turtle_from_la/screen.png',
  'thanh-ha': '/demo/craft/artisan_hand_turned_rustic_terracotta_water_jar_and_tea_bowl_from_bau_truc_cham/screen.png',
  'non-nuoc': '/demo/craft/hand_carved_vietnamese_ironwood_sculpture_of_mythical_dragon_turtle_from_la/screen.png',
  'bau-truc': '/demo/craft/artisan_hand_turned_rustic_terracotta_water_jar_and_tea_bowl_from_bau_truc_cham/screen.png',
  'my-nghiep': '/demo/craft/traditional_cham_ethnic_handwoven_brocade_textile_scarf_with_intricate/screen.png',
  'phu-gia': '/demo/craft/exquisite_vietnamese_traditional_silk_lantern_from_hoi_an_teardrop_shape_with/screen.png',
  'tho-cam-e-de': '/demo/craft/traditional_cham_ethnic_handwoven_brocade_textile_scarf_with_intricate/screen.png',
  'nhac-cu-trung': '/demo/craft/traditional_vietnamese_bamboo_transverse_flute_sao_truc_and_bamboo_birdcage/screen.png',
  'dan-gui-tay-nguyen': '/demo/craft/artisan_handwoven_bamboo_fruit_basket_and_lidded_box_from_phu_vinh_craft/screen.png',
  'tuong-go-nha-mo': '/demo/craft/traditional_vietnamese_mother_of_pearl_inlaid_rosewood_jewelry_box_from_chuyen/screen.png',
  'lai-thieu': '/demo/craft/museum_quality_product_photography_of_an_authentic_vietnamese_blue_and_white/screen.png',
  'tuong-binh-hiep': '/demo/craft/exquisite_traditional_vietnamese_lacquer_tea_tray_from_ha_thai_village_deep/screen.png',
  'gom-bien-hoa': '/demo/craft/product_photography_of_an_authentic_vietnamese_crackle_glaze_ceramic_teapot_set/screen.png',
  'banh-trang-trang-bang': '/demo/craft/traditional_vietnamese_carved_horn_comb_and_spoon_crafted_from_natural_water/screen.png',
  'dinh-yen': '/demo/craft/artisan_handwoven_natural_sedge_and_seagrass_storage_basket_from_kim_son/screen.png',
  'mang-thit': '/demo/craft/artisan_hand_turned_rustic_terracotta_water_jar_and_tea_bowl_from_bau_truc_cham/screen.png',
  'lanh-my-a': '/demo/craft/authentic_vietnamese_lotus_silk_scarf_woven_from_natural_lotus_stem_fibers_in/screen.png',
  'dua-ben-tre': '/demo/craft/artisan_handwoven_bamboo_fruit_basket_and_lidded_box_from_phu_vinh_craft/screen.png'
};

const DEFAULT_CRAFT_FALLBACK_IMG =
  'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=400&q=80';

export default function RegionDetailModal({ region, isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !region) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 bg-[#1C1B1A]/65 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="region-modal-title"
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#F9F8F6] border border-[#E6E2DA] shadow-2xl overflow-hidden flex flex-col animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: `0 25px 50px -12px rgba(28, 27, 26, 0.25), 0 0 0 1px #E6E2DA`
        }}
      >
        {/* Cultural Region Color Stripe */}
        <div className="h-1.5 w-full shrink-0" style={{ backgroundColor: region.color }} />

        {/* HEADER POPUP */}
        <div className="p-5 sm:p-6 bg-surface-crisp border-b border-border-neutral flex items-start justify-between gap-4 shrink-0">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span
                className="px-2.5 py-0.5 text-[10px] font-spec-code font-bold uppercase tracking-[0.16em] text-white shadow-xs"
                style={{ backgroundColor: region.color }}
              >
                {region.id}
              </span>
              <span className="font-spec-code text-[11px] font-semibold text-accent-terracotta uppercase tracking-widest">
                TRADITIONAL CRAFT VILLAGE HERITAGE
              </span>
            </div>
            <h2
              id="region-modal-title"
              className="text-lg sm:text-2xl md:text-3xl font-bold text-text-primary tracking-wide uppercase font-headline-title font-serif"
            >
              {region.name}
            </h2>
            <span className="text-xs sm:text-sm text-text-secondary font-label-signature italic">
              {region.subName}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center bg-surface-subtle hover:bg-text-primary text-text-secondary hover:text-white border border-border-neutral transition-colors cursor-pointer text-base shrink-0"
            title="Close detail page (Esc)"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* HERITAGE STATS BAR */}
        <div className="grid grid-cols-2 sm:grid-cols-3 divide-x divide-border-neutral border-b border-border-neutral bg-surface-subtle text-center shrink-0">
          <div className="py-2.5 px-3">
            <span className="text-[10px] uppercase text-text-secondary block font-spec-code tracking-wider">Provinces</span>
            <span className="text-base sm:text-lg font-bold text-text-primary font-headline-title font-serif">
              {region.provinces ? region.provinces.length : 0} Localities
            </span>
          </div>
          <div className="py-2.5 px-3">
            <span className="text-[10px] uppercase text-text-secondary block font-spec-code tracking-wider">Featured Crafts</span>
            <span className="text-base sm:text-lg font-bold text-accent-terracotta font-headline-title font-serif">
              {region.crafts ? region.crafts.length : 0} Crafts
            </span>
          </div>
          <div className="py-2.5 px-3 col-span-2 sm:col-span-1 border-t sm:border-t-0 border-border-neutral">
            <span className="text-[10px] uppercase text-text-secondary block font-spec-code tracking-wider">Identity</span>
            <span className="text-xs sm:text-sm font-semibold text-text-primary truncate block font-title-card font-serif">
              Master Craftsmanship
            </span>
          </div>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 scrollbar-thin scrollbar-thumb-border-neutral scrollbar-track-transparent">
          {/* 1. Cultural Heritage Character */}
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <span className="w-1.5 h-4" style={{ backgroundColor: region.color }} />
              <h3 className="font-label-action text-xs uppercase tracking-wider text-text-primary font-bold">
                Cultural Craft Identity &amp; Heritage Space
              </h3>
            </div>
            <p className="text-sm sm:text-[14px] text-text-secondary font-body-spec leading-relaxed bg-surface-crisp p-4 sm:p-5 border border-border-neutral shadow-xs">
              {region.description}
            </p>
          </div>

          {/* 2. Featured Crafts */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4" style={{ backgroundColor: region.color }} />
                <h3 className="font-label-action text-xs uppercase tracking-wider text-text-primary font-bold">
                  Representative Craft Works ({region.crafts ? region.crafts.length : 0})
                </h3>
              </div>
              <span className="text-[11px] font-spec-code text-text-secondary">
                Exquisite Handcrafted Essence
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {region.crafts &&
                region.crafts.map((craft) => {
                  const targetDetailUrl = `/crafts/${craft.craftId || craft.slug || craft.id}`;
                  const craftImage =
                    craft.imageUrl ||
                    (craft.craftId && CRAFT_THUMBNAILS[craft.craftId]) ||
                    CRAFT_SLUG_THUMBNAILS[craft.id] ||
                    DEFAULT_CRAFT_FALLBACK_IMG;

                  return (
                    <Link
                      key={craft.id}
                      to={targetDetailUrl}
                      onClick={onClose}
                      className="p-3 sm:p-3.5 bg-surface-crisp border border-border-neutral hover:border-accent-terracotta hover:shadow-md transition-all flex flex-col justify-between group shadow-xs cursor-pointer block no-underline text-inherit"
                      title={`View craft details: ${craft.name}`}
                    >
                      <div className="flex gap-3 sm:gap-3.5 items-start">
                        {/* Craft Image */}
                        <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 overflow-hidden border border-border-neutral bg-canvas-linen relative group/img">
                          <img
                            src={craftImage}
                            alt={craft.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = DEFAULT_CRAFT_FALLBACK_IMG;
                            }}
                          />
                        </div>

                        {/* Craft Details */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
                          <div>
                            <div className="flex items-start justify-between gap-1.5 mb-1">
                              <h4 className="font-bold text-sm sm:text-[15px] text-text-primary font-title-card font-serif group-hover:text-accent-terracotta transition-colors line-clamp-2 leading-snug">
                                {craft.name}
                              </h4>
                            </div>
                            <span
                              className="inline-block text-[10px] font-spec-code px-2 py-0.5 border border-border-neutral bg-canvas-linen text-text-secondary mb-1.5"
                            >
                              {craft.province}
                            </span>
                            <p className="text-xs font-body-spec text-text-secondary leading-relaxed line-clamp-2">
                              {craft.description}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className="mt-3 pt-2.5 border-t border-border-neutral/60 flex items-center justify-between text-[11px] font-spec-code">
                        <span className="text-text-secondary">Handcrafted work</span>
                        <span className="text-accent-terracotta group-hover:text-primary font-bold font-label-action flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          <span>View craft details</span>
                          <span>→</span>
                        </span>
                      </div>
                    </Link>
                  );
                })}
            </div>
          </div>

          {/* 3. Constituent Provinces */}
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <span className="w-1.5 h-4" style={{ backgroundColor: region.color }} />
              <h3 className="font-label-action text-xs uppercase tracking-wider text-text-primary font-bold">
                Territorial Boundary: {region.provinces ? region.provinces.length : 0} Administrative Provinces
              </h3>
            </div>
            <div className="flex flex-wrap gap-1.5 bg-surface-crisp p-3.5 border border-border-neutral shadow-xs">
              {region.provinces &&
                region.provinces.map((prov) => (
                  <span
                    key={prov}
                    className="px-2.5 py-1 bg-canvas-linen border border-border-neutral text-text-secondary hover:text-text-primary hover:border-accent-terracotta text-xs font-body-spec font-medium transition-colors"
                  >
                    {prov}
                  </span>
                ))}
            </div>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="p-4 sm:p-5 border-t border-border-neutral bg-surface-crisp flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-text-secondary font-spec-code text-center sm:text-left">
            <span>Currently viewing heritage region: </span>
            <span className="text-text-primary font-bold">{region.name}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <Link
              to="/artisans"
              onClick={onClose}
              className="py-2.5 px-4 bg-surface-crisp border border-accent-terracotta text-accent-terracotta hover:bg-accent-terracotta hover:text-white font-label-action text-xs uppercase tracking-wider font-semibold transition-colors text-center shadow-xs"
            >
              Master Artisans →
            </Link>
            <Link
              to={`/crafts?q=${encodeURIComponent(region.name)}`}
              onClick={onClose}
              className="flex-1 sm:flex-none py-2.5 px-5 bg-accent-terracotta hover:bg-primary text-white font-label-action text-xs uppercase tracking-wider font-semibold transition-colors text-center shadow-xs"
            >
              Explore All Regional Crafts
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 bg-surface-subtle hover:bg-border-neutral text-text-primary border border-border-neutral font-label-action text-xs uppercase tracking-wider transition-colors text-center cursor-pointer"
            >
              Return to Map
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
