import React, { useState, useEffect } from "react";
import { HOST_CITIES, INTERVENTIONS, simulateScenario } from "./data/cities";
import { HostCity, Intervention } from "./types";
import CitySelector from "./components/CitySelector";
import ResourceNexusCard from "./components/ResourceNexusCard";
import HealthBuiltEnvCard from "./components/HealthBuiltEnvCard";
import ResourceNexusComparison from "./components/ResourceNexusComparison";
import HealthBuiltEnvComparison from "./components/HealthBuiltEnvComparison";
import UnleashSandbox from "./components/UnleashSandbox";
import { Trophy, Leaf, HeartPulse, Sparkles, Layers, ShieldAlert, ThermometerSun, MapPin } from "lucide-react";

export default function App() {
  const [selectedCity, setSelectedCity] = useState<HostCity>(HOST_CITIES[0]);
  const [temperature, setTemperature] = useState<number>(HOST_CITIES[0].avgSummerTemp);
  const [crowdMode, setCrowdMode] = useState<"group" | "quarter" | "final">("quarter");
  const [activePolicies, setActivePolicies] = useState<Intervention[]>([]);
  const [activeTab, setActiveTab] = useState<"nexus" | "health" | "unleash">("nexus");

  // Comparison View states
  const [isComparisonMode, setIsComparisonMode] = useState<boolean>(false);
  const [compareCity, setCompareCity] = useState<HostCity>(HOST_CITIES[4]); // Defaults to Dallas, TX (AT&T Stadium) for robust hot city comparison
  const [compareTemperature, setCompareTemperature] = useState<number>(HOST_CITIES[4].avgSummerTemp);

  // Sync temperature if selected host city changes
  useEffect(() => {
    setTemperature(selectedCity.avgSummerTemp);
  }, [selectedCity]);

  // Sync comparison temperature if compareCity changes
  useEffect(() => {
    if (compareCity) {
      setCompareTemperature(compareCity.avgSummerTemp);
    }
  }, [compareCity]);

  // Handle toggle intervention policies
  const handleTogglePolicy = (policy: Intervention) => {
    setActivePolicies((prev) => {
      const exists = prev.some((p) => p.id === policy.id);
      if (exists) {
        return prev.filter((p) => p.id !== policy.id);
      } else {
        return [...prev, policy];
      }
    });
  };

  // Run environmental stress simulation engine
  const simulation = simulateScenario(selectedCity, crowdMode, temperature, activePolicies);
  const simulationB = simulateScenario(compareCity, crowdMode, compareTemperature, activePolicies);

  // Global counts for badges
  const energySavingsCount = activePolicies.filter(p => p.category === "energy").length;
  const waterSavingsCount = activePolicies.filter(p => p.category === "food-water").length;
  const wasteSavingsCount = activePolicies.filter(p => p.category === "waste").length;

  return (
    <div className="min-h-screen bg-[#0F1115] text-[#E0E0E0] flex flex-col font-sans" id="app-root">
      {/* Dynamic Global Dashboard Header */}
      <header className="bg-[#16191F] border-b border-white/10 sticky top-0 z-40" id="global-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 text-slate-950 p-2.5 rounded-sm shadow-lg shrink-0">
              <Trophy className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-sans font-extrabold text-white tracking-wider uppercase">
                  FIFA 2026 Resource Intelligence Platform
                </h1>
                <span className="text-[9px] bg-white/10 border border-white/5 px-2 py-0.5 rounded text-gray-400 font-mono tracking-widest uppercase">LIVE FEED</span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                Command center for Energy–Food–Water Nexus & Public Health heat mitigation across 11 U.S. host cities
              </p>
            </div>
          </div>

          {/* Quick HUD Metrics */}
          <div className="flex flex-wrap items-center gap-2" id="quick-hud-meters">
            <div className="bg-[#1A1E26] border border-white/10 rounded px-3 py-1.5 text-center min-w-[100px]">
              <span className="block text-[8px] uppercase tracking-wider text-gray-500 font-bold font-sans">CO₂ Mitigation</span>
              <span className="text-xs font-mono font-bold text-emerald-400 mt-0.5 block">
                {isComparisonMode 
                  ? `A: ${simulation.carbonFootprint} | B: ${simulationB.carbonFootprint} MT` 
                  : `${simulation.carbonFootprint} MT CO₂e`
                }
              </span>
            </div>
            <div className="bg-[#1A1E26] border border-white/10 rounded px-3 py-1.5 text-center min-w-[100px]">
              <span className="block text-[8px] uppercase tracking-wider text-gray-500 font-bold font-sans">Nexus Stress</span>
              <span className={`text-xs font-mono font-bold mt-0.5 block ${
                simulation.nexusStressScore > 70 || (isComparisonMode && simulationB.nexusStressScore > 70) 
                  ? "text-red-400 shadow-[0_0_8px_rgba(239,68,68,0.2)]" 
                  : "text-emerald-400"
              }`}>
                {isComparisonMode
                  ? `A: ${simulation.nexusStressScore}% | B: ${simulationB.nexusStressScore}%`
                  : `${simulation.nexusStressScore}%`
                }
              </span>
            </div>
            <div className="bg-[#1A1E26] border border-white/10 rounded px-3 py-1.5 text-center min-w-[100px]">
              <span className="block text-[8px] uppercase tracking-wider text-gray-500 font-bold font-sans">Heat Cases</span>
              <span className={`text-xs font-mono font-bold mt-0.5 block ${
                simulation.publicHealthAdmissions > 25 || (isComparisonMode && simulationB.publicHealthAdmissions > 25) 
                  ? "text-red-400" 
                  : "text-white"
              }`}>
                {isComparisonMode
                  ? `A: ${simulation.publicHealthAdmissions} | B: ${simulationB.publicHealthAdmissions}/day`
                  : `${simulation.publicHealthAdmissions}/day`
                }
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard Space */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* City Matrix Control Board */}
        <section className="space-y-4" id="city-selector-section">
          <CitySelector
            selectedCity={selectedCity}
            onSelectCity={setSelectedCity}
            temperature={temperature}
            setTemperature={setTemperature}
            crowdMode={crowdMode}
            setCrowdMode={setCrowdMode}
            isComparisonMode={isComparisonMode}
            compareCity={compareCity}
            onSelectCompareCity={setCompareCity}
            compareTemperature={compareTemperature}
            setCompareTemperature={setCompareTemperature}
          />
        </section>

        {/* Dynamic Focus Tabs (Track 2, Track 3, UNLEASH Sandbox) & Comparison Toggle */}
        <div className="border-b border-white/10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4" id="dashboard-navigation-tabs">
          <nav className="flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("nexus")}
              className={`pb-3 px-1 border-b-2 font-semibold text-xs uppercase tracking-wider transition-all flex items-center gap-2 focus:outline-none ${
                activeTab === "nexus"
                  ? "border-emerald-500 text-emerald-400"
                  : "border-transparent text-gray-500 hover:text-gray-300 hover:border-white/20"
              }`}
            >
              <Leaf className="w-4 h-4" />
              Track 2: Energy-Food-Water Nexus
            </button>
            <button
              onClick={() => setActiveTab("health")}
              className={`pb-3 px-1 border-b-2 font-semibold text-xs uppercase tracking-wider transition-all flex items-center gap-2 focus:outline-none ${
                activeTab === "health"
                  ? "border-rose-500 text-rose-400"
                  : "border-transparent text-gray-500 hover:text-gray-300 hover:border-white/20"
              }`}
            >
              <HeartPulse className="w-4 h-4" />
              Track 3: Public Health & Heat
            </button>
            <button
              onClick={() => setActiveTab("unleash")}
              className={`pb-3 px-1 border-b-2 font-semibold text-xs uppercase tracking-wider transition-all flex items-center gap-2 focus:outline-none ${
                activeTab === "unleash"
                  ? "border-indigo-500 text-indigo-400"
                  : "border-transparent text-gray-500 hover:text-gray-300 hover:border-white/20"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              UNLEASH Innovation Sandbox
            </button>
          </nav>

          {/* Toggle Dual City Comparison Mode */}
          <div className="pb-2.5">
            <button
              id="comparison-view-toggle"
              onClick={() => setIsComparisonMode(!isComparisonMode)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-mono font-bold uppercase transition-all shadow-sm border ${
                isComparisonMode
                  ? "bg-[#f43f5e]/15 border-rose-500 text-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.2)] font-extrabold"
                  : "bg-[#1A1E26] border-white/10 text-slate-400 hover:text-white hover:border-white/25"
              }`}
            >
              <Layers className="w-4 h-4" />
              {isComparisonMode ? "Comparing: ACTIVE" : "Compare dual cities"}
            </button>
          </div>
        </div>

        {/* Tab Viewport Panels */}
        <section className="transition-all duration-300" id="tab-viewport">
          {activeTab === "nexus" && (
            <div className="space-y-6">
              {isComparisonMode ? (
                <ResourceNexusComparison
                  cityA={selectedCity}
                  cityB={compareCity}
                  simulationA={simulation}
                  simulationB={simulationB}
                  activePolicies={activePolicies}
                  onTogglePolicy={handleTogglePolicy}
                  temperatureA={temperature}
                  temperatureB={compareTemperature}
                />
              ) : (
                <ResourceNexusCard
                  selectedCity={selectedCity}
                  activePolicies={activePolicies}
                  onTogglePolicy={handleTogglePolicy}
                  simulation={simulation}
                  temperature={temperature}
                />
              )}
            </div>
          )}

          {activeTab === "health" && (
            <div className="space-y-6">
              {isComparisonMode ? (
                <HealthBuiltEnvComparison
                  cityA={selectedCity}
                  cityB={compareCity}
                  simulationA={simulation}
                  simulationB={simulationB}
                  activePolicies={activePolicies}
                  onTogglePolicy={handleTogglePolicy}
                  temperatureA={temperature}
                  temperatureB={compareTemperature}
                />
              ) : (
                <HealthBuiltEnvCard
                  selectedCity={selectedCity}
                  activePolicies={activePolicies}
                  onTogglePolicy={handleTogglePolicy}
                  simulation={simulation}
                  temperature={temperature}
                />
              )}
            </div>
          )}

          {activeTab === "unleash" && (
            <div className="space-y-6">
              {isComparisonMode && (
                <div className="bg-indigo-500/10 border border-indigo-500/20 rounded p-3 text-xs text-indigo-400 font-mono flex items-center gap-2">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  Note: UNLEASH Sandbox runs simulations on Slot A ({selectedCity.name}). Turn off comparison mode to edit cities individually.
                </div>
              )}
              <UnleashSandbox
                selectedCity={selectedCity}
              />
            </div>
          )}
        </section>
      </main>

      {/* Humble Footer */}
      <footer className="bg-[#16191F] border-t border-white/10 py-6 mt-12 text-center text-[11px] font-sans text-slate-500" id="app-footer">
        <div>FIFA World Cup 2026 Host Cities Sustainability Matrix &copy; 2026</div>
        <div className="mt-1 font-mono uppercase tracking-widest text-[9px] text-slate-600">Designed in compliance with UNLEASH Innovation Framework • All Rights Reserved</div>
      </footer>
    </div>
  );
}
