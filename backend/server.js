import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Simple healthcheck
app.get("/", (req, res) => {
  res.send("Trustap demo backend is running");
});

// Webhook listener
app.post("/webhook", (req, res) => {
  console.log("Webhook received:", req.body);
  // TODO: verify signature if Trustap sends one
  // handle event (e.g., reservation created)
  res.status(200).send("ok");
});

// Simple proxy endpoint if you want to call Trustap from frontend
app.post("/create-transaction", async (req, res) => {
  try {
    // you would use fetch/axios to call Trustap API here with your secret
    // example: const r = await fetch("https://api.trustap.com/...", {...});
    res.json({ message: "Transaction created (placeholder)" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Backend listening on port ${port}`));
