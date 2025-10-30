import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const BACKEND_PORT = process.env.PORT || 3000;

// in-memory store for demo only
let disabledListings = new Set();

// --- ROUTES ---

app.get("/", (req, res) => res.send("Trustap demo backend is running"));

// create transaction
app.post("/create-transaction", async (req, res) => {
  const { seller_email, price, item_name, image_url } = req.body;
  try {
    const payload = {
      seller_email,
      seller_country_code: "ie",
      currency: "eur",
      description: item_name,
      value: price,
      ad_id: "demo-ad-001",
      image_url
    };

    const r = await fetch(
      "https://dev.stage.trustap.com/api/v1/p2p/listings/create_with_seller",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Basic " +
            Buffer.from(process.env.TRUSTAP_API_KEY + ":").toString("base64"),
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await r.json();
    const redirectUri = "https://adrian-trustap.github.io/trustap-demo/";

    if (data.actions_url) {
      data.pay_deposit_url = `${data.actions_url}?redirect_uri=${redirectUri}`;
    }

    console.log("Trustap response (modified):", data);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// webhook
app.post("/webhook", (req, res) => {
  console.log("Webhook received:", JSON.stringify(req.body, null, 2));

  const { code, metadata } = req.body;
  const adId = metadata?.ad_id || "588a98";

  if (code === "reservation_disabled" || code === "p2p_tx.deposit_accepted") {
    console.log("➡️ Listing disabled for:", adId);
    disabledListings.add(adId);
  }

  if (code === "reservation_enabled" || code === "p2p_tx.cancelled") {
    console.log("➡️ Listing re-enabled for:", adId);
    disabledListings.delete(adId);
  }

  res.sendStatus(200);
});

// listing status
app.get("/listings/:adId/status", (req, res) => {
  const adId = req.params.adId;
  res.json({ disabled: disabledListings.has(adId) });
});

// reset
app.post("/listings/:adId/reset", (req, res) => {
  const adId = req.params.adId;
  disabledListings.delete(adId);
  res.json({ disabled: false });
});

// --- START SERVER ---
app.listen(BACKEND_PORT, () => {
  console.log(`Trustap demo backend listening on port ${BACKEND_PORT}`);
});
