import { useState, useEffect } from "react";
import { createTransaction } from "./api";

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

  <div
    style={{
      border: "1px solid #ddd",
      borderRadius: "8px",
      padding: "1rem",
      background: "#f9f9f9",
      display: "flex",
      flexDirection: "column",
      gap: "0.75rem", // space between rows
    }}
  >
    <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span>Car Name:</span>
      <input style={{ flex: 1, marginLeft: "1rem" }} value={itemName} onChange={(e) => setItemName(e.target.value)} />
    </label>

    <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span>Price (€):</span>
      <input style={{ flex: 1, marginLeft: "1rem" }} type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
    </label>

    <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span>Year:</span>
      <input style={{ flex: 1, marginLeft: "1rem" }} value={year} onChange={(e) => setYear(e.target.value)} />
    </label>

    <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span>Mileage (km):</span>
      <input style={{ flex: 1, marginLeft: "1rem" }} value={mileage} onChange={(e) => setMileage(e.target.value)} />
    </label>

    <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span>Location:</span>
      <input style={{ flex: 1, marginLeft: "1rem" }} value={location} onChange={(e) => setLocation(e.target.value)} />
    </label>

    <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span>Image URL:</span>
      <input style={{ flex: 1, marginLeft: "1rem" }} value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
    </label>

    <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span>Seller Email (Admin):</span>
      <input style={{ flex: 1, marginLeft: "1rem" }} value={email} onChange={(e) => setEmail(e.target.value)} />
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
      Reset Listing (Demo)
    </button>
  </div>

  {message && <p style={{ color: "green", marginTop: "1rem" }}>{message}</p>}
</div>
    </div>
  );
}
