import process from "node:process";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import multer from "multer";
import { WebSocketServer, WebSocket } from "ws";

const app = express();
const PORT = 3000;
app.use(express.json({ limit: "50mb" }));

// Initialize GenAI
const ai = new GoogleGenAI({});
const upload = multer();

// 1. Core Chat/Search/Thinking Endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message, tools: _tools, mode } = req.body;
    let model = "gemini-3.5-flash"; // default
    const systemInstruction = "You are JARVIS, a highly advanced artificial intelligence created to assist the user. You are polite, efficient, and direct. Provide intelligent suggestions, be honest about limitations, and maintain a futuristic demeanor.";
    const config: Record<string, unknown> = { systemInstruction };
    
    if (mode === "high-thinking") {
      model = "gemini-3.1-pro-preview";
      config.thinkingConfig = { thinkingLevel: "HIGH" };
    } else if (mode === "search") {
      model = "gemini-3.5-flash";
      config.tools = [{ googleSearch: {} }];
    } else if (mode === "vision") {
      model = "gemini-3.1-pro-preview";
    }

    const response = await ai.models.generateContent({
        model,
        contents: message,
        config
    });

    res.json({ text: response.text });
  } catch (error: unknown) {
    console.error("Chat Error:", error);
    res.status(500).json({ error: (error as Error).message });
  }
});

// 2. Text to Speech
app.post("/api/tts", async (req, res) => {
  try {
    const { text } = req.body;
    // Check if TTS works via GenerateContent in v2.4.0
    // The instructions say "gemini-3.1-flash-tts-preview"
    const response = await ai.models.generateContent({
       model: "gemini-3.1-flash-tts-preview",
       contents: text
    });
    
    // Attempt to extract base64 audio
    let audioBase64 = null;
    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData) {
        audioBase64 = part.inlineData.data;
        break;
      }
    }
    
    res.json({ audio: audioBase64 || response.text });
  } catch (error: unknown) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.post("/api/vision", upload.single("image"), async (req, res) => {
  try {
     const { prompt } = req.body;
     const file = req.file;
     if (!file) {
        return res.status(400).json({ error: "No image file provided" });
     }
     
     const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: [
            prompt,
            { inlineData: { data: file.buffer.toString("base64"), mimeType: file.mimetype } }
        ],
        config: { systemInstruction: "You are JARVIS. Analyze the provided image context." }
     });
     
     res.json({ text: response.text });
  } catch (err: unknown) {
     res.status(500).json({ error: (err as Error).message });
  }
});

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
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
  
  // Set up WebSocket proxy for Live API
  const wss = new WebSocketServer({ server });
  
  wss.on("connection", (ws, req) => {
    if (!req.url?.startsWith("/api/live")) return;
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      ws.close(1011, "No API key");
      return;
    }

    const HOST = "generativelanguage.googleapis.com";
    const WS_URL = `wss://${HOST}/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent`;
    
    const geminiWs = new WebSocket(`${WS_URL}?key=${apiKey}`);
    
    geminiWs.on("open", () => {
      // Send initial setup
      geminiWs.send(JSON.stringify({
        setup: {
          model: "models/gemini-3.1-flash-live-preview",
          systemInstruction: {
             parts: [{ text: "You are JARVIS, a highly advanced artificial intelligence created to assist the user. You are polite, efficient, and direct. Voice interactive." }]
          }
        }
      }));
    });

    geminiWs.on("message", (data) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(data);
      }
    });

    ws.on("message", (data) => {
      if (geminiWs.readyState === WebSocket.OPEN) {
        geminiWs.send(data);
      }
    });

    geminiWs.on("close", () => ws.close());
    ws.on("close", () => geminiWs.close());
    geminiWs.on("error", (err) => {
       console.error("Gemini WS Error", err);
       ws.close();
    });
  });
}

startServer();
