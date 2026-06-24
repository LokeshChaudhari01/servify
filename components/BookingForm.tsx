"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { IndianRupee } from "lucide-react";
import Script from "next/script";

const TIME_SLOTS = [
  "09:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "12:00 - 13:00",
  "13:00 - 14:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00",
];

export function BookingForm({
  serviceId,
  price,
  title,
}: {
  serviceId: string;
  price: number;
  title: string;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleBooking = async () => {
    if (!session) {
      router.push(`/login?callbackUrl=/services/${serviceId}`);
      return;
    }
    
    if (!date || !timeSlot) {
      setError("Please select both a date and a time slot.");
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId, date, timeSlot }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Failed to create booking.");
        setLoading(false);
        return;
      }

      const bookingData = await res.json();
      
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, 
        amount: bookingData.amount, 
        currency: bookingData.currency,
        name: "Servify",
        description: `Booking for ${title}`,
        order_id: bookingData.orderId,
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
            router.push("/profile");
            router.refresh();
          } else {
            setError("Payment verification failed.");
          }
        },
        prefill: {
          name: session.user?.name || "",
          email: session.user?.email || "",
        },
        theme: {
          color: "#2563eb", // blue-600
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
      
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold mb-4">Book this Service</h3>
        
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
          <input
            type="date"
            min={new Date().toISOString().split("T")[0]}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Time Slot</label>
          <div className="grid grid-cols-2 gap-3">
            {TIME_SLOTS.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => setTimeSlot(slot)}
                className={`py-2 px-3 text-sm border rounded-md text-center transition-colors ${
                  timeSlot === slot
                    ? "border-blue-600 bg-blue-50 text-blue-700 font-semibold"
                    : "border-gray-300 hover:border-blue-500 text-gray-700"
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4 mb-6 flex justify-between items-center">
          <span className="text-gray-600 font-medium">Total Amount</span>
          <div className="flex items-center text-xl font-bold text-gray-900">
            <IndianRupee className="w-5 h-5 mr-1" />
            {price}
          </div>
        </div>

        <button
          onClick={handleBooking}
          disabled={loading}
          className="w-full bg-blue-600 text-white font-medium py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? "Processing..." : session ? "Confirm Booking & Pay" : "Login to Book"}
        </button>
      </div>
    </>
  );
}
