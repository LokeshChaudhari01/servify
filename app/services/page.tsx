import { prisma } from "../../lib/prisma";
import Link from "next/link";
import { Clock, IndianRupee } from "lucide-react";

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const categoryFilter = params.category;

  const services = await prisma.service.findMany({
    where: categoryFilter ? { category: categoryFilter } : undefined,
    orderBy: { category: "asc" },
  });

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-blue-700 tracking-tight">
            {categoryFilter ? `${categoryFilter} Services` : "All Services"}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Choose a service below to view details and book an appointment.
          </p>
        </div>
        {categoryFilter && (
          <Link href="/services" className="mt-4 md:mt-0 text-blue-600 hover:text-blue-500 font-medium">
            Clear Filter
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service: any) => (
          <div
            key={service.id}
            className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
          >
            <div className="p-6 flex-grow">
              <div className="flex justify-between items-start mb-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {service.category}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {service.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {service.description}
              </p>
              <div className="flex items-center text-sm text-gray-500 gap-4">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{service.duration} mins</span>
                </div>
                <div className="flex items-center gap-1 font-semibold text-gray-900">
                  <IndianRupee className="w-4 h-4" />
                  <span>{service.price}</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <Link
                href={`/services/${service.id}`}
                className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                View Details & Book
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
