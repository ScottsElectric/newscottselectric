import React, { useState } from 'react';
import {
  Zap,
  Car,
  BatteryCharging,
  Lightbulb,
  Cpu,
  Waves,
  ShieldCheck,
  PhoneCall,
  Calculator,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

const SERVICE_OPTIONS = [
  { id: 'everyday', name: 'Outlets, Switches, Ceiling Fans & Breaker Fixes', basePrice: 175, Icon: Lightbulb },
  { id: 'panel', name: '200A / 400A Electrical Panel Upgrade', basePrice: 1800, Icon: Zap },
  { id: 'ev', name: 'Level 2 EV Charger Circuit (240V)', basePrice: 650, Icon: Car },
  { id: 'generator', name: 'Whole-Home Standby Generator & ATS', basePrice: 5500, Icon: BatteryCharging },
  { id: 'lighting', name: 'Chandeliers, Recessed LED & Exterior Lighting', basePrice: 450, Icon: Cpu },
  { id: 'pool', name: 'Pool / Hot Tub Subpanel & Bonding', basePrice: 850, Icon: Waves },
  { id: 'inspection', name: 'Safety Inspection & Home-Sale Repairs', basePrice: 199, Icon: ShieldCheck },
];

const NEC_APPLIANCES = [
  { id: 'hvac', label: 'Central Heat Pump / AC (5 kVA)', watts: 5000, isHvac: true },
  { id: 'ev48', label: 'Level 2 EV Charger — 48A Continuous (11.5 kVA)', watts: 11520, isHvac: false },
  { id: 'range', label: 'Electric Range / Induction Cooktop (8 kVA)', watts: 8000, isHvac: false },
  { id: 'dryer', label: 'Electric Clothes Dryer (5 kVA)', watts: 5000, isHvac: false },
  { id: 'spa', label: 'Hot Tub / Pool Equipment Pad (7.5 kVA)', watts: 7500, isHvac: false },
];

const CITIES = [
  'Virginia Beach',
  'Norfolk',
  'Chesapeake',
  'Newport News',
  'Hampton',
  'Portsmouth',
  'Suffolk',
];

export default function InteractiveQuoteCalculator() {
  const [mode, setMode] = useState('quote'); // 'quote' | 'nec'
  const [selectedServices, setSelectedServices] = useState(['panel']);
  const [selectedCity, setSelectedCity] = useState('Virginia Beach');
  const [urgency, setUrgency] = useState('standard');
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });

  // NEC 220.82 Optional Dwelling Load Calculator State
  const [sqFt, setSqFt] = useState(2200);
  const [panelAmps, setPanelAmps] = useState(100);
  const [activeLoads, setActiveLoads] = useState(['hvac', 'ev48', 'range', 'dryer']);

  const toggleService = (id) => {
    if (selectedServices.includes(id)) {
      if (selectedServices.length > 1) {
        setSelectedServices(selectedServices.filter((s) => s !== id));
      }
    } else {
      setSelectedServices([...selectedServices, id]);
    }
  };

  const toggleLoad = (id) => {
    setActiveLoads((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Real NEC Article 220.82 Dwelling Demand Calculation
  const computeNecLoad = () => {
    const generalLightingAndSmallAppliance = sqFt * 3 + 3000 + 1500; // 3 VA/sqft + two 20A kitchen + laundry
    const nonHvacAppliances = NEC_APPLIANCES.filter(
      (a) => !a.isHvac && activeLoads.includes(a.id)
    ).reduce((sum, a) => sum + a.watts, 0);
    const hvacWatts = NEC_APPLIANCES.filter(
      (a) => a.isHvac && activeLoads.includes(a.id)
    ).reduce((sum, a) => sum + a.watts, 0);

    const baseConnected = generalLightingAndSmallAppliance + nonHvacAppliances;
    const baseDemand =
      baseConnected <= 10000
        ? baseConnected
        : 10000 + (baseConnected - 10000) * 0.4;

    const totalDemandVA = Math.round(baseDemand + hvacWatts);
    const calculatedAmps = Math.round(totalDemandVA / 240);
    const utilizationPct = Math.round((calculatedAmps / panelAmps) * 100);
    const needsUpgrade = calculatedAmps > panelAmps * 0.82;

    return { totalDemandVA, calculatedAmps, utilizationPct, needsUpgrade };
  };

  const nec = computeNecLoad();

  const calculateEstimate = () => {
    let total = selectedServices.reduce((sum, id) => {
      const srv = SERVICE_OPTIONS.find((s) => s.id === id);
      return sum + (srv ? srv.basePrice : 0);
    }, 0);
    if (urgency === 'emergency') total *= 1.15;
    return Math.round(total);
  };

  const encode = (data) =>
    Object.keys(data)
      .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
      .join('&');

  const handleSubmit = (e) => {
    e.preventDefault();
    const serviceNames = selectedServices
      .map((id) => {
        const srv = SERVICE_OPTIONS.find((s) => s.id === id);
        return srv ? srv.name : id;
      })
      .join(', ');

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encode({
        'form-name': 'quote-request',
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        city: selectedCity,
        urgency: urgency,
        services: serviceNames,
        estimatedBudget: `$${calculateEstimate()} (NEC Calc: ${nec.calculatedAmps}A on ${panelAmps}A panel)`,
      }),
    })
      .then(() => setSubmitted(true))
      .catch(() => setSubmitted(true));
  };

  return (
    <div className="bento-card p-6 sm:p-10 rounded-3xl max-w-5xl mx-auto shadow-card">
      {/* Top Direct Phone Banner + Mode Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-800/90">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-amber-400">
            Instant Estimate &amp; Panel Load Check
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Estimate Any Repair or Upgrade
          </h2>
        </div>

        <a
          href="tel:7575360478"
          className="inline-flex items-center justify-center gap-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-gold-glow shrink-0"
        >
          <PhoneCall className="w-4 h-4 shrink-0" />
          <span>Skip Form — Call (757) 536-0478</span>
        </a>
      </div>

      {/* Workbench Mode Tabs */}
      <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-950 border border-slate-800 mb-8 max-w-md">
        <button
          type="button"
          onClick={() => setMode('quote')}
          className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
            mode === 'quote'
              ? 'bg-amber-500 text-slate-950 shadow'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>1. Project Price Estimator</span>
        </button>
        <button
          type="button"
          onClick={() => setMode('nec')}
          className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
            mode === 'nec'
              ? 'bg-cyan-400 text-slate-950 shadow'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>2. NEC 220 Panel Load Check</span>
        </button>
      </div>

      {mode === 'nec' && (
        <div className="mb-10 p-5 sm:p-6 rounded-2xl bg-slate-950/90 border border-cyan-500/30 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between text-xs font-bold mb-2">
                <span className="text-slate-300 uppercase tracking-wider">Heated Living Area</span>
                <span className="font-mono text-cyan-400">{sqFt.toLocaleString()} sq ft</span>
              </div>
              <input
                type="range"
                min="900"
                max="5500"
                step="100"
                value={sqFt}
                aria-label="Home square footage"
                onChange={(e) => setSqFt(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <div className="flex justify-between font-mono text-[10px] text-slate-500 mt-1">
                <span>900 sq ft</span>
                <span>3,000 sq ft</span>
                <span>5,500 sq ft</span>
              </div>
            </div>

            <div>
              <span className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Current Main Breaker Rating
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[100, 150, 200].map((amp) => (
                  <button
                    key={amp}
                    type="button"
                    onClick={() => setPanelAmps(amp)}
                    className={`py-2.5 rounded-xl font-mono text-xs font-bold border transition-all ${
                      panelAmps === amp
                        ? 'bg-cyan-400/15 border-cyan-400 text-cyan-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {amp} Amps
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <span className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
              Active or Planned 240V Appliances (NEC 220.82 Optional Calculation)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {NEC_APPLIANCES.map((app) => {
                const checked = activeLoads.includes(app.id);
                return (
                  <button
                    key={app.id}
                    type="button"
                    onClick={() => toggleLoad(app.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                      checked
                        ? 'bg-slate-900 border-cyan-400/60 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span>{app.label}</span>
                    <span className={`font-mono text-[10px] ${checked ? 'text-cyan-400' : 'text-slate-600'}`}>
                      {checked ? 'INCLUDED' : 'OFF'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* NEC Result Readout */}
          <div
            className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              nec.needsUpgrade
                ? 'bg-amber-950/35 border-amber-500/50'
                : 'bg-emerald-950/35 border-emerald-500/40'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {nec.needsUpgrade ? (
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
                <span className="font-mono text-xs font-bold uppercase text-white">
                  Estimated NEC Demand: {nec.calculatedAmps} Amps @ 240V ({(nec.totalDemandVA / 1000).toFixed(1)} kVA • {nec.utilizationPct}% of {panelAmps}A)
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {nec.needsUpgrade
                  ? `Your ${panelAmps}A service exceeds safe continuous headroom. Upgrading to a 200A main-breaker load center is strongly recommended before adding EV or spa loads.`
                  : `Your ${panelAmps}A panel has nominal NEC Article 220 demand headroom, subject to physical breaker space verification by a Master Electrician.`}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (nec.needsUpgrade && !selectedServices.includes('panel')) {
                  setSelectedServices((prev) => [...prev, 'panel']);
                }
                setMode('quote');
              }}
              className="shrink-0 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-xl"
            >
              Lock Into Quote Below →
            </button>
          </div>
        </div>
      )}

      {submitted ? (
        <div className="bg-emerald-950/50 border border-emerald-500/40 p-8 rounded-2xl text-center space-y-4">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
          <h3 className="font-heading text-2xl font-bold text-white">
            Dispatch Request Logged for {selectedCity}
          </h3>
          <p className="text-sm text-slate-300 max-w-lg mx-auto">
            Thank you, <strong className="text-white">{formData.name}</strong>. A Virginia Master Electrician will call you at{' '}
            <strong className="text-amber-400">{formData.phone}</strong>. Need immediate emergency dispatch right now?
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <a
              href="tel:7575360478"
              className="inline-flex items-center gap-2 bg-amber-500 text-slate-950 font-extrabold text-xs px-6 py-3 rounded-xl"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call (757) 536-0478 Now</span>
            </a>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="text-xs text-slate-300 hover:text-amber-400 underline font-semibold"
            >
              Calculate Another Estimate
            </button>
          </div>
        </div>
      ) : (
        <form
          name="quote-request"
          method="POST"
          data-netlify="true"
          data-netlify-honeypot="bot-field"
          onSubmit={handleSubmit}
          className="space-y-7"
        >
          <input type="hidden" name="form-name" value="quote-request" />
          <p className="hidden">
            <label>
              Don’t fill this out if you’re human: <input name="bot-field" />
            </label>
          </p>

          {/* Step 1: Services */}
          <div>
            <label className="block font-mono text-xs font-bold uppercase tracking-wider text-amber-400 mb-3">
              1. Select Electrical Scope Required
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SERVICE_OPTIONS.map((service) => {
                const active = selectedServices.includes(service.id);
                const IconComp = service.Icon;
                return (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => toggleService(service.id)}
                    className={`flex items-center justify-between p-3.5 rounded-xl text-left border transition-all text-xs font-semibold ${
                      active
                        ? 'bg-slate-900 border-amber-400 text-white shadow-gold-glow'
                        : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <span className="flex items-center gap-2.5 pr-2">
                      <IconComp className={`w-4 h-4 shrink-0 ${active ? 'text-amber-400' : 'text-slate-500'}`} />
                      <span>{service.name}</span>
                    </span>
                    <span className="font-mono text-amber-400 shrink-0">${service.basePrice}+</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: City & Urgency */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="calc-city"
                className="block font-mono text-xs font-bold uppercase tracking-wider text-amber-400 mb-2"
              >
                2. 757 Service City
              </label>
              <select
                id="calc-city"
                name="city"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-3.5 text-xs focus:border-amber-400 focus:outline-none"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}, VA
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="calc-urgency"
                className="block font-mono text-xs font-bold uppercase tracking-wider text-amber-400 mb-2"
              >
                3. Dispatch Priority
              </label>
              <select
                id="calc-urgency"
                name="urgency"
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-3.5 text-xs focus:border-amber-400 focus:outline-none"
              >
                <option value="standard">Scheduled Installation / Upgrade</option>
                <option value="sameDay">Same-Day Priority Service</option>
                <option value="emergency">24/7 Immediate Emergency Dispatch</option>
              </select>
            </div>
          </div>

          {/* Estimated Budget Range */}
          <div className="bg-slate-950/90 p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="font-mono text-[11px] uppercase text-slate-400 block">
                Preliminary Turnkey Range ({selectedCity}, VA)
              </span>
              <span className="font-heading text-3xl font-extrabold text-amber-400">
                ${calculateEstimate().toLocaleString()} – $
                {Math.round(calculateEstimate() * 1.25).toLocaleString()}
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                Includes licensed Master Electrician labor, NEC code materials &amp; municipal permit coordination
              </span>
            </div>
            <a
              href="tel:7575360478"
              className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-400/35 text-cyan-300 hover:bg-cyan-400 hover:text-slate-950 text-xs px-4 py-2.5 rounded-xl font-bold transition-colors shrink-0"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Confirm by Phone: (757) 536-0478</span>
            </a>
          </div>

          {/* Step 4: Callback Form */}
          <div className="space-y-4 pt-2 border-t border-slate-800">
            <label className="block font-mono text-xs font-bold uppercase tracking-wider text-amber-400">
              4. Request Phone Callback &amp; Written Quote
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                name="name"
                required
                aria-label="Full Name"
                placeholder="Full Name *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-slate-950 border border-slate-800 text-white rounded-xl p-3.5 text-xs focus:border-amber-400 focus:outline-none"
              />
              <input
                type="tel"
                name="phone"
                required
                aria-label="Phone Number"
                placeholder="Best Phone Number (757) *"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-slate-950 border border-slate-800 text-white rounded-xl p-3.5 text-xs focus:border-amber-400 focus:outline-none"
              />
              <input
                type="email"
                name="email"
                required
                aria-label="Email Address for Written Estimate"
                placeholder="Email (for written copy) *"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-slate-950 border border-slate-800 text-white rounded-xl p-3.5 text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-extrabold text-sm py-4 rounded-xl shadow-gold-glow transition-transform hover:scale-[1.01]"
            >
              Request Callback &amp; Written Quote for {selectedCity} →
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
