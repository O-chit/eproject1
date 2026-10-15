'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import {
  CULTURAL_REGIONS,
  getRegionBoundingBox,
  SOVEREIGNTY_DATA
} from '../../data/regionsConfig';

// CẤU HÌNH MAPSTYLE TỐI GIẢN CHỈ CHỨA DUY NHẤT LAYER BACKGROUND MÀU TỐI SÂU
// Tuyệt đối không tải tiles thế giới, không hiển thị nước khác, cô lập 100% lãnh thổ Việt Nam
const BLANK_DARK_MAP_STYLE = {
  version: 8,
  sources: {},
  layers: [
    {
      id: 'blank-dark-background',
      type: 'background',
      paint: {
        'background-color': '#0B0F19' // Xanh đen sâu thẳm, tôn vinh màu sắc 7 vùng
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
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);

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

  // Thông tin vùng văn hóa đang được chọn
  const activeRegion = selectedRegionId ? CULTURAL_REGIONS[selectedRegionId] : null;

  // Tính toán vùng đệm (padding) tự động để bản đồ luôn căn giữa hoàn hảo
  const getDynamicPadding = useCallback(
    (isDetailedRegion = false) => {
      const isLg = typeof window !== 'undefined' && window.innerWidth >= 1024;
      const rightPanelWidth = isLg && !isPanelCollapsed ? 440 : 40;

      if (isDetailedRegion) {
        return {
          top: 70,
          bottom: 70,
          left: 60,
          right: rightPanelWidth
        };
      }

      return {
        top: 60,
        bottom: 40,
        left: 40,
        right: rightPanelWidth
      };
    },
    [isPanelCollapsed]
  );

  // 2. Căn vừa vặn toàn bộ dải đất và biển đảo Việt Nam trong một màn hình
  const fitToVietnamOverview = useCallback(
    (animate = true) => {
      const map = mapInstanceRef.current;
      if (!map) return;

      map.fitBounds(VIETNAM_BOUNDS, {
        padding: getDynamicPadding(false),
        duration: animate ? 1000 : 0
      });
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
      map.fitBounds(bbox, {
        padding: getDynamicPadding(true),
        duration: 1100,
        maxZoom: 8.5
      });
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

  // Toggle thu gọn/mở rộng Side Panel
  const handleTogglePanel = () => {
    setIsPanelCollapsed((prev) => {
      const nextState = !prev;
      setTimeout(() => {
        const map = mapInstanceRef.current;
        if (map) {
          map.resize();
          if (selectedRegionId) {
            zoomToRegion(selectedRegionId);
          } else {
            fitToVietnamOverview(true);
          }
        }
      }, 250);
      return nextState;
    });
  };

  // 4. Khởi tạo bản đồ 2D nghiêm ngặt MapLibre GL
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: BLANK_DARK_MAP_STYLE,
      center: [108.5, 15.5],
      zoom: 4.8,
      minZoom: 3.2, // Tăng cường dải zoom nhỏ để toàn bộ Việt Nam nằm gọn trong màn hình
      maxZoom: 11.0,
      pitch: 0,
      bearing: 0,
      maxPitch: 0,
      dragRotate: false,
      touchPitch: false,
      maxBounds: [
        [94.0, 3.5],
        [126.0, 26.5]
      ],
      attributionControl: false
    });

    const handleResize = () => {
      map.resize();
    };
    window.addEventListener('resize', handleResize);

    map.on('zoom', () => {
      setCurrentZoom(map.getZoom());
    });

    map.on('load', () => {
      map.resize();
      setMapLoaded(true);
      const isLg = window.innerWidth >= 1024;
      map.fitBounds(VIETNAM_BOUNDS, {
        padding: {
          top: 60,
          bottom: 40,
          left: 40,
          right: isLg ? 440 : 40
        },
        duration: 0
      });
    });

    mapInstanceRef.current = map;

    return () => {
      window.removeEventListener('resize', handleResize);
      sovereigntyMarkersRef.current.forEach((m) => m.remove());
      sovereigntyMarkersRef.current = [];
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 5. Nạp Layers GeoJSON 7 VÙNG VĂN HÓA (Đã loại bỏ hoàn toàn ranh giới tỉnh)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapLoaded || !regionsGeoJson) return;

    // --- A. SOURCE & LAYERS 7 VÙNG VĂN HÓA ---
    if (map.getSource('vn-regions-source')) {
      map.getSource('vn-regions-source').setData(regionsGeoJson);
    } else {
      map.addSource('vn-regions-source', {
        type: 'geojson',
        data: regionsGeoJson
      });

      // 1. Layer Fill tô màu 7 vùng
      map.addLayer({
        id: 'regions-fill',
        type: 'fill',
        source: 'vn-regions-source',
        paint: {
          'fill-color': ['get', 'regionColor'],
          'fill-opacity': 0.88,
          'fill-antialias': true
        }
      });

      // 2. Layer ranh giới CHỈ GIỮ LẠI giữa 7 vùng (và bờ biển ngoài)
      map.addLayer({
        id: 'regions-boundary',
        type: 'line',
        source: 'vn-regions-source',
        paint: {
          'line-color': 'rgba(255, 255, 255, 0.65)',
          'line-width': [
            'interpolate',
            ['linear'],
            ['zoom'],
            3.2, 0.8,
            6.0, 1.5,
            9.0, 2.5
          ]
        }
      });

      // 3. Layer viền sáng khi hover vào vùng
      map.addLayer({
        id: 'region-hover-stroke',
        type: 'line',
        source: 'vn-regions-source',
        paint: {
          'line-color': '#38BDF8', // Cyan rực rỡ
          'line-width': 2.8,
          'line-opacity': 0
        }
      });

      // 4. Layer viền nổi bật cho vùng đang được chọn
      map.addLayer({
        id: 'region-highlight-line',
        type: 'line',
        source: 'vn-regions-source',
        paint: {
          'line-color': '#FEF08A', // Vàng sáng tương phản cao
          'line-width': 3.5,
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
          'circle-radius': 7,
          'circle-color': '#38BDF8',
          'circle-opacity': 0.35
        }
      });

      map.addLayer({
        id: 'islands-point',
        type: 'circle',
        source: 'vn-sovereignty-source',
        filter: ['==', 'type', 'island'],
        paint: {
          'circle-radius': 3.5,
          'circle-color': '#38BDF8',
          'circle-stroke-width': 1.5,
          'circle-stroke-color': '#F8FAFC'
        }
      });

      // Nhãn chữ Biển Đông
      map.addLayer({
        id: 'sea-label',
        type: 'symbol',
        source: 'vn-sovereignty-source',
        filter: ['==', 'type', 'sea-label'],
        layout: {
          'text-field': ['get', 'name'],
          'text-size': 12,
          'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
          'text-letter-spacing': 0.25,
          'text-transform': 'uppercase'
        },
        paint: {
          'text-color': '#94A3B8',
          'text-opacity': 0.65
        }
      });

      addSovereigntyHtmlBadges(map);
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
          map.setFilter('region-hover-stroke', ['==', ['get', 'regionId'], props.regionId]);
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
      }
    };

    map.on('mousemove', 'regions-fill', onMouseMove);
    map.on('mouseleave', 'regions-fill', onMouseLeave);
    map.on('click', 'regions-fill', onClick);

    return () => {
      map.off('mousemove', 'regions-fill', onMouseMove);
      map.off('mouseleave', 'regions-fill', onMouseLeave);
      map.off('click', 'regions-fill', onClick);
    };
  }, [mapLoaded, regionsGeoJson, handleSelectRegion]);

  // 6. Cập nhật độ trong suốt (opacity) và viền highlight khi thay đổi selectedRegionId
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapLoaded || !map.getLayer('regions-fill')) return;

    if (selectedRegionId) {
      // Vùng được chọn giữ 1.0, các vùng khác giảm xuống 0.35
      map.setPaintProperty('regions-fill', 'fill-opacity', [
        'case',
        ['==', ['get', 'regionId'], selectedRegionId],
        1.0,
        0.35
      ]);

      // Bật sáng đường viền cho vùng được chọn
      if (map.getLayer('region-highlight-line')) {
        map.setFilter('region-highlight-line', ['==', ['get', 'regionId'], selectedRegionId]);
        map.setPaintProperty('region-highlight-line', 'line-opacity', 1.0);
      }
    } else {
      // Trạng thái mặc định: Toàn bộ 7 vùng hiển thị 0.88
      map.setPaintProperty('regions-fill', 'fill-opacity', 0.88);

      if (map.getLayer('region-highlight-line')) {
        map.setPaintProperty('region-highlight-line', 'line-opacity', 0);
      }
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
      <div class="flex items-center gap-1.5 px-2.5 py-1 bg-[#0B0F19]/95 border border-[#38BDF8] shadow-lg shadow-[#38BDF8]/25 transition-transform group-hover:scale-105">
        <span class="w-2 h-2 rounded-full bg-[#38BDF8] animate-ping"></span>
        <span class="font-mono text-[10px] font-bold text-[#F8FAFC] tracking-[0.16em] uppercase whitespace-nowrap">
          QUẦN ĐẢO HOÀNG SA
        </span>
      </div>
      <span class="font-sans text-[8px] text-[#38BDF8] tracking-widest uppercase font-semibold mt-0.5 bg-[#0B0F19]/80 px-1 py-0.2">
        (TP. ĐÀ NẴNG – VIỆT NAM)
      </span>
    `;
    const hsMarker = new maplibregl.Marker({ element: hsEl, anchor: 'center' })
      .setLngLat([112.0, 16.5])
      .addTo(map);
    sovereigntyMarkersRef.current.push(hsMarker);

    // Trường Sa
    const tsEl = document.createElement('div');
    tsEl.className = 'group flex flex-col items-center pointer-events-auto cursor-pointer select-none';
    tsEl.innerHTML = `
      <div class="flex items-center gap-1.5 px-2.5 py-1 bg-[#0B0F19]/95 border border-[#38BDF8] shadow-lg shadow-[#38BDF8]/25 transition-transform group-hover:scale-105">
        <span class="w-2 h-2 rounded-full bg-[#38BDF8] animate-ping"></span>
        <span class="font-mono text-[10px] font-bold text-[#F8FAFC] tracking-[0.16em] uppercase whitespace-nowrap">
          QUẦN ĐẢO TRƯỜNG SA
        </span>
      </div>
      <span class="font-sans text-[8px] text-[#38BDF8] tracking-widest uppercase font-semibold mt-0.5 bg-[#0B0F19]/80 px-1 py-0.2">
        (TỈNH KHÁNH HÒA – VIỆT NAM)
      </span>
    `;
    const tsMarker = new maplibregl.Marker({ element: tsEl, anchor: 'center' })
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
    <div className={`relative w-full h-full flex flex-col lg:flex-row overflow-hidden bg-[#0B0F19] ${className}`}>
      {/* THANH ĐIỀU HƯỚNG VÙNG NHANH Ở TRÊN (Quick Region Pills Bar) */}
      <div className="absolute top-3 left-4 right-4 z-20 flex items-center justify-between gap-2 pointer-events-none">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pointer-events-auto bg-[#0B0F19]/90 backdrop-blur-md p-1.5 border border-white/10 shadow-2xl max-w-full">
          <button
            type="button"
            onClick={() => handleSelectRegion(null)}
            className={`px-3 py-1 text-[11px] font-mono uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              !selectedRegionId
                ? 'bg-white text-[#0B0F19] font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Toàn Cảnh Việt Nam
          </button>
          <span className="text-white/20 select-none">|</span>
          {Object.values(CULTURAL_REGIONS).map((reg) => {
            const isSelected = selectedRegionId === reg.id;
            return (
              <button
                key={reg.id}
                type="button"
                onClick={() => handleSelectRegion(reg.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'text-white font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
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

      {/* KHUNG BẢN ĐỒ 2D MAPLIBRE CANVAS */}
      <div className="relative flex-1 w-full h-full min-h-[450px]">
        <div
          ref={mapContainerRef}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        />

        {/* Loading Spinner */}
        {loadingData && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#0B0F19]/85 backdrop-blur-sm">
            <div className="w-10 h-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mb-3"></div>
            <span className="font-mono text-[12px] uppercase tracking-widest text-slate-300">
              Đang tải bản đồ 7 vùng văn hóa làng nghề...
            </span>
          </div>
        )}

        {/* Tooltip di chuột theo Vùng Văn Hóa */}
        {hoveredInfo && (
          <div
            className="absolute z-30 pointer-events-none -translate-x-1/2 -translate-y-full pb-3 font-mono"
            style={{ left: hoveredInfo.x, top: hoveredInfo.y }}
          >
            <div className="px-3.5 py-2 bg-[#0B0F19]/95 border border-white/20 shadow-2xl backdrop-blur-md text-[11px] flex flex-col gap-1 min-w-[200px]">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-white uppercase tracking-wider text-[12px]">
                  {hoveredInfo.regionName}
                </span>
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: hoveredInfo.regionColor }}
                ></span>
              </div>
              <span className="text-[10px] text-amber-400/90 font-mono">
                {hoveredInfo.subName}
              </span>
              <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-white/10 pt-1 mt-0.5">
                <span>{hoveredInfo.provinces ? hoveredInfo.provinces.length : 0} tỉnh thành</span>
                <span className="text-slate-300">Nhấp để xem chi tiết →</span>
              </div>
            </div>
          </div>
        )}

        {/* BỘ NÚT ĐIỀU KHIỂN BẢN ĐỒ TIỆN ÍCH (Góc dưới bên trái) */}
        <div className="absolute bottom-5 left-5 z-20 flex flex-col gap-2 pointer-events-auto">
          {/* Nút Phóng to / Thu nhỏ / Căn vừa màn hình */}
          <div className="flex flex-col bg-[#0B0F19]/90 backdrop-blur-md border border-white/20 shadow-2xl overflow-hidden font-mono text-[12px]">
            <button
              type="button"
              onClick={handleZoomIn}
              className="w-9 h-9 flex items-center justify-center text-slate-200 hover:text-white hover:bg-white/10 transition-colors border-b border-white/10 cursor-pointer font-bold text-base"
              title="Phóng to bản đồ"
            >
              +
            </button>
            <button
              type="button"
              onClick={handleZoomOut}
              className="w-9 h-9 flex items-center justify-center text-slate-200 hover:text-white hover:bg-white/10 transition-colors border-b border-white/10 cursor-pointer font-bold text-base"
              title="Thu nhỏ bản đồ (Xem toàn cảnh)"
            >
              −
            </button>
            <button
              type="button"
              onClick={() => {
                handleSelectRegion(null);
                fitToVietnamOverview(true);
              }}
              className="w-9 h-9 flex items-center justify-center text-amber-400 hover:text-amber-300 hover:bg-white/10 transition-colors cursor-pointer text-sm"
              title="Toàn cảnh Việt Nam vừa vặn màn hình"
            >
              ⛶
            </button>
          </div>

          {/* Nút Xem Toàn Bộ Việt Nam khi đang ở trong chế độ chọn vùng */}
          {selectedRegionId && (
            <button
              type="button"
              onClick={() => handleSelectRegion(null)}
              className="flex items-center gap-2 px-3 py-2 bg-[#0B0F19]/90 hover:bg-[#0B0F19] text-white border border-white/20 shadow-xl backdrop-blur-md font-mono text-[11px] uppercase tracking-wider transition-all cursor-pointer group"
            >
              <span className="text-amber-400 group-hover:-translate-x-0.5 transition-transform">←</span>
              <span>Xem Toàn Cảnh</span>
            </button>
          )}

          {/* Badge hiển thị tỉ lệ zoom nhỏ tiện dụng */}
          <div className="px-2 py-1 bg-[#0B0F19]/80 border border-white/10 text-[9px] font-mono text-slate-400 select-none">
            Mức zoom: {currentZoom.toFixed(1)}x
          </div>
        </div>

        {/* Nút Thu gọn / Mở rộng Side Panel ở cạnh phải màn hình lớn */}
        <button
          type="button"
          onClick={handleTogglePanel}
          className="hidden lg:flex absolute top-1/2 -translate-y-1/2 right-0 z-30 w-6 h-12 bg-[#0F172A] hover:bg-[#1E293B] border-y border-l border-white/20 items-center justify-center text-slate-300 hover:text-white transition-all shadow-xl cursor-pointer"
          title={isPanelCollapsed ? 'Mở rộng bảng chi tiết' : 'Thu gọn bảng để xem bản đồ rộng hơn'}
        >
          <span className="text-xs">{isPanelCollapsed ? '◀' : '▶'}</span>
        </button>
      </div>

      {/* BẢNG THÔNG TIN CHI TIẾT VÙNG VĂN HÓA LÀNG NGHỀ (SIDE PANEL) */}
      <div
        className={`w-full lg:w-[420px] shrink-0 bg-[#0F172A] border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col justify-between overflow-hidden shadow-2xl transition-all duration-300 z-20 ${
          isPanelCollapsed
            ? 'hidden'
            : activeRegion
            ? 'translate-x-0 opacity-100 flex'
            : 'hidden lg:flex'
        }`}
      >
        {activeRegion ? (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Header Vùng */}
            <div className="p-5 border-b border-white/10 bg-[#0B0F19] flex flex-col gap-2 shrink-0">
              <div className="flex items-center justify-between">
                <span
                  className="px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-[0.16em] text-white"
                  style={{ backgroundColor: activeRegion.color }}
                >
                  {activeRegion.id}
                </span>
                <button
                  type="button"
                  onClick={() => handleSelectRegion(null)}
                  className="text-slate-400 hover:text-white text-sm cursor-pointer p-1"
                  title="Đóng chi tiết"
                >
                  ✕
                </button>
              </div>
              <h2 className="text-[20px] font-bold text-white tracking-wide uppercase mt-1">
                {activeRegion.name}
              </h2>
              <span className="text-[12px] text-amber-400/90 font-mono">
                {activeRegion.subName}
              </span>
            </div>

            {/* Nội dung chi tiết cuộn */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-thin scrollbar-thumb-white/10">
              {/* Đặc trưng văn hóa */}
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400 block mb-1.5">
                  Đặc Trưng Văn Hóa Nghề
                </span>
                <p className="text-[13px] text-slate-300 leading-relaxed bg-[#0B0F19]/60 p-3.5 border border-white/5">
                  {activeRegion.description}
                </p>
              </div>

              {/* Làng nghề tiêu biểu */}
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400 block mb-2">
                  Làng Nghề Truyền Thống Tiêu Biểu ({activeRegion.crafts.length})
                </span>
                <div className="space-y-2.5">
                  {activeRegion.crafts.map((craft) => (
                    <div
                      key={craft.id}
                      className="p-3 bg-[#0B0F19] border border-white/5 hover:border-amber-500/50 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-bold text-[13px] text-white">
                          {craft.name}
                        </span>
                        <span
                          className="text-[10px] font-mono px-2 py-0.5 shrink-0"
                          style={{
                            color: activeRegion.color,
                            backgroundColor: activeRegion.badgeBg
                          }}
                        >
                          {craft.province}
                        </span>
                      </div>
                      <p className="text-[12px] text-slate-400 leading-normal">
                        {craft.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Danh sách tỉnh thành trực thuộc */}
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400 block mb-2">
                  Tỉnh Thành Trực Thuộc ({activeRegion.provinces.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeRegion.provinces.map((prov) => (
                    <span
                      key={prov}
                      className="px-2 py-1 bg-[#0B0F19] border border-white/10 text-slate-300 text-[11px] font-mono"
                    >
                      {prov}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer hành động */}
            <div className="p-4 border-t border-white/10 bg-[#0B0F19] flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => handleSelectRegion(null)}
                className="w-full py-2.5 px-4 bg-white/10 hover:bg-white text-slate-200 hover:text-[#0B0F19] font-mono text-[11px] uppercase tracking-wider font-bold transition-colors text-center cursor-pointer"
              >
                Thu Nhỏ Toàn Cảnh
              </button>
            </div>
          </div>
        ) : (
          /* Màn hình chờ khi chưa chọn vùng */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#0B0F19]">
            <div className="w-12 h-12 rounded-full border border-amber-500/30 bg-amber-500/10 flex items-center justify-center text-amber-400 mb-4 text-xl">
              🗺️
            </div>
            <h3 className="font-mono text-[13px] uppercase tracking-widest text-white font-bold mb-2">
              Bản Đồ 7 Vùng Văn Hóa Làng Nghề
            </h3>
            <p className="text-[12px] text-slate-400 leading-relaxed max-w-xs mb-5">
              Nhấp chuột trực tiếp vào bất kỳ vùng màu nào trên bản đồ để khám phá tinh hoa làng nghề, nghệ nhân và kỹ pháp truyền thống của vùng đó.
            </p>
            <div className="space-y-1.5 w-full text-left font-mono text-[11px]">
              {Object.values(CULTURAL_REGIONS).map((reg) => (
                <button
                  key={reg.id}
                  type="button"
                  onClick={() => handleSelectRegion(reg.id)}
                  className="w-full flex items-center justify-between p-2 bg-[#0F172A] hover:bg-white/5 border border-white/5 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: reg.color }}
                    ></span>
                    <span className="text-slate-300">{reg.name}</span>
                  </div>
                  <span className="text-slate-500 text-[10px]">
                    {reg.provinces.length} Tỉnh →
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
