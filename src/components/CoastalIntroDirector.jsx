import React, { useEffect, useRef, useState, useCallback } from 'react';

const INTRO_FRAMES = [
  {
    src: '/assets/images/real/twisted_insulated_copper_ready_for_wire_nut/img_4992.webp',
    wordTop: 'Everyday',
    wordAccent: 'Repairs.',
    sub: 'Outlets • Switches • Fans • Breakers',
  },
  {
    src: '/assets/images/real/panels/img_4022.webp',
    wordTop: '200-Amp',
    wordAccent: 'Upgrades.',
    sub: 'Panels • EV Chargers • Generators',
  },
  {
    src: '/assets/images/real/outdoor_lights/img_3559.webp',
    wordTop: 'Coastal &',
    wordAccent: 'Commercial.',
    sub: 'Virginia Beach & All 7 Cities • 24/7',
  },
];

const SESSION_KEY = 'scotts_coastal_intro_v1';

export default function CoastalIntroDirector() {
  const [phase, setPhase] = useState('idle'); // 'idle' | 'playing' | 'aperture' | 'done'
  const [beat, setBeat] = useState(0); // 0, 1, 2, 3 (brand resolve)
  const [seamReady, setSeamReady] = useState(false);
  const [gapPct, setGapPct] = useState(0);
  const [flash, setFlash] = useState(false);
  const rafRef = useRef(null);
  const timersRef = useRef([]);

  const finishIntro = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    document.documentElement.removeAttribute('data-intro-curtain');
    try {
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch (_) {
      // ignore storage restrictions
    }
    setPhase('done');
    window.__coastalIntroDone = true;
    window.dispatchEvent(new CustomEvent('coastal-intro-complete'));
  }, []);

  const triggerApertureOpen = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    document.documentElement.removeAttribute('data-intro-curtain');
    setSeamReady(true);
    setPhase('aperture');
    window.dispatchEvent(new CustomEvent('coastal-intro-opening'));

    const start = performance.now();
    const duration = 660;

    const easeAperture = (t) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const tick = (now) => {
      const raw = Math.min(1, (now - start) / duration);
      const eased = easeAperture(raw);
      setGapPct(eased * 56);
      if (raw < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        finishIntro();
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [finishIntro]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const params = new URLSearchParams(window.location.search);
    const forceIntro = params.get('intro') === '1';
    const skipIntroParam = params.get('intro') === '0';
    const isHome = window.location.pathname === '/' || window.location.pathname === '';
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isWebdriver = Boolean(navigator.webdriver);
    const isDesktop = window.innerWidth >= 1024;

    let alreadySeen = false;
    try {
      alreadySeen = sessionStorage.getItem(SESSION_KEY) === '1';
    } catch (_) {
      alreadySeen = false;
    }

    const shouldPlay =
      forceIntro ||
      (!skipIntroParam && isHome && isDesktop && !prefersReduced && !isWebdriver && !alreadySeen);

    if (!shouldPlay) {
      document.documentElement.removeAttribute('data-intro-curtain');
      setPhase('done');
      window.__coastalIntroDone = true;
      window.dispatchEvent(new CustomEvent('coastal-intro-opening'));
      window.dispatchEvent(new CustomEvent('coastal-intro-complete'));
      return undefined;
    }

    window.__coastalIntroDone = false;
    setPhase('playing');
    // Remove static curtain on next frame once React overlay is painted
    requestAnimationFrame(() => {
      document.documentElement.removeAttribute('data-intro-curtain');
    });

    const pulseFlash = () => {
      setFlash(true);
      const tf = setTimeout(() => setFlash(false), 85);
      timersRef.current.push(tf);
    };

    // Snappy Higgsfield Speed-Ramp Match-Cut Cadence
    timersRef.current.push(
      setTimeout(() => {
        pulseFlash();
        setBeat(1);
      }, 420)
    );

    timersRef.current.push(
      setTimeout(() => {
        pulseFlash();
        setBeat(2);
      }, 840)
    );

    timersRef.current.push(
      setTimeout(() => {
        pulseFlash();
        setBeat(3);
        setSeamReady(true);
      }, 1260)
    );

    timersRef.current.push(
      setTimeout(() => {
        triggerApertureOpen();
      }, 1680)
    );

    // Safety cap (never trap user)
    timersRef.current.push(
      setTimeout(() => {
        finishIntro();
      }, 3600)
    );

    const handleKey = (e) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        triggerApertureOpen();
      }
    };
    window.addEventListener('keydown', handleKey);

    return () => {
      window.removeEventListener('keydown', handleKey);
      timersRef.current.forEach(clearTimeout);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [finishIntro, triggerApertureOpen]);

  if (phase === 'idle' || phase === 'done') return null;

  const maskGradient =
    phase === 'aperture' && gapPct > 0.2
      ? `linear-gradient(to bottom, #000 0%, #000 calc(50% - ${gapPct}%), transparent calc(50% - ${gapPct}% + 1.5%), transparent calc(50% + ${gapPct}% - 1.5%), #000 calc(50% + ${gapPct}%), #000 100%)`
      : undefined;

  const activeFrame = INTRO_FRAMES[Math.min(beat, INTRO_FRAMES.length - 1)];

  return (
    <div
      role="presentation"
      onClick={triggerApertureOpen}
      onWheel={(e) => e.preventDefault()}
      style={
        maskGradient
          ? {
              WebkitMaskImage: maskGradient,
              maskImage: maskGradient,
            }
          : undefined
      }
      className="fixed inset-0 z-[70] bg-[#06101C] text-white flex items-center justify-center overflow-hidden cursor-pointer select-none"
    >
      {/* Background Rapid Match-Cut Real Jobsite Footage (CSS Background Layers = Zero Duplicate DOM <img>s) */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        {INTRO_FRAMES.map((frame, i) => {
          const visible = beat === i && beat < 3;
          return (
            <div
              key={frame.src}
              style={{ backgroundImage: `url(${frame.src})` }}
              className={`absolute inset-0 bg-cover bg-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                visible ? 'opacity-35 scale-100' : 'opacity-0 scale-110'
              }`}
            />
          );
        })}
        <div className="absolute inset-0 bg-gradient-to-b from-[#06101C]/80 via-[#06101C]/62 to-[#06101C]/90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(13,148,136,0.22),transparent_62%)]" />
      </div>

      {/* Subtle Shutter Beat Flash */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 bg-amber-200/20 mix-blend-screen transition-opacity duration-75 ${
          flash ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Hero Anchor: Center Horizon Voltage Line */}
      <div
        aria-hidden="true"
        style={{
          transform: seamReady ? 'scaleX(1)' : `scaleX(${0.2 + beat * 0.25})`,
          transition: 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="pointer-events-none absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-90"
      />

      {/* Parting Seam Glow Lips During Aperture Open */}
      {phase === 'aperture' && (
        <>
          <div
            aria-hidden="true"
            style={{ top: `calc(50% - ${gapPct}%)` }}
            className="pointer-events-none absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-300 to-transparent shadow-[0_0_24px_rgba(251,191,36,0.95)]"
          />
          <div
            aria-hidden="true"
            style={{ top: `calc(50% + ${gapPct}%)` }}
            className="pointer-events-none absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-teal-300 to-transparent shadow-[0_0_24px_rgba(45,212,191,0.95)]"
          />
        </>
      )}

      {/* Center Kinetic Typography Stage */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {beat < 3 ? (
          <div key={beat} className="space-y-3 animate-intro-beat">
            <div className="font-heading text-5xl lg:text-7xl xl:text-8xl font-extrabold tracking-[-0.04em] leading-[0.96]">
              <span className="text-white">{activeFrame.wordTop} </span>
              <span
                style={{
                  WebkitTextStroke: '1.6px #FBBF24',
                  color: 'transparent',
                }}
                className="font-editorial text-[1.12em] font-normal inline-block pr-2"
              >
                {activeFrame.wordAccent}
              </span>
            </div>
            <p className="text-sm lg:text-base font-medium tracking-[0.16em] uppercase text-teal-300/95">
              {activeFrame.sub}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-3 animate-intro-beat">
            <img
              src="/assets/images/scotts_electric_logo_transparent.png"
              alt="Scott's Electric Hampton Roads Master Electrician Emblem"
              width="80"
              height="80"
              className="h-20 w-auto object-contain drop-shadow-[0_12px_28px_rgba(251,191,36,0.35)]"
            />
            <div className="font-heading text-4xl lg:text-6xl font-extrabold tracking-tight text-white">
              Scott&rsquo;s{' '}
              <span className="font-editorial text-[1.14em] font-normal text-amber-300">
                Electric
              </span>
            </div>
            <div className="text-xs tracking-[0.22em] uppercase text-slate-300 font-semibold">
              Hampton Roads • (757) 536-0478
            </div>
          </div>
        )}
      </div>

      {/* Skip Pill (>= 44px touch/click target) */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          triggerApertureOpen();
        }}
        className="absolute bottom-6 right-6 z-20 min-h-[44px] px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-slate-200 backdrop-blur-md transition-colors"
      >
        Skip Intro →
      </button>
    </div>
  );
}
