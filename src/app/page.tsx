
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loginform from "./components/loginform";

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated");
    console.log("---------->>> isAuthenticated:", auth);
    
    if (auth === "true") {
      router.push("/dashboard"); // Redirect if already logged in
    }
  }, [isAuthenticated]); // Re-run when authentication state changes

  return (
    <div>
      <Loginform setAuth={setIsAuthenticated} /> {/* Pass state update function */}
    </div>
  );
}

