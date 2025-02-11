import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // rzp_test_k2SAPLU02gPn8K
  key_secret: process.env.RAZORPAY_KEY_SECRET, // eflfLazxJsGWTZ2AJBDu4eTu
});

export async function POST(req) {
  try {
    // Debug log to verify environment variables
    console.log("Razorpay Keys:", {
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.slice(0, 5),
      hasSecret: !!process.env.RAZORPAY_KEY_SECRET,
    });

    const data = await req.json();
    const { amount } = data;

    if (!amount) {
      return NextResponse.json(
        { error: "Amount is required" },
        { status: 400 }
      );
    }

    const options = {
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("Razorpay Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}
