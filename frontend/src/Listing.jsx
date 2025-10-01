import { useState } from "react";
import { createTransaction } from "./api";

export default function Listing() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  const handleReserve = async () => {
    setLoading(true);
    try {
      const res = await createTransaction({
        buyer_email: email,
        price: 5000, // 5000 EUR or cents depending on API
        item_name: "2020 Ford Fiesta"
      });

      if (res.error) {
        setMessage(JSON.stringify(res.error));
      } else {
        // Trustap returns a URL for the buyer to continue checkout
        setMessage(`Reservation created. Continue at: ${res.checkout_url || res.url}`);
      }
    } catch (err) {
      setMessage(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="listing">
      <h2>2020 Ford Fiesta</h2>
      <p>Price: €5000</p>
      <input
        type="email"
        placeholder="Buyer email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleReserve} disabled={loading}>
        {loading ? "Reserving..." : "Reserve Now"}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}
