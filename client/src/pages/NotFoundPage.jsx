import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="craft-container py-24 text-center">
      <span className="spec-code text-[#B86B35]">ERROR CODE 404</span>
      <h1 className="font-['Playfair_Display'] text-4xl font-semibold mt-3 mb-4 text-[#1C1B1A]">
        Heritage Page Not Found
      </h1>
      <p className="body-default text-[#5A5854] max-w-md mx-auto mb-8">
        The page you are looking for might have been moved or is not yet registered in our archival records.
      </p>
      <Link
        to="/"
        className="craft-btn craft-btn-primary"
      >
        Return to Home
      </Link>
    </div>
  );
}
