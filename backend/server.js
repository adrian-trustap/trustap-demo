import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Trustap demo backend is running");
});

// Create Trustap transaction (sandbox)
app.post("/create-transaction", async (req, res) => {
  try {
    const { buyer_email, price, item_name } = req.body;

    const r = await fetch("https://sandbox.trustap.com/api/v2/transactions/lite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.TRUSTAP_API_KEY}`,
      },
      body: JSON.stringify({
        buyer_email: buyer_email,        // your test buyer email
        amount: price,                   // amount in cents or euros (check doc)
        currency: "EUR",
        description: item_name,
        // ...add other fields from the docs as needed
        redirect_url: "https://your-frontend-url/trustap-return" // where to send buyer
      }),
    });

    const data = await r.json();

    if (!r.ok) {
      return res.status(r.status).json({ error: data });
    }

    res.json(data); // send Trustap response back to frontend
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Webhook listener
app.post("/webhook", (req, res) => {
  console.log("Webhook received:", req.body);
  res.status(200).send("ok");
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Backend listening on port ${port}`));
