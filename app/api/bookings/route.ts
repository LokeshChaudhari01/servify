import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { auth } from "../../../auth";
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

    const { serviceId, date, timeSlot } = await req.json();

    if (!serviceId || !date || !timeSlot) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) {
      return NextResponse.json({ message: "Service not found" }, { status: 404 });
    }

    // Amount in paise
    const amount = Math.round(service.price * 100);

    const booking = await prisma.booking.create({
      data: {
        date,
        timeSlot,
        status: "PENDING",
        userId: session.user.id,
        serviceId,
      },
    });

    const options = {
      amount,
      currency: "INR",
      receipt: `receipt_${booking.id}`,
    };

    const order = await razorpay.orders.create(options);

    await prisma.payment.create({
      data: {
        bookingId: booking.id,
        amount: service.price,
        currency: "INR",
        status: "PENDING",
        razorpayOrderId: order.id,
      },
    });

    return NextResponse.json({
      message: "Booking and order created",
      bookingId: booking.id,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    }, { status: 201 });
  } catch (error) {
    console.error("Booking creation error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
