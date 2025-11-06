import { useState, useEffect } from "react";
import { createTransaction } from "./api";
import logo from "../images/logo.svg"; 
import favicon from "../images/favicon.ico";

const BACKEND_URL = "https://trustap-demo.onrender.com";

export function Header() {
  return (
    <header style={{
      display: "flex",
      alignItems: "center",
      padding: "1rem 2rem",
      background: "#007bff",
      color: "#fff",
      gap: "1rem"
    }}>
      <img src={logo} alt="AutoTrust Logo" style={{ height: "40px" }} />
      <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold" }}>AutoTrust Marketplace</h1>
    </header>
  );
}

export default function Listing() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("adrian+golf_seller@trustap.com");
  const [disabled, setDisabled] = useState(false);

  // Listing details
  const [itemName, setItemName] = useState("1991 VW Golf");
  const [price, setPrice] = useState(5000);
  const [imageUrl, setImageUrl] = useState("https://www.topgear.com/sites/default/files/news-listicle/image/2023/02/30576-GolfGTIMkII.jpg");
  const [year, setYear] = useState("1991");
  const [mileage, setMileage] = useState("80,000");
  const [location, setLocation] = useState("Dublin, IE");

  // Calculate 5% deposit
  const depositAmount = (price * 0.0105).toFixed(2);

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
        image_url: imageUrl
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
    <div style={{ display: "flex", gap: "2rem", padding: "2rem", fontFamily: "Roboto, sans-serif" }}>
      
      {/* Listing card */}
      <div
        style={{
          width: "450px",
          border: "1px solid #ddd",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
          background: "#fff",
        }}
      >
        {imageUrl ? (
          <img src={imageUrl} alt="Car" style={{ width: "100%", height: "280px", objectFit: "cover" }} />
        ) : (
          <div
            style={{
              width: "100%",
              height: "280px",
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
        <div style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ margin: 0, fontFamily: "Montserrat, sans-serif" }}>{itemName}</h2>
            <span style={{
              background: "#007bff",
              color: "#fff",
              borderRadius: "4px",
              padding: "0.25rem 0.5rem",
              fontWeight: "bold",
            }}>
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
              marginTop: "1.5rem",
              width: "100%",
              background: disabled ? "#ccc" : loading ? "#ffc107" : "#28a745",
              color: disabled ? "#555" : "#fff",
              border: "none",
              padding: "0.75rem",
              borderRadius: "6px",
              cursor: disabled ? "not-allowed" : "pointer",
              fontWeight: "bold",
              fontSize: "1.1rem",
              transition: "all 0.3s ease",
              boxShadow: disabled
                ? "inset 0 0 5px rgba(0,0,0,0.2)"
                : "0 4px 8px rgba(0,0,0,0.2)",
            }}
          >
            {disabled
              ? "🚫 RESERVED"
              : loading
              ? "⏳ Reserving..."
              : `Reserve now for €${depositAmount}`}
          </button>
        </div>
      </div>

      {/* Admin panel */}
      <div style={{
        flex: 1,
        maxWidth: "300px",
      }}>
        <h3 style={{ color: "#333", fontFamily: "Montserrat, sans-serif", marginBottom: "0.5rem" }}>
          Admin Panel
        </h3>

        <div
          style={{
            border: "1px solid #eee",
            borderRadius: "8px",
            padding: "1rem",
            background: "#fafafa",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Car Name:</span>
            <input style={{ flex: 1, marginLeft: "0.5rem" }} value={itemName} onChange={(e) => setItemName(e.target.value)} />
          </label>

          <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Price (€):</span>
            <input style={{ flex: 1, marginLeft: "0.5rem" }} type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
          </label>

          <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Year:</span>
            <input style={{ flex: 1, marginLeft: "0.5rem" }} value={year} onChange={(e) => setYear(e.target.value)} />
          </label>

          <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Mileage (km):</span>
            <input style={{ flex: 1, marginLeft: "0.5rem" }} value={mileage} onChange={(e) => setMileage(e.target.value)} />
          </label>

          <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Location:</span>
            <input style={{ flex: 1, marginLeft: "0.5rem" }} value={location} onChange={(e) => setLocation(e.target.value)} />
          </label>

          <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Image URL:</span>
            <input style={{ flex: 1, marginLeft: "0.5rem" }} value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
          </label>

          <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Seller Email:</span>
            <input style={{ flex: 1, marginLeft: "0.5rem" }} value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>

          <button
            style={{
              marginTop: "1rem",
              background: "#ff6b6b",
              color: "#fff",
              border: "none",
              padding: "0.5rem",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            onClick={handleReset}
          >
            Reset Listing
          </button>
        </div>

        {message && <p style={{ color: "#28a745", marginTop: "0.75rem" }}>{message}</p>}
      </div>
    </div>
  );
}
