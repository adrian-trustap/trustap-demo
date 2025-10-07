import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());



app.use((req,res,next)=>{
  console.log(`${req.method} ${req.url}`, req.headers['content-type']);
  next();
});

const BACKEND_PORT = process.env.PORT || 3000;

app.get("/", (req, res) => res.send("Trustap demo backend is running"));

app.post("/create-transaction", async (req, res) => {
  const { seller_email, price, item_name } = req.body;

  try {
    // Map your frontend fields to Trustap API fields
    const payload = {
      seller_email: seller_email, // or your demo seller email
      seller_country_code: "ie",
      currency: "eur",
      description: item_name,
      value: price,
      ad_id: "demo-ad-001",
    };

    const r = await fetch(
      "https://dev.stage.trustap.com/api/v1/p2p/listings/create_with_seller",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Use HTTP Basic auth: API_KEY + colon, base64 encoded
          Authorization:
            "Basic " +
            Buffer.from(process.env.TRUSTAP_API_KEY + ":").toString("base64"),
        },
        body: JSON.stringify(payload),
      }
    );

 const data = await r.json();
const redirectUri = "https://adrian-trustap.github.io/trustap-demo/";

// trustap returns "actions_url"
if (data.actions_url) {
  data.pay_deposit_url = `${data.actions_url}?redirect_uri=${
    redirectUri
  }`;
}

console.log("Trustap response (modified):", data);
res.json(data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(BACKEND_PORT, () => {
  console.log(`Trustap demo backend listening on port ${BACKEND_PORT}`);
});


// in-memory store for demo only
let disabledListings = new Set();

// Webhook endpoint
app.post("/webhook", (req, res) => {
  console.log("Webhook received:", JSON.stringify(req.body, null, 2));

  const { code, metadata } = req.body;
  const adId = metadata?.ad_id;

  if (!adId) {
    console.log("No ad_id found in webhook");
    return res.sendStatus(200);
  }

  // 🔒 Disable when payment is confirmed or listing_disabled event
  if (code === "listing_disabled" || code === "p2p_tx.deposit_accepted") {
    console.log("➡️ Listing disabled for:", adId);
    disabledListings.add(adId);
  }

  // 🔓 Re-enable when refunded or cancelled
  if (code === "p2p_tx.deposit_refunded" || code === "p2p_tx.cancelled") {
    console.log("➡️ Listing re-enabled for:", adId);
    disabledListings.delete(adId);
  }

  res.sendStatus(200);
});
