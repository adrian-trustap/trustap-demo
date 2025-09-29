import { useState } from "react";
import { createTransaction } from "./api";

export default function Listing() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleReserve = async () => {
    setLoading(true);
    const res = await createTransaction({
      itemId: "car-1",
      price: 5000,
    });
    setMessage(res.message || "Reservation sent");
    setLoading(false);
  };

  return (
    <div className="listing">
      <h2>2020 Ford Fiesta</h2>
      <p>Price: €5000</p>
      <button onClick={handleReserve} disabled={loading}>
        {loading ? "Reserving..." : "Reserve Now"}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}
