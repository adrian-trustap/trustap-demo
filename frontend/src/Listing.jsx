import { useState, useEffect } from "react";
import { createTransaction } from "./api";

const BACKEND_URL = "https://trustap-demo.onrender.com";

export default function Listing() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("adrian+golf_seller@trustap.com");
  const [disabled, setDisabled] = useState(false);

  // Extra fields for preview
  const [itemName, setItemName] = useState("1991 VW Golf");
  const [price, setPrice] = useState(5000);
  const [imageUrl, setImageUrl] = useState("https://www.topgear.com/sites/default/files/news-listicle/image/2023/02/30576-GolfGTIMkII.jpg");
  const [year, setYear] = useState("1991");
  const [mileage, setMileage] = useState("80,000");
  const [location, setLocation] = useState("Dublin, IE");

useEffect(() => {
  const interval = setInterval(async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/listings/588a98/status`);
      const data = await res.json();
      console.log("Listing status:", data); // 👈 add this
      setDisabled(data.disabled);
    } catch (err) {
      console.error("Error checking status:", err);
    }
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
  <div
    style={{
      display: "flex",
      gap: "2rem",
      padding: "2rem",
      justifyContent: "center",
      alignItems: "flex-start",
      background: "#f5f6f8",
      minHeight: "100vh",
      fontFamily: "system-ui, sans-serif",
    }}
  >
    {/* Listing card */}
    <div
      style={{
        width: "420px",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        background: "#fff",
        transition: "transform 0.3s ease",
      }}
    >
      <div style={{ position: "relative" }}>
        <img
          src={imageUrl}
          alt="Car"
          style={{
            width: "100%",
            height: "260px",
            objectFit: "cover",
            filter: disabled ? "grayscale(80%)" : "none",
          }}
        />
        {disabled && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.6)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.75rem",
              fontWeight: "bold",
              textTransform: "uppercase",
            }}
          >
            Reserved
          </div>
        )}
      </div>

      <div style={{ padding: "1.25rem 1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0, fontSize: "1.25rem" }}>{itemName}</h2>
          <span
            style={{
              background: "#007bff",
              color: "#fff",
              borderRadius: "6px",
              padding: "0.4rem 0.6rem",
              fontWeight: "bold",
            }}
          >
            €{price}
          </span>
        </div>
        <div style={{ fontSize: "0.95rem", color: "#666", marginTop: "0.5rem" }}>
          {year} • {mileage} km • {location}
        </div>

        <button
          onClick={handleReserve}
          disabled={loading || disabled}
          style={{
            marginTop: "1.25rem",
            width: "100%",
            background: disabled ? "#b0b0b0" : loading ? "#ffc107" : "#28a745",
            color: "#fff",
            border: "none",
            padding: "0.75rem 1rem",
            borderRadius: "6px",
            cursor: disabled ? "not-allowed" : "pointer",
            fontWeight: "bold",
            fontSize: "1rem",
            letterSpacing: "0.5px",
            transition: "all 0.3s ease",
            boxShadow: disabled
              ? "inset 0 0 5px rgba(0,0,0,0.2)"
              : "0 4px 8px rgba(0,0,0,0.15)",
          }}
        >
          {disabled ? "🚫 RESERVED" : loading ? "⏳ Reserving..." : "Reserve Now"}
        </button>
      </div>
    </div>

    {/* Admin Panel */}
    <div
      style={{
        flex: "0 0 300px",
        background: "#fff",
        borderRadius: "10px",
        border: "1px solid #eee",
        padding: "1rem",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
      }}
    >
      <h3 style={{ marginTop: 0, fontSize: "1rem", color: "#444" }}>Update Listing / Admin</h3>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          fontSize: "0.85rem",
        }}
      >
        {[
          ["Car Name", itemName, setItemName],
          ["Price (€)", price, setPrice, "number"],
          ["Year", year, setYear],
          ["Mileage (km)", mileage, setMileage],
          ["Location", location, setLocation],
          ["Image URL", imageUrl, setImageUrl],
          ["Seller Email", email, setEmail],
        ].map(([label, value, setter, type = "text"], i) => (
          <label key={i} style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ marginBottom: "0.25rem", color: "#555" }}>{label}</span>
            <input
              type={type}
              value={value}
              onChange={(e) => setter(e.target.value)}
              style={{
                padding: "0.4rem",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "0.85rem",
              }}
            />
          </label>
        ))}

        <button
          style={{
            marginTop: "1rem",
            background: "#ff6b6b",
            color: "#fff",
            border: "none",
            padding: "0.5rem",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "0.9rem",
          }}
          onClick={handleReset}
        >
          Reset Listing
        </button>
      </div>

      {message && <p style={{ color: "green", marginTop: "1rem" }}>{message}</p>}
    </div>
  </div>
);

}
