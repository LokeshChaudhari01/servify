import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { auth } from "../../../../auth";
import Razorpay from "razorpay";

export async function POST(req: Request) {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || "dummy",
      key_secret: process.env.RAZORPAY_KEY_SECRET || "dummy",
    });

    const session = await auth();

    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { paymentId } = await req.json();

    if (!paymentId) {
      return NextResponse.json({ message: "Missing payment ID" }, { status: 400 });
    }

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { booking: true },
    });

    if (!payment) {
      return NextResponse.json({ message: "Payment not found" }, { status: 404 });
    }

    if (payment.booking.userId !== session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    if (payment.status === "SUCCESS") {
      return NextResponse.json({ message: "Payment is already successful" }, { status: 400 });
    }

    const amountInPaise = Math.round(payment.amount * 100);

    const options = {
      amount: amountInPaise,
      currency: payment.currency || "INR",
      receipt: `retry_${payment.id}`,
    };

    const order = await razorpay.orders.create(options);

    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        razorpayOrderId: order.id,
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    }, { status: 200 });

  } catch (error) {
    console.error("Payment retry error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
