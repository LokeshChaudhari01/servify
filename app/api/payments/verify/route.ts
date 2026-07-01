import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import crypto from "crypto";
import { sendEmail } from "../../../../lib/email";

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET || "";

    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest("hex");

    if (digest !== razorpay_signature) {
      return NextResponse.json({ message: "Transaction not legit!" }, { status: 400 });
    }

    // Payment is valid
    const payment = await prisma.payment.update({
      where: { razorpayOrderId: razorpay_order_id },
      data: {
        status: "SUCCESS",
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      },
      include: {
        booking: {
          include: {
            user: true,
            service: true,
          },
        },
      },
    });

    await prisma.booking.update({
      where: { id: payment.bookingId },
      data: {
        status: "CONFIRMED",
      },
    });

    // Send Confirmation Email
    const { user, service, date, timeSlot } = payment.booking;
    const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #2563eb;">Booking Confirmed!</h2>
        <p>Hi ${user.name},</p>
        <p>Your payment of <strong>₹${payment.amount}</strong> was successful. Your booking for <strong>${service.title}</strong> is confirmed.</p>
        <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Service:</strong> ${service.title}</p>
          <p style="margin: 5px 0;"><strong>Date:</strong> ${date}</p>
          <p style="margin: 5px 0;"><strong>Time:</strong> ${timeSlot}</p>
          <p style="margin: 5px 0;"><strong>Order ID:</strong> ${payment.razorpayOrderId}</p>
        </div>
        <p>Thank you for choosing Servify!</p>
      </div>
    `;

    await sendEmail({
      to: user.email,
      toName: user.name,
      subject: `Booking Confirmed: ${service.title}`,
      htmlContent,
    });

    return NextResponse.json({ message: "Payment verified successfully" }, { status: 200 });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
