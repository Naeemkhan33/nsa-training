"use client";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // State for password confirmation
  const [error, setError] = useState(""); // State to store error message
  const [showPassword, setShowPassword] = useState(false); // State for showing/hiding password
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for showing/hiding confirm password
  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(""); // Reset the error message before trying again

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/"); // Redirect to the home page after successful sign-up
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setError("This email is already in use. Please use a different email.");
      } else if (error.code === "auth/weak-password") {
        setError(
          "The password is too weak. Please choose a stronger password."
        );
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Your Company"
          src="/assets/logo.png"
          className="mx-auto h-10 w-auto"
        />
        <h2 className="mt-4 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Create a New Account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSignUp} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-primary-600 sm:text-sm/6"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-sm text-primary-500"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-primary-600 sm:text-sm/6"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="confirm-password"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Confirm Password
              </label>
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-sm text-primary-500"
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
            <div className="mt-2">
              <input
                id="confirm-password"
                name="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                required
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-primary-600 sm:text-sm/6"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            {/* Show error message if there's any */}
            {error && (
              <p className="text-center text-red-500 text-sm">{error}</p>
            )}
            <button
              type="submit"
              className="mt-2 flex w-full justify-center rounded-md bg-primary-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            >
              Sign up
            </button>

            <p className="mt-6 text-center text-sm/6 text-gray-500">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="font-semibold text-primary-500 hover:text-primary-600"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
