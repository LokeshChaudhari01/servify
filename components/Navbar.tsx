"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { UserCircle, LogOut } from "lucide-react";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center font-bold text-xl text-blue-600">
              Servify
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/services" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Services
              </Link>
              {session && (
                <Link href="/transactions" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Transactions
                </Link>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {session ? (
              <div className="flex items-center space-x-4">
                <Link href="/profile" className="text-gray-500 hover:text-gray-700 flex items-center gap-2">
                  <UserCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">{session.user?.name}</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-gray-500 hover:text-red-600 flex items-center gap-2 text-sm font-medium"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" className="text-gray-500 hover:text-gray-700 text-sm font-medium">
                  Login
                </Link>
                <Link href="/register" className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium">
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
