"use client";

import { useState } from "react";
import getStripe from "@/lib/getStripe";
import { toast } from "react-hot-toast";

const CheckoutButton = ({ cartItems }) => {
  const [loading, setLoading] = useState(false);
  const [loadingState, setLoadingState] = useState("");

  const handleCheckout = async () => {
    try {
      setLoading(true);
      setLoadingState("Initializing checkout...");

      if (!cartItems || cartItems.length === 0) {
        throw new Error("No items in cart");
      }

      console.log("Cart Items:", cartItems);
      setLoadingState("Sending request to API...");

      const response = await fetch("/api/stripe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cartItems),
      });

      setLoadingState("Processing response...");
      const data = await response.json();
      console.log("API Response:", data);

      if (!response.ok) {
        throw new Error(data.error || "API error");
      }

      if (!data.url) {
        throw new Error("No checkout URL received");
      }

      setLoadingState("Redirecting to Stripe...");
      window.location.href = data.url;
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error(err.message || "Checkout failed");
      setLoading(false);
      setLoadingState("");
    }
  };

  return (
    <button className="btn" onClick={handleCheckout} disabled={loading}>
      {loading ? loadingState : "Pay with Stripe"}
    </button>
  );
};

export default CheckoutButton;
