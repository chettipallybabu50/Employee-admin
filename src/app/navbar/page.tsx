
"use client";
import { useState } from "react";
import { usePathname } from "next/navigation"; // ✅ Correct hook for App Router
import { FiMenu } from "react-icons/fi";
import Link from "next/link";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname(); // ✅ Get current route

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    window.location.href = "/"; // Redirect to login
  };

  // Menu items
  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Charts", path: "/charts" },
    { name: "Services", path: "/services" },
  ];

  return (
    <div className="h-screen w-60 bg-gray-800 text-white p-4">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-gray-700 p-3 rounded w-full"
      >
        <FiMenu size={24} />
        <span>Menu</span>
      </button>

      {/* Menu Items */}
      {isOpen && (
        <ul className="mt-4 space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`block p-2 rounded ${
                  pathname === item.path ? "bg-[#3B8274]" : "bg-gray-700"
                } hover:bg-gray-600`}
              >
                {item.name}
              </Link>
            </li>
          ))}
          {/* Logout Button */}
          <li>
            <button
              onClick={handleLogout}
              className="block p-2 bg-red-500 rounded hover:bg-red-600 w-full text-left"
            >
              Logout
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
