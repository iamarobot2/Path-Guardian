"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-lg z-50 shadow-lg border-b border-white/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Image
              src="/PathGuardian.png"
              alt="Path Guardian Logo"
              width={40}
              height={40}
              className="h-10 w-10"
            />
            <span className="text-xl font-bold text-gray-800">
              Path Guardian
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {" "}
            <Link
              href="#features"
              className="text-gray-600 hover:text-[#229799] transition"
            >
              Features
            </Link>
            <Link
              href="#technology"
              className="text-gray-600 hover:text-[#229799] transition"
            >
              Technology
            </Link>
            <Link
              href="#benefits"
              className="text-gray-600 hover:text-[#229799] transition"
            >
              Benefits
            </Link>
            <Link
              href="#market"
              className="text-gray-600 hover:text-[#229799] transition"
            >
              Market
            </Link>
            <button className="bg-[#229799] text-white px-6 py-2 rounded-full hover:bg-[#1a7373] transition shadow-md">
              Get Demo
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            {" "}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-[#229799] focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {" "}
              <Link
                href="#features"
                className="block px-3 py-2 text-gray-600 hover:text-[#229799] transition"
              >
                Features
              </Link>
              <Link
                href="#technology"
                className="block px-3 py-2 text-gray-600 hover:text-[#229799] transition"
              >
                Technology
              </Link>
              <Link
                href="#benefits"
                className="block px-3 py-2 text-gray-600 hover:text-[#229799] transition"
              >
                Benefits
              </Link>
              <Link
                href="#market"
                className="block px-3 py-2 text-gray-600 hover:text-[#229799] transition"
              >
                Market
              </Link>
              <button className="w-full text-left bg-[#229799] text-white px-3 py-2 rounded-md hover:bg-[#1a7373] transition">
                Get Demo
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
