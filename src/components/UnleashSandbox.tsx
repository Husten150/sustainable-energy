import React, { useState } from "react";
import { HostCity, UnleashSolution } from "../types";
import { Sparkles, Trophy, Lightbulb, CheckSquare, Presentation, HelpCircle, ArrowRight, RefreshCw, AlertTriangle, FileText, Share2 } from "lucide-react";

interface UnleashSandboxProps {
  selectedCity: HostCity;
}

export default function UnleashSandbox({ selectedCity }: UnleashSandboxProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [challengeArea, setChallengeArea] = useState("Public Health & Heat");
  const [problemStatement, setProblemStatement] = useState(
    `Spectators and neighborhood residents in ${selectedCity.name} suffer severe heat-related strain and dehydration due to high asphalt temperatures (UHI) around the transit pathways during high-attendance World Cup fixtures.`
  );
  const [userIdea, setUserIdea] = useState(
    "Set up temporary lightweight wooden pergolas with local climbing vines and integrated solar-powered high-pressure water misting nozzles to create zero-carbon 'shade pathways' along key spectator transit lanes."
  );

  const [evaluation, setEvaluation] = useState<UnleashSolution | null>(null);
  const [loading, setLoading] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleEvaluate = async () => {
    setLoading(true);
    setEvaluation(null);
    setErrorMsg(null);
    try {
      const response = await fetch("/api/unleash/ideate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cityId: selectedCity.id,
          userIdea,
          challengeArea,
        }),
      });
      
      if (!response.ok) {
        let errMsg = `Server responded with status ${response.status}`;
        try {
          const errData = await response.json();
          if (errData && errData.error) {
            errMsg = errData.error;
          } else if (errData && errData.message) {
            errMsg = errData.message;
          }
        } catch {
          // Response body was not JSON (could be Express error HTML page)
          try {
            const text = await response.text();
            if (text && text.length < 500) {
              errMsg = text;
            }
          } catch {
            // ignore
          }
        }
        throw new Error(errMsg);
      }
      
      const data = await response.json();
      setEvaluation(data);
      setStep(3); // Go to results step
    } catch (error: any) {
      console.error("Evaluation failed", error);
      setErrorMsg(error?.message || String(error));
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 2000);
  };

  return (
    <div className="bg-[#16191F] border border-white/10 rounded p-6 shadow-lg space-y-6" id="unleash-sandbox-container">
      {/* Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#1A1E26] text-white rounded border border-white/10 p-5 relative overflow-hidden shadow-md">
        <div className="relative z-10 space-y-1.5">
          <span className="text-[9px] font-mono uppercase tracking-widest text-emerald-400 font-bold">Innovation Co-Laboratory</span>
          <h3 className="text-sm font-sans font-extrabold uppercase tracking-wider">UNLEASH Innovation Sandbox</h3>
          <p className="text-xs text-slate-400 max-w-xl">
            Translate sustainability problems into concrete, localized interventions using the UNLEASH Innovation Methodology. Frame, Ideate, and Prototype.
          </p>
        </div>
        <div className="bg-emerald-500/10 p-2.5 rounded border border-emerald-500/20 shrink-0 self-start text-emerald-400">
          <Trophy className="w-5 h-5" />
        </div>
      </div>

      {/* UNLEASH Progress Path */}
      <div className="flex items-center gap-2 p-1 bg-[#0F1115] rounded border border-white/5">
        <button
          onClick={() => setStep(1)}
          className={`flex-1 py-1.5 text-xs font-mono font-bold uppercase rounded flex items-center justify-center gap-2 transition-all ${
            step === 1 ? "bg-[#1A1E26] text-white border border-white/10" : "text-slate-500 hover:text-slate-300"
          }`}
        >
          <span className="w-4 h-4 rounded bg-[#0F1115] border border-white/5 flex items-center justify-center text-[9px]">1</span>
          Frame Problem
        </button>
        <div className="text-slate-700 font-mono">/</div>
        <button
          onClick={() => setStep(2)}
          className={`flex-1 py-1.5 text-xs font-mono font-bold uppercase rounded flex items-center justify-center gap-2 transition-all ${
            step === 2 ? "bg-[#1A1E26] text-white border border-white/10" : "text-slate-500 hover:text-slate-300"
          }`}
        >
          <span className="w-4 h-4 rounded bg-[#0F1115] border border-white/5 flex items-center justify-center text-[9px]">2</span>
          Ideate & Build
        </button>
        <div className="text-slate-700 font-mono">/</div>
        <button
          disabled={!evaluation}
          onClick={() => setStep(3)}
          className={`flex-1 py-1.5 text-xs font-mono font-bold uppercase rounded flex items-center justify-center gap-2 transition-all disabled:opacity-40 ${
            step === 3 ? "bg-[#1A1E26] text-white border border-white/10" : "text-slate-500 hover:text-slate-300"
          }`}
        >
          <span className="w-4 h-4 rounded bg-[#0F1115] border border-white/5 flex items-center justify-center text-[9px]">3</span>
          Prototype Pitch
        </button>
      </div>

      {/* Step 1: Framing */}
      {step === 1 && (
        <div className="space-y-4" id="sandbox-step-1">
          <div className="space-y-1">
            <h4 className="text-xs font-sans font-extrabold uppercase tracking-wide text-white flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-emerald-400" />
              Identify the local Friction Point
            </h4>
            <p className="text-xs text-slate-400 font-mono">DEFINE THE EXACT PROBLEM STATEMENT TARGETED AT {selectedCity.name.toUpperCase()}.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1 space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-400">Challenge Track Area</label>
              <select
                id="challenge-select"
                value={challengeArea}
                onChange={(e) => setChallengeArea(e.target.value)}
                className="w-full text-xs font-sans p-2.5 bg-[#1A1E26] border border-white/10 rounded text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="Energy-Food-Water Nexus">Track 2: Energy–Food–Water Nexus</option>
                <option value="Public Health & Heat">Track 3: Public Health & Built Environment</option>
                <option value="Solid Waste & Recycling">Circular waste management</option>
                <option value="Transit & Rail Efficiency">Sustainable transportation grid</option>
              </select>
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-400">Formulated Problem Statement</label>
              <textarea
                id="problem-statement-textarea"
                rows={3}
                value={problemStatement}
                onChange={(e) => setProblemStatement(e.target.value)}
                className="w-full text-xs font-sans p-2.5 bg-[#1A1E26] border border-white/10 rounded text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 leading-relaxed"
                placeholder="Formulate your problem statement here..."
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setStep(2)}
              className="bg-emerald-500 hover:bg-emerald-600 text-[#0F1115] font-sans text-xs font-extrabold px-4 py-2 rounded flex items-center gap-1.5 shadow-[0_0_8px_rgba(16,185,129,0.25)] transition-all uppercase tracking-wider"
            >
              Continue to Ideation
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Ideation */}
      {step === 2 && (
        <div className="space-y-4" id="sandbox-step-2">
          <div className="space-y-1">
            <h4 className="text-xs font-sans font-extrabold uppercase tracking-wide text-white flex items-center gap-1.5">
              <CheckSquare className="w-4 h-4 text-emerald-400" />
              Propose Your Sustainable Solution Prototype
            </h4>
            <p className="text-xs text-slate-400 font-mono">DESCRIBE YOUR PRODUCT, TECHNOLOGY, OR POLICY MECHANISM TO SOLVE THIS CHALLENGE.</p>
          </div>

          <div className="space-y-2">
            <textarea
              id="solution-idea-textarea"
              rows={4}
              value={userIdea}
              onChange={(e) => setUserIdea(e.target.value)}
              className="w-full text-xs font-sans p-3 bg-[#1A1E26] border border-white/10 rounded text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 leading-relaxed"
              placeholder="E.g., Design solar-powered cooling bus fleets that deploy water refills and mobile cooling canopies around the transit corridors..."
            />
            <span className="text-[10px] text-slate-500 block font-mono uppercase tracking-wider">
              *Pro tip: The most successful UNLEASH ideas balance ecological impact with material and local deployment feasibility.
            </span>
          </div>

          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/30 rounded p-3.5 flex items-start gap-3 text-red-400 text-xs font-sans">
              <AlertTriangle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
              <div>
                <strong className="font-extrabold uppercase text-[10px] font-mono tracking-wider block text-red-500">Evaluation Engine Exception</strong>
                <p className="mt-1 text-slate-300 font-mono text-[11px] leading-relaxed break-all bg-black/20 p-2 rounded border border-white/5">{errorMsg}</p>
                <p className="mt-2 text-[10px] text-slate-400">
                  Please verify that the development server is active on port 3000, and ensure your GEMINI_API_KEY is correctly set in your environment or Secrets tab.
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => setStep(1)}
              className="text-slate-400 hover:text-white font-mono text-xs uppercase font-bold px-4 py-2"
            >
              Back
            </button>
            <button
              onClick={handleEvaluate}
              disabled={loading || userIdea.length < 10}
              className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-[#0F1115] font-sans text-xs font-extrabold px-4 py-2.5 rounded flex items-center gap-2 shadow-[0_0_8px_rgba(16,185,129,0.25)] transition-all uppercase tracking-wider"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Evaluating Prototype...
                </>
              ) : (
                <>
                  Evaluate Solution with AI
                  <Sparkles className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Pitch Card Results */}
      {step === 3 && evaluation && (
        <div className="space-y-6" id="sandbox-step-3">
          {/* Solution Pitch Card */}
          <div className="bg-[#1A1E26] rounded border border-white/10 p-6 space-y-6 relative overflow-hidden shadow-lg" id="unleash-pitch-card">
            {/* Stamp / Tag overlay */}
            <div className="absolute top-4 right-4 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[8px] uppercase tracking-widest font-extrabold px-3 py-1 rounded">
              UNLEASH INNOVATION PITCH
            </div>

            <div className="space-y-1.5">
              <span className="text-[9px] uppercase font-mono tracking-wider text-emerald-400 font-bold">{challengeArea} • {selectedCity.name.toUpperCase()}</span>
              <h4 className="text-base font-sans font-extrabold uppercase text-white leading-tight flex items-center gap-1.5">
                {evaluation.solutionName}
              </h4>
            </div>

            <hr className="border-white/5" />

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#16191F] rounded border border-white/5 p-3 text-center">
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold font-mono">Ecological Impact</span>
                <div className="text-lg font-mono font-extrabold text-emerald-400 mt-1">{evaluation.impactScore}/100</div>
              </div>
              <div className="bg-[#16191F] rounded border border-white/5 p-3 text-center">
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold font-mono">Feasibility Score</span>
                <div className="text-lg font-mono font-extrabold text-blue-400 mt-1">{evaluation.feasibilityScore}/100</div>
              </div>
              <div className="bg-[#16191F] rounded border border-white/5 p-3 text-center">
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold font-mono">Nexus Balance</span>
                <div className="text-xs font-mono font-bold text-slate-200 mt-2 truncate">{evaluation.nexusMultiplier}</div>
              </div>
            </div>

            {/* Strengths & Improvements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
              <div className="bg-[#16191F] rounded border border-white/5 p-4 space-y-2">
                <div className="font-extrabold uppercase text-[10px] font-mono tracking-wider text-white flex items-center gap-1">
                  <span className="text-emerald-400 font-extrabold font-mono">✓</span> Innovation Strengths
                </div>
                <ul className="list-disc list-inside space-y-1.5 text-slate-400 leading-relaxed text-[11px]">
                  {evaluation.strengths.map((str, idx) => (
                    <li key={idx}>{str}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#16191F] rounded border border-white/5 p-4 space-y-2">
                <div className="font-extrabold uppercase text-[10px] font-mono tracking-wider text-white flex items-center gap-1">
                  <span className="text-emerald-400 font-extrabold font-mono">✦</span> Areas for Refinement
                </div>
                <ul className="list-disc list-inside space-y-1.5 text-slate-400 leading-relaxed text-[11px]">
                  {evaluation.improvements.map((imp, idx) => (
                    <li key={idx}>{imp}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Mentor Review */}
            <div className="bg-[#16191F] rounded border border-emerald-500/10 p-4 space-y-1.5">
              <div className="text-[8px] font-mono font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> UNLEASH Facilitator Feedback
              </div>
              <p className="text-xs text-slate-400 italic leading-relaxed font-sans">
                &ldquo;{evaluation.feedback}&rdquo;
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2">
            <button
              onClick={() => setStep(2)}
              className="text-slate-400 hover:text-white font-mono text-xs font-bold uppercase flex items-center gap-1"
            >
              ← Edit Prototype
            </button>

            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={handleShare}
                className="flex-1 sm:flex-initial bg-[#1A1E26] hover:bg-[#222731] text-white border border-white/10 font-mono text-xs font-bold uppercase px-4 py-2.5 rounded flex items-center justify-center gap-1.5"
              >
                <Share2 className="w-4 h-4" />
                {shareSuccess ? "Copied Pitch Link!" : "Share Pitch Card"}
              </button>
            </div>
          </div>
          
          {evaluation.isMock && (
            <div className="space-y-2 max-w-3xl mx-auto">
              <div className="text-[9px] font-mono text-slate-500 flex items-center gap-1 justify-center mt-1 uppercase">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500/50" />
                Evaluation created via fail-safe client heuristic model. To activate complete Gemini evaluation, verify key.
              </div>
              {evaluation.errorDetails && (
                <div className="bg-[#1D1E24] border border-amber-500/20 text-amber-400 text-[10px] font-mono p-3 rounded leading-relaxed whitespace-pre-wrap">
                  <div className="font-extrabold text-[9px] uppercase tracking-wider text-amber-500 mb-1.5 flex items-center gap-1 justify-center">
                    <AlertTriangle className="w-3 h-3" /> Server Diagnostic Log (Gemini Connection Status)
                  </div>
                  <div className="bg-black/30 p-2 rounded border border-white/5 text-slate-300 text-center break-all">{evaluation.errorDetails}</div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
