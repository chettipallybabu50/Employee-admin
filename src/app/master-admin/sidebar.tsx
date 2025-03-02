"use client";

import { useState } from "react";
import { FiMenu } from "react-icons/fi";
import Link from "next/link";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="h-screen w-60 bg-gray-800 text-white p-4">
      {/* Toggle Button (Icon + Menu Name) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-gray-700 p-3 rounded w-full"
      >
        <FiMenu size={24} />
        <span>Menu</span>
      </button>

      {/* Menu Items (Visible when isOpen is true) */}
      {isOpen && (
        <ul className="mt-4 space-y-2">
          <li>
            <Link href="/dashboard" className="block p-2 bg-gray-700 rounded hover:bg-gray-600">
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/page1" className="block p-2 bg-gray-700 rounded hover:bg-gray-600">
              Page 1
            </Link>
          </li>
          <li>
            <Link href="/page2" className="block p-2 bg-gray-700 rounded hover:bg-gray-600">
              Page 2
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
}
