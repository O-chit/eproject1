'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Map, Marker, setWorkerUrl } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

// Cấu hình web worker nội bộ từ public folder để Vite & browser luôn load mượt mà 100%
if (typeof window !== 'undefined' && typeof setWorkerUrl === 'function') {
  setWorkerUrl('/maplibre-gl-worker.mjs');
}

import {
  CULTURAL_REGIONS,
  getRegionBoundingBox,
  SOVEREIGNTY_DATA
} from './regionsConfig';
import RegionDetailModal from './RegionDetailModal';

// CẤU HÌNH BẢN ĐỒ DI SẢN CRAFTROOTS
// Nền biển mang sắc men ngọc nhạt (#EAF2F4), dịu mát, đồng điệu 100% với gam màu Linen #F9F8F6 của trang web
const HERITAGE_MAP_STYLE = {
  version: 8,
  sources: {},
  glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
  layers: [
    {
      id: 'heritage-ocean-background',
      type: 'background',
      paint: {
        'background-color': '#EAF2F4' // Biển men ngọc nhạt thanh khiết
      }
    }
  ]
};

// Khung nhìn bao trọn toàn vẹn đất liền và biển đảo Việt Nam
const VIETNAM_BOUNDS = [
  [102.0, 6.8],  // Tây Nam: Cực Tây Điện Biên đến cực Nam Trường Sa
  [117.5, 23.5]  // Đông Bắc: Cực Đông Trường Sa đến Lũng Cú Hà Giang
];

export default function VietnamCulturalMap({
  initialRegionId = null,
  onRegionSelect,
  className = ''
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const sovereigntyMarkersRef = useRef([]);

  const [regionsGeoJson, setRegionsGeoJson] = useState(null);
  const [selectedRegionId, setSelectedRegionId] = useState(initialRegionId);
  const [hoveredInfo, setHoveredInfo] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [currentZoom, setCurrentZoom] = useState(4.8);

  // Quản lý trạng thái mở/đóng Popup Trang Chi Tiết Vùng Văn Hóa
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalRegion, setModalRegion] = useState(
    initialRegionId ? CULTURAL_REGIONS[initialRegionId] : null
  );

  // 1. Tải dữ liệu GeoJSON 7 VÙNG VĂN HÓA (Đã hợp nhất, chỉ giữ lại ranh giới giữa 7 vùng, bỏ ranh giới tỉnh)
  useEffect(() => {
    let isMounted = true;
    async function loadCulturalRegionsGeoJson() {
      try {
        setLoadingData(true);
        const res = await fetch('/data/vietnam-cultural-regions.geojson');
        const data = await res.json();
        if (isMounted) {
          setRegionsGeoJson(data);
        }
      } catch (err) {
        console.error('[VietnamCulturalMap] Lỗi tải dữ liệu 7 vùng văn hóa:', err);
      } finally {
        if (isMounted) setLoadingData(false);
      }
    }
    loadCulturalRegionsGeoJson();
    return () => {
      isMounted = false;
    };
  }, []);

  // Tính toán vùng đệm (padding) tự động, an toàn tuyệt đối, bản đồ luôn nằm giữa màn hình
  const getDynamicPadding = useCallback(
    (isDetailedRegion = false) => {
      if (isDetailedRegion) {
        return {
          top: 60,
          bottom: 60,
          left: 60,
          right: 60
        };
      }

      return {
        top: 60,
        bottom: 40,
        left: 40,
        right: 40
      };
    },
    []
  );

  // 2. Căn vừa vặn toàn bộ dải đất và biển đảo Việt Nam trong một màn hình
  const fitToVietnamOverview = useCallback(
    (animate = true) => {
      const map = mapInstanceRef.current;
      if (!map) return;

      const containerWidth = mapContainerRef.current?.clientWidth || 0;
      const containerHeight = mapContainerRef.current?.clientHeight || 0;
      if (containerWidth <= 0 || containerHeight <= 0) return;

      try {
        map.fitBounds(VIETNAM_BOUNDS, {
          padding: getDynamicPadding(false),
          duration: animate ? 1000 : 0
        });
      } catch (e) {
        console.warn('[VietnamCulturalMap] fitBounds error:', e);
      }
    },
    [getDynamicPadding]
  );

  // 3. Phóng to cận cảnh vào vùng được chọn
  const zoomToRegion = useCallback(
    (regionId) => {
      const map = mapInstanceRef.current;
      if (!map || !regionsGeoJson?.features) return;

      if (!regionId) {
        fitToVietnamOverview(true);
        return;
      }

      const bbox = getRegionBoundingBox(regionsGeoJson.features, regionId);
      try {
        map.fitBounds(bbox, {
          padding: getDynamicPadding(true),
          duration: 1100,
          maxZoom: 8.5
        });
      } catch (e) {
        console.warn('[VietnamCulturalMap] zoomToRegion error:', e);
      }
    },
    [regionsGeoJson, fitToVietnamOverview, getDynamicPadding]
  );

  // Xử lý chọn vùng
  const handleSelectRegion = useCallback(
    (regionId) => {
      setSelectedRegionId(regionId);
      zoomToRegion(regionId);
      if (onRegionSelect) {
        onRegionSelect(regionId ? CULTURAL_REGIONS[regionId] : null);
      }
    },
    [zoomToRegion, onRegionSelect]
  );

  // 4. Khởi tạo bản đồ 2D nghiêm ngặt MapLibre GL
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    let map = null;
    try {
      map = new Map({
        container: mapContainerRef.current,
        style: HERITAGE_MAP_STYLE,
        center: [108.5, 15.5],
        zoom: 4.8,
        minZoom: 3.2,
        maxZoom: 11.0,
        pitch: 0,
        bearing: 0,
        maxPitch: 0,
        dragRotate: false,
        touchPitch: false,
        maxBounds: [
          [88.0, 2.0],
          [132.0, 28.0]
        ],
        attributionControl: false
      });
    } catch (err) {
      console.error('[VietnamCulturalMap] Khởi tạo map thất bại:', err);
      return;
    }

    const handleResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.resize();
      }
    };
    window.addEventListener('resize', handleResize);

    // Dùng ResizeObserver để bảo đảm canvas luôn có kích thước chuẩn xác
    let resizeObserver = null;
    if (window.ResizeObserver && mapContainerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.resize();
        }
      });
      resizeObserver.observe(mapContainerRef.current);
    }

    map.on('zoom', () => {
      setCurrentZoom(map.getZoom());
    });

    map.on('load', () => {
      map.resize();
      setMapLoaded(true);
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.resize();
          fitToVietnamOverview(false);
        }
      }, 100);
    });

    mapInstanceRef.current = map;
    if (typeof window !== 'undefined') {
      window.__map = map;
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      sovereigntyMarkersRef.current.forEach((m) => m.remove());
      sovereigntyMarkersRef.current = [];
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [fitToVietnamOverview]);

  // 5. Nạp Layers GeoJSON 7 VÙNG VĂN HÓA (Đã loại bỏ hoàn toàn ranh giới tỉnh)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapLoaded || !regionsGeoJson) return;

    if (!map.isStyleLoaded()) {
      map.once('styledata', () => {
        setupLayers();
      });
      return;
    }

    setupLayers();

    function setupLayers() {
      try {
        // --- A. SOURCE & LAYERS 7 VÙNG VĂN HÓA ---
        if (map.getSource('vn-regions-source')) {
          map.getSource('vn-regions-source').setData(regionsGeoJson);
        } else {
          map.addSource('vn-regions-source', {
            type: 'geojson',
            data: regionsGeoJson
          });

          // 1. Layer Fill tô màu 7 vùng văn hóa di sản (Ý tưởng 2: Ngũ Sắc Tranh Dân Gian & Men Tro Củi)
          map.addLayer({
            id: 'regions-fill',
            type: 'fill',
            source: 'vn-regions-source',
            paint: {
              'fill-color': [
                'match',
                ['get', 'regionId'],
                'TAY_BAC_VIET_BAC', '#D49A24',      // Vàng Hoa Hòe (Tranh dân gian & Dệt thổ cẩm)
                'DONG_BANG_SONG_HONG', '#A83827',   // Đỏ Vang Gỗ Vang (Son tranh Đông Hồ & Gốm Bát Tràng)
                'BAC_TRUNG_BO', '#5E4B7A',          // Tím Men Tro Lam Huế (Cố Đô & Men tro cổ)
                'NAM_TRUNG_BO', '#266B88',          // Lam Chàm Men Chu Đậu (Hải dương & Men lam cổ)
                'TAY_NGUYEN', '#CE5C23',            // Cam Lửa Nung Củi (Bazan nung củi & Lửa cồng chiêng)
                'DONG_NAM_BO', '#8A5232',           // Nâu Hổ Phách Nam Bộ (Gỗ mật, sơn mài & Gốm sành)
                'TAY_NAM_BO', '#327555',            // Xanh Gỉ Đồng Cổ Mộc (Phù sa miệt vườn Cửu Long)
                ['coalesce', ['get', 'regionColor'], '#B86B35']
              ],
              'fill-opacity': 0.92,
              'fill-antialias': true
            }
          });

          // 2a. Lớp rãnh viền trắng bọc ngoài (Outer Casing) - bảo đảm ranh giới 7 vùng luôn sắc nét nổi bật
          map.addLayer({
            id: 'regions-boundary-casing',
            type: 'line',
            source: 'vn-regions-source',
            paint: {
              'line-color': '#FFFFFF',
              'line-width': [
                'interpolate',
                ['linear'],
                ['zoom'],
                3.2, 2.5,
                6.0, 3.8,
                9.0, 5.2
              ],
              'line-opacity': 0.95
            }
          });

          // 2b. Lớp chỉ ranh giới chính màu mực đen (Inner Sharp Linework)
          map.addLayer({
            id: 'regions-boundary',
            type: 'line',
            source: 'vn-regions-source',
            paint: {
              'line-color': '#1C1B1A',
              'line-width': [
                'interpolate',
                ['linear'],
                ['zoom'],
                3.2, 1.2,
                6.0, 1.8,
                9.0, 2.6
              ],
              'line-opacity': 0.85
            }
          });

          // 3. Layer viền Terracotta khi hover vào vùng
          map.addLayer({
            id: 'region-hover-stroke',
            type: 'line',
            source: 'vn-regions-source',
            paint: {
              'line-color': '#B86B35',
              'line-width': 3.8,
              'line-opacity': 0
            }
          });

          // 4. Layer viền mực đen nổi bật cho vùng đang được chọn
          map.addLayer({
            id: 'region-highlight-line',
            type: 'line',
            source: 'vn-regions-source',
            paint: {
              'line-color': '#1C1B1A',
              'line-width': 4.5,
              'line-opacity': 0
            }
          });
        }

        // --- B. SOURCE & LAYERS CHỦ QUYỀN BIỂN ĐẢO (HOÀNG SA & TRƯỜNG SA) ---
        if (map.getSource('vn-sovereignty-source')) {
          map.getSource('vn-sovereignty-source').setData(SOVEREIGNTY_DATA);
        } else {
          map.addSource('vn-sovereignty-source', {
            type: 'geojson',
            data: SOVEREIGNTY_DATA
          });

          // Chấm sáng đại diện các thực thể đảo
          map.addLayer({
            id: 'islands-glow',
            type: 'circle',
            source: 'vn-sovereignty-source',
            filter: ['==', 'type', 'island'],
            paint: {
              'circle-radius': 8,
              'circle-color': '#B86B35',
              'circle-opacity': 0.25
            }
          });

          map.addLayer({
            id: 'islands-point',
            type: 'circle',
            source: 'vn-sovereignty-source',
            filter: ['==', 'type', 'island'],
            paint: {
              'circle-radius': 4.0,
              'circle-color': '#B86B35',
              'circle-stroke-width': 2.0,
              'circle-stroke-color': '#FFFFFF'
            }
          });
        }

        // Marker HTML chủ quyền cho Hoàng Sa & Trường Sa
        addSovereigntyHtmlBadges(map);
      } catch (err) {
        console.error('[VietnamCulturalMap] Lỗi khi tạo layers:', err);
      }
    }

    // --- C. SỰ KIỆN TƯƠNG TÁC CHUỘT TRÊN 7 VÙNG ---
    const onMouseMove = (e) => {
      const features = map.queryRenderedFeatures(e.point, { layers: ['regions-fill'] });
      if (features.length > 0) {
        map.getCanvas().style.cursor = 'pointer';
        const props = features[0].properties;

        setHoveredInfo({
          regionId: props.regionId,
          regionName: props.regionName,
          subName: props.subName,
          regionColor: props.regionColor,
          craftsCount: props.craftsCount || 0,
          provinces: typeof props.provinces === 'string' ? JSON.parse(props.provinces) : props.provinces,
          x: e.point.x,
          y: e.point.y
        });

        if (map.getLayer('region-hover-stroke')) {
          map.setFilter('region-hover-stroke', ['==', 'regionId', props.regionId]);
          map.setPaintProperty('region-hover-stroke', 'line-opacity', 1.0);
        }
      } else {
        map.getCanvas().style.cursor = '';
        setHoveredInfo(null);
        if (map.getLayer('region-hover-stroke')) {
          map.setPaintProperty('region-hover-stroke', 'line-opacity', 0);
        }
      }
    };

    const onMouseLeave = () => {
      map.getCanvas().style.cursor = '';
      setHoveredInfo(null);
      if (map.getLayer('region-hover-stroke')) {
        map.setPaintProperty('region-hover-stroke', 'line-opacity', 0);
      }
    };

    const onClick = (e) => {
      const features = map.queryRenderedFeatures(e.point, { layers: ['regions-fill'] });
      if (features.length > 0) {
        const clickedRegionId = features[0].properties.regionId;
        handleSelectRegion(clickedRegionId);
        if (CULTURAL_REGIONS[clickedRegionId]) {
          setModalRegion(CULTURAL_REGIONS[clickedRegionId]);
          setIsModalOpen(true);
        }
      }
    };

    map.on('mousemove', 'regions-fill', onMouseMove);
    map.on('mouseleave', 'regions-fill', onMouseLeave);
    map.on('click', 'regions-fill', onClick);

    return () => {
      if (map.getLayer('regions-fill')) {
        map.off('mousemove', 'regions-fill', onMouseMove);
        map.off('mouseleave', 'regions-fill', onMouseLeave);
        map.off('click', 'regions-fill', onClick);
      }
    };
  }, [mapLoaded, regionsGeoJson, handleSelectRegion]);

  // 6. Cập nhật độ trong suốt (opacity) và viền highlight khi thay đổi selectedRegionId
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapLoaded || !map.getLayer('regions-fill')) return;

    try {
      if (selectedRegionId) {
        map.setPaintProperty('regions-fill', 'fill-opacity', [
          'case',
          ['==', ['get', 'regionId'], selectedRegionId],
          1.0,
          0.35
        ]);

        if (map.getLayer('region-highlight-line')) {
          map.setFilter('region-highlight-line', ['==', 'regionId', selectedRegionId]);
          map.setPaintProperty('region-highlight-line', 'line-opacity', 1.0);
        }
      } else {
        map.setPaintProperty('regions-fill', 'fill-opacity', 0.88);

        if (map.getLayer('region-highlight-line')) {
          map.setPaintProperty('region-highlight-line', 'line-opacity', 0);
        }
      }
    } catch (e) {
      console.warn('[VietnamCulturalMap] update highlight error:', e);
    }
  }, [selectedRegionId, mapLoaded]);

  // Marker HTML cho Hoàng Sa & Trường Sa
  const addSovereigntyHtmlBadges = (map) => {
    sovereigntyMarkersRef.current.forEach((m) => m.remove());
    sovereigntyMarkersRef.current = [];

    // Hoàng Sa
    const hsEl = document.createElement('div');
    hsEl.className = 'group flex flex-col items-center pointer-events-auto cursor-pointer select-none';
    hsEl.innerHTML = `
      <div class="flex items-center gap-1.5 px-3 py-1 bg-[#FFFFFF] border-2 border-[#B86B35] shadow-lg shadow-[#B86B35]/20 transition-transform group-hover:scale-105">
        <span class="w-2.5 h-2.5 rounded-full bg-[#B86B35] animate-ping"></span>
        <span class="font-['Montserrat',sans-serif] text-[10px] font-bold text-[#1C1B1A] tracking-[0.16em] uppercase whitespace-nowrap">
          QUẦN ĐẢO HOÀNG SA
        </span>
      </div>
      <span class="font-['Inter',sans-serif] text-[9px] text-[#B86B35] tracking-widest uppercase font-bold mt-0.5 bg-[#FFFFFF] border border-[#E6E2DA] px-1.5 py-0.5 shadow-xs">
        (TP. ĐÀ NẴNG – VIỆT NAM)
      </span>
    `;
    const hsMarker = new Marker({ element: hsEl, anchor: 'center' })
      .setLngLat([112.0, 16.5])
      .addTo(map);
    sovereigntyMarkersRef.current.push(hsMarker);

    // Trường Sa
    const tsEl = document.createElement('div');
    tsEl.className = 'group flex flex-col items-center pointer-events-auto cursor-pointer select-none';
    tsEl.innerHTML = `
      <div class="flex items-center gap-1.5 px-3 py-1 bg-[#FFFFFF] border-2 border-[#B86B35] shadow-lg shadow-[#B86B35]/20 transition-transform group-hover:scale-105">
        <span class="w-2.5 h-2.5 rounded-full bg-[#B86B35] animate-ping"></span>
        <span class="font-['Montserrat',sans-serif] text-[10px] font-bold text-[#1C1B1A] tracking-[0.16em] uppercase whitespace-nowrap">
          QUẦN ĐẢO TRƯỜNG SA
        </span>
      </div>
      <span class="font-['Inter',sans-serif] text-[9px] text-[#B86B35] tracking-widest uppercase font-bold mt-0.5 bg-[#FFFFFF] border border-[#E6E2DA] px-1.5 py-0.5 shadow-xs">
        (TỈNH KHÁNH HÒA – VIỆT NAM)
      </span>
    `;
    const tsMarker = new Marker({ element: tsEl, anchor: 'center' })
      .setLngLat([114.0, 10.0])
      .addTo(map);
    sovereigntyMarkersRef.current.push(tsMarker);
  };

  // Điều khiển phóng to / thu nhỏ
  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn({ duration: 300 });
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut({ duration: 300 });
    }
  };

  return (
    <div className={`relative w-full h-full flex flex-col overflow-hidden bg-[#F9F8F6] ${className}`}>
      {/* THANH ĐIỀU HƯỚNG VÙNG NHANH Ở TRÊN (Quick Region Pills Bar) */}
      <div className="absolute top-3 left-4 right-4 z-20 flex items-center justify-between gap-2 pointer-events-none">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pointer-events-auto bg-[#FFFFFF]/95 backdrop-blur-md p-1.5 border border-[#E6E2DA] shadow-md max-w-full">
          <button
            type="button"
            onClick={() => {
              handleSelectRegion(null);
              setIsModalOpen(false);
              fitToVietnamOverview(true);
            }}
            className={`px-3 py-1 text-[11px] font-label-action uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              !selectedRegionId
                ? 'bg-[#1C1B1A] text-white font-bold shadow-xs'
                : 'text-[#5A5854] hover:text-[#1C1B1A] hover:bg-[#F4F2EE]'
            }`}
          >
            Toàn Cảnh Việt Nam
          </button>
          <span className="text-[#E6E2DA] select-none">|</span>
          {Object.values(CULTURAL_REGIONS).map((reg) => {
            const isSelected = selectedRegionId === reg.id;
            return (
              <button
                key={reg.id}
                type="button"
                onClick={() => {
                  handleSelectRegion(reg.id);
                  setModalRegion(reg);
                  setIsModalOpen(true);
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-label-action uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'text-white font-bold shadow-xs'
                    : 'text-[#5A5854] hover:text-[#1C1B1A] hover:bg-[#F4F2EE]'
                }`}
                style={isSelected ? { backgroundColor: reg.color } : {}}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: reg.color }}
                ></span>
                <span>{reg.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* KHUNG BẢN ĐỒ 2D MAPLIBRE CANVAS (FULL WIDTH & FULL HEIGHT) */}
      <div className="relative flex-1 w-full h-full min-h-[450px]">
        <div
          ref={mapContainerRef}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          style={{ minHeight: '450px', width: '100%', height: '100%' }}
        />

        {/* Loading Spinner */}
        {loadingData && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#F9F8F6]/85 backdrop-blur-sm">
            <div className="w-10 h-10 border-3 border-[#B86B35] border-t-transparent rounded-full animate-spin mb-3"></div>
            <span className="font-spec-code text-[12px] uppercase tracking-widest text-[#5A5854]">
              Đang tải bản đồ 7 vùng văn hóa làng nghề...
            </span>
          </div>
        )}

        {/* Tooltip di chuột theo Vùng Văn Hóa */}
        {hoveredInfo && (
          <div
            className="absolute z-30 pointer-events-none -translate-x-1/2 -translate-y-full pb-3 font-body-spec"
            style={{ left: hoveredInfo.x, top: hoveredInfo.y }}
          >
            <div className="px-3.5 py-2.5 bg-[#FFFFFF]/98 border border-[#E6E2DA] shadow-xl backdrop-blur-md text-[12px] flex flex-col gap-1 min-w-[210px]">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-[#1C1B1A] uppercase tracking-wider text-[13px] font-title-card font-serif">
                  {hoveredInfo.regionName}
                </span>
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                  style={{ backgroundColor: hoveredInfo.regionColor }}
                ></span>
              </div>
              <span className="text-[11px] text-[#B86B35] font-body-spec font-medium">
                {hoveredInfo.subName}
              </span>
              <div className="flex items-center justify-between text-[11px] text-[#5A5854] border-t border-[#E6E2DA] pt-1.5 mt-0.5 font-spec-code">
                <span>{hoveredInfo.provinces ? hoveredInfo.provinces.length : 0} tỉnh thành</span>
                <span className="text-[#B86B35] font-semibold">Xem chi tiết di sản →</span>
              </div>
            </div>
          </div>
        )}

        {/* BỘ NÚT ĐIỀU KHIỂN BẢN ĐỒ TIỆN ÍCH (Góc dưới bên trái) */}
        <div className="absolute bottom-5 left-5 z-20 flex flex-col gap-2 pointer-events-auto">
          {/* Nút Phóng to / Thu nhỏ / Căn vừa màn hình */}
          <div className="flex flex-col bg-[#FFFFFF]/95 backdrop-blur-md border border-[#E6E2DA] shadow-lg overflow-hidden font-spec-code text-[12px]">
            <button
              type="button"
              onClick={handleZoomIn}
              className="w-9 h-9 flex items-center justify-center text-[#1C1B1A] hover:text-[#B86B35] hover:bg-[#F4F2EE] transition-colors border-b border-[#E6E2DA] cursor-pointer font-bold text-base"
              title="Phóng to bản đồ"
            >
              +
            </button>
            <button
              type="button"
              onClick={handleZoomOut}
              className="w-9 h-9 flex items-center justify-center text-[#1C1B1A] hover:text-[#B86B35] hover:bg-[#F4F2EE] transition-colors border-b border-[#E6E2DA] cursor-pointer font-bold text-base"
              title="Thu nhỏ bản đồ (Xem toàn cảnh)"
            >
              −
            </button>
            <button
              type="button"
              onClick={() => {
                handleSelectRegion(null);
                setIsModalOpen(false);
                fitToVietnamOverview(true);
              }}
              className="w-9 h-9 flex items-center justify-center text-[#B86B35] hover:bg-[#F4F2EE] transition-colors cursor-pointer text-sm"
              title="Toàn cảnh Việt Nam vừa vặn màn hình"
            >
              ⛶
            </button>
          </div>

          {/* Cụm nút khi đang chọn một vùng văn hóa */}
          {selectedRegionId && CULTURAL_REGIONS[selectedRegionId] && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setModalRegion(CULTURAL_REGIONS[selectedRegionId]);
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-2 bg-[#B86B35] hover:bg-[#8E4A16] text-white font-bold border border-[#B86B35] shadow-lg backdrop-blur-md font-label-action text-[11px] uppercase tracking-wider transition-all cursor-pointer"
                title="Mở popup chi tiết vùng văn hóa"
              >
                <span>📖 Chi Tiết Vùng</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  handleSelectRegion(null);
                  setIsModalOpen(false);
                  fitToVietnamOverview(true);
                }}
                className="flex items-center gap-1.5 px-3 py-2 bg-[#FFFFFF]/95 hover:bg-[#F4F2EE] text-[#1C1B1A] border border-[#E6E2DA] shadow-lg backdrop-blur-md font-label-action text-[11px] uppercase tracking-wider transition-all cursor-pointer group"
                title="Xem lại toàn cảnh dải đất Việt Nam"
              >
                <span className="text-[#B86B35] group-hover:-translate-x-0.5 transition-transform">←</span>
                <span>Toàn Cảnh</span>
              </button>
            </div>
          )}

          {/* Badge hiển thị tỉ lệ zoom nhỏ tiện dụng */}
          <div className="px-2 py-1 bg-[#FFFFFF]/90 border border-[#E6E2DA] text-[10px] font-spec-code text-[#5A5854] select-none shadow-xs">
            Mức zoom: {currentZoom.toFixed(1)}x
          </div>
        </div>
      </div>

      {/* POPUP TRANG CHI TIẾT VÙNG VĂN HÓA LÀNG NGHỀ (MODAL) */}
      <RegionDetailModal
        isOpen={isModalOpen}
        region={modalRegion}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
