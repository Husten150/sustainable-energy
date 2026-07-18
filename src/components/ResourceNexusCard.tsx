import React from "react";
import { HostCity, Intervention, SimulationResult } from "../types";
import { INTERVENTIONS } from "../data/cities";
import { Zap, Droplets, Trash2, ShieldAlert, CheckCircle, HelpCircle, Leaf, Sparkles } from "lucide-react";

interface ResourceNexusCardProps {
  selectedCity: HostCity;
  activePolicies: Intervention[];
  onTogglePolicy: (policy: Intervention) => void;
  simulation: SimulationResult;
  temperature: number;
}

export default function ResourceNexusCard({
  selectedCity,
  activePolicies,
  onTogglePolicy,
  simulation,
  temperature,
}: ResourceNexusCardProps) {
  // Let's calculate baseline values so we can visualize "Savings"
  const crowdFactor = 1.0; // standard factor for display calculations
  const matchAttendance = selectedCity.capacity;
  const tempExcess = Math.max(0, temperature - 75);
  
  const baselineEnergy = Math.round(((matchAttendance * 3.5) / 1000) * (1 + (tempExcess * 0.045)));
  const baselineWater = Math.round((((matchAttendance * 30) / 1000) + 600) * (1 + (tempExcess * 0.06)));
  const baselineWaste = Math.round((matchAttendance * 0.7) / 1000);
  const baselineCO2 = Math.round((baselineEnergy * 0.38) + (baselineWaste * 0.9 * 0.85) + (baselineWater * 0.002));

  const energySaved = Math.max(0, baselineEnergy - simulation.energyUsage);
  const waterSaved = Math.max(0, baselineWater - simulation.waterUsage);
  const wasteKeptFromLandfill = Math.max(0, baselineWaste - simulation.wasteToLandfill);
  const co2Prevented = Math.max(0, baselineCO2 - simulation.carbonFootprint);

  return (
    <div className="space-y-6" id="resource-nexus-container">
      {/* Overview header */}
      <div className="bg-[#16191F] border border-white/10 rounded p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-md">
        <div>
          <h3 className="text-xs font-sans font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
            <Leaf className="w-4 h-4 text-emerald-400" />
            Track 2: Energy–Food–Water Nexus intelligence
          </h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            FIFA 2026 hosts experience magnified resource dependencies. Intervene to reduce grid stress and close circular loop gaps.
          </p>
        </div>
        
        {/* Dynamic Nexus Stress Gauge */}
        <div className="flex items-center gap-3 bg-[#1A1E26] px-4 py-2 rounded border border-white/10 shadow shrink-0">
          <div className="text-right">
            <span className="text-[8px] font-mono font-bold text-gray-500 uppercase tracking-widest block">Nexus Stress Level</span>
            <span className={`text-xs font-mono font-bold ${
              simulation.nexusStressScore > 75 ? "text-red-400 animate-pulse" :
              simulation.nexusStressScore > 50 ? "text-amber-400" :
              "text-emerald-400"
            }`}>
              {simulation.nexusStressScore}% {simulation.nexusStressScore > 75 ? "CRITICAL" : simulation.nexusStressScore > 50 ? "ELEVATED" : "STABLE"}
            </span>
          </div>
          <div className="w-10 h-10 relative flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="20" cy="20" r="16" stroke="rgba(255,255,255,0.05)" strokeWidth="2.5" fill="transparent" />
              <circle
                cx="20"
                cy="20"
                r="16"
                stroke={simulation.nexusStressScore > 75 ? "#f87171" : simulation.nexusStressScore > 50 ? "#fbbf24" : "#34d399"}
                strokeWidth="3"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 16}
                strokeDashoffset={2 * Math.PI * 16 * (1 - simulation.nexusStressScore / 100)}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>
            <span className="absolute text-[10px] font-mono font-bold text-white">{simulation.nexusStressScore}</span>
          </div>
        </div>
      </div>

      {/* Grid: Footprints and Resource Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Energy Card */}
        <div className="bg-[#16191F] border border-white/10 rounded p-4 space-y-4 shadow-md" id="energy-footprint-card">
          <div className="flex justify-between items-start">
            <div className="bg-amber-500/10 p-2 rounded border border-amber-500/20 text-amber-400">
              <Zap className="w-4 h-4" />
            </div>
            {energySaved > 0 && (
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-1 font-bold">
                <Sparkles className="w-3 h-3" /> Saved {energySaved} MWh
              </span>
            )}
          </div>
          <div>
            <h4 className="text-xs font-sans font-bold uppercase tracking-wide text-white">Grid Electrical footprint</h4>
            <p className="text-[10px] text-slate-500 mt-0.5 font-mono">STADIUM HVAC REFRIGERATION & DISTRICT GRID</p>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono font-medium text-slate-400">
              <span>Simulation Value:</span>
              <span className="font-bold text-white">{simulation.energyUsage} MWh</span>
            </div>
            <div className="w-full bg-[#0F1115] h-2 rounded overflow-hidden relative">
              {/* Baseline shade */}
              <div className="absolute top-0 right-0 h-full bg-amber-500/5" style={{ width: `${Math.min(100, (baselineEnergy / 500) * 100)}%` }}></div>
              {/* Actual bar */}
              <div
                className="bg-amber-400 h-full rounded transition-all duration-500 shadow-[0_0_6px_rgba(245,158,11,0.5)]"
                style={{ width: `${Math.min(100, (simulation.energyUsage / 500) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[9px] text-slate-500 font-mono">
              <span>Eco Target</span>
              <span>Baseline: {baselineEnergy} MWh</span>
              <span>500 MWh Max</span>
            </div>
          </div>
        </div>

        {/* Water Card */}
        <div className="bg-[#16191F] border border-white/10 rounded p-4 space-y-4 shadow-md" id="water-footprint-card">
          <div className="flex justify-between items-start">
            <div className="bg-blue-500/10 p-2 rounded border border-blue-500/20 text-blue-400">
              <Droplets className="w-4 h-4" />
            </div>
            {waterSaved > 0 && (
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-1 font-bold">
                <Sparkles className="w-3 h-3" /> Saved {waterSaved} kL
              </span>
            )}
          </div>
          <div>
            <h4 className="text-xs font-sans font-bold uppercase tracking-wide text-white">Hydration & Irrigation footprint</h4>
            <p className="text-[10px] text-slate-500 mt-0.5 font-mono">POTABLE WATER LOOPS & TURF IRRIGATION</p>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono font-medium text-slate-400">
              <span>Simulation Value:</span>
              <span className="font-bold text-white">{simulation.waterUsage} kL</span>
            </div>
            <div className="w-full bg-[#0F1115] h-2 rounded overflow-hidden relative">
              {/* Baseline shade */}
              <div className="absolute top-0 right-0 h-full bg-blue-500/5" style={{ width: `${Math.min(100, (baselineWater / 4000) * 100)}%` }}></div>
              {/* Actual bar */}
              <div
                className="bg-blue-400 h-full rounded transition-all duration-500 shadow-[0_0_6px_rgba(59,130,246,0.5)]"
                style={{ width: `${Math.min(100, (simulation.waterUsage / 4000) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[9px] text-slate-500 font-mono">
              <span>Eco Target</span>
              <span>Baseline: {baselineWater} kL</span>
              <span>4,000 kL Limit</span>
            </div>
          </div>
        </div>

        {/* Waste Card */}
        <div className="bg-[#16191F] border border-white/10 rounded p-4 space-y-4 shadow-md" id="waste-footprint-card">
          <div className="flex justify-between items-start">
            <div className="bg-emerald-500/10 p-2 rounded border border-emerald-500/20 text-emerald-400">
              <Trash2 className="w-4 h-4" />
            </div>
            {wasteKeptFromLandfill > 0 && (
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-1 font-bold">
                <Sparkles className="w-3 h-3" /> Kept {wasteKeptFromLandfill} Tons out
              </span>
            )}
          </div>
          <div>
            <h4 className="text-xs font-sans font-bold uppercase tracking-wide text-white">Municipal Food & Solid Waste</h4>
            <p className="text-[10px] text-slate-500 mt-0.5 font-mono">CONCESSION WASTE & RECYCLABLES VOLUME</p>
          </div>
          <div className="grid grid-cols-2 gap-2 font-mono">
            <div className="bg-[#1A1E26] rounded border border-white/5 p-2 text-center">
              <span className="text-[9px] text-slate-500 uppercase tracking-wider font-bold">To Landfill</span>
              <span className="block text-xs font-bold text-slate-300 mt-0.5">{simulation.wasteToLandfill} Tons</span>
            </div>
            <div className="bg-emerald-500/5 rounded border border-emerald-500/10 p-2 text-center">
              <span className="text-[9px] text-emerald-500 uppercase tracking-wider font-bold">Diverted</span>
              <span className="block text-xs font-bold text-emerald-400 mt-0.5">{simulation.wasteGenerated - simulation.wasteToLandfill} Tons</span>
            </div>
          </div>
        </div>
      </div>

      {/* Carbon Footprint Summary & Local Food Sourcing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Carbon footprint */}
        <div className="bg-[#1A1E26] border border-white/10 rounded p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
          <div className="space-y-1">
            <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-emerald-400">NET ENVIRONMENTAL TELEMETRY</span>
            <h4 className="text-sm font-sans font-extrabold text-white uppercase tracking-wider">CO₂ Equivalent Mitigation</h4>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Integrated matrix computing electrical HVAC, waste transport, and supply-chain logistics.
            </p>
          </div>
          <div className="text-center sm:text-right shrink-0">
            <div className="text-xl font-mono font-bold text-emerald-400">{simulation.carbonFootprint} MT CO₂e</div>
            <div className="text-[9px] text-slate-500 mt-0.5 font-mono uppercase tracking-wider">
              Baseline: {baselineCO2} MT | <span className="text-emerald-400 font-bold">-{co2Prevented} mitigated</span>
            </div>
          </div>
        </div>

        {/* Food Sourcing Meter */}
        <div className="bg-[#1A1E26] border border-white/10 rounded p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
          <div className="space-y-1">
            <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-emerald-400">SUPPLY CHAIN SUSTAINABILITY</span>
            <h4 className="text-sm font-sans font-extrabold text-white uppercase tracking-wider">Zero-Mile Local Menus</h4>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Sourcing from local district agricultural loops drastically reduces high-emission highway logistics.
            </p>
          </div>
          <div className="text-center sm:text-right shrink-0">
            <div className="text-xl font-mono font-bold text-emerald-400">{simulation.foodSourced}%</div>
            <div className="text-[9px] text-slate-500 font-mono mt-0.5 uppercase tracking-wider">Sourced locally (&lt;50 miles)</div>
          </div>
        </div>
      </div>

      {/* Section: Interventions Policy Dashboard */}
      <div className="bg-[#16191F] border border-white/10 rounded p-5 shadow-lg" id="interventions-selector">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
          <div>
            <h3 className="text-xs font-sans font-extrabold text-white uppercase tracking-wider">Host City Intervention Protocols</h3>
            <p className="text-xs text-slate-400 mt-0.5">Activate green guidelines to calibrate real-time performance optimization.</p>
          </div>
          <div className="text-[10px] font-mono font-bold text-slate-400 bg-[#1A1E26] px-2 py-1 rounded border border-white/5">
            SYS CONFIGURED: {activePolicies.length} / {INTERVENTIONS.filter(i => i.category !== "health").length + 3}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {INTERVENTIONS.map((policy) => {
            const isActive = activePolicies.some(p => p.id === policy.id);
            return (
              <button
                key={policy.id}
                id={`policy-btn-${policy.id}`}
                onClick={() => onTogglePolicy(policy)}
                className={`text-left p-3.5 rounded border transition-all duration-200 flex items-start gap-3 focus:outline-none ${
                  isActive
                    ? "bg-[#1A1E26] border-emerald-500/80 text-white shadow-sm ring-1 ring-emerald-500/10 shadow-[0_0_8px_rgba(16,185,129,0.05)]"
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
