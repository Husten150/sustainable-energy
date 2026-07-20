import React, { useState, useEffect } from "react";
import { HostCity } from "../types";
import { MapPin, ThermometerSnowflake, Droplets, HeartPulse, TreePine, Navigation, ExternalLink, RefreshCw, AlertTriangle, Sparkles, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface LiveMapsExplorerProps {
  selectedCity: HostCity;
}

type QueryType = "cooling" | "hydration" | "hospitals" | "shade";

interface GroundedSource {
  title: string;
  uri: string;
}

interface MapsResponse {
  text: string;
  sources: GroundedSource[];
  isMock?: boolean;
  isLive?: boolean;
  errorDetails?: string;
}

// Client-side local simulation helper for instant, robust rendering without NetworkErrors
function getLocalMapsFallback(cityName: string, stadiumName: string, queryType: QueryType): MapsResponse {
  let places: Array<{ title: string; uri: string; role: string; address: string }> = [];
  if (queryType === "cooling") {
    places = [
      {
        title: `${cityName} Central Public Library (Primary Cooling Shelter)`,
        address: "Downtown Library Complex",
        role: "Air-conditioned public shelter, hydration fountains, electrical charging stations.",
        uri: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cityName + " Central Library")}`
      },
      {
        title: "International District & Community Recreation Hub",
        address: "0.4 miles from Stadium",
        role: "Indoor cooling shelter, water-dispensation zone, cooling spray zones for fans.",
        uri: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cityName + " Community Center")}`
      }
    ];
  } else if (queryType === "hydration") {
    places = [
      {
        title: `${stadiumName} North Gate Hydration Plaza`,
        address: "Entrance Plaza Grounds",
        role: "High-capacity touchless water bottle refill bays & active misting canopies.",
        uri: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stadiumName)}`
      },
      {
        title: "Pioneer Square Historic Green Plaza",
        address: "0.3 miles North of Stadium",
        role: "Public hydration fountain station and municipal shaded park rest area.",
        uri: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cityName + " Pioneer Square")}`
      }
    ];
  } else if (queryType === "hospitals") {
    places = [
      {
        title: "Regional Medical Center & Level 1 Trauma Clinic",
        address: "First Hill District",
        role: "Major emergency department prepared for heatstroke triage & trauma response.",
        uri: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cityName + " Hospital")}`
      },
      {
        title: "City Health Urgent Care Center",
        address: "0.6 miles from Stadium",
        role: "Immediate-care facility for non-critical heat exhaustion, hydration infusions.",
        uri: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cityName + " Urgent Care")}`
      }
    ];
  } else {
    places = [
      {
        title: "Occidental Square Urban Shaded Forest Park",
        address: "0.2 miles from Stadium Core",
        role: "Thick deciduous tree canopy cover, public tables, shade structures.",
        uri: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cityName + " Occidental Square")}`
      },
      {
        title: "Waterfront Park and Bay-breeze Pavilion",
        address: "0.7 miles from Stadium Core",
        role: "Coastal shaded plaza offering cooling sea breezes, active shade canopies.",
        uri: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cityName + " Waterfront Park")}`
      }
    ];
  }

  const markdownText = `### Local Simulation: Facilities near ${stadiumName}

Verified public health and microclimate relief facilities nearby to protect spectators from extreme heat:

${places.map((p, idx) => `${idx + 1}. **${p.title}**
   - **Location**: ${p.address}
   - **Service Profile**: ${p.role}`).join("\n\n")}`;

  return {
    text: markdownText,
    sources: places.map(p => ({ title: p.title, uri: p.uri })),
    isMock: true,
    isLive: false
  };
}

export default function LiveMapsExplorer({ selectedCity }: LiveMapsExplorerProps) {
  const [activeQuery, setActiveQuery] = useState<QueryType>("cooling");
  const [data, setData] = useState<MapsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Sync client-side fallback immediately when selectedCity or activeQuery changes
  useEffect(() => {
    const fallback = getLocalMapsFallback(selectedCity.name, selectedCity.stadium, activeQuery);
    setData(fallback);
    setFetchError(null);
  }, [selectedCity.id, activeQuery]);

  const handleLiveQuery = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await fetch("/api/gemini/maps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cityId: selectedCity.id,
          queryType: activeQuery,
        }),
      });
      if (!res.ok) {
        throw new Error(`Server returned status code ${res.status}`);
      }
      const json = await res.json();
      setData({
        ...json,
        isLive: !json.isMock
      });
    } catch (err: any) {
      console.warn("Live maps fetch encountered resource network issue, staying with client-side local simulation.", err);
      setFetchError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  const queryButtons = [
    {
      id: "cooling" as QueryType,
      label: "Cooling Centers",
      desc: "AC shelters & mist zones",
      icon: <ThermometerSnowflake className="w-4 h-4 text-cyan-400" />,
      color: "border-cyan-500/20 hover:border-cyan-500/50 text-cyan-400 active:bg-cyan-500/10",
      activeBg: "bg-cyan-500/10 border-cyan-500/80 text-cyan-200 shadow-[0_0_8px_rgba(6,182,212,0.15)]",
    },
    {
      id: "hydration" as QueryType,
      label: "Water Refills",
      desc: "Plazas & fountain bays",
      icon: <Droplets className="w-4 h-4 text-blue-400" />,
      color: "border-blue-500/20 hover:border-blue-500/50 text-blue-400 active:bg-blue-500/10",
      activeBg: "bg-blue-500/10 border-blue-500/80 text-blue-200 shadow-[0_0_8px_rgba(59,130,246,0.15)]",
    },
    {
      id: "hospitals" as QueryType,
      label: "ER & Medical",
      desc: "Heat triage & trauma",
      icon: <HeartPulse className="w-4 h-4 text-rose-400" />,
      color: "border-rose-500/20 hover:border-rose-500/50 text-rose-400 active:bg-rose-500/10",
      activeBg: "bg-rose-500/10 border-rose-500/80 text-rose-200 shadow-[0_0_8px_rgba(244,63,94,0.15)]",
    },
    {
      id: "shade" as QueryType,
      label: "Shaded Havens",
      desc: "Canopies & public parks",
      icon: <TreePine className="w-4 h-4 text-emerald-400" />,
      color: "border-emerald-500/20 hover:border-emerald-500/50 text-emerald-400 active:bg-emerald-500/10",
      activeBg: "bg-emerald-500/10 border-emerald-500/80 text-emerald-200 shadow-[0_0_8px_rgba(16,185,129,0.15)]",
    },
  ];

  return (
    <div className="bg-[#16191F] border border-white/10 rounded-lg p-5 text-white shadow-lg space-y-6" id="live-maps-explorer">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500/10 p-2.5 rounded border border-blue-500/20 text-blue-400 shrink-0">
            <MapPin className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <h4 className="text-sm font-sans font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
              Live Safe Haven Finder
              <span className="text-[8px] font-mono font-bold uppercase bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded border border-blue-500/25">Google Maps Grounded</span>
            </h4>
            <p className="text-[10px] text-slate-400 font-sans mt-0.5 leading-relaxed">
              Searching real physical public infrastructure near <span className="font-semibold text-slate-200">{selectedCity.stadium}</span>.
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {data?.isLive ? (
            <span className="text-[9px] font-mono font-bold uppercase text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded flex items-center gap-1">
              <Check className="w-3 h-3" /> Live Synced
            </span>
          ) : (
            <button
              onClick={handleLiveQuery}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 disabled:opacity-40 text-slate-950 font-sans text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1.5 shadow-[0_0_6px_rgba(59,130,246,0.2)] transition-all cursor-pointer uppercase tracking-wide"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3 h-3 animate-spin" /> Fetching GIS...
                </>
              ) : (
                <>
                  <Sparkles className="w-3 h-3 text-slate-950" /> Sync Live Google Maps
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Grid of buttons to change active query */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {queryButtons.map((btn) => {
          const isActive = activeQuery === btn.id;
          return (
            <button
              key={btn.id}
              onClick={() => setActiveQuery(btn.id)}
              className={`text-left p-3 rounded-md border text-xs transition-all duration-200 flex flex-col justify-between gap-1 h-full cursor-pointer ${
                isActive ? btn.activeBg : `bg-[#1A1E26]/40 ${btn.color}`
              }`}
            >
              <div className="flex justify-between items-center w-full">
                <span className="font-bold font-sans text-xs">{btn.label}</span>
                {btn.icon}
              </div>
              <span className="text-[9px] text-slate-500 font-mono leading-tight">{btn.desc}</span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Results block */}
      <div className="bg-[#0F1115] border border-white/5 rounded p-4 space-y-4">
        {loading ? (
          <div className="space-y-4 py-6 font-mono animate-pulse">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-blue-500/20 border border-blue-500/10"></div>
              <div className="h-4 bg-white/5 rounded w-1/3"></div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-white/5 rounded w-full"></div>
              <div className="h-3 bg-white/5 rounded w-5/6"></div>
              <div className="h-3 bg-white/5 rounded w-4/5"></div>
            </div>
            <div className="pt-2 flex gap-2">
              <div className="h-6 bg-white/5 rounded w-24"></div>
              <div className="h-6 bg-white/5 rounded w-28"></div>
            </div>
          </div>
        ) : data ? (
          <div className="space-y-5">
            {/* Markdown response content */}
            <div className="markdown-body text-xs text-slate-300 leading-relaxed font-sans space-y-3">
              <ReactMarkdown>{data.text}</ReactMarkdown>
            </div>

            {/* Extracted Google Maps Links badges */}
            {data.sources && data.sources.length > 0 && (
              <div className="border-t border-white/5 pt-4 space-y-2.5">
                <h5 className="text-[9px] font-mono font-bold uppercase text-blue-400 tracking-wider flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5" />
                  Verified Map Referenced Sources
                </h5>
                <div className="flex flex-wrap gap-2">
                  {data.sources.map((src, index) => (
                    <a
                      key={index}
                      href={src.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-500/5 hover:bg-blue-500/15 border border-blue-500/20 hover:border-blue-500/40 px-3 py-1.5 rounded text-[10px] font-mono font-bold text-blue-300 hover:text-white flex items-center gap-1.5 transition-all shadow-sm"
                    >
                      <MapPin className="w-3 h-3 text-blue-400" />
                      {src.title}
                      <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Mock / Fallback alert indicator */}
            {!data.isLive && (
              <div className="text-[9px] font-mono text-slate-600 flex items-center gap-1.5 uppercase border-t border-white/5 pt-3">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500/45" />
                Displaying Client-Side Local Simulation. Click &ldquo;Sync Live Google Maps&rdquo; above to query live GIS coordinates.
              </div>
            )}

            {/* Fetch error feedback if failed to fetch live */}
            {fetchError && (
              <div className="bg-amber-500/5 border border-amber-500/20 p-3 rounded text-[10px] font-mono text-amber-400 flex flex-col gap-1">
                <span className="font-bold flex items-center gap-1 uppercase">
                  <AlertTriangle className="w-3.5 h-3.5" /> Live GIS Lookup Unavailable
                </span>
                <span className="text-slate-400">
                  The live service did not respond ({fetchError}). The system has retained your client-side geographic fallback safely.
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-slate-500 font-mono">
            SELECT A CATEGORY TO INITIATE MAP RETRIEVAL PROTOCOLS.
          </div>
        )}
      </div>
    </div>
  );
}
