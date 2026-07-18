import React from "react";
import { HostCity } from "../types";
import { HOST_CITIES } from "../data/cities";
import { MapPin, Trophy, ShieldAlert, Train, ThermometerSun } from "lucide-react";

interface CitySelectorProps {
  selectedCity: HostCity;
  onSelectCity: (city: HostCity) => void;
  temperature: number;
  setTemperature: (temp: number) => void;
  crowdMode: "group" | "quarter" | "final";
  setCrowdMode: (mode: "group" | "quarter" | "final") => void;
}

export default function CitySelector({
  selectedCity,
  onSelectCity,
  temperature,
  setTemperature,
  crowdMode,
  setCrowdMode,
}: CitySelectorProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" id="city-selector-matrix-board">
      {/* Left: US Host Cities Map & List */}
      <div className="lg:col-span-8 bg-[#16191F] rounded border border-white/10 p-5 shadow-lg" id="city-selector-map-container">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-sm font-sans font-extrabold text-white tracking-wider uppercase flex items-center gap-2">
              <Trophy className="w-4 h-4 text-emerald-400" />
              FIFA 2026 U.S. Host Cities Matrix
            </h2>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Select an official US host node to calibrate predictive resource & climate stress profiles.
            </p>
          </div>
          <div className="flex items-center gap-1.5 self-start bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[9px] uppercase tracking-wider font-mono text-emerald-400 font-bold">SYS ACTIVE</span>
          </div>
        </div>

        {/* Vector SVG Map Container */}
        <div className="relative w-full h-[260px] md:h-[310px] bg-[#0F1115] rounded border border-white/5 overflow-hidden flex items-center justify-center p-2 mb-4">
          <svg
            className="w-full h-full max-w-[650px] opacity-90"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {/* Dark technical grid lines */}
            <path d="M 0 10 L 100 10 M 0 20 L 100 20 M 0 30 L 100 30 M 0 40 L 100 40 M 0 50 L 100 50 M 0 60 L 100 60 M 0 70 L 100 70 M 0 80 L 100 80 M 0 90 L 100 90" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />
            <path d="M 10 0 L 10 100 M 20 0 L 20 100 M 30 0 L 30 100 M 40 0 L 40 100 M 50 0 L 50 100 M 60 0 L 60 100 M 70 0 L 70 100 M 80 0 L 80 100 M 90 0 L 90 100" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />
            
            {/* US outline abstraction styled like a radar matrix */}
            <path
              d="M 12 10 Q 5 25 10 40 T 15 70 Q 25 85 45 80 T 55 90 T 80 88 T 92 80 T 96 45 T 90 25 T 85 15 T 45 10 Z"
              fill="#16191F"
              fillOpacity="0.4"
              stroke="rgba(34, 197, 94, 0.2)"
              strokeWidth="1"
              strokeDasharray="2 2"
            />
            {/* Lakes and interior accents */}
            <circle cx="75" cy="28" r="2" fill="rgba(255,255,255,0.1)" />
          </svg>

          {/* Interactive City Nodes on Map */}
          {HOST_CITIES.map((city) => {
            const isSelected = city.id === selectedCity.id;
            return (
              <button
                key={city.id}
                id={`map-pin-${city.id}`}
                onClick={() => onSelectCity(city)}
                style={{
                  left: `${city.coordinates.x}%`,
                  top: `${city.coordinates.y}%`,
                }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group z-10 focus:outline-none"
              >
                <div className="relative flex items-center justify-center transition-all duration-300">
                  {/* Pulse Ring for Selected */}
                  {isSelected && (
                    <span className="absolute w-6 h-6 bg-emerald-500/40 rounded-full animate-ping"></span>
                  )}
                  {/* Dot */}
                  <div
                    className={`w-3 h-3 rounded-full border shadow-[0_0_6px_rgba(0,0,0,0.5)] transition-all duration-300 ${
                      isSelected
                        ? "bg-emerald-400 border-white scale-125 shadow-[0_0_8px_#10b981]"
                        : "bg-[#1A1E26] border-slate-500 hover:bg-slate-800 hover:scale-110"
                    }`}
                  />
                  {/* Label tooltip (Desktop) */}
                  <div className="absolute bottom-5 bg-[#1A1E26] border border-white/10 text-white text-[9px] font-mono px-2 py-0.5 rounded shadow-lg opacity-0 group-hover:opacity-100 md:opacity-0 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20">
                    {city.name}
                  </div>
                </div>
              </button>
            );
          })}

          {/* Map Compass Legend */}
          <div className="absolute bottom-3 left-4 bg-[#1A1E26]/90 p-2 rounded border border-white/10 text-[9px] font-mono text-slate-400 space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 border border-white shadow-[0_0_4px_#10b981]"></span>
              Active Node
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#111317] border border-slate-500"></span>
              Inactive Node
            </div>
          </div>
        </div>

        {/* Horizontal List of Host Cities */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2" id="city-selection-pills">
          {HOST_CITIES.map((city) => {
            const isSelected = city.id === selectedCity.id;
            return (
              <button
                key={city.id}
                id={`city-pill-${city.id}`}
                onClick={() => onSelectCity(city)}
                className={`text-left px-2.5 py-1.5 rounded border text-[11px] transition-all duration-200 ${
                  isSelected
                    ? "bg-[#22c55e]/10 border-emerald-500 text-emerald-400 font-bold shadow-[0_0_8px_rgba(34,197,94,0.1)]"
                    : "bg-[#1A1E26] border-white/5 text-slate-300 hover:border-white/20 hover:bg-[#222731]"
                }`}
              >
                <div className="truncate font-sans font-semibold">{city.name}</div>
                <div className="text-[9px] text-slate-500 mt-0.5 font-sans truncate">{city.stadium}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: Environmental Controls & Stadium Specs */}
      <div className="lg:col-span-4 space-y-4">
        {/* Environmental Controller */}
        <div className="bg-[#16191F] rounded border border-white/10 p-5 shadow-lg" id="env-controls-container">
          <h3 className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-3 flex items-center gap-2">
            <ThermometerSun className="w-3.5 h-3.5 text-orange-400" />
            Live Stress Parameters
          </h3>
          
          {/* Temperature Slider */}
          <div className="space-y-1.5 mb-5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium">Ambient Matchday Temp</span>
              <span className={`font-mono font-bold px-1.5 py-0.5 rounded text-[11px] ${
                temperature >= 95 ? "bg-red-950/40 text-red-400 border border-red-900/30" : temperature >= 85 ? "bg-amber-950/40 text-amber-400 border border-amber-900/30" : "bg-emerald-950/40 text-emerald-400 border border-emerald-900/30"
              }`}>
                {temperature}°F
              </span>
            </div>
            <input
              type="range"
              id="temp-slider"
              min="65"
              max="105"
              step="1"
              value={temperature}
              onChange={(e) => setTemperature(parseInt(e.target.value))}
              className="w-full h-1 bg-[#0F1115] rounded appearance-none cursor-pointer accent-emerald-500 focus:outline-none"
            />
            <div className="flex justify-between text-[9px] text-slate-500 font-mono">
              <span>65°F (Cool)</span>
              <span>85°F (Warm)</span>
              <span>105°F (Heatwave)</span>
            </div>
          </div>

          {/* Crowd Match Bracket Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-sans text-slate-400 flex items-center gap-1.5">
              <Train className="w-3.5 h-3.5 text-emerald-400" /> Match Bracket Attendance
            </label>
            <div className="grid grid-cols-3 gap-1 p-0.5 bg-[#0F1115] rounded border border-white/5" id="crowd-brackets">
              {(["group", "quarter", "final"] as const).map((mode) => (
                <button
                  key={mode}
                  id={`crowd-mode-btn-${mode}`}
                  onClick={() => setCrowdMode(mode)}
                  className={`py-1 text-[10px] font-mono font-bold rounded uppercase tracking-wider transition-all ${
                    crowdMode === mode
                      ? "bg-[#1A1E26] text-emerald-400 border border-white/10 shadow-sm"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-500 font-sans leading-relaxed mt-1">
              Bracket shifts spectator volume: Group (~85% load), Quarters (~105% peak load), Final (~125% peak capacity stress).
            </p>
          </div>
        </div>

        {/* Active Stadium Profile Card */}
        <div className="bg-[#1A1E26] rounded border border-white/10 p-5 shadow-lg relative overflow-hidden" id="city-profile-summary">
          {/* subtle decoration to fit cybernetic theme */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 space-y-3.5">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[8px] font-mono uppercase tracking-widest text-emerald-400 font-bold">NODE TELEMETRY</span>
                <h3 className="text-lg font-sans font-extrabold text-white mt-0.5 leading-tight">{selectedCity.name}</h3>
                <p className="text-xs text-slate-400 font-mono">{selectedCity.state}</p>
              </div>
              <div className="bg-emerald-500/10 p-2 rounded border border-emerald-500/20">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </div>

            <hr className="border-white/5" />

            <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs font-sans">
              <div>
                <span className="text-[8px] font-mono uppercase tracking-wider text-slate-500 block">STADIUM VENUE</span>
                <span className="font-semibold text-slate-200 mt-0.5 block truncate" title={selectedCity.stadium}>{selectedCity.stadium}</span>
              </div>
              <div>
                <span className="text-[8px] font-mono uppercase tracking-wider text-slate-500 block">PEAK CAPACITY</span>
                <span className="font-mono font-bold text-slate-200 mt-0.5 block">{selectedCity.capacity.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[8px] font-mono uppercase tracking-wider text-slate-500 block">YEAR BUILT</span>
                <span className="font-mono text-slate-200 mt-0.5 block">{selectedCity.buildYear}</span>
              </div>
              <div>
                <span className="text-[8px] font-mono uppercase tracking-wider text-slate-500 block">UHI RISK LEVEL</span>
                <span className={`font-mono font-bold mt-0.5 inline-block px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider ${
                  selectedCity.uhiRisk === "Very High" ? "bg-red-950/40 text-red-400 border border-red-900/30" :
                  selectedCity.uhiRisk === "High" ? "bg-orange-950/40 text-orange-400 border border-orange-900/30" :
                  selectedCity.uhiRisk === "Medium-High" ? "bg-amber-950/40 text-amber-400 border border-amber-900/30" :
                  "bg-emerald-950/40 text-emerald-400 border border-emerald-900/30"
                }`}>{selectedCity.uhiRisk}</span>
              </div>
            </div>

            <hr className="border-white/5" />

            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-sans">Transit Grid Load Capacity</span>
                <span className="font-mono text-emerald-400 font-bold">{selectedCity.publicTransitScore}/100</span>
              </div>
              <div className="w-full bg-[#0F1115] h-1 rounded overflow-hidden">
                <div
                  className="bg-emerald-400 h-full rounded shadow-[0_0_6px_#10b981]"
                  style={{ width: `${selectedCity.publicTransitScore}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
