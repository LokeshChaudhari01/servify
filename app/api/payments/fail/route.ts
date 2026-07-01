import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { auth } from "../../../../auth";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { razorpay_order_id } = await req.json();

    if (!razorpay_order_id) {
      return NextResponse.json({ message: "Missing order ID" }, { status: 400 });
    }

    const payment = await prisma.payment.findUnique({
      where: { razorpayOrderId: razorpay_order_id },
      include: { booking: true },
    });

    if (!payment) {
      return NextResponse.json({ message: "Payment not found" }, { status: 404 });
    }

    if (payment.booking.userId !== session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    // Only update if it's currently PENDING to avoid overwriting SUCCESS
    if (payment.status === "PENDING") {
      await prisma.$transaction([
        prisma.payment.update({
          where: { id: payment.id },
          data: { status: "FAILED" },
        }),
        // Option to leave booking as PENDING or set FAILED. Let's keep it PENDING so they can just retry paying
        // Or set both to FAILED and they can re-initiate. The user asked for "repay the pending payments".
        // Setting both to FAILED is clear, and we can allow retry if Booking is FAILED or PENDING.
        prisma.booking.update({
          where: { id: payment.bookingId },
          data: { status: "FAILED" },
        }),
      ]);
    }

    return NextResponse.json({ message: "Payment marked as failed" }, { status: 200 });
  } catch (error) {
    console.error("Payment fail error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
