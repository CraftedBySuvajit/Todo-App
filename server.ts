import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";


dotenv.config();



const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// AI Endpoints
app.post("/api/ai/generate-tasks", async (req, res) => {
  try {
    const { goal, count = 5, negativePrompt = "" } = req.body;
    if (!goal) return res.status(400).json({ error: "Goal is required" });

    const prompt = `You are Todo App, a high-performance productivity assistant specifically helping the user achieve their goals. 
      The user's current goal is: "${goal}". 
      Break this down into exactly ${count} actionable tasks. Make them professional, clear, and focused on momentum.
      ${negativePrompt ? `IMPORTANT CONSTRAINTS: Do NOT include task types related to: "${negativePrompt}".` : ""}`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              priority: { type: Type.STRING, enum: ["low", "medium", "high"] },
              tags: { type: Type.ARRAY, items: { type: Type.STRING } },
              notes: { type: Type.STRING }
            },
            required: ["title", "priority", "tags", "notes"]
          }
        }
      }
    });

    const result = JSON.parse(response.text || "[]");
    res.json(result);
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: "Failed to generate tasks" });
  }
});

app.post("/api/ai/analyze-selection", async (req, res) => {
  try {
    const { tasks, message } = req.body;
    if (!tasks || !Array.isArray(tasks)) return res.status(400).json({ error: "Tasks array is required" });

    const tasksCtx = tasks.map(t => `- [${t.status}] ${t.title} (${t.priority} priority)${t.notes ? `: ${t.notes}` : ''}`).join('\n');
    
    const prompt = `You are Todo App AI, a strategic productivity consultant.
      The user has selected the following tasks for analysis:
      ${tasksCtx}
      
      User Message: "${message || "Analyze these tasks and give me 3-4 professional suggestions to optimize my work or next steps."}"
      
      Respond with professional, actionable, and encouraging advice. Keep it concise. Focus on high-impact strategies. Use bullet points if helpful.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    res.json({ text: response.text });
  } catch (error) {
    console.error("AI Analysis Error:", error);
    res.status(500).json({ error: "Failed to analyze selection" });
  }
});

// Vite middleware for development
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }
}

setupVite().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
