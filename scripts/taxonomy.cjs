/**
 * OSM tag to Tier-1 functional category crosswalk.
 *
 * Modelled on the AnythingPOI taxonomy: two OSM keys that describe the world
 * differently are mapped onto one functional hierarchy, so that "what is this
 * place for" is answerable without asking which key a mapper happened to reach
 * for. A restaurant and a waste basket are both `amenity` in raw OSM, which is
 * why the raw key is useless as a category system.
 *
 * Three outcomes are possible for any node:
 *   - a Tier-1 functional category  (participates in the entropy measure)
 *   - FURNITURE                     (excluded: street fittings, not destinations)
 *   - VACANT                        (tracked separately as a transition signal)
 */

const FURNITURE = 'FURNITURE';
const VACANT = 'VACANT';

/** Tier-1 categories. Order is fixed: the built JSON stores indices into this. */
const TIERS = [
  'Food & Beverage',
  'Retail',
  'Personal Care & Services',
  'Healthcare',
  'Professional & Business',
  'Financial',
  'Education',
  'Arts & Entertainment',
  'Sports & Recreation',
  'Parks & Nature',
  'Accommodation',
  'Transportation',
  'Automotive',
  'Civic & Government',
  'Religious',
  'Historic & Memorial',
  'Industrial & Logistics',
  'Other',
];

/*
 * Street fittings. These dominate OSM's Toronto extract (bench alone is 8,615
 * nodes, more than every restaurant in the city) and they describe the presence
 * of a sidewalk rather than the character of a place. Including them makes the
 * entropy surface a map of street furniture density.
 */
const FURNITURE_VALUES = new Set([
  'bench', 'waste_basket', 'waste_disposal', 'bicycle_parking', 'post_box',
  'recycling', 'picnic_table', 'vending_machine', 'drinking_water', 'telephone',
  'toilets', 'shelter', 'parking_space', 'trolley_bay', 'relay_box', 'grit_bin',
  'public_bookcase', 'clothing_donation', 'fountain', 'hydrant', 'street_lamp',
  'bbq', 'letter_box', 'bicycle_repair_station', 'water_point', 'compressed_air',
  'luggage_locker', 'parcel_locker', 'photo_booth', 'clock', 'surveillance',
  'fixme', 'lounger', 'planter', 'give_box', 'smoking_area', 'watering_place',
  'information', 'board', 'map', 'noticeboard', 'artwork_furniture',
]);

/** Explicit value to Tier-1 mapping, keyed by OSM tag value. */
const VALUE_MAP = {
  // Food & Beverage
  restaurant: 0, fast_food: 0, cafe: 0, bar: 0, pub: 0, ice_cream: 0,
  food_court: 0, biergarten: 0, bakery: 0, deli: 0, butcher: 0, greengrocer: 0,
  alcohol: 0, confectionery: 0, coffee: 0, tea: 0, seafood: 0, cheese: 0,
  chocolate: 0, wine: 0, beverages: 0, pastry: 0, juice_bar: 0, farm: 0,
  spices: 0, health_food: 0, nutrition_supplements: 0, water: 0,

  // Retail
  clothes: 1, convenience: 1, supermarket: 1, variety_store: 1, shoes: 1,
  furniture: 1, jewelry: 1, gift: 1, florist: 1, pet: 1, electronics: 1,
  books: 1, sports: 1, toys: 1, department_store: 1, houseware: 1,
  mobile_phone: 1, computer: 1, art: 1, cannabis: 1, 'e-cigarette': 1,
  interior_decoration: 1, bed: 1, paint: 1, hardware: 1, doityourself: 1,
  second_hand: 1, charity: 1, boutique: 1, fabric: 1, music: 1,
  video_games: 1, garden_centre: 1, kiosk: 1, newsagent: 1, stationery: 1,
  tobacco: 1, general: 1, mall: 1, wholesale: 1, outdoor: 1, bag: 1,
  watches: 1, antiques: 1, craft: 1, frame: 1, lighting: 1, carpet: 1,
  curtain: 1, kitchen: 1, bathroom_furnishing: 1, appliance: 1, erotic: 1,
  party: 1, photo: 1, pawnbroker: 1, ticket: 1, video: 1, trophy: 1,
  fishing: 1, hunting: 1, swimming_pool_supplies: 1, baby_goods: 1,
  leather: 1, fireplace: 1, window_blind: 1, tiles: 1, flooring: 1,
  household_linen: 1, chemist: 1, perfumery: 1, hifi: 1, camera: 1,
  musical_instrument: 1, games: 1, collector: 1, model: 1, wool: 1,
  sewing: 1, bookmaker: 1, lottery: 1, weapons: 1, military_surplus: 1,

  // Personal Care & Services
  hairdresser: 2, beauty: 2, massage: 2, tattoo: 2, dry_cleaning: 2,
  laundry: 2, tailor: 2, optician: 2, cosmetics: 2, nail_salon: 2,
  barber: 2, pet_grooming: 2, copyshop: 2, shoe_repair: 2, locksmith: 2,
  travel_agency: 2, photographer: 2, hairdresser_supply: 2, piercing: 2,
  sauna: 2, funeral_directors: 2, dry_cleaner: 2, repair: 2,
  electronics_repair: 2, phone_repair: 2, watchmaker: 2, key_cutting: 2,

  // Healthcare
  dentist: 3, doctors: 3, pharmacy: 3, clinic: 3, veterinary: 3, hospital: 3,
  nursing_home: 3, healthcare: 3, optometrist: 3, physiotherapist: 3,
  chiropractor: 3, medical_supply: 3, hearing_aids: 3, blood_donation: 3,
  psychotherapist: 3, alternative_medicine: 3,

  // Professional & Business
  company: 4, lawyer: 4, tax_advisor: 4, accountant: 4, insurance: 4,
  employment_agency: 4, estate_agent: 4, it: 4, consulting: 4, architect: 4,
  engineer: 4, advertising_agency: 4, ngo: 4, association: 4, research: 4,
  telecommunication: 4, coworking: 4, newspaper: 4, notary: 4, marketing: 4,
  logistics: 4, property_management: 4, foundation: 4, quango: 4,
  moving_company: 4, surveyor: 4, translator: 4, publisher: 4, insurance_agent: 4,

  // Financial
  bank: 5, atm: 5, bureau_de_change: 5, money_lender: 5, money_transfer: 5,
  payment_terminal: 5, financial: 5, financial_advisor: 5, credit_union: 5,

  // Education
  school: 6, kindergarten: 6, college: 6, university: 6, prep_school: 6,
  language_school: 6, music_school: 6, childcare: 6, library: 6,
  educational_institution: 6, training: 6, tutoring: 6, dancing_school: 6,
  research_institute: 6, driving_school: 6,

  // Arts & Entertainment
  theatre: 7, cinema: 7, arts_centre: 7, nightclub: 7, casino: 7, gallery: 7,
  museum: 7, artwork: 7, attraction: 7, gambling: 7, music_venue: 7,
  stripclub: 7, events_venue: 7, exhibition_centre: 7, aquarium: 7, zoo: 7,
  theme_park: 7, planetarium: 7, amusement_arcade: 7, escape_game: 7,

  // Sports & Recreation
  fitness_centre: 8, sports_centre: 8, pitch: 8, playground: 8,
  swimming_pool: 8, fitness_station: 8, golf_course: 8, stadium: 8, track: 8,
  sports_hall: 8, dance: 8, horse_riding: 8, marina: 8, slipway: 8,
  bowling_alley: 8, ice_rink: 8, miniature_golf: 8, climbing: 8,
  sports_club: 8, recreation_ground: 8, disc_golf_course: 8, bleachers: 8,

  // Parks & Nature
  park: 9, garden: 9, nature_reserve: 9, dog_park: 9, picnic_site: 9,
  viewpoint: 9, beach_resort: 9, common: 9, green: 9, wildlife_hide: 9,
  bird_hide: 9, camp_pitch: 9, firepit: 9, beach: 9,

  // Accommodation
  hotel: 10, motel: 10, hostel: 10, guest_house: 10, apartment: 10,
  camp_site: 10, chalet: 10, bed_and_breakfast: 10, caravan_site: 10,
  resort: 10, love_hotel: 10,

  // Transportation
  fuel: 11, parking: 11, parking_entrance: 11, bicycle_rental: 11,
  car_sharing: 11, car_rental: 11, charging_station: 11, taxi: 11,
  bus_station: 11, ferry_terminal: 11, boat_rental: 11,
  motorcycle_parking: 11, bicycle_wash: 11, transportation: 11,
  driving_range: 11, airport: 11, terminal: 11, helipad: 11,

  // Automotive
  car_repair: 12, car: 12, car_wash: 12, car_parts: 12, tyres: 12,
  motorcycle: 12, motorcycle_repair: 12, truck: 12, caravan: 12,
  car_dealer: 12, vehicle_inspection: 12, boat: 12, atv: 12,

  // Civic & Government
  townhall: 13, courthouse: 13, police: 13, fire_station: 13, post_office: 13,
  government: 13, embassy: 13, prison: 13, public_building: 13,
  social_facility: 13, community_centre: 13, ranger_station: 13,
  public_bath: 13, customs: 13, diplomatic: 13, register_office: 13,
  political_party: 13, administrative: 13, refugee_site: 13, courthouse_annex: 13,

  // Religious
  place_of_worship: 14, monastery: 14, religious: 14, church: 14,
  mosque: 14, synagogue: 14, temple: 14,

  // Historic & Memorial
  memorial: 15, monument: 15, heritage: 15, ruins: 15, archaeological_site: 15,
  wayside_cross: 15, wayside_shrine: 15, castle: 15, fort: 15, tomb: 15,
  ship: 15, aircraft: 15, locomotive: 15, boundary_stone: 15, milestone: 15,
  city_gate: 15, cannon: 15, manor: 15, building: 15, district: 15,

  // Industrial & Logistics
  warehouse: 16, loading_dock: 16, factory: 16, works: 16, storage_rental: 16,
  trade: 16, industrial: 16, depot: 16, scrap_yard: 16, recycling_centre: 16,
  distributor: 16, agrarian: 16, energy: 16, gas: 16, oil: 16,
  building_supplies: 16, timber: 16, machinery: 16, tool_hire: 16,
  fuel_depot: 16, container: 16,
};

/** Values that mark a unit as empty rather than as having a function. */
const VACANT_VALUES = new Set([
  'vacant', 'disused', 'abandoned', 'empty', 'closed', 'former', 'no',
]);

/**
 * Classify one OSM node.
 * @param {string} key   primary OSM key, e.g. "amenity"
 * @param {string} value tag value, e.g. "restaurant"
 * @returns {number|string} Tier-1 index, or FURNITURE / VACANT
 */
function classify(key, value) {
  if (!value) return FURNITURE;

  /* Multi-value tags such as "waste_basket;recycling" take their first part. */
  const v = String(value).split(';')[0].trim().toLowerCase();

  if (VACANT_VALUES.has(v)) return VACANT;
  if (FURNITURE_VALUES.has(v)) return FURNITURE;
  if (Object.prototype.hasOwnProperty.call(VALUE_MAP, v)) return VALUE_MAP[v];

  /* Fall back on the key when the value is unrecognised. A shop of unknown
     type is still retail; an unknown office is still business activity. */
  switch (key) {
    case 'shop': return 1;
    case 'office': return 4;
    case 'historic': return 15;
    case 'leisure': return 8;
    case 'tourism': return 7;
    case 'industrial': return 16;
    default: return 17; // Other
  }
}

module.exports = { TIERS, FURNITURE, VACANT, classify };
