import { useState } from "react";
import { createTransaction } from "./api";

export default function Listing() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  const [disabled, setDisabled] = useState(false);

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
        buyer_email: email,
        price: 5000, // 5000 EUR or cents depending on API
        item_name: "2020 Ford Fiesta"
      });

      if (res.error) {
        setMessage(JSON.stringify(res.error));
      } else {
        // Trustap returns a URL for the buyer to continue checkout
        const redirectUrl = res.pay_deposit_url;
        if (redirectUrl) {
//          setMessage(`Reservation created. Continue at: ${redirectUrl}`);
          window.location.href = res.pay_deposit_url;
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
    <div className="listing">
      <h2>2020 Ford Fiesta</h2>
      <p>Price: €5000</p>
      <input
        type="email"
        placeholder="Buyer email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleReserve} disabled={loading || disabled}>
      {disabled ? "Reserved" : loading ? "Reserving..." : "Reserve Now"}
      </button>

      <button onClick={handleReset}>Reset Listing (Demo)</button>
      {message && <p>{message}</p>}
    </div>
  );
}
