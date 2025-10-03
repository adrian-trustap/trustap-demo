import { useState, useEffect } from "react";
import { createTransaction } from "./api";

export default function Listing() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [disabled, setDisabled] = useState(false);

  // Extra fields for preview
  const [itemName, setItemName] = useState("2020 Ford Fiesta");
  const [price, setPrice] = useState(5000);
  const [imageUrl, setImageUrl] = useState("");
  const [year, setYear] = useState("2020");
  const [mileage, setMileage] = useState("30,000");
  const [location, setLocation] = useState("Dublin, IE");

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch(`${BACKEND_URL}/listings/588a98/status`);
      const data = await res.json();
      setDisabled(data.disabled);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleReset = async () => {
    await fetch(`${BACKEND_URL}/listings/588a98/reset`, { method: "POST" });
    setDisabled(false);
  };

  const handleReserve = async () => {
    setLoading(true);
    try {
      const res = await createTransaction({
        seller_email: email,
        price,
        item_name: itemName,
        ad_id: "588a98",
      });

      if (res.error) {
        setMessage(JSON.stringify(res.error));
      } else {
        const redirectUrl = res.pay_deposit_url;
        if (redirectUrl) {
          window.location.href = redirectUrl;
        } else {
          setMessage("Reservation created, but no redirect URL returned.");
        }
      }
    } catch (err) {
      setMessage(err.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", gap: "2rem", padding: "1rem" }}>
      {/* Listing card */}
      <div
        style={{
          width: "350px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          background: "#fff",
        }}
      >
        {imageUrl ? (
          <img src={imageUrl} alt="Car" style={{ width: "100%", height: "200px", objectFit: "cover" }} />
        ) : (
          <div
            style={{
              width: "100%",
              height: "200px",
              background: "#f0f0f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#999",
            }}
          >
            Car Image Preview
          </div>
        )}
        <div style={{ padding: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0 }}>{itemName}</h3>
            <span style={{ background: "#007bff", color: "#fff", borderRadius: "4px", padding: "0.25rem 0.5rem" }}>
              €{price}
            </span>
          </div>
          <div style={{ fontSize: "0.9rem", color: "#666", marginTop: "0.5rem" }}>
            {year} • {mileage} km • {location}
          </div>
          <button
            onClick={handleReserve}
            disabled={loading || disabled}
            style={{
              marginTop: "1rem",
              width: "100%",
              background: "#28a745",
              color: "#fff",
              border: "none",
              padding: "0.5rem",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {disabled ? "Reserved" : loading ? "Reserving..." : "Reserve Now"}
          </button>
        </div>
      </div>

      {/* Form / Admin */}
      <div style={{ flex: 1 }}>
        <h2>Update Listing / Admin</h2>
        <label>
          Car Name:
          <input value={itemName} onChange={(e) => setItemName(e.target.value)} />
        </label>
        <br />
        <label>
          Price (€):
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        </label>
        <br />
        <label>
          Year:
          <input value={year} onChange={(e) => setYear(e.target.value)} />
        </label>
        <br />
        <label>
          Mileage (km):
          <input value={mileage} onChange={(e) => setMileage(e.target.value)} />
        </label>
        <br />
        <label>
          Location:
          <input value={location} onChange={(e) => setLocation(e.target.value)} />
        </label>
        <br />
        <label>
          Image URL:
          <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
        </label>
        <br />
        <label>
          Seller email (Admin):
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <br />
        <button onClick={handleReset}>Reset Listing (Demo)</button>

        {message && <p style={{ color: "green" }}>{message}</p>}
      </div>
    </div>
  );
}
