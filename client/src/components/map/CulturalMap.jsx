import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import { getVillagesApi } from '../../api/regions';
import { getCategoriesApi } from '../../api/metadata';
import MapLegend from './MapLegend';
import MapControls from './MapControls';
import VillageDrawer from './VillageDrawer';

// Fallback style using robust CARTO Dark raster tiles - ensures 100% offline & firewall resilience
const BASEMAP_STYLE = {
  version: 8,
  sources: {
    'carto-dark': {
      type: 'raster',
      tiles: [
        'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
        'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
        'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
      ],
      tileSize: 256,
      attribution: '&copy; OpenStreetMap contributors, &copy; CARTO'
    }
  },
  layers: [
    {
      id: 'carto-dark-tiles',
      type: 'raster',
      source: 'carto-dark',
      minzoom: 0,
      maxzoom: 20
    }
  ]
};

const REGION_CENTERS = {
  'all': { center: [108.5, 15.8], zoom: 5.4, pitch: 0 },
  'dong-bang-bac-bo': { center: [105.9, 20.8], zoom: 8.4, pitch: 20 },
  'tay-bac': { center: [103.8, 21.6], zoom: 7.8, pitch: 25 },
  'dong-bac': { center: [106.2, 21.8], zoom: 7.8, pitch: 20 },
  'bac-trung-bo': { center: [106.2, 18.5], zoom: 7.2, pitch: 15 },
  'duyen-hai-nam-trung-bo': { center: [109.5, 14.5], zoom: 6.8, pitch: 20 },
  'tay-nguyen': { center: [108.0, 13.0], zoom: 7.4, pitch: 25 },
  'nam-bo': { center: [106.0, 10.2], zoom: 7.4, pitch: 15 }
};

// Chuyển danh sách làng nghề sang chuẩn GeoJSON
function villagesToGeoJSON(villages = []) {
  return {
    type: 'FeatureCollection',
    features: villages
      .filter((v) => Array.isArray(v.coordinates) && v.coordinates.length === 2)
      .map((v) => ({
        type: 'Feature',
        id: v.id,
        properties: {
          id: v.id,
          name: v.name,
          category: v.category || v.categorySlug || 'ceramics',
          categoryLabel: v.categoryLabel || v.categoryName || 'Di Sản Làng Nghề',
          regionId: v.regionId || v.regionCode || '',
          regionName: v.regionName || '',
          province: v.province || v.location || '',
          established: v.established || '',
          artisansCount: v.artisansCount || 0,
          craftsCount: v.craftsCount || 0,
          description: v.description || '',
          representativeArtisan: v.representativeArtisan || '',
          image: v.image || v.thumbnailUrl || '',
          craftId: v.craftId || v.id,
          featured: !!v.featured
        },
        geometry: {
          type: 'Point',
          coordinates: v.coordinates
        }
      }))
  };
}

export default function CulturalMap({
  activeRegionKey = 'all',
  onRegionChange,
  className = ''
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [villagesData, setVillagesData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedVillage, setSelectedVillage] = useState(null);
  const [is3D, setIs3D] = useState(false);
  const [hoveredInfo, setHoveredInfo] = useState(null);

  // 1. Tải dữ liệu Làng Nghề từ API Database
  useEffect(() => {
    let isMounted = true;
    async function fetchVillages() {
      try {
        const res = await getVillagesApi();
        if (isMounted && res.data && Array.isArray(res.data)) {
          setVillagesData(res.data);
        }
      } catch (err) {
        console.warn('[CulturalMap] Lỗi tải làng nghề từ API:', err);
      }
    }

    fetchVillages();
    return () => {
      isMounted = false;
    };
  }, []);

  // Lọc danh sách làng nghề theo Danh mục & Vùng miền
  const filteredVillages = villagesData.filter((v) => {
    const cat = v.category || v.categorySlug;
    const reg = v.regionId || v.regionCode || String(v.region_id);
    const matchCategory = selectedCategory === 'all' || cat === selectedCategory;
    const matchRegion = activeRegionKey === 'all' || reg === activeRegionKey;
    return matchCategory && matchRegion;
  });

  // Chọn làng nghề
  const handleSelectVillage = useCallback((village) => {
    setSelectedVillage(village);
    if (mapInstanceRef.current && village.coordinates) {
      mapInstanceRef.current.easeTo({
        center: village.coordinates,
        zoom: Math.max(mapInstanceRef.current.getZoom(), 9.5),
        duration: 1000
      });
    }
  }, []);

  // Khởi tạo bản đồ MapLibre
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: BASEMAP_STYLE,
      center: [108.5, 15.8],
      zoom: 5.4,
      minZoom: 4.8,
      maxZoom: 16,
      pitch: 0,
      bearing: 0,
      attributionControl: false
    });

    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');

    const handleResize = () => {
      mapInstanceRef.current?.resize();
    };
    window.addEventListener('resize', handleResize);

    map.on('load', async () => {
      map.resize();

      // 1. Fetch & Add Vietnam Regions GeoJSON
      try {
        const res = await fetch('/data/vietnam-regions.geojson');
        const geojson = await res.json();

        if (map.getSource('vietnam-regions')) {
          map.getSource('vietnam-regions').setData(geojson);
        } else {
          map.addSource('vietnam-regions', {
            type: 'geojson',
            data: geojson
          });

          // Fill Layer for Cultural Regions
          map.addLayer({
            id: 'regions-fill',
            type: 'fill',
            source: 'vietnam-regions',
            filter: ['==', '$type', 'Polygon'],
            paint: {
              'fill-color': [
                'case',
                ['has', 'color'], ['get', 'color'],
                '#B86B35'
              ],
              'fill-opacity': 0.18
            }
          });

          // Region Boundaries Line Layer
          map.addLayer({
            id: 'regions-line',
            type: 'line',
            source: 'vietnam-regions',
            filter: ['==', '$type', 'Polygon'],
            paint: {
              'line-color': '#E6E2DA',
              'line-width': 1.2,
              'line-opacity': 0.6,
              'line-dasharray': [3, 2]
            }
          });

          // Region Hover Highlight Layer
          map.addLayer({
            id: 'regions-highlight-line',
            type: 'line',
            source: 'vietnam-regions',
            filter: ['==', '$type', 'Polygon'],
            paint: {
              'line-color': '#B86B35',
              'line-width': 2.5,
              'line-opacity': 0.9
            }
          });
        }
      } catch (err) {
        console.warn('[CulturalMap] Chưa tải được vietnam-regions.geojson:', err);
      }

      // 2. Add Craft Villages GeoJSON Source with Clustering
      const initialGeoJSON = villagesToGeoJSON(villagesData);
      map.addSource('craft-villages-source', {
        type: 'geojson',
        data: initialGeoJSON,
        cluster: true,
        clusterMaxZoom: 12,
        clusterRadius: 45
      });

      // Cluster Outer Glow Layer
      map.addLayer({
        id: 'clusters-glow',
        type: 'circle',
        source: 'craft-villages-source',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': '#B86B35',
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            24, 5,
            30, 10,
            38
          ],
          'circle-opacity': 0.25,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#B86B35',
          'circle-stroke-opacity': 0.6
        }
      });

      // Cluster Circles Layer
      map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'craft-villages-source',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': '#1C1B1A',
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            16, 5,
            22, 10,
            28
          ],
          'circle-stroke-width': 2.5,
          'circle-stroke-color': '#B86B35'
        }
      });

      // Cluster Count Numbers
      map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'craft-villages-source',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
          'text-size': 13
        },
        paint: {
          'text-color': '#F9F8F6'
        }
      });

      // Individual Village Points (Unclustered)
      map.addLayer({
        id: 'unclustered-point-glow',
        type: 'circle',
        source: 'craft-villages-source',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': '#B86B35',
          'circle-radius': 14,
          'circle-opacity': 0.25
        }
      });

      map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'craft-villages-source',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': [
            'match',
            ['get', 'category'],
            'ceramics', '#B86B35',
            'textiles', '#2A7B68',
            'bamboo', '#D49B35',
            'lacquer', '#A82D2D',
            'metalsmith', '#6B7280',
            '#B86B35'
          ],
          'circle-radius': 7.5,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#FFFFFF'
        }
      });

      // Click on cluster -> Fly to expand
      map.on('click', 'clusters', async (e) => {
        const features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
        const clusterId = features[0].properties.cluster_id;
        try {
          const zoom = await map.getSource('craft-villages-source').getClusterExpansionZoom(clusterId);
          map.easeTo({
            center: features[0].geometry.coordinates,
            zoom: zoom + 0.5,
            duration: 800
          });
        } catch (err) {
          console.error(err);
        }
      });

      // Click on unclustered point -> Select Village
      map.on('click', 'unclustered-point', (e) => {
        if (!e.features || !e.features[0]) return;
        const props = e.features[0].properties;
        const found = villagesData.find((v) => String(v.id) === String(props.id)) || props;
        if (found) {
          handleSelectVillage(found);
        }
      });

      // Hover cursors
      map.on('mouseenter', 'clusters', () => { map.getCanvas().style.cursor = 'pointer'; });
      map.on('mouseleave', 'clusters', () => { map.getCanvas().style.cursor = ''; });
      map.on('mouseenter', 'unclustered-point', (e) => {
        map.getCanvas().style.cursor = 'pointer';
        if (e.features && e.features[0]) {
          const props = e.features[0].properties;
          setHoveredInfo({
            name: props.name,
            province: props.province,
            x: e.point.x,
            y: e.point.y
          });
        }
      });
      map.on('mouseleave', 'unclustered-point', () => {
        map.getCanvas().style.cursor = '';
        setHoveredInfo(null);
      });

      // Click on region polygon
      map.on('click', 'regions-fill', (e) => {
        if (e.features && e.features[0]) {
          const regionId = e.features[0].properties.id;
          if (regionId && onRegionChange) {
            onRegionChange(regionId);
          }
        }
      });

      // 3. Thiêng liêng chủ quyền: Hoàng Sa, Trường Sa & Biển Đông
      addSovereigntyMarkers(map);

      setMapLoaded(true);
    });

    mapInstanceRef.current = map;

    return () => {
      window.removeEventListener('resize', handleResize);
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [handleSelectVillage, onRegionChange]);

  // Đánh dấu chủ quyền biển đảo thiêng liêng
  const addSovereigntyMarkers = (map) => {
    // 1. Quần đảo Hoàng Sa (TP. Đà Nẵng, Việt Nam)
    const hoangSaEl = document.createElement('div');
    hoangSaEl.className = 'sovereignty-badge flex flex-col items-center pointer-events-auto cursor-pointer group';
    hoangSaEl.innerHTML = `
      <div class="flex items-center gap-1.5 px-2.5 py-1 bg-[#1C1B1A]/90 border border-[#B86B35] shadow-lg backdrop-blur-xs transition-transform duration-300 group-hover:scale-105">
        <span class="w-2 h-2 rounded-full bg-[#B86B35] animate-ping"></span>
        <span class="font-['Montserrat'] text-[10px] font-bold text-[#F9F8F6] tracking-[0.18em] uppercase whitespace-nowrap">
          QUẦN ĐẢO HOÀNG SA
        </span>
      </div>
      <span class="font-['Inter'] text-[8px] text-[#B86B35] tracking-widest uppercase font-semibold mt-0.5 bg-[#1C1B1A]/80 px-1.5 py-0.2">
        (VIỆT NAM)
      </span>
    `;
    const hoangSaMarker = new maplibregl.Marker({ element: hoangSaEl, anchor: 'center' })
      .setLngLat([112.00, 16.50])
      .addTo(map);
    markersRef.current.push(hoangSaMarker);

    // 2. Quần đảo Trường Sa (Tỉnh Khánh Hòa, Việt Nam)
    const truongSaEl = document.createElement('div');
    truongSaEl.className = 'sovereignty-badge flex flex-col items-center pointer-events-auto cursor-pointer group';
    truongSaEl.innerHTML = `
      <div class="flex items-center gap-1.5 px-2.5 py-1 bg-[#1C1B1A]/90 border border-[#B86B35] shadow-lg backdrop-blur-xs transition-transform duration-300 group-hover:scale-105">
        <span class="w-2 h-2 rounded-full bg-[#B86B35] animate-ping"></span>
        <span class="font-['Montserrat'] text-[10px] font-bold text-[#F9F8F6] tracking-[0.18em] uppercase whitespace-nowrap">
          QUẦN ĐẢO TRƯỜNG SA
        </span>
      </div>
      <span class="font-['Inter'] text-[8px] text-[#B86B35] tracking-widest uppercase font-semibold mt-0.5 bg-[#1C1B1A]/80 px-1.5 py-0.2">
        (VIỆT NAM)
      </span>
    `;
    const truongSaMarker = new maplibregl.Marker({ element: truongSaEl, anchor: 'center' })
      .setLngLat([114.50, 10.00])
      .addTo(map);
    markersRef.current.push(truongSaMarker);

    // 3. Biển Đông (Việt Nam)
    const bienDongEl = document.createElement('div');
    bienDongEl.className = 'pointer-events-none select-none text-center opacity-65';
    bienDongEl.innerHTML = `
      <div class="font-['Montserrat'] text-[11px] font-light text-[#E6E2DA] tracking-[0.35em] uppercase">
        BIỂN ĐÔNG (VIỆT NAM)
      </div>
      <div class="font-['Inter'] text-[8px] text-[#B86B35] tracking-[0.2em] uppercase mt-0.5">
        HẢI PHẬN QUỐC GIA
      </div>
    `;
    const bienDongMarker = new maplibregl.Marker({ element: bienDongEl, anchor: 'center' })
      .setLngLat([110.80, 13.80])
      .addTo(map);
    markersRef.current.push(bienDongMarker);
  };

  // Đồng bộ vị trí bản đồ khi activeRegionKey thay đổi
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded) return;
    const target = REGION_CENTERS[activeRegionKey] || REGION_CENTERS['all'];
    mapInstanceRef.current.flyTo({
      center: target.center,
      zoom: target.zoom,
      pitch: is3D ? 45 : target.pitch,
      duration: 1200,
      essential: true
    });

    // Cập nhật Highlight viền vùng trong MapLibre
    if (mapInstanceRef.current.getLayer('regions-highlight-line')) {
      if (activeRegionKey === 'all') {
        mapInstanceRef.current.setFilter('regions-highlight-line', ['==', '$type', 'Polygon']);
        mapInstanceRef.current.setPaintProperty('regions-highlight-line', 'line-opacity', 0.4);
      } else {
        mapInstanceRef.current.setFilter('regions-highlight-line', [
          'all',
          ['==', '$type', 'Polygon'],
          ['==', ['get', 'id'], activeRegionKey]
        ]);
        mapInstanceRef.current.setPaintProperty('regions-highlight-line', 'line-opacity', 1.0);
      }
    }
  }, [activeRegionKey, mapLoaded, is3D]);

  // Cập nhật GeoJSON Source khi lọc làng nghề hoặc dữ liệu API về
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded) return;
    const source = mapInstanceRef.current.getSource('craft-villages-source');
    if (source) {
      source.setData(villagesToGeoJSON(filteredVillages));
    }
  }, [filteredVillages, mapLoaded]);

  // Map Controls Callbacks
  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn({ duration: 300 });
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut({ duration: 300 });
  };

  const handleResetView = () => {
    if (onRegionChange) onRegionChange('all');
    mapInstanceRef.current?.flyTo({
      center: [108.5, 15.8],
      zoom: 5.4,
      pitch: 0,
      bearing: 0,
      duration: 1000
    });
    setSelectedCategory('all');
    setSelectedVillage(null);
  };

  const handleTogglePitch = () => {
    const next3D = !is3D;
    setIs3D(next3D);
    mapInstanceRef.current?.easeTo({
      pitch: next3D ? 45 : 0,
      duration: 800
    });
  };

  return (
    <div className={`relative w-full h-full overflow-hidden bg-[#1C1B1A] ${className}`}>
      {/* WebGL Map Canvas Container */}
      <div
        ref={mapContainerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Cartographic Coordinate Overlay Grid Accents */}
      <div className="absolute top-3 left-4 pointer-events-none z-10 flex items-center gap-2 font-spec-code text-[10px] text-text-secondary/70 tracking-widest uppercase">
        <span className="w-1.5 h-1.5 rounded-full bg-accent-terracotta"></span>
        <span>HỆ TỌA ĐỘ WGS-84 / LƯỢC ĐỒ QUỐC GIA</span>
      </div>

      {/* Hover Tooltip */}
      {hoveredInfo && (
        <div
          className="absolute z-30 pointer-events-none -translate-x-1/2 -translate-y-full pb-3 font-spec-code"
          style={{ left: hoveredInfo.x, top: hoveredInfo.y }}
        >
          <div className="px-2.5 py-1.5 bg-surface-crisp border border-border-neutral shadow-lg text-[11px] flex flex-col">
            <span className="font-semibold text-text-primary uppercase tracking-wider">
              {hoveredInfo.name}
            </span>
            <span className="text-[10px] text-text-secondary">{hoveredInfo.province}</span>
          </div>
        </div>
      )}

      {/* Bottom-Left Legend Panel */}
      <div className="absolute bottom-4 left-4 z-20 hidden sm:block">
        <MapLegend
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          totalVillages={filteredVillages.length}
          activeRegionLabel={
            activeRegionKey === 'all'
              ? 'Toàn Quốc'
              : REGION_CENTERS[activeRegionKey]
              ? activeRegionKey.toUpperCase()
              : 'Đang Chọn'
          }
        />
      </div>

      {/* Top-Right Control Buttons */}
      <div className="absolute top-4 right-4 z-20">
        <MapControls
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onResetView={handleResetView}
          onTogglePitch={handleTogglePitch}
          is3D={is3D}
        />
      </div>

      {/* Slide-out Village Detail Drawer */}
      <VillageDrawer
        village={selectedVillage}
        onClose={() => setSelectedVillage(null)}
      />
    </div>
  );
}
