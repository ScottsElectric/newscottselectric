import React, { useState, useEffect, useMemo } from 'react';
import { PhoneCall, Expand, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { HOME_VAULT_REMAINING } from '../config/verifiedMedia.js';

export default function MotionVaultGallery() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [showAllRemaining, setShowAllRemaining] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(null);

  const categories = useMemo(() => {
    const counts = new Map();
    HOME_VAULT_REMAINING.forEach((p) => {
      counts.set(p.tradeCategory, (counts.get(p.tradeCategory) || 0) + 1);
    });
    return [
      { id: 'all', label: 'All Photos' },
      ...Array.from(counts.entries()).map(([cat]) => ({
        id: cat,
        label: cat,
      })),
    ];
  }, []);

  const filteredPhotos = useMemo(() => {
    const pool =
      activeCategory === 'all'
        ? HOME_VAULT_REMAINING
        : HOME_VAULT_REMAINING.filter((p) => p.tradeCategory === activeCategory);
    if (activeCategory === 'all' && !showAllRemaining) {
      return pool.slice(0, 9);
    }
    return pool;
  }, [activeCategory, showAllRemaining]);

  useEffect(() => {
    if (lightboxIdx === null) return undefined;
    const handleKey = (e) => {
      if (e.key === 'Escape') setLightboxIdx(null);
      if (e.key === 'ArrowRight') {
        setLightboxIdx((i) => (i + 1) % filteredPhotos.length);
      }
      if (e.key === 'ArrowLeft') {
        setLightboxIdx((i) => (i - 1 + filteredPhotos.length) % filteredPhotos.length);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxIdx, filteredPhotos.length]);

  const activePhoto = lightboxIdx !== null ? filteredPhotos[lightboxIdx] : null;

  return (
    <section id="verified-photo-vault" className="py-20 lg:py-28 coastal-dune-surface border-t border-coastal-navy/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Clean Human Header + Kinetic Stroke Heading */}
        <div data-reveal-block className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">
              Project Gallery
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-coastal-navy mt-3 leading-[1.08] tracking-tight">
              Panels, Lighting &amp;{' '}
              <span className="relative inline-block">
                <span data-stroke-word className="kinetic-stroke-teal text-[1.14em]">
                  Clean Rough-In Work.
                </span>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 260 14"
                  fill="none"
                  preserveAspectRatio="none"
                  className="pointer-events-none absolute -bottom-1 left-0 w-full h-3 overflow-visible"
                >
                  <path
                    data-pen-path
                    d="M4 10.5C78 3.5 178 3 256 9.5"
                    stroke="#D97706"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    pathLength="1"
                    strokeDasharray="1"
                    strokeDashoffset="1"
                  />
                </svg>
              </span>
            </h2>
            <p className="text-sm sm:text-base text-coastal-slate mt-3 leading-relaxed">
              A closer look at our copper splices, underground conduit runs, foyer chandeliers, and weatherproof coastal installations.
            </p>
          </div>

          <a
            href="tel:7575360478"
            className="shrink-0 inline-flex items-center justify-center gap-2.5 bg-coastal-navy hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-md transition-colors w-fit"
          >
            <PhoneCall className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Call (757) 536-0478</span>
          </a>
        </div>

        {/* Clean Category Filter Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map((tab) => {
            const selected = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveCategory(tab.id);
                  setLightboxIdx(null);
                }}
                className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                  selected
                    ? 'bg-coastal-navy text-white border-coastal-navy shadow-sm'
                    : 'bg-white/85 text-coastal-navy border-coastal-navy/15 hover:border-teal-600'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Clean Mosaic Cards (Zero Overlaid Technical Spec Noise) */}
        <div data-deal-grid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredPhotos.map((photo, idx) => (
            <article
              key={photo.cleanBase}
              data-deal-item
              className="group sand-card rounded-3xl overflow-hidden flex flex-col justify-between"
            >
              <div>
                <button
                  type="button"
                  onClick={() => setLightboxIdx(idx)}
                  aria-label={`View full photo: ${photo.title}`}
                  className="relative block w-full aspect-[4/3.3] overflow-hidden bg-coastal-navy text-left focus:outline-none"
                >
                  <img
                    src={photo.src}
                    alt={photo.seoAlt}
                    loading="lazy"
                    decoding="async"
                    style={{
                      objectPosition: `${photo.focalPoint.x}% ${photo.focalPoint.y}%`,
                    }}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <span className="absolute top-3.5 right-3.5 p-2 rounded-full bg-black/35 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                    <Expand className="w-3.5 h-3.5" />
                  </span>
                </button>

                <div className="p-5 sm:p-6">
                  <h3 className="font-heading text-lg font-extrabold text-coastal-navy group-hover:text-teal-700 transition-colors leading-snug">
                    {photo.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-coastal-slate mt-2 leading-relaxed">
                    {photo.caption}
                  </p>
                </div>
              </div>

              <div className="px-5 sm:px-6 pb-5 pt-0">
                <div className="pt-3 border-t border-coastal-navy/10 flex items-center justify-between text-xs">
                  <span className="text-coastal-slate font-medium">
                    {photo.tradeCategory}
                  </span>
                  <a
                    href="tel:7575360478"
                    className="inline-flex items-center gap-1.5 font-extrabold text-teal-700 hover:text-coastal-navy"
                  >
                    <span>(757) 536-0478</span>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Expand Remaining Archive Button */}
        {activeCategory === 'all' && HOME_VAULT_REMAINING.length > 9 && (
          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={() => setShowAllRemaining((prev) => !prev)}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-coastal-sand border border-coastal-navy/20 text-coastal-navy font-bold text-xs sm:text-sm shadow-sm transition-colors"
            >
              <span>
                {showAllRemaining
                  ? 'Show Fewer Photos'
                  : `View All ${HOME_VAULT_REMAINING.length} Project Photos`}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 bg-coastal-deep/95 backdrop-blur-lg flex items-center justify-center p-4"
          onClick={() => setLightboxIdx(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-coastal-navy rounded-3xl overflow-hidden border border-white/15 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-black flex items-center justify-center max-h-[72vh]">
              <img
                src={activePhoto.src}
                alt={activePhoto.seoAlt}
                className="max-h-[72vh] w-auto object-contain"
              />
              <button
                type="button"
                onClick={() => setLightboxIdx(null)}
                aria-label="Close photo"
                className="absolute top-4 right-4 p-2.5 rounded-full bg-coastal-navy/90 text-white hover:bg-amber-400 hover:text-coastal-navy transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() =>
                  setLightboxIdx((i) => (i - 1 + filteredPhotos.length) % filteredPhotos.length)
                }
                aria-label="Previous photo"
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-coastal-navy/90 text-white hover:bg-amber-400 hover:text-coastal-navy transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setLightboxIdx((i) => (i + 1) % filteredPhotos.length)}
                aria-label="Next photo"
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-coastal-navy/90 text-white hover:bg-amber-400 hover:text-coastal-navy transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-heading text-xl font-bold text-white">
                  {activePhoto.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                  {activePhoto.caption}
                </p>
              </div>
              <a
                href="tel:7575360478"
                className="shrink-0 inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-coastal-navy font-extrabold text-xs px-5 py-3.5 rounded-xl"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call (757) 536-0478</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
