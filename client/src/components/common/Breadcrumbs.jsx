import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const routeNameMap = {
  '': 'Trang Chủ',
  'crafts': 'Kho Lưu Trữ Di Sản',
  'artisans': 'Hồ Sơ Nghệ Nhân',
  'regions': 'Bản Đồ Văn Hóa Làng Nghề',
  'seasonal': 'Bộ Sưu Tập Theo Mùa',
  'favourites': 'Tác Phẩm Đã Lưu',
  'contact': 'Liên Hệ & Đặt Lịch Xưởng',
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
        label,
        path: currentPath,
        isLast,
      });
    });
  }

  return (
    <section aria-label="Breadcrumb" className="w-full bg-canvas-linen py-space-sm border-b border-border-neutral">
      <div className="max-w-7xl mx-auto px-margin">
        <ol className="flex items-center flex-wrap gap-2 font-spec-code text-spec-code tracking-[0.16em] uppercase text-text-secondary">
          {crumbs.map((crumb, idx) => {
            const isLast = idx === crumbs.length - 1;
            return (
              <li key={crumb.path || idx} className="flex items-center gap-2">
                {idx > 0 && (
                  <span className="text-border-neutral opacity-60 select-none">/</span>
                )}
                {isLast ? (
                  <span className="text-accent-terracotta font-medium truncate max-w-[240px] sm:max-w-md" aria-current="page">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    to={crumb.path}
                    className="hover:text-accent-terracotta transition-colors"
                  >
                    {crumb.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
