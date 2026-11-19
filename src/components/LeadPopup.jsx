import React, { useState, useEffect } from 'react';
import { PhoneCall, X, CheckCircle2, Zap } from 'lucide-react';

const CITIES = [
  'Virginia Beach',
  'Norfolk',
  'Chesapeake',
  'Newport News',
  'Hampton',
  'Portsmouth',
  'Suffolk',
];

const QUICK_SCOPES = [
  { id: 'Outlets, Switches or Breaker Repair', label: 'Outlets, Switches or Breakers' },
  { id: 'Ceiling Fan or Light Fixture', label: 'Ceiling Fan or Lighting' },
  { id: '24/7 Emergency / Power Outage', label: '24/7 Emergency Repair' },
  { id: '200A / 400A Panel Upgrade', label: '200A Panel Upgrade' },
  { id: 'EV Charger, Pool or Generator', label: 'EV, Pool or Generator' },
  { id: 'Commercial or Home Inspection', label: 'Commercial / Inspection' },
];

const FUNNEL_SESSION_KEY = 'scotts_quick_funnel_v1';

export default function LeadPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: 'Virginia Beach',
    service: QUICK_SCOPES[0].id,
  });

  useEffect(() => {
    const openHandler = () => setIsOpen(true);
    window.addEventListener('open-callback-modal', openHandler);

    const params = new URLSearchParams(window.location.search);
    const forceFunnel = params.get('funnel') === '1';
    const disableFunnel = params.get('funnel') === '0';
    const isWebdriver = Boolean(navigator.webdriver);

    if (forceFunnel) {
      const tf = setTimeout(() => setIsOpen(true), 250);
      return () => {
        clearTimeout(tf);
        window.removeEventListener('open-callback-modal', openHandler);
      };
    }

    let alreadyShown = false;
    try {
      alreadyShown = sessionStorage.getItem(FUNNEL_SESSION_KEY) === '1';
    } catch (_) {
      alreadyShown = false;
    }

    let autoTimer = null;

    const scheduleAutoOpen = (delayMs) => {
      if (disableFunnel || isWebdriver || alreadyShown) return;
      clearTimeout(autoTimer);
      autoTimer = setTimeout(() => {
        try {
          sessionStorage.setItem(FUNNEL_SESSION_KEY, '1');
        } catch (_) {
          // ignore storage restrictions
        }
        setIsOpen(true);
      }, delayMs);
    };

    const onIntroComplete = () => scheduleAutoOpen(650);
    window.addEventListener('coastal-intro-complete', onIntroComplete);

    // If intro already finished (e.g. mobile or subpage), schedule immediately without race
    if (window.__coastalIntroDone) {
      scheduleAutoOpen(750);
    }

    // Fallback only if neither intro event nor flag has scheduled it yet
    const fallbackTimer = setTimeout(() => {
      if (!autoTimer) scheduleAutoOpen(2800);
    }, 250);

    const onEsc = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onEsc);

    return () => {
      clearTimeout(autoTimer);
      clearTimeout(fallbackTimer);
      window.removeEventListener('open-callback-modal', openHandler);
      window.removeEventListener('coastal-intro-complete', onIntroComplete);
      window.removeEventListener('keydown', onEsc);
    };
  }, []);

  const encode = (data) =>
    Object.keys(data)
      .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
      .join('&');

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encode({
        'form-name': 'popup',
        ...formData,
      }),
    })
      .then(() => setSubmitted(true))
      .catch(() => setSubmitted(true));
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Quick Electrician Dispatch & Callback"
      onClick={() => setIsOpen(false)}
      className="fixed inset-0 z-[60] flex items-center justify-center p-3.5 sm:p-5 bg-[#06101C]/75 backdrop-blur-md animate-modal-backdrop"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-[2rem] overflow-hidden bg-[#FCFBF8] text-coastal-navy border border-coastal-navy/15 shadow-[0_36px_90px_-18px_rgba(4,12,24,0.72)] text-left max-h-[92vh] overflow-y-auto animate-modal-card"
      >
        {/* Top Chesapeake Navy Header Strip */}
        <div className="bg-coastal-navy text-white px-6 pt-6 pb-5 relative">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close window"
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-300 mb-1.5">
            <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>Fast Service Across All 7 Cities • Open 24/7</span>
          </div>

          <h2 className="font-heading text-2xl sm:text-[1.75rem] font-extrabold leading-tight tracking-tight pr-8">
            Need an Electrician{' '}
            <span className="font-editorial text-[1.14em] font-normal text-teal-300">
              Right Away?
            </span>
          </h2>
          <p className="text-xs sm:text-[13px] text-slate-300 mt-1.5 leading-relaxed">
            From a single dead outlet, ceiling fan, or tripping breaker to a 200A panel upgrade or emergency outage—skip the browsing and connect directly.
          </p>
        </div>

        <div className="p-5 sm:p-6">
          {submitted ? (
            <div className="py-6 text-center space-y-4">
              <CheckCircle2 className="w-11 h-11 text-teal-600 mx-auto" />
              <h3 className="font-heading text-2xl font-extrabold text-coastal-navy">
                We&rsquo;re On It
              </h3>
              <p className="text-sm text-coastal-slate leading-relaxed max-w-sm mx-auto">
                Thanks, <strong className="text-coastal-navy">{formData.name}</strong>. Our electrician serving{' '}
                <strong>{formData.city}</strong> will call <strong className="text-teal-700">{formData.phone}</strong> shortly regarding{' '}
                <strong>{formData.service}</strong>.
              </p>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="bg-coastal-navy text-white font-bold text-xs px-6 py-3.5 rounded-xl"
              >
                Continue Exploring Site
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* 1. Instant 1-Tap Phone Call */}
              <a
                href="tel:7575360478"
                className="cta-phone-beam w-full flex items-center justify-center gap-3 bg-coastal-navy hover:bg-[#0E2238] text-white font-extrabold text-base py-4 rounded-2xl shadow-lg transition-transform hover:-translate-y-0.5"
              >
                <span className="w-8 h-8 rounded-xl bg-amber-400 text-coastal-navy flex items-center justify-center shrink-0">
                  <PhoneCall className="w-4 h-4 stroke-[2.5]" />
                </span>
                <span>Call Now: (757) 536-0478</span>
              </a>

              <div className="relative flex py-0.5 items-center">
                <div className="flex-grow border-t border-coastal-navy/12" />
                <span className="shrink mx-3 text-[11px] font-semibold text-coastal-slate">
                  Or get a quick callback
                </span>
                <div className="flex-grow border-t border-coastal-navy/12" />
              </div>

              {/* 2. Quick Residential -> Major Upgrade Picker */}
              <form
                name="popup"
                method="POST"
                data-netlify="true"
                data-netlify-honeypot="bot-field"
                onSubmit={handleSubmit}
                className="space-y-3.5"
              >
                <input type="hidden" name="form-name" value="popup" />
                <input type="hidden" name="service" value={formData.service} />
                <input type="hidden" name="email" value={formData.email} />
                <p className="hidden">
                  <label>
                    Don’t fill this out: <input name="bot-field" />
                  </label>
                </p>

                <div>
                  <div className="text-[11px] font-bold text-coastal-navy mb-1.5">
                    What can we help you with?
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {QUICK_SCOPES.map((item) => {
                      const active = formData.service === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, service: item.id })}
                          className={`text-left px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                            active
                              ? 'bg-teal-700 text-white border-teal-700 shadow-sm'
                              : 'bg-white hover:bg-coastal-sand/70 text-coastal-navy border-coastal-navy/15'
                          }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    name="name"
                    required
                    aria-label="Your Name"
                    placeholder="Your Name *"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white border border-coastal-navy/20 text-coastal-navy placeholder:text-slate-400 rounded-xl px-3.5 py-3 text-xs font-medium focus:border-teal-700 focus:outline-none"
                  />
                  <input
                    type="tel"
                    name="phone"
                    required
                    aria-label="Phone Number"
                    placeholder="Phone Number *"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-white border border-coastal-navy/20 text-coastal-navy placeholder:text-slate-400 rounded-xl px-3.5 py-3 text-xs font-medium focus:border-teal-700 focus:outline-none"
                  />
                </div>

                <select
                  name="city"
                  aria-label="Your City"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-white border border-coastal-navy/20 text-coastal-navy rounded-xl px-3.5 py-3 text-xs font-semibold focus:border-teal-700 focus:outline-none"
                >
                  {CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}, VA
                    </option>
                  ))}
                </select>

                <button
                  type="submit"
                  className="w-full bg-amber-400 hover:bg-amber-300 text-coastal-navy font-extrabold text-sm py-3.5 rounded-xl shadow-sm transition-colors"
                >
                  Request Fast Callback →
                </button>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center text-xs font-semibold text-coastal-slate hover:text-coastal-navy pt-0.5"
                >
                  No thanks — just browsing the site
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
