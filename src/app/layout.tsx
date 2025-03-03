
"use client";
import { usePathname } from "next/navigation";
import Sidebar from "./navbar/page"; // Import navbar
import "./globals.css";
import { ToastContainer } from 'react-toastify';
import "./graphstyles.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Show navbar only if NOT on the login page
  const showNavbar = pathname !== "/";

  return (
    <html lang="en">
      <body>
        <div className="flex h-screen">
          {showNavbar && <Sidebar />} {/* Display navbar globally except on login page */}
          <main className="flex-grow overflow-auto">{children}</main>
        </div>
        <ToastContainer position="top-center" autoClose={1000} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      </body>
    </html>
  );
}

