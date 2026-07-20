import React from "react";
import { HostCity, Intervention, SimulationResult } from "../types";
import { HeartPulse, Activity, ShieldAlert, ThermometerSun, CheckCircle } from "lucide-react";
import LiveMapsExplorer from "./LiveMapsExplorer";

interface HealthBuiltEnvComparisonProps {
  cityA: HostCity;
  cityB: HostCity;
  simulationA: SimulationResult;
  simulationB: SimulationResult;
  activePolicies: Intervention[];
  onTogglePolicy: (policy: Intervention) => void;
  temperatureA: number;
  temperatureB: number;
}

export default function HealthBuiltEnvComparison({
  cityA,
  cityB,
  simulationA,
  simulationB,
  activePolicies,
  onTogglePolicy,
  temperatureA,
  temperatureB,
}: HealthBuiltEnvComparisonProps) {
  const isCoolPavingActive = activePolicies.some((p) => p.id === "thermal_paving");
  const isHydrationActive = activePolicies.some((p) => p.id === "cooling_hubs");

  // Temperature adjustment factor per district based on UHI and policies
  const getDistrictTemp = (baseTemp: number, baseUhi: number) => {
    let temp = baseTemp + baseUhi;
    if (isCoolPavingActive) temp -= 4; // Cool pavement coating lowers UHI
    if (isHydrationActive) temp -= 2; // Hydration cooling effect
    return Math.round(temp);
  };

  const stadiumTempA = getDistrictTemp(temperatureA, 5);
  const fanZoneTempA = getDistrictTemp(temperatureA, 3);
  const transitTempA = getDistrictTemp(temperatureA, 4);
  const hotelTempA = getDistrictTemp(temperatureA, 1);
  const hospitalTempA = getDistrictTemp(temperatureA, 0);

  const stadiumTempB = getDistrictTemp(temperatureB, 5);
  const fanZoneTempB = getDistrictTemp(temperatureB, 3);
  const transitTempB = getDistrictTemp(temperatureB, 4);
  const hotelTempB = getDistrictTemp(temperatureB, 1);
  const hospitalTempB = getDistrictTemp(temperatureB, 0);

  // Dynamic heat coloring for the comparison grids
  const getThermalBg = (temp: number) => {
    if (temp >= 105) return "bg-red-500/15 border-red-500/30 text-red-400";
    if (temp >= 95) return "bg-orange-500/15 border-orange-500/30 text-orange-400";
    if (temp >= 85) return "bg-amber-500/15 border-amber-500/30 text-amber-400";
    return "bg-emerald-500/15 border-emerald-500/30 text-emerald-400";
  };

  return (
    <div className="space-y-6" id="health-comparison-container">
      {/* Intro overview */}
      <div className="bg-[#16191F] border border-white/10 rounded p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-md">
        <div>
          <h3 className="text-xs font-sans font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-rose-400" />
            Track 3: Side-by-Side Public Health & Heat Comparison
          </h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Examine and contrast how regional urban heat islands (UHI), crowd densities, and hospital capacities respond to severe ambient stress simultaneously.
          </p>
        </div>
      </div>

      {/* Main Comparative Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* City A: Public Health */}
        <div className="bg-[#16191F] border border-emerald-500/15 rounded p-5 space-y-6 relative overflow-hidden" id="health-comp-city-a">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <div>
              <span className="text-[8px] font-mono uppercase tracking-widest text-emerald-400 font-bold">NODE SLOT A</span>
              <h4 className="text-base font-sans font-extrabold text-white">{cityA.name}</h4>
              <p className="text-[10px] text-slate-400 font-mono">{cityA.uhiRisk} UHI Risk • Transit Score: {cityA.publicTransitScore}/100</p>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-1 text-[10px] font-mono font-bold rounded">
              {temperatureA}°F Ambient
            </div>
          </div>

          {/* Predictive Admissions Model */}
          <div className="space-y-3.5">
            <h5 className="text-xs font-sans font-bold uppercase tracking-wide text-white flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-400" />
              Admissions Analysis
            </h5>

            <div className="p-4 rounded border border-emerald-500/15 bg-[#1A1E26] flex items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[8px] uppercase font-mono font-bold text-slate-400 tracking-wider block">Predicted Emergency Cases</span>
                <div className="text-lg font-mono font-bold text-emerald-400">{simulationA.publicHealthAdmissions} cases/day</div>
                <span className="text-[9px] font-sans text-slate-500 block mt-0.5">Based on microclimate exposure curves</span>
              </div>
              <div className="bg-emerald-500/10 text-emerald-400 p-2 rounded border border-emerald-500/25 shrink-0">
                <ShieldAlert className="w-4.5 h-4.5" />
              </div>
            </div>

            {/* Hospital Occupancy Load */}
            <div className="space-y-2 bg-[#1A1E26] border border-white/5 p-4 rounded">
              <div className="flex justify-between text-xs font-sans">
                <span className="text-slate-400 font-medium font-sans">ER Capacity Load</span>
                <span className={`font-mono font-bold ${simulationA.hospitalOccupancy > 90 ? "text-red-400" : "text-emerald-400"}`}>
                  {simulationA.hospitalOccupancy}% ({Math.round(400 * (simulationA.hospitalOccupancy / 100))}/400 Beds)
                </span>
              </div>
              <div className="w-full bg-[#0F1115] h-2 rounded overflow-hidden">
                <div
                  className={`h-full rounded transition-all duration-500 ${
                    simulationA.hospitalOccupancy > 90 ? "bg-red-500" : simulationA.hospitalOccupancy > 75 ? "bg-amber-400" : "bg-emerald-400"
                  }`}
                  style={{ width: `${simulationA.hospitalOccupancy}%` }}
                />
              </div>
              <div className="flex justify-between text-[8px] text-slate-500 font-mono uppercase">
                <span>70% Base Load</span>
                <span>Peak Load</span>
                <span>100% Cap</span>
              </div>
            </div>

            {/* Public Transit Share */}
            <div className="space-y-2 bg-[#1A1E26] border border-white/5 p-4 rounded">
              <div className="flex justify-between text-xs font-sans">
                <span className="text-slate-400 font-medium font-sans">Transit Share (Mitigates Congestion)</span>
                <span className="font-mono font-bold text-emerald-400">{simulationA.transitShare}% share</span>
              </div>
              <div className="w-full bg-[#0F1115] h-2 rounded overflow-hidden">
                <div
                  className="h-full rounded bg-emerald-400"
                  style={{ width: `${simulationA.transitShare}%` }}
                />
              </div>
            </div>
          </div>

          {/* Microclimate District UHI Temperatures */}
          <div className="space-y-3">
            <h5 className="text-xs font-sans font-bold uppercase tracking-wide text-white flex items-center gap-1.5">
              <ThermometerSun className="w-4 h-4 text-emerald-400" />
              Microclimate District Temperatures
            </h5>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center font-mono">
              <div className={`p-2 rounded border ${getThermalBg(stadiumTempA)}`}>
                <span className="block text-[7px] uppercase font-bold text-slate-400">Stadium</span>
                <span className="block text-xs font-bold mt-1">{stadiumTempA}°F</span>
              </div>
              <div className={`p-2 rounded border ${getThermalBg(fanZoneTempA)}`}>
                <span className="block text-[7px] uppercase font-bold text-slate-400">Fan Fest</span>
                <span className="block text-xs font-bold mt-1">{fanZoneTempA}°F</span>
              </div>
              <div className={`p-2 rounded border ${getThermalBg(transitTempA)}`}>
                <span className="block text-[7px] uppercase font-bold text-slate-400">Transit</span>
                <span className="block text-xs font-bold mt-1">{transitTempA}°F</span>
              </div>
              <div className={`p-2 rounded border ${getThermalBg(hotelTempA)}`}>
                <span className="block text-[7px] uppercase font-bold text-slate-400">Hotels</span>
                <span className="block text-xs font-bold mt-1">{hotelTempA}°F</span>
              </div>
              <div className={`p-2 rounded border ${getThermalBg(hospitalTempA)} col-span-2 sm:col-span-1`}>
                <span className="block text-[7px] uppercase font-bold text-slate-400">Hospital</span>
                <span className="block text-xs font-bold mt-1">{hospitalTempA}°F</span>
              </div>
            </div>
          </div>
        </div>

        {/* City B: Public Health */}
        <div className="bg-[#16191F] border border-[#f43f5e]/15 rounded p-5 space-y-6 relative overflow-hidden" id="health-comp-city-b">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />

          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <div>
              <span className="text-[8px] font-mono uppercase tracking-widest text-rose-400 font-bold">NODE SLOT B</span>
              <h4 className="text-base font-sans font-extrabold text-white">{cityB.name}</h4>
              <p className="text-[10px] text-slate-400 font-mono">{cityB.uhiRisk} UHI Risk • Transit Score: {cityB.publicTransitScore}/100</p>
            </div>
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-2.5 py-1 text-[10px] font-mono font-bold rounded">
              {temperatureB}°F Ambient
            </div>
          </div>

          {/* Predictive Admissions Model */}
          <div className="space-y-3.5">
            <h5 className="text-xs font-sans font-bold uppercase tracking-wide text-white flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-rose-400" />
              Admissions Analysis
            </h5>

            <div className="p-4 rounded border border-rose-500/15 bg-[#1A1E26] flex items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[8px] uppercase font-mono font-bold text-slate-400 tracking-wider block">Predicted Emergency Cases</span>
                <div className="text-lg font-mono font-bold text-rose-400">{simulationB.publicHealthAdmissions} cases/day</div>
                <span className="text-[9px] font-sans text-slate-500 block mt-0.5">Based on microclimate exposure curves</span>
              </div>
              <div className="bg-rose-500/10 text-rose-400 p-2 rounded border border-rose-500/25 shrink-0">
                <ShieldAlert className="w-4.5 h-4.5" />
              </div>
            </div>

            {/* Hospital Occupancy Load */}
            <div className="space-y-2 bg-[#1A1E26] border border-white/5 p-4 rounded">
              <div className="flex justify-between text-xs font-sans">
                <span className="text-slate-400 font-medium font-sans">ER Capacity Load</span>
                <span className={`font-mono font-bold ${simulationB.hospitalOccupancy > 90 ? "text-red-400" : "text-rose-400"}`}>
                  {simulationB.hospitalOccupancy}% ({Math.round(400 * (simulationB.hospitalOccupancy / 100))}/400 Beds)
                </span>
              </div>
              <div className="w-full bg-[#0F1115] h-2 rounded overflow-hidden">
                <div
                  className={`h-full rounded transition-all duration-500 ${
                    simulationB.hospitalOccupancy > 90 ? "bg-red-500" : simulationB.hospitalOccupancy > 75 ? "bg-amber-400" : "bg-rose-500"
                  }`}
                  style={{ width: `${simulationB.hospitalOccupancy}%` }}
                />
              </div>
              <div className="flex justify-between text-[8px] text-slate-500 font-mono uppercase">
                <span>70% Base Load</span>
                <span>Peak Load</span>
                <span>100% Cap</span>
              </div>
            </div>

            {/* Public Transit Share */}
            <div className="space-y-2 bg-[#1A1E26] border border-white/5 p-4 rounded">
              <div className="flex justify-between text-xs font-sans">
                <span className="text-slate-400 font-medium font-sans">Transit Share (Mitigates Congestion)</span>
                <span className="font-mono font-bold text-rose-400">{simulationB.transitShare}% share</span>
              </div>
              <div className="w-full bg-[#0F1115] h-2 rounded overflow-hidden">
                <div
                  className="h-full rounded bg-rose-500"
                  style={{ width: `${simulationB.transitShare}%` }}
                />
              </div>
            </div>
          </div>

          {/* Microclimate District UHI Temperatures */}
          <div className="space-y-3">
            <h5 className="text-xs font-sans font-bold uppercase tracking-wide text-white flex items-center gap-1.5">
              <ThermometerSun className="w-4 h-4 text-rose-400" />
              Microclimate District Temperatures
            </h5>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center font-mono">
              <div className={`p-2 rounded border ${getThermalBg(stadiumTempB)}`}>
                <span className="block text-[7px] uppercase font-bold text-slate-400">Stadium</span>
                <span className="block text-xs font-bold mt-1">{stadiumTempB}°F</span>
              </div>
              <div className={`p-2 rounded border ${getThermalBg(fanZoneTempB)}`}>
                <span className="block text-[7px] uppercase font-bold text-slate-400">Fan Fest</span>
                <span className="block text-xs font-bold mt-1">{fanZoneTempB}°F</span>
              </div>
              <div className={`p-2 rounded border ${getThermalBg(transitTempB)}`}>
                <span className="block text-[7px] uppercase font-bold text-slate-400">Transit</span>
                <span className="block text-xs font-bold mt-1">{transitTempB}°F</span>
              </div>
              <div className={`p-2 rounded border ${getThermalBg(hotelTempB)}`}>
                <span className="block text-[7px] uppercase font-bold text-slate-400">Hotels</span>
                <span className="block text-xs font-bold mt-1">{hotelTempB}°F</span>
              </div>
              <div className={`p-2 rounded border ${getThermalBg(hospitalTempB)} col-span-2 sm:col-span-1`}>
                <span className="block text-[7px] uppercase font-bold text-slate-400">Hospital</span>
                <span className="block text-xs font-bold mt-1">{hospitalTempB}°F</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Joint Health Interventions Selector */}
      <div className="bg-[#16191F] border border-white/10 rounded p-4 space-y-4 shadow-md" id="health-comp-policies">
        <h4 className="text-xs font-sans font-bold uppercase tracking-wide text-white">Local Public Health Protocols Comparison</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Cooling bus / misting corridor */}
          <button
            onClick={() =>
              onTogglePolicy({
                id: "cooling_hubs",
                name: "Hydration Hubs & Misting Corridors",
                category: "health",
                description: "Set up high-flow, shaded drinking water kiosks and automated micro-mist zones",
                energySavings: -12,
                waterSavings: -350,
                wasteReduction: 0,
                healthAdmissionAvoided: 24,
                co2Reduction: -2,
                costEstimate: "Low",
                feasibilityScore: 98,
              })
            }
            className={`w-full text-left p-3.5 rounded text-xs flex justify-between items-center transition-all border ${
              activePolicies.some((p) => p.id === "cooling_hubs")
                ? "bg-[#1A1E26] border-blue-500/80 text-white shadow-sm ring-1 ring-blue-500/10 shadow-[0_0_6px_rgba(59,130,246,0.1)]"
                : "bg-[#1A1E26]/50 border-white/5 text-slate-400 hover:border-white/10 hover:bg-[#222731]"
            }`}
          >
            <div>
              <div className="font-bold text-white font-sans text-xs">Hydration Hubs & Misting Corridors</div>
              <div className="text-[10px] text-slate-500 mt-0.5">High-impact heat exhaustion mitigation</div>
            </div>
            <span
              className={`text-[8px] font-mono font-bold uppercase px-2 py-0.5 rounded border shrink-0 ml-2 ${
                activePolicies.some((p) => p.id === "cooling_hubs")
                  ? "bg-blue-500/15 text-blue-400 border-blue-500/20"
                  : "bg-white/5 text-slate-500 border-transparent"
              }`}
            >
              {activePolicies.some((p) => p.id === "cooling_hubs") ? "Active" : "Deploy"}
            </span>
          </button>

          {/* Thermal pavement coating */}
          <button
            onClick={() =>
              onTogglePolicy({
                id: "thermal_paving",
                name: "Cool Pavement Coatings & Shade Canopies",
                category: "health",
                description: "Apply highly reflective coatings on parking lots and plazas and construct solar shading covers",
                energySavings: 15,
                waterSavings: 0,
                wasteReduction: 0,
                healthAdmissionAvoided: 18,
                co2Reduction: 12,
                costEstimate: "High",
                feasibilityScore: 65,
              })
            }
            className={`w-full text-left p-3.5 rounded text-xs flex justify-between items-center transition-all border ${
              activePolicies.some((p) => p.id === "thermal_paving")
                ? "bg-[#1A1E26] border-purple-500/80 text-white shadow-sm ring-1 ring-purple-500/10 shadow-[0_0_6px_rgba(168,85,247,0.1)]"
                : "bg-[#1A1E26]/50 border-white/5 text-slate-400 hover:border-white/10 hover:bg-[#222731]"
            }`}
          >
            <div>
              <div className="font-bold text-white font-sans text-xs">Cool Pavement Coatings & Solar Shade</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Reduces regional concrete UHI anomalies</div>
            </div>
            <span
              className={`text-[8px] font-mono font-bold uppercase px-2 py-0.5 rounded border shrink-0 ml-2 ${
                activePolicies.some((p) => p.id === "thermal_paving")
                  ? "bg-purple-500/15 text-purple-400 border-purple-500/20"
                  : "bg-white/5 text-slate-500 border-transparent"
              }`}
            >
              {activePolicies.some((p) => p.id === "thermal_paving") ? "Active" : "Deploy"}
            </span>
          </button>
        </div>
      </div>

      {/* Comparative Live Maps Grounding Exploration Section */}
      <div className="border-t border-white/10 pt-6 space-y-4">
        <h4 className="text-xs font-sans font-extrabold text-slate-100 uppercase tracking-widest flex items-center gap-2">
          <ThermometerSun className="w-4 h-4 text-amber-500" />
          Comparative Safe Haven GIS Analytics
        </h4>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="space-y-3">
            <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider block bg-emerald-500/5 border border-emerald-500/10 px-3 py-1.5 rounded-md">
              LOCATIONAL NODE A: {cityA.name} ({cityA.stadium})
            </span>
            <LiveMapsExplorer selectedCity={cityA} />
          </div>
          <div className="space-y-3">
            <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider block bg-cyan-500/5 border border-cyan-500/10 px-3 py-1.5 rounded-md">
              LOCATIONAL NODE B: {cityB.name} ({cityB.stadium})
            </span>
            <LiveMapsExplorer selectedCity={cityB} />
          </div>
        </div>
      </div>
    </div>
  );
}
