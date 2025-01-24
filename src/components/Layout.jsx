"use client";
import React from "react";
import Header from "./Header";
import { usePathname } from "next/navigation";

const Layout = ({ children }) => {
  const pathname = usePathname(); // Get the current pathname
  const hideHeader = pathname === "/signin" || pathname === "/signup"; // Check if the current route is /sign-in
  return (
    <div className="min-h-screen flex flex-col">
      {!hideHeader && <Header />}

      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
};

export default Layout;
