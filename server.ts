import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory leads storage
interface LeadRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  investmentGoal: string;
  investmentAmount: number;
  investmentMode: string;
  riskProfile?: string;
  recommendedFunds?: string[];
  message?: string;
  sourcePage?: string;
  createdAt: string;
  status: string;
}

const leadsDatabase: LeadRecord[] = [];
const visitorLogs: any[] = [];

// Lazy-initialized Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    app: "WealthyWiz",
    timestamp: new Date().toISOString(),
    geminiAvailable: !!process.env.GEMINI_API_KEY,
    leadsCount: leadsDatabase.length,
    visitorsCount: visitorLogs.length,
  });
});

// Leads Endpoints
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xljrqnzg';

app.post("/api/leads", async (req, res) => {
  try {
    const { name, email, phone, investmentGoal, investmentAmount, investmentMode, riskProfile, recommendedFunds, message, sourcePage } = req.body;
    
    if (!name || !email || !phone) {
      return res.status(400).json({ error: "Name, email and phone are required." });
    }

    const newLead: LeadRecord = {
      id: req.body.id || `LW-${Date.now().toString().slice(-6)}`,
      name,
      email,
      phone,
      investmentGoal: investmentGoal || 'Wealth Creation',
      investmentAmount: Number(investmentAmount) || 10000,
      investmentMode: investmentMode || 'monthly_sip',
      riskProfile: riskProfile || 'Not Specified',
      recommendedFunds: recommendedFunds || [],
      message: message || '',
      sourcePage: sourcePage || '/',
      createdAt: new Date().toISOString(),
      status: 'new',
    };

    leadsDatabase.unshift(newLead);
    console.log(`[WealthyWiz Lead Captured] Ref: ${newLead.id}, Name: ${newLead.name}, Email: ${newLead.email}`);

    // Asynchronously forward to Formspree
    fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        name: newLead.name,
        email: newLead.email,
        phone: newLead.phone,
        investmentGoal: newLead.investmentGoal,
        investmentAmount: `₹${newLead.investmentAmount.toLocaleString('en-IN')}`,
        investmentMode: newLead.investmentMode === 'monthly_sip' ? 'Monthly SIP' : 'One-Time Lumpsum',
        riskProfile: newLead.riskProfile,
        recommendedFunds: Array.isArray(newLead.recommendedFunds) ? newLead.recommendedFunds.join(', ') : newLead.recommendedFunds,
        message: newLead.message || 'No additional notes provided',
        leadId: newLead.id,
        sourcePage: newLead.sourcePage,
        submittedAt: newLead.createdAt,
        _subject: `New WealthyWiz Advisory Lead: ${newLead.name} (${newLead.investmentGoal})`,
      }),
    }).catch((err) => {
      console.warn("[Formspree Sync Error from server]:", err);
    });

    return res.status(201).json({
      success: true,
      message: "Lead recorded successfully and synced to Formspree",
      lead: newLead,
    });
  } catch (error) {
    console.error("Error logging lead:", error);
    return res.status(500).json({ error: "Failed to store lead." });
  }
});

app.get("/api/leads", (_req, res) => {
  return res.json({
    success: true,
    leads: leadsDatabase,
    count: leadsDatabase.length,
  });
});

// Visitor Tracker Endpoint
app.post("/api/visitors", (req, res) => {
  try {
    const { sessionId, page, referrer, userAgent } = req.body;
    visitorLogs.push({
      sessionId,
      page: page || '/',
      referrer: referrer || 'direct',
      userAgent: userAgent || '',
      timestamp: new Date().toISOString(),
    });
    return res.json({ success: true });
  } catch {
    return res.json({ success: false });
  }
});

// Optional AI Advisor Query Endpoint
app.post("/api/advisor/chat", async (req, res) => {
  try {
    const { message, context } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        reply: "To maximize wealth compounding in Indian mutual funds, maintain a core allocation in Flexi Cap and Large & Mid Cap direct growth plans while matching your SIP to your risk profile.",
        source: "rule_engine",
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: `You are WealthyWiz, an Indian mutual fund advisory expert. Context: ${JSON.stringify(context || {})}. User Question: ${message}`,
      config: {
        systemInstruction: "You are WealthyWiz Mutual Fund Advisor. Provide concise, AMFI-compliant guidance on Indian mutual funds, SIP compounding, and tax planning (Section 80C).",
        temperature: 0.6,
      },
    });

    return res.json({
      reply: response.text || "Keep disciplined with monthly SIPs and review asset allocation annually.",
      source: "gemini-3.7-flash",
    });
  } catch (error) {
    console.error("Advisor API error:", error);
    return res.json({
      reply: "Maintain disciplined SIP investing in diversified direct plans.",
      source: "fallback",
    });
  }
});

// Start Server with Vite or Static
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

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`WealthyWiz Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
