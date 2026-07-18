import { HostCity, Intervention, SimulationResult } from "../types";

export const HOST_CITIES: HostCity[] = [
  {
    id: "seattle",
    name: "Seattle",
    state: "Washington",
    stadium: "Lumen Field",
    capacity: 69000,
    buildYear: 2002,
    uhiRisk: "Medium",
    avgSummerTemp: 76,
    publicTransitScore: 82,
    coordinates: { x: 12, y: 15 },
    coordinatesDistrict: {
      stadium: { x: 30, y: 40 },
      fanZone: { x: 50, y: 25 },
      hotelCorridor: { x: 75, y: 35 },
      transitHub: { x: 25, y: 65 },
      hospital: { x: 70, y: 70 }
    }
  },
  {
    id: "bayarea",
    name: "San Francisco Bay Area",
    state: "California",
    stadium: "Levi's Stadium",
    capacity: 68500,
    buildYear: 2014,
    uhiRisk: "Medium",
    avgSummerTemp: 82,
    publicTransitScore: 70,
    coordinates: { x: 10, y: 45 },
    coordinatesDistrict: {
      stadium: { x: 35, y: 45 },
      fanZone: { x: 60, y: 20 },
      hotelCorridor: { x: 78, y: 40 },
      transitHub: { x: 20, y: 70 },
      hospital: { x: 82, y: 75 }
    }
  },
  {
    id: "losangeles",
    name: "Los Angeles",
    state: "California",
    stadium: "SoFi Stadium",
    capacity: 70240,
    buildYear: 2020,
    uhiRisk: "High",
    avgSummerTemp: 86,
    publicTransitScore: 65,
    coordinates: { x: 15, y: 65 },
    coordinatesDistrict: {
      stadium: { x: 40, y: 50 },
      fanZone: { x: 65, y: 30 },
      hotelCorridor: { x: 80, y: 50 },
      transitHub: { x: 30, y: 80 },
      hospital: { x: 85, y: 80 }
    }
  },
  {
    id: "kansascity",
    name: "Kansas City",
    state: "Missouri",
    stadium: "Arrowhead Stadium",
    capacity: 76416,
    buildYear: 1972,
    uhiRisk: "Medium-High",
    avgSummerTemp: 88,
    publicTransitScore: 40,
    coordinates: { x: 50, y: 42 },
    coordinatesDistrict: {
      stadium: { x: 45, y: 55 },
      fanZone: { x: 70, y: 35 },
      hotelCorridor: { x: 85, y: 45 },
      transitHub: { x: 20, y: 60 },
      hospital: { x: 75, y: 75 }
    }
  },
  {
    id: "dallas",
    name: "Dallas",
    state: "Texas",
    stadium: "AT&T Stadium",
    capacity: 80000,
    buildYear: 2009,
    uhiRisk: "Very High",
    avgSummerTemp: 96,
    publicTransitScore: 45,
    coordinates: { x: 48, y: 72 },
    coordinatesDistrict: {
      stadium: { x: 50, y: 50 },
      fanZone: { x: 75, y: 25 },
      hotelCorridor: { x: 85, y: 55 },
      transitHub: { x: 15, y: 60 },
      hospital: { x: 65, y: 80 }
    }
  },
  {
    id: "houston",
    name: "Houston",
    state: "Texas",
    stadium: "NRG Stadium",
    capacity: 72220,
    buildYear: 2002,
    uhiRisk: "Very High",
    avgSummerTemp: 94,
    publicTransitScore: 50,
    coordinates: { x: 52, y: 84 },
    coordinatesDistrict: {
      stadium: { x: 48, y: 48 },
      fanZone: { x: 70, y: 25 },
      hotelCorridor: { x: 80, y: 60 },
      transitHub: { x: 20, y: 75 },
      hospital: { x: 60, y: 85 }
    }
  },
  {
    id: "atlanta",
    name: "Atlanta",
    state: "Georgia",
    stadium: "Mercedes-Benz Stadium",
    capacity: 71000,
    buildYear: 2017,
    uhiRisk: "High",
    avgSummerTemp: 89,
    publicTransitScore: 60,
    coordinates: { x: 73, y: 68 },
    coordinatesDistrict: {
      stadium: { x: 42, y: 52 },
      fanZone: { x: 62, y: 32 },
      hotelCorridor: { x: 82, y: 42 },
      transitHub: { x: 22, y: 72 },
      hospital: { x: 72, y: 82 }
    }
  },
  {
    id: "miami",
    name: "Miami",
    state: "Florida",
    stadium: "Hard Rock Stadium",
    capacity: 64767,
    buildYear: 1987,
    uhiRisk: "High",
    avgSummerTemp: 90,
    publicTransitScore: 55,
    coordinates: { x: 85, y: 88 },
    coordinatesDistrict: {
      stadium: { x: 38, y: 48 },
      fanZone: { x: 58, y: 28 },
      hotelCorridor: { x: 78, y: 38 },
      transitHub: { x: 18, y: 68 },
      hospital: { x: 68, y: 78 }
    }
  },
  {
    id: "philadelphia",
    name: "Philadelphia",
    state: "Pennsylvania",
    stadium: "Lincoln Financial Field",
    capacity: 67594,
    buildYear: 2003,
    uhiRisk: "Medium-High",
    avgSummerTemp: 86,
    publicTransitScore: 78,
    coordinates: { x: 86, y: 38 },
    coordinatesDistrict: {
      stadium: { x: 40, y: 40 },
      fanZone: { x: 60, y: 20 },
      hotelCorridor: { x: 80, y: 35 },
      transitHub: { x: 25, y: 60 },
      hospital: { x: 70, y: 75 }
    }
  },
  {
    id: "newyork",
    name: "New York New Jersey",
    state: "New Jersey",
    stadium: "MetLife Stadium",
    capacity: 82500,
    buildYear: 2010,
    uhiRisk: "High",
    avgSummerTemp: 85,
    publicTransitScore: 85,
    coordinates: { x: 89, y: 32 },
    coordinatesDistrict: {
      stadium: { x: 42, y: 44 },
      fanZone: { x: 64, y: 24 },
      hotelCorridor: { x: 82, y: 38 },
      transitHub: { x: 28, y: 64 },
      hospital: { x: 74, y: 78 }
    }
  },
  {
    id: "boston",
    name: "Boston",
    state: "Massachusetts",
    stadium: "Gillette Stadium",
    capacity: 65878,
    buildYear: 2002,
    uhiRisk: "Medium",
    avgSummerTemp: 82,
    publicTransitScore: 68,
    coordinates: { x: 92, y: 25 },
    coordinatesDistrict: {
      stadium: { x: 45, y: 42 },
      fanZone: { x: 65, y: 22 },
      hotelCorridor: { x: 82, y: 32 },
      transitHub: { x: 22, y: 62 },
      hospital: { x: 72, y: 72 }
    }
  }
];

export const INTERVENTIONS: Intervention[] = [
  {
    id: "green_grid",
    name: "Smart Stadium Microgrid & Peak Shaving",
    category: "energy",
    description: "Install grid-connected battery reserves and automate stadium cooling loads to offset peak hour grids by shaving 25% of active electrical spike during matches.",
    energySavings: 85,
    waterSavings: 0,
    wasteReduction: 0,
    healthAdmissionAvoided: 0,
    co2Reduction: 68,
    costEstimate: "High",
    feasibilityScore: 78
  },
  {
    id: "transit_subsidies",
    name: "Spectator Free Transit Incentives",
    category: "energy",
    description: "Bundle active match tickets with 100% free light rail and bus transit codes, raising ridership share and avoiding vehicle congestion emissions.",
    energySavings: 120, // Avoided gasoline equivalent
    waterSavings: 0,
    wasteReduction: 0,
    healthAdmissionAvoided: 5, // Reduced local vehicle emissions during high heat
    co2Reduction: 95,
    costEstimate: "Medium",
    feasibilityScore: 92
  },
  {
    id: "water_catchment",
    name: "Greywater Recycling & Pitch Catchment",
    category: "food-water",
    description: "Equip the venue with advanced rainwater collection filters and recycle restroom wash water to handle 100% of field turf irrigation needs.",
    energySavings: 10,
    waterSavings: 1400, // kL water saved
    wasteReduction: 0,
    healthAdmissionAvoided: 0,
    co2Reduction: 8,
    costEstimate: "Medium",
    feasibilityScore: 85
  },
  {
    id: "compost_mandate",
    name: "100% Compostable Food & Organic Ware",
    category: "waste",
    description: "Mandate food vendors in and around stadium zones use only organic, certified biodegradable utensils and compost 100% of leftover organic scraps.",
    energySavings: 5,
    waterSavings: 200, // Reduced water for package recycling processes
    wasteReduction: 18, // Tons kept from landfill
    healthAdmissionAvoided: 0,
    co2Reduction: 35,
    costEstimate: "Low",
    feasibilityScore: 95
  },
  {
    id: "local_sourcing",
    name: "Zero-Mile Food Procurement Policy",
    category: "food-water",
    description: "Contract with farmers and kitchens within a 50-mile radius of the host city to supply 70%+ of concessions food items, drastically cutting logistics fuel.",
    energySavings: 45,
    waterSavings: 100,
    wasteReduction: 4,
    healthAdmissionAvoided: 0,
    co2Reduction: 52,
    costEstimate: "Low",
    feasibilityScore: 80
  },
  {
    id: "cooling_hubs",
    name: "Hydration Hubs & Misting Corridors",
    category: "health",
    description: "Set up high-flow, shaded drinking water kiosks and automated micro-mist zones every 150m across visitor queues, transit lines, and fan fests.",
    energySavings: -12, // Small energy cost for pumps/shading fans
    waterSavings: -350, // Small water consumption for drinking/misting
    wasteReduction: 0,
    healthAdmissionAvoided: 24, // High health impact!
    co2Reduction: -2,
    costEstimate: "Low",
    feasibilityScore: 98
  },
  {
    id: "thermal_paving",
    name: "Cool Pavement Coatings & Shade Canopies",
    category: "health",
    description: "Apply highly reflective coatings on parking lots and plazas and construct temporary high-albedo solar shading covers over visitor walkways.",
    energySavings: 15, // Reduced district ambient AC draw
    waterSavings: 0,
    wasteReduction: 0,
    healthAdmissionAvoided: 18,
    co2Reduction: 12,
    costEstimate: "High",
    feasibilityScore: 65
  },
  {
    id: "health_alert_dispatch",
    name: "Heat-Risk App Alerts & Medical Dispatch",
    category: "health",
    description: "Push smart thermal alerts via ticket app when temperature hits 90°F, prompting people to hydrate, while pre-positioning mobile paramedical cycles.",
    energySavings: 0,
    waterSavings: 0,
    wasteReduction: 0,
    healthAdmissionAvoided: 15,
    co2Reduction: 0,
    costEstimate: "Low",
    feasibilityScore: 90
  }
];

// High-fidelity heuristic simulator of World Cup Match resource and public health tension
export function simulateScenario(
  city: HostCity,
  crowdMode: "group" | "quarter" | "final",
  tempF: number,
  activeInterventions: Intervention[]
): SimulationResult {
  // 1. Crowd metrics multipliers
  const crowdFactor = crowdMode === "final" ? 1.25 : crowdMode === "quarter" ? 1.05 : 0.85;
  const matchAttendance = Math.round(city.capacity * crowdFactor);
  
  // 2. Weather/Temperature multipliers
  // Baseline temperature is 75. Every degree above adds cooling stress and water stress.
  const tempExcess = Math.max(0, tempF - 75);
  const weatherEnergyMultiplier = 1 + (tempExcess * 0.045); // AC cools much harder
  const weatherWaterMultiplier = 1 + (tempExcess * 0.06); // Spectators drink much more, irrigation spikes

  // 3. Baselines before intervention
  // Base energy: 3.5 kWh per spectator (including stadium, district hotels, fanzones, and direct transit)
  const baseEnergy = (matchAttendance * 3.5) / 1000; // in MWh
  // Base water: 30 liters per spectator + 600 kL static pitch irrigation
  const baseWater = ((matchAttendance * 30) / 1000) + 600; // in kL
  // Base waste: 0.7 kg of trash per spectator
  const baseWaste = (matchAttendance * 0.7) / 1000; // in Tons
  // Base transit ridership: depends on the city's transit score
  const baseTransitShare = city.publicTransitScore; // % baseline ridership
  // Base heat admissions: based on temperature and crowd. High thermal islands amplify.
  const uhiModifier = city.uhiRisk === "Very High" ? 1.5 : city.uhiRisk === "High" ? 1.3 : city.uhiRisk === "Medium-High" ? 1.15 : 1.0;
  
  // Formula for baseline admissions: if temp > 80, admissions start growing exponentially
  let baseAdmissions = 0;
  if (tempF > 80) {
    baseAdmissions = Math.pow(tempF - 80, 1.45) * (matchAttendance / 15000) * uhiModifier * 0.45;
  } else {
    baseAdmissions = (matchAttendance / 30000) * 0.5; // low baseline dehydration/falls
  }
  
  // 4. Compute accumulated interventions
  let energySavings = 0;
  let waterSavings = 0;
  let wasteSavings = 0;
  let carbonReduction = 0;
  let healthAdmissionAvoided = 0;
  let transitBoost = 0;

  activeInterventions.forEach(policy => {
    // scale policy impacts with crowd size
    const scale = crowdFactor;
    energySavings += policy.energySavings * scale;
    waterSavings += policy.waterSavings * scale;
    wasteSavings += policy.wasteReduction * scale;
    carbonReduction += policy.co2Reduction * scale;
    healthAdmissionAvoided += policy.healthAdmissionAvoided * (tempExcess > 0 ? (tempExcess / 10) : 1);
    
    if (policy.id === "transit_subsidies") {
      transitBoost = (100 - baseTransitShare) * 0.65; // Boosts transit share dramatically
    }
  });

  // Apply savings ensuring we don't go below physical minimums
  const finalEnergy = Math.max(50, (baseEnergy * weatherEnergyMultiplier) - energySavings);
  const finalWater = Math.max(100, (baseWater * weatherWaterMultiplier) - waterSavings);
  const finalWaste = Math.max(5, baseWaste - wasteSavings);
  const finalWasteToLandfill = Math.max(0, finalWaste * (activeInterventions.some(i => i.id === "compost_mandate") ? 0.2 : 0.85));
  const finalTransit = Math.min(95, baseTransitShare + transitBoost);
  
  // Public Health Admissions computation
  const mitigatedAdmissions = Math.max(2, baseAdmissions - healthAdmissionAvoided);
  
  // Food local percentage
  const isLocalFoodActive = activeInterventions.some(i => i.id === "local_sourcing");
  const localFoodPercentage = isLocalFoodActive ? 75 : 12;

  // Hospital Capacity Utilization
  // Say regional host hospitals have 450 general emergency beds. World cup adds load.
  const regionalEmergencyBeds = 400;
  const normalOccupancyBeds = regionalEmergencyBeds * 0.70; // 70% standard load
  const finalOccupancy = Math.min(100, ((normalOccupancyBeds + mitigatedAdmissions) / regionalEmergencyBeds) * 100);

  // Carbon Footprint calculations
  // Energy: ~0.4 MT CO2 per MWh. Waste to Landfill: ~1.2 MT CO2 per Ton. Transit saving is already factored in.
  const baseCarbon = (finalEnergy * 0.38) + (finalWasteToLandfill * 0.9) + (finalWater * 0.002);
  const finalCarbon = Math.max(15, baseCarbon - carbonReduction);

  // Nexus Tension Score: compound indicator from 0-100 indicating resource stress
  const energyTension = (finalEnergy / (city.capacity * 6 / 1000)) * 50;
  const waterTension = (finalWater / 2000) * 50;
  const temperatureTension = tempExcess * 2.5;
  const rawNexusStress = (energyTension + waterTension + temperatureTension) / 3;
  // Reduce tension based on count of active interventions
  const activeInterventionDiscount = activeInterventions.length * 6;
  const finalNexusStress = Math.min(100, Math.max(10, Math.round(rawNexusStress - activeInterventionDiscount)));

  return {
    energyUsage: Math.round(finalEnergy),
    waterUsage: Math.round(finalWater),
    foodSourced: localFoodPercentage,
    wasteGenerated: Math.round(finalWaste),
    wasteToLandfill: Math.round(finalWasteToLandfill),
    transitShare: Math.round(finalTransit),
    publicHealthAdmissions: Math.round(mitigatedAdmissions),
    hospitalOccupancy: Math.round(finalOccupancy),
    nexusStressScore: finalNexusStress,
    carbonFootprint: Math.round(finalCarbon)
  };
}
