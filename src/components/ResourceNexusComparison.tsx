import React from "react";
import { HostCity, Intervention, SimulationResult } from "../types";
import { INTERVENTIONS } from "../data/cities";
import { Zap, Droplets, Trash2, Leaf, Sparkles, CheckCircle } from "lucide-react";

interface ResourceNexusComparisonProps {
  cityA: HostCity;
  cityB: HostCity;
  simulationA: SimulationResult;
  simulationB: SimulationResult;
  activePolicies: Intervention[];
  onTogglePolicy: (policy: Intervention) => void;
  temperatureA: number;
  temperatureB: number;
}

export default function ResourceNexusComparison({
  cityA,
  cityB,
  simulationA,
  simulationB,
  activePolicies,
  onTogglePolicy,
  temperatureA,
  temperatureB,
}: ResourceNexusComparisonProps) {
  // Compute baselines for both cities to calculate and compare savings
  const getBaselines = (city: HostCity, temp: number) => {
    const matchAttendance = city.capacity;
    const tempExcess = Math.max(0, temp - 75);
    const baselineEnergy = Math.round(((matchAttendance * 3.5) / 1000) * (1 + (tempExcess * 0.045)));
    const baselineWater = Math.round((((matchAttendance * 30) / 1000) + 600) * (1 + (tempExcess * 0.06)));
    const baselineWaste = Math.round((matchAttendance * 0.7) / 1000);
    const baselineCO2 = Math.round((baselineEnergy * 0.38) + (baselineWaste * 0.9 * 0.85) + (baselineWater * 0.002));
    return { baselineEnergy, baselineWater, baselineWaste, baselineCO2 };
  };

  const baseA = getBaselines(cityA, temperatureA);
  const baseB = getBaselines(cityB, temperatureB);

  const energySavedA = Math.max(0, baseA.baselineEnergy - simulationA.energyUsage);
  const energySavedB = Math.max(0, baseB.baselineEnergy - simulationB.energyUsage);

  const waterSavedA = Math.max(0, baseA.baselineWater - simulationA.waterUsage);
  const waterSavedB = Math.max(0, baseB.baselineWater - simulationB.waterUsage);

  const carbonSavedA = Math.max(0, baseA.baselineCO2 - simulationA.carbonFootprint);
  const carbonSavedB = Math.max(0, baseB.baselineCO2 - simulationB.carbonFootprint);

  return (
    <div className="space-y-6" id="nexus-comparison-container">
      {/* Dual City Header Overview */}
      <div className="bg-[#16191F] border border-white/10 rounded p-5 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-xs font-sans font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
            <Leaf className="w-4 h-4 text-emerald-400" />
            Track 2: Side-by-Side Energy-Food-Water Nexus Comparison
          </h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Simultaneously compare resource stress metrics, emissions profiles, and intervention efficacy under different microclimate parameters.
          </p>
        </div>

        {/* Dual Nexus Stress Indicators */}
        <div className="flex gap-4 items-center self-stretch md:self-auto">
          {/* City A Stress */}
          <div className="flex-1 md:flex-initial flex items-center gap-2.5 bg-[#1A1E26] px-3.5 py-1.5 rounded border border-emerald-500/20">
            <div className="text-right">
              <span className="text-[7px] font-mono text-emerald-400 font-extrabold uppercase tracking-widest block">City A: {cityA.name}</span>
              <span className={`text-[11px] font-mono font-bold ${
                simulationA.nexusStressScore > 75 ? "text-red-400" : simulationA.nexusStressScore > 50 ? "text-amber-400" : "text-emerald-400"
              }`}>
                Stress: {simulationA.nexusStressScore}%
              </span>
            </div>
            <div className="w-8 h-8 relative flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="16" cy="16" r="12" stroke="rgba(255,255,255,0.05)" strokeWidth="2" fill="transparent" />
                <circle
                  cx="16"
                  cy="16"
                  r="12"
                  stroke={simulationA.nexusStressScore > 75 ? "#f87171" : simulationA.nexusStressScore > 50 ? "#fbbf24" : "#10b981"}
                  strokeWidth="2.5"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 12}
                  strokeDashoffset={2 * Math.PI * 12 * (1 - simulationA.nexusStressScore / 100)}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-[8px] font-mono font-bold text-slate-200">{simulationA.nexusStressScore}</span>
            </div>
          </div>

          {/* City B Stress */}
          <div className="flex-1 md:flex-initial flex items-center gap-2.5 bg-[#1A1E26] px-3.5 py-1.5 rounded border border-rose-500/20">
            <div className="text-right">
              <span className="text-[7px] font-mono text-rose-400 font-extrabold uppercase tracking-widest block">City B: {cityB.name}</span>
              <span className={`text-[11px] font-mono font-bold ${
                simulationB.nexusStressScore > 75 ? "text-red-400" : simulationB.nexusStressScore > 50 ? "text-amber-400" : "text-rose-400"
              }`}>
                Stress: {simulationB.nexusStressScore}%
              </span>
            </div>
            <div className="w-8 h-8 relative flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="16" cy="16" r="12" stroke="rgba(255,255,255,0.05)" strokeWidth="2" fill="transparent" />
                <circle
                  cx="16"
                  cy="16"
                  r="12"
                  stroke={simulationB.nexusStressScore > 75 ? "#f87171" : simulationB.nexusStressScore > 50 ? "#fbbf24" : "#f43f5e"}
                  strokeWidth="2.5"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 12}
                  strokeDashoffset={2 * Math.PI * 12 * (1 - simulationB.nexusStressScore / 100)}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-[8px] font-mono font-bold text-slate-200">{simulationB.nexusStressScore}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Dual Column Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* City A column */}
        <div className="bg-[#16191F] border border-[#10b981]/15 rounded p-5 space-y-6 relative overflow-hidden" id="nexus-comp-city-a">
          {/* subtle background hue */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <div>
              <span className="text-[8px] font-mono uppercase tracking-widest text-emerald-400 font-bold">NODE SLOT A</span>
              <h4 className="text-base font-sans font-extrabold text-white">{cityA.name}</h4>
              <p className="text-[10px] text-slate-400 font-mono">{cityA.stadium} • {cityA.capacity.toLocaleString()} seats</p>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-1 text-[10px] font-mono font-bold rounded">
              {temperatureA}°F Ambient
            </div>
          </div>

          {/* Energy usage card inside City A */}
          <div className="bg-[#1A1E26] border border-white/5 p-4 rounded space-y-3">
            <div className="flex justify-between items-start">
              <span className="flex items-center gap-1.5 text-xs text-slate-300 font-sans font-bold">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Grid Electrical Footprint
              </span>
              {energySavedA > 0 && (
                <span className="bg-emerald-500/10 text-emerald-400 text-[9px] font-mono px-1.5 py-0.5 rounded font-bold">
                  -{energySavedA} MWh saved
                </span>
              )}
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Simulation Value</span>
                <span className="font-bold text-white">{simulationA.energyUsage} MWh</span>
              </div>
              <div className="w-full bg-[#0F1115] h-2 rounded overflow-hidden">
                <div
                  className="bg-amber-400 h-full rounded shadow-[0_0_6px_rgba(245,158,11,0.4)]"
                  style={{ width: `${Math.min(100, (simulationA.energyUsage / 500) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[8px] text-slate-500 font-mono">
                <span>Baseline: {baseA.baselineEnergy} MWh</span>
                <span>500 MWh Max</span>
              </div>
            </div>
          </div>

          {/* Water usage card inside City A */}
          <div className="bg-[#1A1E26] border border-white/5 p-4 rounded space-y-3">
            <div className="flex justify-between items-start">
              <span className="flex items-center gap-1.5 text-xs text-slate-300 font-sans font-bold">
                <Droplets className="w-3.5 h-3.5 text-blue-400" />
                Water & Irrigation
              </span>
              {waterSavedA > 0 && (
                <span className="bg-emerald-500/10 text-emerald-400 text-[9px] font-mono px-1.5 py-0.5 rounded font-bold">
                  -{waterSavedA} kL saved
                </span>
              )}
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Simulation Value</span>
                <span className="font-bold text-white">{simulationA.waterUsage} kL</span>
              </div>
              <div className="w-full bg-[#0F1115] h-2 rounded overflow-hidden">
                <div
                  className="bg-blue-400 h-full rounded shadow-[0_0_6px_rgba(59,130,246,0.4)]"
                  style={{ width: `${Math.min(100, (simulationA.waterUsage / 4000) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[8px] text-slate-500 font-mono">
                <span>Baseline: {baseA.baselineWater} kL</span>
                <span>4,000 kL Max</span>
              </div>
            </div>
          </div>

          {/* Solid Waste details */}
          <div className="bg-[#1A1E26] border border-white/5 p-4 rounded space-y-3">
            <span className="flex items-center gap-1.5 text-xs text-slate-300 font-sans font-bold">
              <Trash2 className="w-3.5 h-3.5 text-emerald-400" />
              Municipal Solid Waste
            </span>
            <div className="grid grid-cols-2 gap-2 text-center font-mono text-xs">
              <div className="bg-[#0F1115] p-2 rounded border border-white/5">
                <span className="text-[8px] text-slate-500 block">TO LANDFILL</span>
                <span className="font-bold text-slate-200 block mt-0.5">{simulationA.wasteToLandfill} Tons</span>
              </div>
              <div className="bg-[#0F1115] p-2 rounded border border-emerald-500/10">
                <span className="text-[8px] text-emerald-400 block">RECOVERED / DIVERTED</span>
                <span className="font-bold text-emerald-400 block mt-0.5">{simulationA.wasteGenerated - simulationA.wasteToLandfill} Tons</span>
              </div>
            </div>
          </div>

          {/* Summary Carbon metrics */}
          <div className="bg-[#1A1E26]/50 border border-emerald-500/10 rounded p-4 flex justify-between items-center">
            <div className="space-y-0.5">
              <span className="text-[8px] font-mono text-slate-500 uppercase block">CARBON INTENSITY</span>
              <span className="text-sm font-sans font-bold text-white">CO₂e footprint</span>
            </div>
            <div className="text-right font-mono">
              <span className="text-base font-bold text-emerald-400">{simulationA.carbonFootprint} MT</span>
              <span className="text-[9px] text-slate-500 block">Saved {carbonSavedA} MT CO₂e</span>
            </div>
          </div>
        </div>

        {/* City B column */}
        <div className="bg-[#16191F] border border-[#f43f5e]/15 rounded p-5 space-y-6 relative overflow-hidden" id="nexus-comp-city-b">
          {/* subtle background hue */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />

          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <div>
              <span className="text-[8px] font-mono uppercase tracking-widest text-rose-400 font-bold">NODE SLOT B</span>
              <h4 className="text-base font-sans font-extrabold text-white">{cityB.name}</h4>
              <p className="text-[10px] text-slate-400 font-mono">{cityB.stadium} • {cityB.capacity.toLocaleString()} seats</p>
            </div>
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-2.5 py-1 text-[10px] font-mono font-bold rounded">
              {temperatureB}°F Ambient
            </div>
          </div>

          {/* Energy usage card inside City B */}
          <div className="bg-[#1A1E26] border border-white/5 p-4 rounded space-y-3">
            <div className="flex justify-between items-start">
              <span className="flex items-center gap-1.5 text-xs text-slate-300 font-sans font-bold">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Grid Electrical Footprint
              </span>
              {energySavedB > 0 && (
                <span className="bg-rose-500/10 text-rose-400 text-[9px] font-mono px-1.5 py-0.5 rounded font-bold">
                  -{energySavedB} MWh saved
                </span>
              )}
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Simulation Value</span>
                <span className="font-bold text-white">{simulationB.energyUsage} MWh</span>
              </div>
              <div className="w-full bg-[#0F1115] h-2 rounded overflow-hidden">
                <div
                  className="bg-amber-400 h-full rounded shadow-[0_0_6px_rgba(245,158,11,0.4)]"
                  style={{ width: `${Math.min(100, (simulationB.energyUsage / 500) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[8px] text-slate-500 font-mono">
                <span>Baseline: {baseB.baselineEnergy} MWh</span>
                <span>500 MWh Max</span>
              </div>
            </div>
          </div>

          {/* Water usage card inside City B */}
          <div className="bg-[#1A1E26] border border-white/5 p-4 rounded space-y-3">
            <div className="flex justify-between items-start">
              <span className="flex items-center gap-1.5 text-xs text-slate-300 font-sans font-bold">
                <Droplets className="w-3.5 h-3.5 text-blue-400" />
                Water & Irrigation
              </span>
              {waterSavedB > 0 && (
                <span className="bg-rose-500/10 text-rose-400 text-[9px] font-mono px-1.5 py-0.5 rounded font-bold">
                  -{waterSavedB} kL saved
                </span>
              )}
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Simulation Value</span>
                <span className="font-bold text-white">{simulationB.waterUsage} kL</span>
              </div>
              <div className="w-full bg-[#0F1115] h-2 rounded overflow-hidden">
                <div
                  className="bg-blue-400 h-full rounded shadow-[0_0_6px_rgba(59,130,246,0.4)]"
                  style={{ width: `${Math.min(100, (simulationB.waterUsage / 4000) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[8px] text-slate-500 font-mono">
                <span>Baseline: {baseB.baselineWater} kL</span>
                <span>4,000 kL Max</span>
              </div>
            </div>
          </div>

          {/* Solid Waste details */}
          <div className="bg-[#1A1E26] border border-white/5 p-4 rounded space-y-3">
            <span className="flex items-center gap-1.5 text-xs text-slate-300 font-sans font-bold">
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              Municipal Solid Waste
            </span>
            <div className="grid grid-cols-2 gap-2 text-center font-mono text-xs">
              <div className="bg-[#0F1115] p-2 rounded border border-white/5">
                <span className="text-[8px] text-slate-500 block">TO LANDFILL</span>
                <span className="font-bold text-slate-200 block mt-0.5">{simulationB.wasteToLandfill} Tons</span>
              </div>
              <div className="bg-[#0F1115] p-2 rounded border border-rose-500/10">
                <span className="text-[8px] text-rose-400 block">RECOVERED / DIVERTED</span>
                <span className="font-bold text-rose-400 block mt-0.5">{simulationB.wasteGenerated - simulationB.wasteToLandfill} Tons</span>
              </div>
            </div>
          </div>

          {/* Summary Carbon metrics */}
          <div className="bg-[#1A1E26]/50 border border-rose-500/10 rounded p-4 flex justify-between items-center">
            <div className="space-y-0.5">
              <span className="text-[8px] font-mono text-slate-500 uppercase block">CARBON INTENSITY</span>
              <span className="text-sm font-sans font-bold text-white">CO₂e footprint</span>
            </div>
            <div className="text-right font-mono">
              <span className="text-base font-bold text-rose-400">{simulationB.carbonFootprint} MT</span>
              <span className="text-[9px] text-slate-500 block">Saved {carbonSavedB} MT CO₂e</span>
            </div>
          </div>
        </div>
      </div>

      {/* Joint Interventions Policy Dashboard */}
      <div className="bg-[#16191F] border border-white/10 rounded p-5 shadow-lg" id="nexus-comp-policies">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
          <div>
            <h3 className="text-xs font-sans font-extrabold text-white uppercase tracking-wider">Joint Protocol Deployment Matrix</h3>
            <p className="text-xs text-slate-400 mt-0.5">Deploy environmental policies to observe comparative savings scalability across both regions.</p>
          </div>
          <div className="text-[10px] font-mono font-bold text-slate-400 bg-[#1A1E26] px-2 py-1 rounded border border-white/5">
            POLICIES ACTIVE: {activePolicies.length}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {INTERVENTIONS.map((policy) => {
            const isActive = activePolicies.some(p => p.id === policy.id);
            return (
              <button
                key={policy.id}
                id={`comp-policy-btn-${policy.id}`}
                onClick={() => onTogglePolicy(policy)}
                className={`text-left p-3.5 rounded border transition-all duration-200 flex items-start gap-3 focus:outline-none ${
                  isActive
                    ? "bg-[#1A1E26] border-emerald-500/80 text-white shadow-sm ring-1 ring-emerald-500/10"
                    : "bg-[#1A1E26]/50 border-white/5 text-slate-400 hover:border-white/15 hover:bg-[#222731]"
                }`}
              >
                <div className={`mt-0.5 shrink-0 ${isActive ? "text-emerald-400" : "text-slate-600"}`}>
                  {isActive ? <CheckCircle className="w-4 h-4 fill-emerald-500/10" /> : <div className="w-4 h-4 rounded-full border border-slate-600" />}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-sans font-bold text-xs text-white leading-tight">{policy.name}</span>
                    <span className={`text-[8px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                      policy.category === "energy" ? "bg-amber-500/5 text-amber-400 border-amber-500/20" :
                      policy.category === "food-water" ? "bg-blue-500/5 text-blue-400 border-blue-500/20" :
                      policy.category === "waste" ? "bg-emerald-500/5 text-emerald-400 border-emerald-500/20" :
                      "bg-purple-500/5 text-purple-400 border-purple-500/20"
                    }`}>{policy.category}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">{policy.description}</p>
                  
                  {/* Performance Indicators */}
                  <div className="flex items-center gap-2 pt-1 text-[9px] font-mono text-slate-500">
                    <span>CAPEX: {policy.costEstimate}</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-semibold">{policy.feasibilityScore}% FEASIBILITY INDEX</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
