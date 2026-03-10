import { generateCartData } from "./generateCartData";
import CartClient from "./CartClient";

export const metadata = {
  title: "Your Custom Checkout — The Longevity Agent",
  description: "Review your supplement stack with prices from vetted vendors.",
};

export default function CartPage() {
  // Generate product lookup at BUILD TIME (static).
  // This avoids needing better-sqlite3 native binary at Vercel serverless runtime.
  const data = generateCartData();

  return <CartClient data={data} />;
}
