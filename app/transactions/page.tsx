import { prisma } from "../../lib/prisma";
import { auth } from "../../auth";
import { redirect } from "next/navigation";
import { IndianRupee, CreditCard } from "lucide-react";
import { PaymentRetryButton } from "../../components/PaymentRetryButton";

export default async function TransactionsPage() {
  const session = await auth();

  if (!session || !session.user?.id) {
    redirect("/login");
  }

  const payments = await prisma.payment.findMany({
    where: {
      booking: {
        userId: session.user.id,
      },
    },
    include: {
      booking: {
        include: {
          service: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-blue-700 tracking-tight">Transactions</h1>
        <p className="mt-2 text-sm text-gray-500">
          View all your payment history and retry failed or pending payments.
        </p>
      </div>

      {payments.length === 0 ? (
        <div className="bg-gray-50 text-center py-12 rounded-lg border border-gray-200">
          <p className="text-gray-500 text-sm">No transactions found.</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
          <ul className="divide-y divide-gray-200">
            {payments.map((payment) => (
              <li key={payment.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${
                      payment.status === 'SUCCESS' ? 'bg-green-100 text-green-600' :
                      payment.status === 'FAILED' ? 'bg-red-100 text-red-600' :
                      'bg-yellow-100 text-yellow-600'
                    }`}>
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {payment.booking.service.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(payment.createdAt).toLocaleDateString()} &middot; Order ID: {payment.razorpayOrderId}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="flex items-center gap-1 justify-end text-lg font-bold text-gray-900">
                        <IndianRupee className="w-4 h-4" />
                        <span>{payment.amount}</span>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        payment.status === 'SUCCESS' ? 'bg-green-100 text-green-800' :
                        payment.status === 'FAILED' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {payment.status}
                      </span>
                    </div>
                    
                    {(payment.status === 'PENDING' || payment.status === 'FAILED') && (
                      <PaymentRetryButton 
                        paymentId={payment.id}
                        serviceTitle={payment.booking.service.title}
                      />
                    )}
                  </div>
                  
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
