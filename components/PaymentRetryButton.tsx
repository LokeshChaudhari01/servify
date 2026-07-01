"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useSession } from "next-auth/react";

export function PaymentRetryButton({
  paymentId,
  serviceTitle,
}: {
  paymentId: string;
  serviceTitle: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const handleRetry = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/payments/retry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "Failed to initialize retry.");
        setLoading(false);
        return;
      }

      const orderData = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount, // Amount in paise from new order
        currency: orderData.currency,
        name: "Servify",
        description: `Retry Payment for ${serviceTitle}`,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          // Verify payment on the server
          const verifyRes = await fetch("/api/payments/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          if (verifyRes.ok) {
            router.refresh();
          } else {
            alert("Payment verification failed.");
          }
        },
        prefill: {
          name: session?.user?.name || "",
          email: session?.user?.email || "",
        },
        theme: {
          color: "#2563eb",
        },
        modal: {
          escape: true,
          confirm_close: true,
          ondismiss: async function () {
            // Optional: call fail API if we want to explicitly log retry attempts failing
            // But since it's already failed/pending, it's fine to just let them close it
            setLoading(false);
          },
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      
      paymentObject.on('payment.failed', async function (response: any) {
        await fetch("/api/payments/fail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ razorpay_order_id: orderData.orderId }),
        });
        alert(response.error.description);
        setLoading(false);
      });

      paymentObject.open();
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <button
        onClick={handleRetry}
        disabled={loading}
        className="bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm"
      >
        {loading ? "Processing..." : "Retry Payment"}
      </button>
    </>
  );
}
