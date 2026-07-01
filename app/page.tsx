import Link from "next/link";
import { prisma } from "../lib/prisma";

export default async function Home() {
  const categories = await prisma.service.groupBy({
    by: ['category'],
    _count: {
      id: true,
    },
  });

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-blue-600">
        <div className="absolute inset-0">
          <div className="absolute inset-y-0 w-full h-full bg-blue-600 mix-blend-multiply" />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Professional Home Services
          </h1>
          <p className="mt-6 text-xl text-blue-100 max-w-3xl">
            Book expert electricians, plumbers, cleaners, and more. Quality service delivered to your doorstep.
          </p>
          <div className="mt-10">
            <Link
              href="/services"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 transition-colors"
            >
              Browse Services
            </Link>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-extrabold text-blue-700 tracking-tight">Our Services</h2>
        <div className="mt-8 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 xl:gap-x-8">
          {categories.map((cat: { category: string; _count: { id: number } }) => (
            <Link key={cat.category} href={`/services?category=${cat.category}`} className="group relative">
              <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100 group-hover:opacity-75 transition-opacity sm:aspect-w-2 sm:aspect-h-1 lg:aspect-w-1 lg:aspect-h-1">
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <span className="text-2xl font-bold text-gray-600">{cat.category}</span>
                </div>
              </div>
              <h3 className="mt-4 text-base font-semibold text-gray-900">
                {cat.category} ({cat._count.id} services)
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
