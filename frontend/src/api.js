const BACKEND_URL = "https://trustap-demo.onrender.com/"; // your Render URL

export async function createTransaction(data) {
  const res = await fetch(`${BACKEND_URL}/create-transaction`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
}