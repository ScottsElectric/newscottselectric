import realPhotosData from './realPhotos.json';

// Exclude brand graphics (61 real jobsite photos)
export const ALL_VERIFIED_PHOTOS = realPhotosData.filter((p) => p.isRealJobsitePhoto);

// Exclude 3 near-duplicate second camera angles of identical fixtures/rooms on the landing page
const NEAR_DUPLICATE_BASES = new Set(['img_1685', 'img_1646', 'img_4528']);

const photoByBase = new Map(ALL_VERIFIED_PHOTOS.map((p) => [p.cleanBase, p]));
const photoBySrc = new Map(ALL_VERIFIED_PHOTOS.map((p) => [p.src, p]));

export function getPhotoByBase(cleanBase) {
  return photoByBase.get(cleanBase) || ALL_VERIFIED_PHOTOS[0];
}

export function getPhotoBySrc(src) {
  return photoBySrc.get(src) || null;
}

export function getPhotosByBases(bases = []) {
  return bases.map((b) => photoByBase.get(b)).filter(Boolean);
}

// ============================================================================
// STRICT ZERO-DUPLICATE PARTITION FOR LANDING PAGE (/)
// Every single section below uses a 100% disjoint set of cleanBase IDs!
// ============================================================================

// 1. HERO COASTAL CINEMA PORTAL (5 Unique Photos)
export const HOME_HERO_SLIDES = [
  {
    ...getPhotoByBase('img_3559'),
    shortLabel: 'Coastal LED',
    necBadge: 'NEC 410 • WET-LOCATION',
    priceHint: '$400 – $2,800',
    tag: 'COASTAL EXTERIOR & PALM UPLIGHTING',
    locationVibe: 'Shore Drive & Oceanfront Ready',
    serviceLink: '/services/custom-lighting-installation/',
  },
  {
    ...getPhotoByBase('img_4022'),
    shortLabel: '200A Panel',
    necBadge: 'NEC 408 • COPPER BUS',
    priceHint: '$1,800 – $3,800',
    tag: '200A SOLID COPPER BUSBAR UPGRADE',
    locationVibe: 'Same-Day Dominion Reconnect',
    serviceLink: '/services/electrical-panel-upgrades/',
  },
  {
    ...getPhotoByBase('img_5434'),
    shortLabel: 'High-Bay Rig',
    necBadge: 'NEC 314.27 • TRUSS MOUNT',
    priceHint: '$550 – $1,800',
    tag: 'WATERFRONT PAVILION TRUSS LIGHTING',
    locationVibe: '2-Story & Hospitality Rigging',
    serviceLink: '/services/ceiling-fan-chandelier-installation/',
  },
  {
    ...getPhotoByBase('img_5108'),
    shortLabel: 'Meter Bank',
    necBadge: 'VA CLASS A • 3-PHASE',
    priceHint: '$950 – $15,000+',
    tag: '6-GANG METER BANK & GE DISCONNECTS',
    locationVibe: 'Multi-Unit & Commercial Service',
    serviceLink: '/services/commercial-electrical/',
  },
  {
    ...getPhotoByBase('img_4370'),
    shortLabel: 'NEC 680 Pool',
    necBadge: 'NEC 680 • 8-AWG BONDED',
    priceHint: '$850 – $2,900',
    tag: 'NEC 680 COASTAL POOL AUTOMATION',
    locationVibe: 'Saltwater Pad & GFCI Subpanels',
    serviceLink: '/services/pool-hot-tub-wiring/',
  },
];

// 2. PINNED STACKED-DECK ELECTRICAL SCOPES (11 Unique Photos + 1 Unique Video Poster = 12 Unique Media)
export const HOME_STACKED_SERVICES = [
  {
    id: 'scope-panels',
    num: '01',
    eyebrow: '200A & 400A SERVICE CAPACITY • DOMINION UTILITY SYNC',
    titlePlain: '200-Amp Main Breaker',
    titleItalic: 'Panel Upgrades',
    priceHint: '$1,800 – $3,800 Turnkey',
    summary:
      'Replace overloaded 100A coastal panels, legacy split-bus boxes, and hazardous FPE/Zinsco breakers with UL-listed Square D, Siemens, and Eaton 200A/400A load centers—complete with insulated lug guards, whole-home surge defense, and same-day utility reconnect.',
    bullets: [
      'Same-day 4–8 hr changeover with Dominion Energy',
      'AFCI/GFCI arc-fault & ground-fault branch protection',
      'Municipal electrical permits filed in all 7 cities',
    ],
    mainPhoto: getPhotoByBase('img_3626'),
    accentPhoto: getPhotoByBase('img_4523'),
    href: '/services/electrical-panel-upgrades',
    cardTone: 'sand',
  },
  {
    id: 'scope-ev',
    num: '02',
    eyebrow: 'DEDICATED 240V CIRCUITS • TESLA NACS & UNIVERSAL J1772',
    titlePlain: 'Level 2 Home & Coastal',
    titleItalic: 'EV Charging Stations',
    priceHint: '$650 – $1,500 Installed',
    summary:
      'Charge 9x faster overnight with a dedicated 40A–60A 240V copper circuit, NEC Article 220 load verification, weather-rated NEMA 3R outdoor disconnects, and clean Schedule 40 PVC or EMT conduit runs.',
    bullets: [
      '35–48 miles of range added per hour @ 240V',
      'Hardwired Tesla Wall Connector, Rivian, Ford & ChargePoint',
      'Salt-air weatherproof exterior pedestals & garages',
    ],
    mainPhoto: getPhotoByBase('img_5010'),
    accentPhoto: getPhotoByBase('img_9203'),
    href: '/services/ev-charger-installation',
    cardTone: 'navy',
  },
  {
    id: 'scope-generators',
    num: '03',
    eyebrow: "HURRICANE & NOR'EASTER CONTINUITY • ATS & INTERLOCKS",
    titlePlain: 'Whole-Home Standby',
    titleItalic: 'Generators & Interlocks',
    priceHint: 'ATS & Mechanical Interlocks',
    summary:
      'Keep central HVAC, refrigeration, sump pumps, and medical gear running automatically within 10 seconds of a coastal storm outage using Generac/Kohler Automatic Transfer Switches or UL-listed brass mechanical breaker interlocks.',
    bullets: [
      'Automatic power restoration in under 10 seconds',
      'Natural gas & propane turnkey standby integrations',
      'Code-compliant brass breaker interlocks prevent backfeed',
    ],
    mainPhoto: getPhotoByBase('img_3691'),
    accentPhoto: getPhotoByBase('img_3805'),
    href: '/services/whole-home-generators',
    cardTone: 'sand',
  },
  {
    id: 'scope-lighting',
    num: '04',
    eyebrow: 'HIGH-BAY SCAFFOLD RIGGING • ARCHITECTURAL & DUSK LEDS',
    titlePlain: 'Two-Story Chandeliers &',
    titleItalic: 'Coastal Illumination',
    priceHint: '$400 – $2,800 Custom Scopes',
    summary:
      'Structural fan/fixture-rated ceiling boxes for grand two-story foyers, MC-cable commercial crystal chandeliers, ultra-slim canless LED recessed grids, and warm dusk-to-dawn craftsman perimeter sconces.',
    bullets: [
      '100+ lb reinforced high-ceiling foyer chandelier mounts',
      'Zero-patch canless IC-rated LED wafer downlights',
      'Weatherproof coastal lanterns & photocell security LEDs',
    ],
    mainPhoto: getPhotoByBase('img_5803'),
    accentPhoto: getPhotoByBase('img_0949'),
    href: '/services/custom-lighting-installation',
    cardTone: 'navy',
  },
  {
    id: 'scope-commercial',
    num: '05',
    eyebrow: '120/208V & 277/480V 3-PHASE • VA CLASS A CONTRACTOR',
    titlePlain: 'Commercial 3-Phase &',
    titleItalic: 'Tenant Buildouts',
    priceHint: '24/7 Priority Commercial Line',
    summary:
      'Symmetrical Square D NQ bolt-on subpanels, heavy-duty NEMA 3R fusible safety switches with Littelfuse cartridges, parallel EMT risers, retail/restaurant buildouts, and rapid lost-phase emergency dispatch.',
    bullets: [
      'Square D I-Line, NQ QOB bolt-on & Siemens panelboards',
      'Armored MC-cable & parallel EMT conduit racks',
      'Full municipal inspector sign-off across Hampton Roads',
    ],
    mainPhoto: getPhotoByBase('img_4537'),
    accentPhoto: getPhotoByBase('img_4525'),
    href: '/services/commercial-electrical',
    cardTone: 'sand',
  },
  {
    id: 'scope-pools-crawlspace',
    num: '06',
    eyebrow: 'NEC ARTICLE 680 POOLS • ENCAPSULATED CRAWLSPACE RACEWAYS',
    titlePlain: 'Pool Subpanels &',
    titleItalic: 'Clean Crawlspace Wiring',
    priceHint: 'Inspection-Grade Craftsmanship',
    summary:
      'From 8-relay saltwater pool automation enclosures and dual low-voltage transformers outside to laser-neat 12-AWG NM-B copper runs stapled along encapsulated crawlspace joists underneath coastal homes.',
    bullets: [
      '8-relay pool & spa load centers + equipotential bonding',
      'Encapsulated crawlspace NEC 334.30 joist cable routing',
      'Smart switch banks & whole-home energy monitoring',
    ],
    mainPhoto: getPhotoByBase('img_4251'),
    videoSrc: '/assets/videos/crawlspace_raceway.mp4',
    videoPosterPhoto: getPhotoByBase('img_0348'),
    href: '/services/smart-home-automation',
    cardTone: 'navy',
  },
];

// 3. PINNED HORIZONTAL FILM-TRACK GALLERY (10 Unique Photos)
export const HOME_HORIZONTAL_REEL = getPhotosByBases([
  'img_1645',
  'img_3246',
  'img_0283',
  'img_0757',
  'img_4533',
  'img_3327',
  'img_4992',
  'img_5884',
  'img_3482',
  'img_4519',
]);

// 4. 7-CITY TIDEWATER COVERAGE CARDS (7 Unique Photos — 1 Distinct Photo Per City)
export const HOME_CITY_HUBS = [
  {
    name: 'Virginia Beach',
    slug: '/virginia-beach-electrician',
    zips: '23451 – 23464',
    corridor: 'Shore Dr • Oceanfront • Great Neck • Sandbridge',
    description:
      'Coastal 200A/400A panel upgrades, Level 2 EV chargers, saltwater pool automation pads, and hurricane standby generators.',
    photo: getPhotoByBase('img_4878'),
  },
  {
    name: 'Norfolk',
    slug: '/norfolk-electrician',
    zips: '23502 – 23518',
    corridor: 'Ghent • Freemason • Ocean View • Downtown',
    description:
      'Historic home copper rewiring, multi-family 6-gang meter banks, 3-phase commercial switchgear, and 24/7 dispatch.',
    photo: getPhotoByBase('img_0805'),
  },
  {
    name: 'Chesapeake',
    slug: '/chesapeake-electrician',
    zips: '23320 – 23325',
    corridor: 'Greenbrier • Great Bridge • Hickory • Western Branch',
    description:
      'NEC Article 680 pool & hot tub subpanels, 200A breaker replacements, vaulted ceiling fans, and garage EV circuits.',
    photo: getPhotoByBase('img_5177'),
  },
  {
    name: 'Newport News',
    slug: '/newport-news-electrician',
    zips: '23601 – 23608',
    corridor: 'Oyster Point • Hilton Village • Port Warwick • Denbigh',
    description:
      'Peninsula 200A plug-on-neutral load centers, exterior utility meter sockets, surge protection, and commercial LEDs.',
    photo: getPhotoByBase('img_1141'),
  },
  {
    name: 'Hampton',
    slug: '/hampton-electrician',
    zips: '23661 – 23669',
    corridor: 'Phoebus • Buckroe Beach • Fox Hill • Wythe',
    description:
      'Coastal NEMA 3R exterior service gear, aluminum branch-wire remediation, and automatic standby transfer switches.',
    photo: getPhotoByBase('img_5869'),
  },
  {
    name: 'Portsmouth',
    slug: '/portsmouth-electrician',
    zips: '23701 – 23707',
    corridor: 'Olde Towne • Churchland • Port Norfolk • Cradock',
    description:
      'Fuse-box and split-bus conversions to 200A breakers, municipal code violation corrections, and real-estate inspection fixes.',
    photo: getPhotoByBase('img_2677'),
  },
  {
    name: 'Suffolk',
    slug: '/suffolk-electrician',
    zips: '23434 – 23438',
    corridor: 'Harbour View • North Suffolk • Driver • Chuckatuck',
    description:
      'Detached workshop & barn subpanels, underground PVC feeder trenching, and 22kW–26kW whole-estate standby generators.',
    photo: getPhotoByBase('img_4572'),
  },
];

// Collect every cleanBase already used in Sections 1–4 so Section 5 NEVER repeats a single photo!
const USED_ON_HOME_ABOVE_VAULT = new Set([
  ...HOME_HERO_SLIDES.map((p) => p.cleanBase),
  ...HOME_STACKED_SERVICES.flatMap((s) => [
    s.mainPhoto?.cleanBase,
    s.accentPhoto?.cleanBase,
    s.videoPosterPhoto?.cleanBase,
  ]),
  ...HOME_HORIZONTAL_REEL.map((p) => p.cleanBase),
  ...HOME_CITY_HUBS.map((c) => c.photo?.cleanBase),
  ...NEAR_DUPLICATE_BASES,
]);

// 5. REMAINING UNSEEN FIELD CRAFTSMANSHIP ARCHIVE (Zero Overlap With Sections 1–4!)
export const HOME_VAULT_REMAINING = ALL_VERIFIED_PHOTOS.filter(
  (p) => !USED_ON_HOME_ABOVE_VAULT.has(p.cleanBase)
).sort((a, b) => b.qualityScore - a.qualityScore);

export function getImageGallerySchema(siteUrl = 'https://scottselectric.pro') {
  const topPhotos = ALL_VERIFIED_PHOTOS.filter(
    (p) => p.qualityScore >= 8 && !NEAR_DUPLICATE_BASES.has(p.cleanBase)
  ).slice(0, 24);
  return {
    '@type': 'ImageGallery',
    '@id': `${siteUrl}/#verified-jobsite-gallery`,
    name: 'Verified Master Electrician Jobsite Photography in Coastal Virginia & 757',
    description:
      'Authentic field photographs of 200A electrical panel upgrades, 3-phase commercial switchgear, meter banks, chandelier rigging, coastal disconnects, and copper wiring across Virginia Beach, Norfolk, Chesapeake, Newport News, Hampton, Portsmouth, and Suffolk.',
    image: topPhotos.map((p) => ({
      '@type': 'ImageObject',
      contentUrl: `${siteUrl}${p.src}`,
      name: p.title,
      description: p.seoAlt,
      width: p.width,
      height: p.height,
    })),
  };
}
