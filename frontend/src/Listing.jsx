import { useState, useEffect } from "react";
import { createTransaction } from "./api";

const BACKEND_URL = "https://trustap-demo.onrender.com";

export default function Listing() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("adrian+golf_seller@trustap.com");
  const [disabled, setDisabled] = useState(false);

  const [itemName, setItemName] = useState("1991 VW Golf");
  const [price, setPrice] = useState(5000);
  const [imageUrl, setImageUrl] = useState(
    "https://www.topgear.com/sites/default/files/news-listicle/image/2023/02/30576-GolfGTIMkII.jpg"
  );
  const [year, setYear] = useState("1991");
  const [mileage, setMileage] = useState("80,000");
  const [location, setLocation] = useState("Dublin, IE");

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/listings/588a98/status`);
        const data = await res.json();
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
      if (res.error) setMessage(JSON.stringify(res.error));
      else {
        const redirectUrl = res.pay_deposit_url;
        if (redirectUrl) window.location.href = redirectUrl;
        else setMessage("Reservation created, but no redirect URL returned.");
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
        alignItems: "flex-start",
        gap: "3rem",
        padding: "2rem",
        background: "#fafafa",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Listing card */}
      <div
        style={{
          flex: "0 0 500px",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
          background: "#fff",
          transition: "transform 0.3s ease",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "320px",
            background: "#f0f0f0",
            position: "relative",
          }}
        >
          <img
            src={imageUrl}
            alt={itemName}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
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
                background: "rgba(0,0,0,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: "2rem",
                fontWeight: "bold",
              }}
            >
              🚫 RESERVED
            </div>
          )}
        </div>

        <div style={{ padding: "1.5rem" }}>
          <h2 style={{ margin: "0 0 0.25rem", fontSize: "1.5rem" }}>{itemName}</h2>
          <div style={{ color: "#777", fontSize: "0.95rem" }}>
            {year} • {mileage} km • {location}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "1rem",
            }}
          >
            <span
              style={{
                fontSize: "1.75rem",
                fontWeight: "600",
                color: "#007bff",
              }}
            >
              €{price}
            </span>
            <button
              onClick={handleReserve}
              disabled={loading || disabled}
              style={{
                background: disabled ? "#ccc" : loading ? "#ffc107" : "#28a745",
                color: disabled ? "#555" : "#fff",
                border: "none",
                padding: "0.75rem 1.25rem",
                borderRadius: "8px",
                cursor: disabled ? "not-allowed" : "pointer",
                fontWeight: "600",
                fontSize: "1rem",
                transition: "all 0.3s ease",
                boxShadow: disabled
                  ? "inset 0 0 5px rgba(0,0,0,0.2)"
                  : "0 3px 6px rgba(0,0,0,0.2)",
              }}
            >
              {disabled
                ? "Reserved"
                : loading
                ? "⏳ Reserving..."
                : "Reserve Now"}
            </button>
          </div>
        </div>
      </div>

      {/* Admin Panel */}
      <div
        style={{
          flex: 1,
          maxWidth: "200px",
          background: "#f9f9f9",
          border: "1px solid #eee",
          borderRadius: "12px",
          padding: "1.5rem",
          boxShadow: "inset 0 0 6px rgba(0,0,0,0.05)",
        }}
      >
        <h3 style={{ marginTop: 0, fontSize: "1.25rem", color: "#555" }}>
          Update Listing / Admin
        </h3>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            marginTop: "1rem",
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
            <label
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "0.9rem",
                color: "#555",
              }}
            >
              <span>{label}:</span>
              <input
                style={{
                  flex: 1,
                  marginLeft: "1rem",
                  padding: "0.5rem",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  background: "#fff",
                }}
                type={type}
                value={value}
                onChange={(e) => setter(e.target.value)}
              />
            </label>
          ))}

          <button
            style={{
              marginTop: "1rem",
              background: "#ff6b6b",
              color: "#fff",
              border: "none",
              padding: "0.6rem",
              borderRadius: "6px",
              fontWeight: "600",
              cursor: "pointer",
              alignSelf: "flex-start",
            }}
            onClick={handleReset}
          >
            Reset Listing (Demo)
          </button>
        </div>

        {message && (
          <p style={{ color: "green", marginTop: "1rem", fontSize: "0.9rem" }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
