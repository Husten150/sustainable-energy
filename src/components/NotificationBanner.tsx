import React, { useState, useEffect } from "react";
import { HostCity, SimulationResult, Intervention } from "../types";
import { AlertTriangle, HeartPulse, ShieldAlert, X, Check, Flame, ChevronRight, Activity } from "lucide-react";

interface NotificationBannerProps {
  cityA: HostCity;
  simulationA: SimulationResult;
  temperatureA: number;
  cityB?: HostCity;
  simulationB?: SimulationResult;
  temperatureB?: number;
  isComparisonMode: boolean;
  activePolicies: Intervention[];
  onTogglePolicy: (policy: Intervention) => void;
}

export default function NotificationBanner({
  cityA,
  simulationA,
  temperatureA,
  cityB,
  simulationB,
  temperatureB,
  isComparisonMode,
  activePolicies,
  onTogglePolicy,
}: NotificationBannerProps) {
  // Store dismissed notifications. If cities or temperatures change, we can reset dismissal state to ensure new alerts are seen.
  const [isDismissedA, setIsDismissedA] = useState(false);
  const [isDismissedB, setIsDismissedB] = useState(false);

  // Reset dismissal when cities, temperature, or active policy count changes to keep the system active and helpful
  useEffect(() => {
    setIsDismissedA(false);
  }, [cityA.id, temperatureA]);

  useEffect(() => {
    if (cityB && temperatureB) {
      setIsDismissedB(false);
    }
  }, [cityB?.id, temperatureB]);

  const hasHighRiskA = simulationA.publicHealthAdmissions > 25;
  const hasHighRiskB = isComparisonMode && simulationB && simulationB.publicHealthAdmissions > 25;

  if (!hasHighRiskA && !hasHighRiskB) {
    return null;
  }

  // Find missing heat/health interventions
  const isHydrationActive = activePolicies.some(p => p.id === "cooling_hubs");
  const isPavingActive = activePolicies.some(p => p.id === "thermal_paving");
  const isTransitActive = activePolicies.some(p => p.id === "transit_subsidies");

  const getUrgentActions = () => {
    const actions = [];
    if (!isHydrationActive) {
      actions.push({
        id: "cooling_hubs",
        name: "Hydration Hubs & Misting Corridors",
        impact: "Reduces admissions by up to 24 cases/day",
        policy: { id: "cooling_hubs", name: "Hydration Hubs & Misting Corridors", category: "health" as const, description: "Set up high-flow, shaded drinking water kiosks and automated micro-mist zones", energySavings: -12, waterSavings: -350, wasteReduction: 0, healthAdmissionAvoided: 24, co2Reduction: -2, costEstimate: "Low" as const, feasibilityScore: 98 }
      });
    }
    if (!isPavingActive) {
      actions.push({
        id: "thermal_paving",
        name: "Cool Pavement Coatings & Solar Shade",
        impact: "Reduces admissions by up to 18 cases/day",
        policy: { id: "thermal_paving", name: "Cool Pavement Coatings & Shade Canopies", category: "health" as const, description: "Apply highly reflective coatings on parking lots and plazas and construct solar shading covers", energySavings: 15, waterSavings: 0, wasteReduction: 0, healthAdmissionAvoided: 18, co2Reduction: 12, costEstimate: "High" as const, feasibilityScore: 65 }
      });
    }
    if (!isTransitActive) {
      actions.push({
        id: "transit_subsidies",
        name: "Spectator Free Transit Incentives",
        impact: "Reduces admissions by up to 5 cases/day",
        policy: { id: "transit_subsidies", name: "Spectator Free Transit Incentives", category: "energy" as const, description: "Bundle active match tickets with 100% free light rail and bus transit codes", energySavings: 120, waterSavings: 0, wasteReduction: 0, healthAdmissionAvoided: 5, co2Reduction: 95, costEstimate: "Medium" as const, feasibilityScore: 92 }
      });
    }
    return actions;
  };

  const urgentActions = getUrgentActions();

  return (
    <div className="space-y-3" id="public-health-advisory-notifications">
      {/* Alert for City A */}
      {hasHighRiskA && !isDismissedA && (
        <div className="bg-[#1F1416] border-l-4 border-rose-500 rounded-r border-y border-r border-rose-900/40 p-4 relative shadow-lg overflow-hidden animate-in fade-in slide-in-from-top duration-300">
          <div className="absolute right-3 top-3 flex items-center gap-2 z-10">
            <button
              onClick={() => setIsDismissedA(true)}
              className="text-slate-400 hover:text-white p-1 rounded-sm bg-black/20 hover:bg-black/40 border border-white/5 transition-all"
              title="Dismiss Advisory"
              id="dismiss-advisory-a"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-start gap-4 pr-6">
            <div className="p-2 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 shrink-0 mt-0.5 animate-pulse">
              <ShieldAlert className="w-5 h-5" />
            </div>

            <div className="space-y-2 flex-1">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-xs font-sans font-extrabold uppercase tracking-widest text-rose-400">
                    High-Risk Public Health Advisory
                  </h4>
                  <span className="text-[9px] bg-rose-500/15 border border-rose-500/30 text-rose-400 font-mono px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                    Critical Heat Load
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-sans mt-1 leading-relaxed">
                  In <span className="font-extrabold text-white">{cityA.name}</span> ({cityA.stadium}), current simulated temperature is{" "}
                  <span className="font-mono font-extrabold text-white bg-white/5 px-1 py-0.5 rounded">{temperatureA}°F</span>.
                  Predicted public health cases are currently{" "}
                  <span className="text-rose-400 font-mono font-extrabold underline decoration-rose-500/40">
                    {simulationA.publicHealthAdmissions} cases/day
                  </span>
                  , exceeding the high-risk safety threshold of 25 cases/day.
                </p>
              </div>

              {/* Suggestions panel */}
              {urgentActions.length > 0 ? (
                <div className="bg-black/25 rounded border border-rose-900/30 p-3 mt-3 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-amber-400 uppercase font-bold tracking-wider">
                    <Activity className="w-3.5 h-3.5" /> Recommended Local Protocols to Lower Heat Stress
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {urgentActions.map((act) => (
                      <div
                        key={act.id}
                        className="bg-[#16191F]/85 border border-white/5 hover:border-rose-500/20 rounded p-2.5 flex flex-col justify-between gap-2.5 transition-colors"
                      >
                        <div>
                          <div className="text-[11px] font-bold text-white font-sans leading-tight">
                            {act.name}
                          </div>
                          <div className="text-[9px] text-emerald-400 font-mono mt-1">
                            ★ {act.impact}
                          </div>
                        </div>
                        <button
                          onClick={() => onTogglePolicy(act.policy)}
                          className="w-full py-1 px-2 rounded bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-slate-950 border border-rose-500/25 hover:border-transparent text-[10px] font-mono font-bold uppercase transition-all flex items-center justify-center gap-1"
                        >
                          Deploy Protocol
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded p-2.5 text-xs font-sans flex items-center gap-2 mt-3">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    All critical local heat-mitigation protocols have been deployed for {cityA.name}. Emergency capacity risks remain elevated due to ambient microclimates. Consider manually reducing temperature in the Control Board or reducing attendance levels.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Alert for City B (Comparison Mode) */}
      {hasHighRiskB && !isDismissedB && cityB && simulationB && temperatureB && (
        <div className="bg-[#1F1416] border-l-4 border-rose-500 rounded-r border-y border-r border-rose-900/40 p-4 relative shadow-lg overflow-hidden animate-in fade-in slide-in-from-top duration-300">
          <div className="absolute right-3 top-3 flex items-center gap-2 z-10">
            <button
              onClick={() => setIsDismissedB(true)}
              className="text-slate-400 hover:text-white p-1 rounded-sm bg-black/20 hover:bg-black/40 border border-white/5 transition-all"
              title="Dismiss Advisory"
              id="dismiss-advisory-b"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-start gap-4 pr-6">
            <div className="p-2 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 shrink-0 mt-0.5 animate-pulse">
              <ShieldAlert className="w-5 h-5" />
            </div>

            <div className="space-y-2 flex-1">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-xs font-sans font-extrabold uppercase tracking-widest text-rose-400">
                    High-Risk Public Health Advisory (Slot B)
                  </h4>
                  <span className="text-[9px] bg-rose-500/15 border border-rose-500/30 text-rose-400 font-mono px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                    Critical Heat Load
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-sans mt-1 leading-relaxed">
                  In comparison city <span className="font-extrabold text-white">{cityB.name}</span> ({cityB.stadium}), current simulated temperature is{" "}
                  <span className="font-mono font-extrabold text-white bg-white/5 px-1 py-0.5 rounded">{temperatureB}°F</span>.
                  Predicted public health cases are currently{" "}
                  <span className="text-rose-400 font-mono font-extrabold underline decoration-rose-500/40">
                    {simulationB.publicHealthAdmissions} cases/day
                  </span>
                  , exceeding the high-risk safety threshold of 25 cases/day.
                </p>
              </div>

              {/* Suggestions panel */}
              {urgentActions.length > 0 ? (
                <div className="bg-black/25 rounded border border-rose-900/30 p-3 mt-3 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-amber-400 uppercase font-bold tracking-wider">
                    <Activity className="w-3.5 h-3.5" /> Recommended Local Protocols to Lower Heat Stress
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {urgentActions.map((act) => (
                      <div
                        key={act.id}
                        className="bg-[#16191F]/85 border border-white/5 hover:border-rose-500/20 rounded p-2.5 flex flex-col justify-between gap-2.5 transition-colors"
                      >
                        <div>
                          <div className="text-[11px] font-bold text-white font-sans leading-tight">
                            {act.name}
                          </div>
                          <div className="text-[9px] text-emerald-400 font-mono mt-1">
                            ★ {act.impact}
                          </div>
                        </div>
                        <button
                          onClick={() => onTogglePolicy(act.policy)}
                          className="w-full py-1 px-2 rounded bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-slate-950 border border-rose-500/25 hover:border-transparent text-[10px] font-mono font-bold uppercase transition-all flex items-center justify-center gap-1"
                        >
                          Deploy Protocol
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded p-2.5 text-xs font-sans flex items-center gap-2 mt-3">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    All critical local heat-mitigation protocols have been deployed for {cityB.name}. Emergency capacity risks remain elevated due to ambient microclimates. Consider manually reducing temperature in the Control Board or reducing attendance levels.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
