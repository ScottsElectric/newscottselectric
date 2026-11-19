import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTriggerPkg from 'gsap/ScrollTrigger';
import {
  PhoneCall,
  ShieldCheck,
  Zap,
  Compass,
  CheckCircle2,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { HOME_HERO_SLIDES } from '../config/verifiedMedia.js';

const ScrollTrigger = ScrollTriggerPkg?.ScrollTrigger || ScrollTriggerPkg;

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const SLIDE_DURATION_MS = 5600;

export default function HiggsfieldHeroStage() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [strokeKey, setStrokeKey] = useState(0);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 35 });
  const sectionRef = useRef(null);
  const portalRef = useRef(null);
  const copyRef = useRef(null);
  const ghostRef = useRef(null);

  // Sync stroke-to-ink reveal right as the Desktop Intro Aperture splits open!
  useEffect(() => {
    const replayStroke = () => setStrokeKey((k) => k + 1);
    window.addEventListener('coastal-intro-opening', replayStroke);
    return () => window.removeEventListener('coastal-intro-opening', replayStroke);
  }, []);

  // Autoplay gallery with hover pause
  useEffect(() => {
    if (isPaused) return undefined;
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % HOME_HERO_SLIDES.length);
    }, SLIDE_DURATION_MS);
    return () => clearInterval(timer);
  }, [isPaused, activeIdx]);

  // Subtle scroll parallax (never hides hero copy at opacity 0)
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !sectionRef.current) return undefined;

    const ctx = gsap.context(() => {
      if (portalRef.current) {
        gsap.to(portalRef.current, {
          y: -22,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.65,
          },
        });
      }

      if (ghostRef.current) {
        gsap.to(ghostRef.current, {
          xPercent: -6,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.8,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handlePointerMove = (e) => {
    if (!portalRef.current) return;
    const rect = portalRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setTilt({
      rx: Number((-(py - 0.5) * 4).toFixed(2)),
      ry: Number(((px - 0.5) * 5).toFixed(2)),
      gx: Math.round(px * 100),
      gy: Math.round(py * 100),
    });
  };

  const resetPointer = () => {
    setTilt({ rx: 0, ry: 0, gx: 50, gy: 35 });
    setIsPaused(false);
  };

  const stepSlide = (dir) => {
    setActiveIdx((prev) => (prev + dir + HOME_HERO_SLIDES.length) % HOME_HERO_SLIDES.length);
  };

  const currentSlide = HOME_HERO_SLIDES[activeIdx] || HOME_HERO_SLIDES[0];

  return (
    <section
      ref={sectionRef}
      className="relative coastal-sand-surface pt-7 pb-20 sm:pt-11 lg:pt-14 lg:pb-28 overflow-hidden border-b border-coastal-navy/10"
    >
      {/* Subtle Outlined Architectural Ghost Watermark ("757") */}
      <div
        ref={ghostRef}
        aria-hidden="true"
        style={{ WebkitTextStroke: '1.25px rgba(15, 118, 110, 0.085)', color: 'transparent' }}
        className="pointer-events-none select-none hidden lg:block absolute -bottom-10 left-8 font-heading font-extrabold text-[15rem] xl:text-[18rem] leading-none tracking-tighter"
      >
        757
      </div>

      {/* Subtle Coastal Bathymetric Contour Lines */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 820"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        className="pointer-events-none absolute inset-0 w-full h-full opacity-[0.06]"
      >
        <path
          d="M-120 190C180 95 430 285 760 175C1090 65 1290 215 1560 130"
          stroke="#0F766E"
          strokeWidth="1.4"
        />
        <path
          d="M-120 350C210 255 470 445 810 335C1150 225 1310 375 1560 290"
          stroke="#0A1929"
          strokeWidth="1.1"
        />
        <path
          d="M-120 530C260 435 560 605 900 495C1240 385 1380 525 1560 450"
          stroke="#B45309"
          strokeWidth="1.1"
        />
      </svg>

      {/* Sunlit Warmth & Atlantic Breeze Radial Glows */}
      <div className="pointer-events-none absolute -top-32 right-0 w-[600px] h-[600px] rounded-full bg-teal-500/[0.08] blur-[130px]" />
      <div className="pointer-events-none absolute top-28 -left-24 w-[460px] h-[460px] rounded-full bg-amber-500/[0.10] blur-[120px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* ================================================================
              LEFT COLUMN: Kinetic Stroke Typography & Effortless Human Copy
              ================================================================ */}
          <div ref={copyRef} className="lg:col-span-7 space-y-6 sm:space-y-7 text-left">
            {/* 1. Clean Understated Location & Availability Pill */}
            <div
              data-hero-stagger
              className="inline-flex items-center gap-2.5 bg-white/90 backdrop-blur-md border border-coastal-navy/12 px-4 py-1.5 rounded-full shadow-sm"
            >
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
              </span>
              <span className="text-xs sm:text-[13px] font-semibold text-coastal-navy">
                Virginia Beach &amp; All 7 Cities • Open 24/7
              </span>
            </div>

            {/* 2. Next-Level Kinetic Stroke-to-Ink Headline + Self-Drawing SVG Pen Flourish */}
            <div key={strokeKey} data-hero-stagger>
              <h1 className="font-heading text-[2.3rem] sm:text-[3.1rem] xl:text-[3.65rem] font-extrabold text-coastal-navy leading-[1.06] tracking-[-0.032em]">
                24/7 Emergency Electrician,{' '}
                <span className="relative inline-block whitespace-nowrap sm:whitespace-normal">
                  <span className="kinetic-stroke-teal kinetic-stroke-hero text-[1.15em]">
                    200A Panel Upgrades
                  </span>
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 320 16"
                    fill="none"
                    preserveAspectRatio="none"
                    className="pointer-events-none absolute -bottom-1.5 left-0 w-full h-3 sm:h-3.5 overflow-visible"
                  >
                    <path
                      d="M3 11.5C78 3.5 198 2.5 317 9.5"
                      stroke="#D97706"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                      pathLength="1"
                      className="pen-underline-hero"
                    />
                    <path
                      d="M28 14.5C118 9.5 224 8.5 296 12.5"
                      stroke="#0D9488"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeOpacity="0.65"
                      pathLength="1"
                      className="pen-underline-hero"
                    />
                  </svg>
                </span>{' '}
                &amp; EV Chargers Across{' '}
                <span className="kinetic-stroke-teal kinetic-stroke-hero text-[1.14em]">
                  Hampton Roads.
                </span>
              </h1>
            </div>

            {/* 3. Clear, Confident Human Lead Paragraph (Everyday Residential -> Major Upgrades) */}
            <p
              data-hero-stagger
              className="text-base sm:text-lg text-coastal-slate leading-[1.68] max-w-[56ch] speakable"
            >
              From everyday outlet repairs, ceiling fans, and tripping breakers to same-day 200A panel upgrades, EV chargers, pool wiring, and standby generators—licensed Master Electricians serving{' '}
              <strong className="text-coastal-navy font-bold">
                Virginia Beach, Norfolk, Chesapeake, Newport News, Hampton, Portsmouth &amp; Suffolk
              </strong>
              .
            </p>

            {/* 4. Clean, Matched-Height Dual Action Buttons (Zero Clutter) */}
            <div
              data-hero-stagger
              className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5"
            >
              <a
                href="tel:7575360478"
                className="cta-phone-beam group inline-flex items-center justify-center gap-3 bg-coastal-navy hover:bg-[#0E2238] text-white font-extrabold text-base sm:text-[17px] px-7 py-4 min-h-[58px] rounded-2xl shadow-[0_20px_44px_-12px_rgba(10,25,41,0.42)] transition-transform duration-200 hover:-translate-y-0.5"
              >
                <span className="w-8 h-8 rounded-xl bg-amber-400 text-coastal-navy flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <PhoneCall className="w-4 h-4 stroke-[2.6]" />
                </span>
                <span className="whitespace-nowrap">Call (757) 536-0478</span>
              </a>

              <a
                href="#instant-calculator"
                className="inline-flex items-center justify-center gap-2 border border-coastal-navy/18 hover:border-teal-700 bg-white/95 hover:bg-white text-coastal-navy font-bold text-sm sm:text-base px-6 py-4 min-h-[58px] rounded-2xl shadow-[0_12px_28px_-12px_rgba(10,25,41,0.14)] transition-all duration-200 hover:-translate-y-0.5 whitespace-nowrap"
              >
                <span>Estimate Your Project</span>
                <span aria-hidden="true" className="text-teal-700">↓</span>
              </a>
            </div>

            {/* 5. Clean Architectural Trust Ledger */}
            <div
              data-hero-stagger
              className="rounded-2xl bg-white/90 backdrop-blur-md border border-coastal-navy/10 shadow-[0_16px_38px_-18px_rgba(10,25,41,0.15)] grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-coastal-navy/10 overflow-hidden"
            >
              <div className="p-3.5 sm:p-4 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                <div>
                  <div className="font-heading text-xs sm:text-[13px] font-extrabold text-coastal-navy">
                    VA Class A
                  </div>
                  <div className="text-[11px] text-coastal-slate">Master Licensed</div>
                </div>
              </div>

              <div className="p-3.5 sm:p-4 flex items-start gap-2.5 border-l border-coastal-navy/10 sm:border-l-0">
                <Zap className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-heading text-xs sm:text-[13px] font-extrabold text-coastal-navy">
                    30–45 Min Avg
                  </div>
                  <div className="text-[11px] text-coastal-slate">24/7 Emergencies</div>
                </div>
              </div>

              <div className="p-3.5 sm:p-4 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                <div>
                  <div className="font-heading text-xs sm:text-[13px] font-extrabold text-coastal-navy">
                    Same-Day Power
                  </div>
                  <div className="text-[11px] text-coastal-slate">Permits &amp; Dominion</div>
                </div>
              </div>

              <div className="p-3.5 sm:p-4 flex items-start gap-2.5 border-l border-coastal-navy/10 sm:border-l-0">
                <Compass className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-heading text-xs sm:text-[13px] font-extrabold text-coastal-navy">
                    All 7 Cities
                  </div>
                  <div className="text-[11px] text-coastal-slate">Shore Dr HQ</div>
                </div>
              </div>
            </div>
          </div>

          {/* ================================================================
              RIGHT COLUMN: Pure Uncluttered Editorial Photo Frame
              ================================================================ */}
          <div className="lg:col-span-5">
            <div
              ref={portalRef}
              onPointerEnter={() => setIsPaused(true)}
              onPointerMove={handlePointerMove}
              onPointerLeave={resetPointer}
              style={{ perspective: '1400px' }}
              className="relative mx-auto max-w-md lg:max-w-none will-change-transform"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-3 rounded-[2.6rem] bg-gradient-to-br from-teal-500/12 via-transparent to-amber-500/18 blur-xl"
              />

              <div
                style={{
                  transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
                  transition: 'transform 260ms cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                className="relative hero-bezel-shell rounded-[2.2rem] p-2.5 sm:p-3 overflow-hidden"
              >
                {/* Clean Cross-Dissolving Jobsite Photography (Zero Badge Clutter at Top) */}
                <div className="relative aspect-[4/4.5] rounded-[1.7rem] overflow-hidden bg-coastal-navy">
                  {HOME_HERO_SLIDES.map((slide, idx) => {
                    const isActive = idx === activeIdx;
                    return (
                      <img
                        key={slide.cleanBase}
                        src={slide.src}
                        alt={slide.seoAlt}
                        width={slide.width}
                        height={slide.height}
                        loading={idx === 0 ? 'eager' : 'lazy'}
                        decoding="async"
                        style={{
                          objectPosition: `${slide.focalPoint.x}% ${slide.focalPoint.y}%`,
                        }}
                        className={`absolute inset-0 w-full h-full object-cover brightness-[1.05] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                          isActive
                            ? 'opacity-100 scale-[1.02] z-10'
                            : 'opacity-0 scale-[1.07] z-0 pointer-events-none'
                        }`}
                      />
                    );
                  })}

                  {/* Soft Pointer Specular Sheen & Subtle Bottom Gradient */}
                  <div
                    aria-hidden="true"
                    style={{
                      background: `radial-gradient(circle at ${tilt.gx}% ${tilt.gy}%, rgba(255,255,255,0.14), transparent 55%)`,
                    }}
                    className="pointer-events-none absolute inset-0 z-20"
                  />
                  <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-[#06111D]/92 via-[#06111D]/15 to-transparent" />

                  {/* Minimal Prev / Next Controls in Top-Right Corner */}
                  <div className="absolute top-3.5 right-3.5 z-30 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => stepSlide(-1)}
                      aria-label="Previous project photo"
                      className="w-8 h-8 rounded-full bg-black/35 hover:bg-black/60 border border-white/20 text-white backdrop-blur-md flex items-center justify-center transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => stepSlide(1)}
                      aria-label="Next project photo"
                      className="w-8 h-8 rounded-full bg-black/35 hover:bg-black/60 border border-white/20 text-white backdrop-blur-md flex items-center justify-center transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Clean Editorial Caption Card */}
                  <div className="absolute bottom-3.5 inset-x-3.5 z-30 p-4 rounded-2xl bg-[#081523]/88 border border-white/15 backdrop-blur-xl text-left">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="font-heading text-base sm:text-[17px] font-bold text-white leading-snug truncate">
                          {currentSlide.title}
                        </h2>
                        <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">
                          {currentSlide.caption}
                        </p>
                      </div>
                      <a
                        href={currentSlide.serviceLink}
                        aria-label={`Explore ${currentSlide.title}`}
                        className="shrink-0 w-9 h-9 rounded-xl bg-amber-400 hover:bg-amber-300 text-coastal-navy flex items-center justify-center transition-colors"
                      >
                        <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Minimal 5-Line Progress Indicator (Zero Text Clutter) */}
                <div className="grid grid-cols-5 gap-2 px-3 pt-3 pb-1">
                  {HOME_HERO_SLIDES.map((slide, idx) => {
                    const active = idx === activeIdx;
                    return (
                      <button
                        key={slide.cleanBase}
                        type="button"
                        onClick={() => setActiveIdx(idx)}
                        aria-label={`Show project: ${slide.title}`}
                        className="py-1 focus:outline-none"
                      >
                        <div className="h-1 w-full rounded-full bg-coastal-navy/12 overflow-hidden">
                          {active ? (
                            <div
                              key={`${activeIdx}-${isPaused ? 'paused' : 'play'}`}
                              className={`h-full w-full rounded-full bg-teal-700 animate-hero-progress ${
                                isPaused ? 'animate-hero-progress-paused' : ''
                              }`}
                            />
                          ) : (
                            <div
                              className={`h-full rounded-full ${
                                idx < activeIdx ? 'w-full bg-teal-700/45' : 'w-0'
                              }`}
                            />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gentle Coastal Horizon Wave Transition Divider */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
        <svg
          viewBox="0 0 1440 56"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[103%] h-7 sm:h-10 animate-tide"
          preserveAspectRatio="none"
        >
          <path
            d="M0 28C240 54 480 2 720 24C960 46 1200 6 1440 26V56H0V28Z"
            fill="#EFEAE0"
          />
        </svg>
      </div>
    </section>
  );
}
