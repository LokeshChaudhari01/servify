import { prisma } from "../../../lib/prisma";
import { notFound } from "next/navigation";
import { BookingForm } from "../../../components/BookingForm";
import { Clock, CheckCircle } from "lucide-react";

export default async function ServiceDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const service = await prisma.service.findUnique({
    where: { id },
  });

  if (!service) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7 xl:col-span-8">
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <div className="mb-6">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-4">
                {service.category}
              </span>
              <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
                {service.title}
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                {service.description}
              </p>
              
              <div className="flex items-center gap-6 text-gray-700">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span className="font-medium">{service.duration} Minutes</span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6 mt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">What's included</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                  <span className="text-gray-600">Professional and verified experts</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                  <span className="text-gray-600">Post-service cleanup</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                  <span className="text-gray-600">7-day service warranty</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 lg:mt-0 lg:col-span-5 xl:col-span-4">
          <BookingForm
            serviceId={service.id}
            price={service.price}
            title={service.title}
          />
        </div>
      </div>
    </div>
  );
}
