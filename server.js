import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Proxy endpoint for Anthropic API
app.post("/api/messages", async (req, res) => {
  try {
    const { messages, system, model, max_tokens } = req.body;
    const apiKey = process.env.VITE_ANTHROPIC_KEY;

    console.log("\n=== NEW REQUEST ===");
    console.log("API Key exists:", !!apiKey);
    if (apiKey) {
      console.log("API Key (first 30 chars):", apiKey.substring(0, 30));
    }

    if (!apiKey) {
      console.error("❌ API key not found in environment variables");
      return res.status(500).json({ error: "API key not configured" });
    }

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens,
        system,
        messages,
      }),
    };

    console.log("Headers being sent:", JSON.stringify(options.headers, null, 2));

    const response = await fetch("https://api.anthropic.com/v1/messages", options);
    const data = await response.json();

    console.log("Response status:", response.status);
    if (!response.ok) {
      console.error("❌ API Error:", response.status);
      console.error("Full error response:", JSON.stringify(data, null, 2));
      return res.status(response.status).json(data);
    }

    console.log("✓ Got response from Anthropic");
    res.json(data);
  } catch (error) {
    console.error("❌ Server error:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
  console.log(`API Key loaded: ${process.env.VITE_ANTHROPIC_KEY ? "✓ Yes" : "✗ No"}`);
});
