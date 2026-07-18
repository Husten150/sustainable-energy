import React, { useState, useEffect } from "react";
import { HostCity, Intervention, SimulationResult, GeminiAnalysis } from "../types";
import { MapPin, ThermometerSun, ShieldAlert, HeartPulse, Activity, Sparkles, AlertTriangle, RefreshCw } from "lucide-react";

interface HealthBuiltEnvCardProps {
  selectedCity: HostCity;
  activePolicies: Intervention[];
  onTogglePolicy: (policy: Intervention) => void;
  simulation: SimulationResult;
  temperature: number;
}

export default function HealthBuiltEnvCard({
  selectedCity,
  activePolicies,
  onTogglePolicy,
  simulation,
  temperature,
}: HealthBuiltEnvCardProps) {
  const [analysis, setAnalysis] = useState<GeminiAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSensors, setShowSensors] = useState(true);

  // Trigger Gemini analysis when city, temp or active policies change
  useEffect(() => {
    async function fetchAnalysis() {
      setLoading(true);
      try {
        const response = await fetch("/api/gemini/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cityId: selectedCity.id,
            temperature,
            activePolicies: activePolicies.map(p => p.name),
          }),
        });
        const data = await response.json();
        setAnalysis(data);
      } catch (err) {
        console.error("Error fetching Gemini analysis", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalysis();
  }, [selectedCity.id, temperature, activePolicies.length]);

  // Determine local heat thermal risk levels for UHI zones
  const isCoolPavingActive = activePolicies.some(p => p.id === "thermal_paving");
  const isHydrationActive = activePolicies.some(p => p.id === "cooling_hubs");

  // Temperature adjustment factor per district based on UHI and policies
  const getDistrictTemp = (baseUhi: number) => {
    let temp = temperature + baseUhi;
    if (isCoolPavingActive) temp -= 4; // Cool pavement coating lowers UHI
    if (isHydrationActive) temp -= 2; // Hydration cooling effect
    return Math.round(temp);
  };

  const stadiumTemp = getDistrictTemp(5); // Concrete stadium parking lot UHI: +5°F
  const fanZoneTemp = getDistrictTemp(3); // Crowd fanzone: +3°F
  const transitTemp = getDistrictTemp(4); // Busy pavement transit hub: +4°F
  const hotelTemp = getDistrictTemp(1);  // Standard urban hotel corridor: +1°F
  const hospitalTemp = getDistrictTemp(0); // Forested hospital park: +0°F

  // Dynamic heat coloring for the thermal map
  const getThermalColor = (temp: number) => {
    if (temp >= 105) return "fill-red-600 stroke-red-800";
    if (temp >= 95) return "fill-orange-500 stroke-orange-700";
    if (temp >= 85) return "fill-amber-400 stroke-amber-600";
    return "fill-emerald-400 stroke-emerald-600";
  };

  const getThermalBg = (temp: number) => {
    if (temp >= 105) return "bg-red-500/25 border-red-500 text-red-700";
    if (temp >= 95) return "bg-orange-500/25 border-orange-500 text-orange-700";
    if (temp >= 85) return "bg-amber-500/20 border-amber-400 text-amber-700";
    return "bg-emerald-500/15 border-emerald-400 text-emerald-700";
  };

  return (
    <div className="space-y-6" id="health-built-env-container">
      {/* Intro overview */}
      <div className="bg-[#16191F] border border-white/10 rounded p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-md">
        <div>
          <h3 className="text-xs font-sans font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-rose-400" />
            Track 3: Public Health & the Built Environment
          </h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Identify overlaps between stadium heat island anomalies, crowd volume, and climate exposures to prevent emergency spikes.
          </p>
        </div>
        
        {/* Toggle Grid overlay */}
        <button
          onClick={() => setShowSensors(!showSensors)}
          className={`px-3 py-1.5 rounded border text-xs font-mono font-bold uppercase transition-all shadow-sm shrink-0 ${
            showSensors
              ? "bg-[#1A1E26] border-emerald-500 text-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.2)]"
              : "bg-[#1A1E26]/50 border-white/5 text-slate-400 hover:bg-[#222731] hover:border-white/10"
          }`}
        >
          {showSensors ? "MUTE SENSOR TELEMETRY" : "ACTIVATE SENSOR TELEMETRY"}
        </button>
      </div>

      {/* Grid: Thermal Map and Hospital Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Satellite Thermal Mapping Simulation */}
        <div className="lg:col-span-7 bg-[#16191F] border border-white/10 rounded p-4 space-y-4 shadow-md" id="thermal-mapping-card">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-xs font-sans font-bold uppercase tracking-wide text-white">Satellite Microclimate Thermal map</h4>
              <p className="text-[10px] text-slate-500 mt-0.5 font-mono">STADIUM DISTRICT URBAN HEAT ISLAND (UHI) INDEX ANOMALIES</p>
            </div>
            <div className="flex gap-1.5 text-[9px] font-mono">
              <span className="flex items-center gap-1 text-slate-400"><span className="w-2.5 h-2.5 rounded bg-red-500"></span> 105°F+</span>
              <span className="flex items-center gap-1 text-slate-400"><span className="w-2.5 h-2.5 rounded bg-orange-500"></span> 95°F+</span>
              <span className="flex items-center gap-1 text-slate-400"><span className="w-2.5 h-2.5 rounded bg-amber-400"></span> 85°F+</span>
              <span className="flex items-center gap-1 text-slate-400"><span className="w-2.5 h-2.5 rounded bg-emerald-400"></span> Safe</span>
            </div>
          </div>

          {/* Interactive SVG district layout map */}
          <div className="relative w-full aspect-video bg-[#0F1115] rounded overflow-hidden border border-white/5 flex items-center justify-center p-2">
            {/* Background heat contour rings */}
            <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
              <circle cx="50" cy="50" r="30" fill="none" stroke="#ef4444" strokeWidth="4" strokeDasharray="4 8" />
              <circle cx="50" cy="50" r="45" fill="none" stroke="#f59e0b" strokeWidth="3" strokeDasharray="3 6" />
            </svg>

            {/* Simulated Microclimate Nodes */}
            <svg className="w-full h-full" viewBox="0 0 100 100">
              {/* Paths Connecting Districts */}
              <path d="M 30 40 L 50 25 L 75 35 L 70 70 L 25 65 Z" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="2 4" />
              <path d="M 30 40 L 25 65" fill="none" stroke="#334155" strokeWidth="1" />
              <path d="M 50 25 L 25 65" fill="none" stroke="#334155" strokeWidth="1" />

              {/* District 1: Stadium Core */}
              <rect x="20" y="30" width="20" height="20" rx="2" className={`transition-colors duration-500 ${getThermalColor(stadiumTemp)} bg-opacity-40`} fillOpacity="0.3" strokeWidth="1.5" />
              
              {/* District 2: FIFA Fan Festival Zone */}
              <polygon points="45,15 60,15 65,35 40,30" className={`transition-colors duration-500 ${getThermalColor(fanZoneTemp)} bg-opacity-40`} fillOpacity="0.3" strokeWidth="1.5" />

              {/* District 3: Hotel/Concourse Corridor */}
              <rect x="68" y="25" width="18" height="18" rx="2" className={`transition-colors duration-500 ${getThermalColor(hotelTemp)} bg-opacity-40`} fillOpacity="0.3" strokeWidth="1.5" />

              {/* District 4: Light Rail / Transit Hub */}
              <circle cx="25" cy="65" r="11" className={`transition-colors duration-500 ${getThermalColor(transitTemp)} bg-opacity-40`} fillOpacity="0.3" strokeWidth="1.5" />

              {/* District 5: Regional Hospital Node */}
              <rect x="62" y="60" width="22" height="18" rx="2" className={`transition-colors duration-500 ${getThermalColor(hospitalTemp)} bg-opacity-40`} fillOpacity="0.3" strokeWidth="1.5" />

              {/* Labels on SVG */}
              <text x="30" y="38" fill="#f8fafc" fontSize="3" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">STADIUM</text>
              <text x="52" y="23" fill="#f8fafc" fontSize="3" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">FAN ZONE</text>
              <text x="77" y="32" fill="#f8fafc" fontSize="3" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">HOTELS</text>
              <text x="25" y="65" fill="#f8fafc" fontSize="3" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">TRANSIT</text>
              <text x="73" y="68" fill="#f8fafc" fontSize="3" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">HOSPITAL</text>
            </svg>

            {/* Float HUD Information Card Overlay */}
            {showSensors && (
              <div className="absolute inset-x-3 bottom-3 bg-[#16191F]/90 border border-white/10 rounded p-2.5 backdrop-blur-sm grid grid-cols-2 md:grid-cols-5 gap-2 text-white shadow-lg">
                <div className="p-1 rounded bg-[#0F1115] border border-white/5 text-center">
                  <span className="block text-[7px] uppercase tracking-wider text-slate-500 font-bold font-mono">Stadium Core</span>
                  <span className={`block text-xs font-mono font-bold mt-0.5 ${stadiumTemp >= 95 ? "text-red-400 animate-pulse" : "text-emerald-400"}`}>{stadiumTemp}°F</span>
                </div>
                <div className="p-1 rounded bg-[#0F1115] border border-white/5 text-center">
                  <span className="block text-[7px] uppercase tracking-wider text-slate-500 font-bold font-mono">Fan Festival</span>
                  <span className={`block text-xs font-mono font-bold mt-0.5 ${fanZoneTemp >= 95 ? "text-red-400 animate-pulse" : "text-emerald-400"}`}>{fanZoneTemp}°F</span>
                </div>
                <div className="p-1 rounded bg-[#0F1115] border border-white/5 text-center">
                  <span className="block text-[7px] uppercase tracking-wider text-slate-500 font-bold font-mono">Transit Hub</span>
                  <span className={`block text-xs font-mono font-bold mt-0.5 ${transitTemp >= 95 ? "text-red-400 animate-pulse" : "text-emerald-400"}`}>{transitTemp}°F</span>
                </div>
                <div className="p-1 rounded bg-[#0F1115] border border-white/5 text-center">
                  <span className="block text-[7px] uppercase tracking-wider text-slate-500 font-bold font-mono">Hotel strip</span>
                  <span className="block text-xs font-mono font-bold text-slate-300 mt-0.5">{hotelTemp}°F</span>
                </div>
                <div className="p-1 rounded bg-[#0F1115] border border-white/5 text-center col-span-2 md:col-span-1">
                  <span className="block text-[7px] uppercase tracking-wider text-slate-500 font-bold font-mono">Hospital Park</span>
                  <span className="block text-xs font-mono font-bold text-emerald-400 mt-0.5">{hospitalTemp}°F</span>
                </div>
              </div>
            )}

            {/* Hydration / Cooling Bus pins on map */}
            {isHydrationActive && showSensors && (
              <>
                <div className="absolute" style={{ left: "28%", top: "42%" }}>
                  <span className="flex h-3.5 w-3.5 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-blue-500 border border-white shadow-[0_0_6px_#3b82f6]"></span></span>
                </div>
                <div className="absolute" style={{ left: "55%", top: "28%" }}>
                  <span className="flex h-3.5 w-3.5 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-blue-500 border border-white shadow-[0_0_6px_#3b82f6]"></span></span>
                </div>
                <div className="absolute" style={{ left: "22%", top: "70%" }}>
                  <span className="flex h-3.5 w-3.5 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-blue-500 border border-white shadow-[0_0_6px_#3b82f6]"></span></span>
                </div>
              </>
            )}
          </div>
          
          <p className="text-[10px] text-slate-500 font-sans leading-relaxed">
            *Notice how UHI anomalies amplify ambient temperature by up to 5°F in concrete parking lots (Stadium) and asphalt grids (Transit). Activate <span className="font-semibold text-slate-400">Cool Pavement Coatings</span> or <span className="font-semibold text-slate-400">Hydration Corridors</span> to depress local anomalies.
          </p>
        </div>

        {/* Right: Hospital Capacity & Predictive Admissions Model */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-6">
          {/* Health admissions prediction */}
          <div className="bg-[#16191F] border border-white/10 rounded p-4 space-y-4 shadow-md" id="health-analytics-dashboard">
            <h4 className="text-xs font-sans font-bold uppercase tracking-wide text-white flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-rose-400" />
              Predictive Admissions Model
            </h4>

            <div className="p-4 rounded border border-rose-500/20 bg-rose-500/5 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[8px] uppercase font-mono font-bold text-rose-400 tracking-wider block">Predicted Emergency Cases</span>
                <div className="text-xl font-mono font-bold text-rose-400">{simulation.publicHealthAdmissions} cases/day</div>
                <span className="text-[9px] font-sans text-slate-500 block mt-0.5">Based on crowd size, thermal index, and cooling policies</span>
              </div>
              <div className="bg-rose-500/10 text-rose-400 p-2.5 rounded border border-rose-500/25 shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
            </div>

            {/* Hospital Beds Usage */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-sans">
                <span className="text-slate-400 font-medium">Regional ER Capacity Load</span>
                <span className={`font-mono font-bold ${simulation.hospitalOccupancy > 90 ? "text-red-400" : "text-slate-300"}`}>
                  {simulation.hospitalOccupancy}% ({Math.round(400 * (simulation.hospitalOccupancy/100))}/400 Beds)
                </span>
              </div>
              <div className="w-full bg-[#0F1115] h-2 rounded overflow-hidden">
                <div
                  className={`h-full rounded transition-all duration-500 ${
                    simulation.hospitalOccupancy > 90 ? "bg-red-500 shadow-[0_0_6px_#ef4444]" : simulation.hospitalOccupancy > 75 ? "bg-amber-400 shadow-[0_0_6px_#fbbf24]" : "bg-blue-400 shadow-[0_0_6px_#60a5fa]"
                  }`}
                  style={{ width: `${simulation.hospitalOccupancy}%` }}
                />
              </div>
              <div className="flex justify-between text-[9px] text-slate-500 font-mono uppercase tracking-wider">
                <span>70% BASE LOAD</span>
                <span>PEAK EVENT LOAD</span>
                <span>100% CAP</span>
              </div>
            </div>
          </div>

          {/* Environmental Health Interventions Selector */}
          <div className="bg-[#16191F] border border-white/10 rounded p-4 space-y-3 shadow-md" id="health-policies-selector">
            <h4 className="text-xs font-sans font-bold uppercase tracking-wide text-white">Local Public Health Protocols</h4>
            <div className="space-y-2">
              {/* Cooling bus / misting corridor */}
              <button
                onClick={() => onTogglePolicy(
                  { id: "cooling_hubs", name: "Hydration Hubs & Misting Corridors", category: "health", description: "Set up high-flow, shaded drinking water kiosks and automated micro-mist zones", energySavings: -12, waterSavings: -350, wasteReduction: 0, healthAdmissionAvoided: 24, co2Reduction: -2, costEstimate: "Low", feasibilityScore: 98 }
                )}
                className={`w-full text-left p-3 rounded text-xs flex justify-between items-center transition-all border ${
                  activePolicies.some(p => p.id === "cooling_hubs")
                    ? "bg-[#1A1E26] border-blue-500/80 text-white shadow-sm ring-1 ring-blue-500/10 shadow-[0_0_6px_rgba(59,130,246,0.1)]"
                    : "bg-[#1A1E26]/50 border-white/5 text-slate-400 hover:border-white/10 hover:bg-[#222731]"
                }`}
              >
                <div>
                  <div className="font-bold text-white font-sans text-xs">Hydration Hubs & Misting Corridors</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">High-impact heat exhaustion mitigation</div>
                </div>
                <span className={`text-[8px] font-mono font-bold uppercase px-2 py-0.5 rounded border shrink-0 ml-2 ${
                  activePolicies.some(p => p.id === "cooling_hubs") ? "bg-blue-500/15 text-blue-400 border-blue-500/20" : "bg-white/5 text-slate-500 border-transparent"
                }`}>
                  {activePolicies.some(p => p.id === "cooling_hubs") ? "Active" : "Deploy"}
                </span>
              </button>

              {/* Thermal pavement coating */}
              <button
                onClick={() => onTogglePolicy(
                  { id: "thermal_paving", name: "Cool Pavement Coatings & Shade Canopies", category: "health", description: "Apply highly reflective coatings on parking lots and plazas and construct solar shading covers", energySavings: 15, waterSavings: 0, wasteReduction: 0, healthAdmissionAvoided: 18, co2Reduction: 12, costEstimate: "High", feasibilityScore: 65 }
                )}
                className={`w-full text-left p-3 rounded text-xs flex justify-between items-center transition-all border ${
                  activePolicies.some(p => p.id === "thermal_paving")
                    ? "bg-[#1A1E26] border-purple-500/80 text-white shadow-sm ring-1 ring-purple-500/10 shadow-[0_0_6px_rgba(168,85,247,0.1)]"
                    : "bg-[#1A1E26]/50 border-white/5 text-slate-400 hover:border-white/10 hover:bg-[#222731]"
                }`}
              >
                <div>
                  <div className="font-bold text-white font-sans text-xs">Cool Pavement Coatings & Solar Shade</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Reduces regional concrete UHI anomalies</div>
                </div>
                <span className={`text-[8px] font-mono font-bold uppercase px-2 py-0.5 rounded border shrink-0 ml-2 ${
                  activePolicies.some(p => p.id === "thermal_paving") ? "bg-purple-500/15 text-purple-400 border-purple-500/20" : "bg-white/5 text-slate-500 border-transparent"
                }`}>
                  {activePolicies.some(p => p.id === "thermal_paving") ? "Active" : "Deploy"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Advisory Panel: Gemini API response */}
      <div className="bg-[#16191F] border border-white/10 rounded p-5 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="bg-emerald-500/10 p-2 rounded border border-emerald-500/20 text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-sans font-extrabold text-slate-100 uppercase tracking-wider">AI Sustainability & Public Health advisor</h4>
              <p className="text-[10px] text-slate-400 font-mono">CUSTOM CLIMATE RISK ANALYSIS POWERED BY GEMINI</p>
            </div>
          </div>
          {loading && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono uppercase tracking-wider">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" /> ANALYZING MICROCLIMATES...
            </div>
          )}
        </div>

        {loading ? (
          <div className="space-y-3 py-2 animate-pulse font-mono">
            <div className="h-3.5 bg-[#0F1115] rounded w-1/4 border border-white/5"></div>
            <div className="h-16 bg-[#0F1115] rounded border border-white/5"></div>
            <div className="h-12 bg-[#0F1115] rounded w-5/6 border border-white/5"></div>
          </div>
        ) : analysis ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded border ${
                analysis.riskLevel === "CRITICAL" ? "bg-red-500/20 text-red-300 border-red-500/40 shadow-[0_0_6px_rgba(239,68,68,0.2)]" :
                analysis.riskLevel === "HIGH" ? "bg-orange-500/20 text-orange-300 border-orange-500/40" :
                analysis.riskLevel === "MODERATE" ? "bg-amber-500/20 text-amber-300 border-amber-500/40" :
                "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
              }`}>
                RISK ASSESSMENT: {analysis.riskLevel}
              </span>
              <span className="text-xs text-slate-400 font-sans truncate">• {analysis.nexusTension}</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">{analysis.analysis}</p>

            {analysis.interventions && analysis.interventions.length > 0 && (
              <div className="space-y-2.5 pt-2">
                <h5 className="text-[9px] font-mono font-bold uppercase text-emerald-400 tracking-wider">AI Recommended Tactical Actions</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {analysis.interventions.map((rec, i) => (
                    <div key={i} className="bg-[#1A1E26] border border-white/10 rounded p-3 space-y-1">
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-xs font-extrabold text-white font-sans truncate">{rec.title}</span>
                        <span className="text-[8px] font-mono font-bold uppercase bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20">{rec.feasibility} FEAS.</span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-sans leading-normal">{rec.description}</p>
                      <div className="text-[9px] text-emerald-400 font-mono pt-1">★ IMPACT: {rec.impact}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {analysis.isMock && (
              <div className="text-[9px] font-mono text-slate-600 flex items-center gap-1 mt-1 uppercase">
                <AlertTriangle className="w-3 h-3 text-amber-500/50" />
                No active GEMINI_API_KEY detected. Dynamic local heuristics model loaded as fail-safe.
              </div>
            )}
          </div>
        ) : (
          <div className="text-slate-400 text-xs py-4 text-center font-mono">FAILED TO ACQUIRE THERMAL SENSITIVITY VECTOR DATA.</div>
        )}
      </div>
    </div>
  );
}
