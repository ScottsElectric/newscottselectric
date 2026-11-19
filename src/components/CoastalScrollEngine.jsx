import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTriggerPkg from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

const ScrollTrigger = ScrollTriggerPkg?.ScrollTrigger || ScrollTriggerPkg;

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function CoastalScrollEngine() {
  const progressBarRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return undefined;

    // 1. Sync Lenis inertial smooth wheel scroll directly onto GSAP's ticker
    const lenis = new Lenis({
      lerp: 0.095,
      wheelMultiplier: 1.0,
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const tickerFn = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);

    // 2. Global Coastal Scroll Choreography
    const ctx = gsap.context(() => {
      // Top coastal tide progress bar
      if (progressBarRef.current) {
        gsap.fromTo(
          progressBarRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: document.documentElement,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.15,
            },
          }
        );
      }

      // Self-drawing coastal horizon dividers
      gsap.utils.toArray('[data-draw-rule]').forEach((rule) => {
        gsap.fromTo(
          rule,
          { scaleX: 0, transformOrigin: 'left center' },
          {
            scaleX: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: rule,
              start: 'top 90%',
              end: 'top 62%',
              scrub: 0.5,
            },
          }
        );
      });

      // Scroll-scrubbed Kinetic Stroke -> Solid Ink Section Headings
      gsap.utils.toArray('[data-stroke-word]').forEach((word) => {
        gsap.fromTo(
          word,
          { '--ink-wipe': '0%' },
          {
            '--ink-wipe': '100%',
            ease: 'power2.out',
            scrollTrigger: {
              trigger: word,
              start: 'top 88%',
              end: 'top 52%',
              scrub: 0.45,
            },
          }
        );
      });

      // Scroll-drawn Handcrafted SVG Pen Underlines on Section Headings
      gsap.utils.toArray('[data-pen-path]').forEach((path) => {
        gsap.fromTo(
          path,
          { strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: path,
              start: 'top 88%',
              end: 'top 56%',
              scrub: 0.45,
            },
          }
        );
      });

      // Continuous scroll-assembled section headers & editorial blocks
      gsap.utils.toArray('[data-reveal-block]').forEach((block) => {
        gsap.fromTo(
          block,
          { y: 32, opacity: 0.18 },
          {
            y: 0,
            opacity: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: block,
              start: 'top 92%',
              end: 'top 64%',
              scrub: 0.45,
            },
          }
        );
      });

      // Staggered card grids that deal into place continuously as user scrolls
      gsap.utils.toArray('[data-deal-grid]').forEach((grid) => {
        const cards = grid.querySelectorAll('[data-deal-item]');
        if (!cards.length) return;
        gsap.fromTo(
          cards,
          { y: 44, opacity: 0.15, scale: 0.97 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: grid,
              start: 'top 90%',
              end: 'top 48%',
              scrub: 0.5,
            },
          }
        );
      });

      // Subtle inner-window vertical coastal parallax on framed photos
      gsap.utils.toArray('[data-parallax-img]').forEach((img) => {
        gsap.fromTo(
          img,
          { yPercent: -6, scale: 1.12 },
          {
            yPercent: 6,
            scale: 1.12,
            ease: 'none',
            scrollTrigger: {
              trigger: img.parentElement || img,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.6,
            },
          }
        );
      });
    });

    const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 350);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
      gsap.ticker.remove(tickerFn);
      lenis.destroy();
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[3px] z-50 pointer-events-none bg-transparent"
    >
      <div
        ref={progressBarRef}
        className="h-full w-full origin-left scale-x-0 bg-gradient-to-r from-teal-400 via-amber-400 to-orange-400"
      />
    </div>
  );
}
