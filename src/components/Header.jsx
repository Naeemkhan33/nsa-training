"use client";

import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useState, useEffect } from "react";
import Image from "next/image";
import { getAuth } from "firebase/auth";
import Link from "next/link";

const Header = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  // Check if user is signed in
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser); // Set the current user when their authentication state changes
    });

    return () => unsubscribe(); // Cleanup the subscription on component unmount
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/signin");
  };

  return (
    <header className="py-4 bg-gray-50">
      <div className="container mx-auto px-8">
        <div className="flex justify-between">
          <Link href="/">
            <Image
              height={160}
              width={160}
              className="object-contain"
              src="/assets/logo.png"
              alt="logo"
            />
          </Link>
          <div>
            {user ? (
              <button
                className="px-4 py-2 rounded-md bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold"
                type="button"
                onClick={handleSignOut}
              >
                Sign Out
              </button>
            ) : (
              <button
                className="px-4 py-2 rounded-md bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold"
                type="button"
                onClick={() => router.push("/signin")}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
