export interface HostCity {
  id: string;
  name: string;
  state: string;
  stadium: string;
  capacity: number;
  buildYear: number;
  uhiRisk: "Low" | "Medium" | "Medium-High" | "High" | "Very High";
  avgSummerTemp: number;
  publicTransitScore: number;
  coordinates: { x: number; y: number }; // Relative coordinates for our vector SVG map
  coordinatesDistrict: {
    stadium: { x: number; y: number };
    fanZone: { x: number; y: number };
    hotelCorridor: { x: number; y: number };
    transitHub: { x: number; y: number };
    hospital: { x: number; y: number };
  };
}

export interface Intervention {
  id: string;
  name: string;
  category: "energy" | "food-water" | "waste" | "health";
  description: string;
  energySavings: number; // in MWh/day
  waterSavings: number; // in kL/day
  wasteReduction: number; // in Tons/day
  healthAdmissionAvoided: number; // cases prevented
  co2Reduction: number; // metric tons CO2
  costEstimate: "Low" | "Medium" | "High";
  feasibilityScore: number; // 0-100
}

export interface SimulationResult {
  energyUsage: number;
  waterUsage: number;
  foodSourced: number; // Tons of locally sourced
  wasteGenerated: number;
  wasteToLandfill: number;
  transitShare: number; // % public transit ridership
  publicHealthAdmissions: number;
  hospitalOccupancy: number; // % hospital occupancy
  nexusStressScore: number; // 0-100 overall stress
  carbonFootprint: number; // metric tons of CO2 equivalent
}

export interface GeminiAnalysis {
  isMock?: boolean;
  riskLevel: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  nexusTension: string;
  analysis: string;
  interventions: Array<{
    title: string;
    description: string;
    feasibility: string;
    impact: string;
  }>;
}

export interface UnleashSolution {
  isMock?: boolean;
  errorDetails?: string;
  solutionName: string;
  impactScore: number;
  feasibilityScore: number;
  nexusMultiplier: string;
  strengths: string[];
  improvements: string[];
  feedback: string;
}
