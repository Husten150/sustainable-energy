import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded Gemini AI client to prevent crash if key is missing on start
let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!aiClient) {
    let apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      throw new Error("GEMINI_API_KEY environment variable is missing or using placeholder.");
    }
    apiKey = apiKey.replace(/^["']|["']$/g, "").trim();
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is empty after removing quotes.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Helper to sanitize Gemini response text containing potential markdown JSON blocks
function cleanJsonResponse(text: string): string {
  let cleaned = text.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.substring(3);
  }
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  return cleaned.trim();
}

// Host City profiles metadata for server intelligence
const hostCities = [
  { id: "seattle", name: "Seattle, WA", stadium: "Lumen Field", capacity: 69000, buildYear: 2002, uhiRisk: "Low-Medium", avgSummerTemp: 75, publicTransitScore: 82 },
  { id: "bayarea", name: "San Francisco Bay Area, CA", stadium: "Levi's Stadium", capacity: 68500, buildYear: 2014, uhiRisk: "Medium", avgSummerTemp: 82, publicTransitScore: 70 },
  { id: "losangeles", name: "Los Angeles, CA", stadium: "SoFi Stadium", capacity: 70240, buildYear: 2020, uhiRisk: "High", avgSummerTemp: 85, publicTransitScore: 65 },
  { id: "kansascity", name: "Kansas City, MO", stadium: "Arrowhead Stadium", capacity: 76416, buildYear: 1972, uhiRisk: "Medium-High", avgSummerTemp: 88, publicTransitScore: 40 },
  { id: "dallas", name: "Dallas, TX", stadium: "AT&T Stadium", capacity: 80000, buildYear: 2009, uhiRisk: "Very High", avgSummerTemp: 96, publicTransitScore: 45 },
  { id: "houston", name: "Houston, TX", stadium: "NRG Stadium", capacity: 72220, buildYear: 2002, uhiRisk: "Very High", avgSummerTemp: 94, publicTransitScore: 50 },
  { id: "atlanta", name: "Atlanta, GA", stadium: "Mercedes-Benz Stadium", capacity: 71000, buildYear: 2017, uhiRisk: "High", avgSummerTemp: 89, publicTransitScore: 60 },
  { id: "miami", name: "Miami, FL", stadium: "Hard Rock Stadium", capacity: 64767, buildYear: 1987, uhiRisk: "High", avgSummerTemp: 90, publicTransitScore: 55 },
  { id: "philadelphia", name: "Philadelphia, PA", stadium: "Lincoln Financial Field", capacity: 67594, buildYear: 2003, uhiRisk: "Medium-High", avgSummerTemp: 86, publicTransitScore: 78 },
  { id: "newyork", name: "New York New Jersey", stadium: "MetLife Stadium", capacity: 82500, buildYear: 2010, uhiRisk: "High", avgSummerTemp: 85, publicTransitScore: 85 },
  { id: "boston", name: "Boston, MA", stadium: "Gillette Stadium", capacity: 65878, buildYear: 2002, uhiRisk: "Medium", avgSummerTemp: 82, publicTransitScore: 68 }
];

// Helper to provide a rich fallback when Gemini is unavailable
function getMockCityAnalysis(cityId: string, temp: number, activePolicies: string[]) {
  const city = hostCities.find(c => c.id === cityId) || hostCities[0];
  const totalPolicies = activePolicies.length;
  
  const impactMultiplier = Math.max(0.2, 1 - (totalPolicies * 0.15));
  const heatRisk = temp > 95 ? "CRITICAL" : temp > 85 ? "HIGH" : "MODERATE";
  
  return {
    isMock: true,
    riskLevel: heatRisk,
    nexusTension: temp > 90 ? "Tension high due to extreme grid loads and water requirements." : "Optimal balance in current conditions.",
    analysis: `This is a high-fidelity heuristic simulation. For ${city.name} at ${temp}°F with stadium ${city.stadium} (Capacity: ${city.capacity}):\n\n` +
              `1. **Public Health Risks**: Since temperature is ${temp}°F and local urban heat island risk is rated ${city.uhiRisk}, there is a ${heatRisk} threat of heat stroke. ` +
              `Expected hospital admissions are estimated at ${Math.round((temp * 0.9 + (temp > 90 ? 15 : 2)) * impactMultiplier)} cases/day within the tournament zone.\n` +
              `2. **Energy Grid Load**: HVAC requirements at ${city.stadium} are operating at ${temp > 85 ? "Maximum Cooling" : "Moderate Eco-Cooling"}. ` +
              `Energy consumption sits at approx ${Math.round(250 * (temp / 75) * impactMultiplier)} MWh/day.\n` +
              `3. **Water Stress**: Drinking water demand is amplified. Pitch irrigation requires deep cooling cycles. ` +
              `Water consumption is estimated at ${Math.round(1800 * (temp / 75) * impactMultiplier)} kL/day.\n` +
              `4. **Waste Management**: Spectators will generate approx ${Math.round(45 * (city.capacity / 70000))} tons of mixed waste per match. ` +
              `Current active green policies cover: ${activePolicies.length > 0 ? activePolicies.join(", ") : "None. Please activate interventions above to reduce footprint."}.`,
    interventions: [
      {
        title: "Deploy Additional Hydration Nodes",
        description: `Since temperature is ${temp}°F, set up high-flow drinking water corridors every 100 meters around ${city.stadium} and key transit paths.`,
        feasibility: "High",
        impact: "Reduces emergency health admissions by up to 35%"
      },
      {
        title: "Initiate Stadium Microgrid Grid Peak-Shaving",
        description: `Trigger battery reserve discharge during match halftime hours to prevent substation brownouts in the ${city.name} district.`,
        feasibility: "Medium",
        impact: "Cuts critical grid surge demand by 20%"
      }
    ]
  };
}

// API endpoint to analyze current host city metrics
app.post("/api/gemini/analyze", async (req, res) => {
  const { cityId, temperature, activePolicies } = req.body;
  const city = hostCities.find(c => c.id === cityId);
  
  if (!city) {
    return res.status(400).json({ error: "Invalid city ID" });
  }

  try {
    const ai = getGeminiClient();
    const prompt = `
      You are an expert event sustainability officer and public health climatologist.
      Analyze the following FIFA 2026 Host City Scenario:
      - City: ${city.name}
      - Venue: ${city.stadium} (Capacity: ${city.capacity} spectators, built in ${city.buildYear})
      - Current Scenario Day Ambient Temperature: ${temperature}°F
      - Urban Heat Island Vulnerability: ${city.uhiRisk}
      - Public Transit Score: ${city.publicTransitScore}
      - Currently Implemented Policies/Interventions: ${activePolicies.join(", ") || "None"}

      Provide your feedback in structured JSON format containing:
      - riskLevel: "LOW" | "MODERATE" | "HIGH" | "CRITICAL" (based on temperature, capacity, heat risks)
      - nexusTension: A brief summary sentence of the current stress on the Energy-Food-Water nexus.
      - analysis: A highly detailed analysis paragraph discussing spectator water stress, venue HVAC grid strain, and transit efficiency.
      - interventions: An array of 2-3 specific, actionable physical or logistical interventions that city planners should execute immediately. Each intervention must have 'title', 'description', 'feasibility' (High/Medium/Low), and 'impact' fields.

      Respond ONLY with valid JSON. Do not write markdown blocks or trailing text outside of the JSON.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskLevel: { type: Type.STRING },
            nexusTension: { type: Type.STRING },
            analysis: { type: Type.STRING },
            interventions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  feasibility: { type: Type.STRING },
                  impact: { type: Type.STRING }
                },
                required: ["title", "description", "feasibility", "impact"]
              }
            }
          },
          required: ["riskLevel", "nexusTension", "analysis", "interventions"]
        }
      }
    });

    const text = response.text || "{}";
    const result = JSON.parse(cleanJsonResponse(text));
    res.json(result);
  } catch (error: any) {
    const errorMsg = error instanceof Error ? error.message : (error && typeof error === "object" && "message" in error ? (error as any).message : String(error));
    console.warn("Gemini API error or missing key. Falling back to high-fidelity heuristics.", errorMsg);
    const mockResult = getMockCityAnalysis(cityId, temperature, activePolicies);
    res.json({
      ...mockResult,
      isMock: true,
      errorDetails: errorMsg,
    });
  }
});

// API endpoint for UNLEASH Innovation Sandbox (Ideation)
app.post("/api/unleash/ideate", async (req, res) => {
  const { cityId, userIdea, challengeArea } = req.body;
  const city = hostCities.find(c => c.id === cityId) || hostCities[0];

  try {
    const ai = getGeminiClient();
    const prompt = `
      You are an UNLEASH Innovation Facilitator helping a team prototype a sustainability solution for the FIFA World Cup 2026.
      They have proposed a solution idea.
      
      - City Context: ${city.name} (${city.stadium})
      - Challenge Area: ${challengeArea} (e.g. Energy, Water, Waste, Public Health, Transit)
      - User's Proposed Solution Idea: "${userIdea}"

      Evaluate their solution using the UNLEASH Innovation framework and return a structured JSON response with:
      - solutionName: Create an inspiring, professional name for their solution.
      - impactScore: Score from 1-100.
      - feasibilityScore: Score from 1-100.
      - nexusMultiplier: Impact on the Energy-Food-Water Nexus (e.g. "+15% Water Efficiency, -10% Grid Strain").
      - strengths: An array of 2 strengths of the idea.
      - improvements: An array of 2 concrete suggestions to refine or upscale the prototype.
      - feedback: A friendly, encouraging UNLEASH mentor review (100-150 words).

      Respond ONLY with valid JSON. Do not write markdown blocks or trailing text outside of the JSON.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            solutionName: { type: Type.STRING },
            impactScore: { type: Type.INTEGER },
            feasibilityScore: { type: Type.INTEGER },
            nexusMultiplier: { type: Type.STRING },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
            feedback: { type: Type.STRING }
          },
          required: ["solutionName", "impactScore", "feasibilityScore", "nexusMultiplier", "strengths", "improvements", "feedback"]
        }
      }
    });

    const text = response.text || "{}";
    const result = JSON.parse(cleanJsonResponse(text));
    res.json(result);
  } catch (error: any) {
    const errorMsg = error instanceof Error ? error.message : (error && typeof error === "object" && "message" in error ? (error as any).message : String(error));
    console.warn("Gemini API error or missing key in Sandbox. Returning interactive simulation response.", errorMsg);
    
    // High-quality fallback when Gemini is unavailable
    const randomImpact = Math.round(55 + Math.random() * 30);
    const randomFeasible = Math.round(60 + Math.random() * 30);
    res.json({
      isMock: true,
      errorDetails: errorMsg,
      solutionName: `EcoPulse - ${challengeArea} Optimizer`,
      impactScore: randomImpact,
      feasibilityScore: randomFeasible,
      nexusMultiplier: `+${Math.round(randomImpact * 0.2)}% Resource Savings, -${Math.round(randomFeasible * 0.15)}% Operational Stress`,
      strengths: [
        "Addresses the core problem localized for " + city.stadium,
        "Highly scalable across other host cities due to low starting hardware costs."
      ],
      improvements: [
        "Incorporate real-time sensor feedback to optimize on-the-fly logistics.",
        "Team up with local transit authorities to bundle event tickets with mobile passes."
      ],
      feedback: `Fantastic effort! Your idea to solve the ${challengeArea} challenge in ${city.name} matches the spirit of the UNLEASH Innovation Methodology. By zeroing in on this specific friction point, you've designed a prototype that balances high localized impact with scalable implementation protocols. To further sharpen this, make sure to detail how spectator incentives can drive voluntary compliance!`
    });
  }
});

// Serve frontend assets in production, use Vite middleware in development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
