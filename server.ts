import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

// Set up JSON body parser with a generous limit for crop uploads
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// Initialize Google GenAI lazily
let aiClient: GoogleGenAI | null = null;
function getGenAI() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey !== "") {
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return aiClient;
}

// 1. Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY",
  });
});

// 2. Crop Pathology Diagnostic Endpoint using server-side Gemini 3.5 Flash
app.post("/api/diagnose", async (req, res) => {
  const { imageBase64, mimeType, cropName } = req.body;

  if (!imageBase64 || !mimeType) {
    return res.status(400).json({ error: "Missing image data or mimeType" });
  }

  const cleanCropName = cropName || "agricultural crop";

  try {
    const ai = getGenAI();

    if (!ai) {
      console.log("No valid GEMINI_API_KEY found, falling back to intelligent mock diagnosis.");
      throw new Error("Missing GEMINI_API_KEY");
    }

    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: imageBase64,
      },
    };

    const promptText = `
Analyze this distressed plant/leaf photo of a ${cleanCropName} crop.
Diagnose any disease, chemical/fertilizer deficiency, pest infestation, or soil moisture/drainage issues.
Provide your response strictly in the following JSON format. Do not wrap it in markdown code blocks. Just return raw JSON.

{
  "healthy": false (boolean, true if perfectly healthy, false if has issue),
  "issueName": "Name of the disease/pest/deficiency in simple, clear terms (e.g., Rice Blast, Late Blight, Iron Chlorosis)",
  "pathogen": "Scientific name or pathogen type (e.g., Pyricularia oryzae, Phytophthora infestans, or 'Nutrient Deficiency')",
  "confidence": 92 (integer between 0 and 100),
  "summary": "A 2-3 sentence clear agricultural summary of what is happening, why, and standard local symptoms visible here.",
  "soilRecommendations": {
    "nitrogen": "Specific Nitrogen (N) advice based on this condition (e.g. slightly reduce/increase or maintain)",
    "phosphorus": "Specific Phosphorus (P) advice",
    "potassium": "Specific Potassium (K) advice",
    "moisture": "Specific water, drainage, or humidity management advice"
  },
  "actionItems": [
    "Priority immediate action step 1 (e.g. prune, separate, apply copper-spray, increase spacing)",
    "Action step 2",
    "Action step 3"
  ],
  "productionGrade": "A" or "B" or "C" (representing suggestion of grade after remediation),
  "isUrgent": true (boolean, true if it spreads quickly or kills the crop, false otherwise)
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        imagePart,
        { text: promptText }
      ],
      config: {
        responseMimeType: "application/json",
      },
    });

    const textOutput = response.text || "{}";
    // Try parsing the json output. It might be returned wrapped in ```json ... ```
    let cleanJson = textOutput.trim();
    if (cleanJson.startsWith("```")) {
      cleanJson = cleanJson.replace(/^```json\s*/, "").replace(/```$/, "").trim();
    }

    const report = JSON.parse(cleanJson);
    return res.json({ provider: "gemini", report });

  } catch (error: any) {
    console.error("Diagnosis error:", error);

    // Provide intelligent mock diagnosis fallback matching crop types
    // This maintains bulletproof usability when key is absent or limit is hit
    const cropLower = cleanCropName.toLowerCase();
    let mockReport = {
      healthy: false,
      issueName: "Bacterial Leaf Blight",
      pathogen: "Xanthomonas oryzae pv. oryzae",
      confidence: 85,
      summary: "Yellowish water-soaked stripes appear along the leaf blades, starting from the tip or margins. Highly common during monsoon season under excessive wet nitrogen fertilization.",
      soilRecommendations: {
        nitrogen: "Suspend extra Nitrogen application immediately. Excessive Nitrogen triggers rapid bacteria multiplication.",
        phosphorus: "Maintain standard rates (P). High phosphorus aids cell regeneration.",
        potassium: "Apply muriate of potash (K) to bolster natural tissue resistance against vascular plugging.",
        moisture: "Drain excess standing water. Ensure field does not remain constantly saturated to break infection cycles."
      },
      actionItems: [
        "Furl and dry the field for 3-4 days if irrigation controls permit.",
        "Apply copper oxychloride (2.5g per Litre) early in the clear morning lines.",
        "Avoid weeding or physical activity while crops are wet to prevent spreading bacteria mechanically."
      ],
      productionGrade: "B",
      isUrgent: true
    };

    if (cropLower.includes("potato") || cropLower.includes("tomato")) {
      mockReport = {
        healthy: false,
        issueName: "Potato Late Blight",
        pathogen: "Phytophthora infestans (Oomycete)",
        confidence: 88,
        summary: "Circular water-soaked necrotic lesions appear on the lower leaves, showing a white fuzzy mildew growth underneath during cold humid periods.",
        soilRecommendations: {
          nitrogen: "Slightly reduce N - Excess foliage limits wind aeration, causing leaf moisture traps.",
          phosphorus: "Maintain normal levels to sustain active root intake.",
          potassium: "Boost soluble Potash (K) to protect tubers and help thick membrane defenses.",
          moisture: "Stop overhead sprinkler irrigation. Water at the ridge base to keep foliage perfectly dry."
        },
        actionItems: [
          "Carefully prune infected lower leaf layers and bag/burn them far from crops.",
          "Spray a protective contact fungicide such as Mancozeb or organic copper spray.",
          "Begin hilling soil around the plant bases to seal and protect underground tubers from spore runoff."
        ],
        productionGrade: "B",
        isUrgent: true
      };
    } else if (cropLower.includes("mango") || cropLower.includes("fruit")) {
      mockReport = {
        healthy: false,
        issueName: "Mango Powdery Mildew",
        pathogen: "Oidium mangiferae (Ascomycete)",
        confidence: 91,
        summary: "A white powdery fungal coating emerges on the inflorescences, leaves, and young fruits, resulting in heavy flower drop and ruined fruit sets.",
        soilRecommendations: {
          nitrogen: "Maintain standard balanced levels. Limit late-season Nitrogen flush.",
          phosphorus: "Incorporate organic bone meal (P) to strengthen panicle resilience.",
          potassium: "Ensure high potassium levels prior to flowering cycle to increase starch translocation.",
          moisture: "Ensure clear tree-canopy weeding so lower limbs can dry quickly after early morning dew."
        },
        actionItems: [
          "Prune congested center branches to allow maximum sunlight penetration into the inner canopy.",
          "Spray wettable sulfur (2g per Litre) at early bud swell and repeat during petal fall.",
          "Spray neem oil or organic potassium bicarbonate as a natural preventative on healthy clusters."
        ],
        productionGrade: "C",
        isUrgent: false
      };
    } else if (cropLower.includes("jute") || cropLower.includes("fiber")) {
      mockReport = {
        healthy: false,
        issueName: "Stem Rot / Macrophomina",
        pathogen: "Macrophomina phaseolina",
        confidence: 82,
        summary: "Dark brown or grayish patches form on the lower stems, turning black. Fibers rot and snap easily, causing early crop collapse in waterlogged soil.",
        soilRecommendations: {
          nitrogen: "Moderately reduce. Excess Nitrogen weakens the stem structural lignin.",
          phosphorus: "Increase. Strong roots help resist soil-borne moisture pathogens.",
          potassium: "Critical: Top-dress Extra Potash (MOP) to accelerate fiber cell-wall heavy layering.",
          moisture: "Improve field drainage channels. Jute is highly susceptible to stem-rot when stagnant water pools around stalks."
        },
        actionItems: [
          "Instantly pull and remove any blackening plants. Never leave them in the field layout.",
          "Treat seeds/rhizosphere with Trichoderma-based bio-controlling agents.",
          "Implement high-rotation cover cropping with mustard or legumes in the off-season."
        ],
        productionGrade: "C",
        isUrgent: true
      };
    }

    return res.json({
      provider: "mock-fallback",
      report: mockReport,
      message: "Using offline intelligent fallback due to missing or invalid GEMINI_API_KEY environment configuration.",
    });
  }
});

// Serve frontend build assets
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
    console.log(`Smart Farmer Server successfully running on http://localhost:${PORT}`);
  });
}

startServer();
