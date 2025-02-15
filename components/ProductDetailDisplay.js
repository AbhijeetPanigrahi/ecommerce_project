"use client";

import React, { useState } from "react";
import { useStateContext } from "@/context/StateContext";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  AiFillStar,
  AiOutlineStar,
  AiOutlinePlus,
  AiOutlineMinus,
} from "react-icons/ai";
import { urlFor } from "../lib/client";

const ProductDetailDisplay = ({ productData }) => {
  const { name, price, image, details } = productData;

  const [index, setIndex] = useState(0); // Manage image carousel state
  const [quantity, setQuantity] = useState(1); // Manage quantity state
  const [loading, setLoading] = useState(false); // Add loading state
  const router = useRouter();

  // const handleDecrease = () => setQuantity((prev) => Math.max(prev - 1, 1));
  // const handleIncrease = () => setQuantity((prev) => prev + 1);
  const { decQty, incQty, qty, onAdd, clearCart } = useStateContext();

  // Add Razorpay initialization
  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Add handleBuyNow function
  const handleBuyNow = async () => {
    try {
      setLoading(true);
      const res = await initializeRazorpay();

      if (!res) {
        toast.error("Razorpay SDK failed to load");
        return;
      }

      // Calculate total amount
      const totalAmount = price * qty;

      // Create order
      const response = await fetch("/api/razorpay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: totalAmount,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create order");
      }

      // Configure Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "Your Store Name",
        description: `Purchase of ${name} (Qty: ${qty})`,
        order_id: data.id,
        image: urlFor(image[0]).url(),
        handler: function (response) {
          toast.success("Payment Successful!");
          clearCart();
          router.push("/success");
        },
        prefill: {
          name: "",
          email: "",
          contact: "",
        },
        theme: {
          color: "#f02d34",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Payment Error:", error);
      toast.error(error.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-detail-container">
      <div>
        <div className="image-container">
          {/* Render the selected image */}
          <img
            src={urlFor(image && image[index]).url()}
            alt={name}
            className="product-detail-image"
          />
        </div>
        <div className="small-images-container">
          {image?.length > 0 ? (
            image.map((img, i) => {
              const imgUrl = urlFor(img).url(); // Resolve the image URL
              return (
                <img
                  key={i}
                  src={imgUrl}
                  alt={`Thumbnail ${i}`}
                  className={
                    i === index ? "small-image selected-image" : "small-image"
                  }
                  onMouseEnter={() => setIndex(i)} // Set the selected image index
                />
              );
            })
          ) : (
            <p>No additional images available</p>
          )}
        </div>
      </div>
      <div className="product-detail-desc">
        <h1>{name}</h1>
        <div className="reviews">
          <AiFillStar />
          <AiFillStar />
          <AiFillStar />
          <AiFillStar />
          <AiOutlineStar />
          <p>(50 reviews)</p>
        </div>
        <h4>Details:</h4>
        <p>{details}</p>
        <p className="price">${price}</p>
        <div className="quantity">
          <h3>Quantity:</h3>
          <p className="quantity-desc">
            <span className="minus" onClick={decQty}>
              <AiOutlineMinus />
            </span>
            <span className="num">{qty}</span>
            <span className="plus" onClick={incQty}>
              <AiOutlinePlus />
            </span>
          </p>
        </div>
        <div className="buttons">
          <button
            type="button"
            className="add-to-cart"
            onClick={() => onAdd(productData, qty)}
          >
            Add to Cart
          </button>
          <button
            type="button"
            className="buy-now"
            onClick={handleBuyNow}
            disabled={loading}
          >
            {loading ? "Processing..." : "Buy Now"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailDisplay;
