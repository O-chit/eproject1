import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const routeNameMap = {
  '': 'Trang Chủ',
  'crafts': 'Danh Mục Di Sản',
  'artisans': 'Nghệ Nhân',
  'regions': 'Vùng Miền & Làng Nghề',
  'seasonal': 'Mùa Triển Lãm',
  'favourites': 'Lưu Trữ Cá Nhân',
  'contact': 'Gặp Gỡ & Kết Nối',
  'login': 'Tài Khoản',
};

export default function Breadcrumbs({ customCrumbs }) {
  const location = useLocation();

  if (location.pathname === '/') return null;

  let crumbs = [];

  if (customCrumbs && customCrumbs.length > 0) {
    crumbs = customCrumbs;
  } else {
    const pathnames = location.pathname.split('/').filter(Boolean);
    crumbs.push({ label: 'Trang Chủ', path: '/' });

    let currentPath = '';
    pathnames.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathnames.length - 1;
      const label = routeNameMap[segment] || segment.replace(/-/g, ' ');
      crumbs.push({
        label: isLast ? label : label,
        path: currentPath,
        isLast,
      });
    });
  }

  return (
    <nav aria-label="Breadcrumb" className="w-full py-3.5 border-b border-[#E6E2DA]/60 bg-[#FFFFFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ol className="flex items-center flex-wrap gap-2 text-[11px] font-['Montserrat'] tracking-[0.1em] uppercase text-[#5A5854]">
          {crumbs.map((crumb, idx) => {
            const isLast = idx === crumbs.length - 1;
            return (
              <li key={crumb.path || idx} className="flex items-center gap-2">
                {idx > 0 && (
                  <span className="text-[#867368] opacity-50 select-none text-[12px]">/</span>
                )}
                {isLast ? (
                  <span className="text-[#B86B35] font-semibold truncate max-w-[200px] sm:max-w-xs" aria-current="page">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    to={crumb.path}
                    className="hover:text-[#B86B35] transition-colors"
                  >
                    {crumb.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
