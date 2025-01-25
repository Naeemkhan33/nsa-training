"use client";

import { useEffect, useState } from "react";
import { firestore } from "../lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { QRCodeSVG } from "qrcode.react";
import Link from "next/link";
import Image from "next/image";
import { getAuth } from "firebase/auth"; // Import Firebase Auth

export default function Report() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser); // Set the current user when their authentication state changes
    });

    // Fetch employees only if user is logged in
    if (user) {
      const fetchEmployees = async () => {
        try {
          const querySnapshot = await getDocs(
            collection(firestore, "employees")
          );
          const employeesData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          // Fetch feedback for each employee and calculate their average rating
          for (let employee of employeesData) {
            const feedbackQuery = query(
              collection(firestore, "feedback"),
              where("employeeId", "==", employee.id)
            );
            const feedbackSnapshot = await getDocs(feedbackQuery);
            const feedbackData = feedbackSnapshot.docs.map((doc) => doc.data());

            // Calculate average rating
            if (feedbackData.length > 0) {
              const totalRating = feedbackData.reduce(
                (sum, feedback) => sum + feedback.rating,
                0
              );
              const avgRating = totalRating / feedbackData.length;
              employee.averageRating = avgRating.toFixed(1); // Add average rating to employee data
            } else {
              employee.averageRating = 0; // Set to 0 if no feedback
            }
          }

          setEmployees(employeesData);
          setLoading(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      };

      fetchEmployees();
    } else {
      setLoading(false); // Stop loading if the user isn't logged in
    }

    return () => unsubscribe(); // Cleanup the subscription on component unmount
  }, [user]);

  if (!user) {
    return (
      <div className="text-center h-full flex-1 flex flex-col justify-center items-center">
        <p className="text-2xl text-red-500 font-semibold">
          You must be logged in to view this content.
        </p>
        <Link
          href="/signin"
          className="inline-block mt-3 px-4 py-2 rounded-md bg-primary text-white text-sm font-semibold"
        >
          Login Now
        </Link>
      </div>
    );
  }

  if (loading) {
    return <p className="text-center text-lg">Loading employees...</p>;
  }

  if (error) {
    return <p className="text-center text-red-600">Error: {error}</p>;
  }

  return (
    <section className="py-6">
      <div className="container mx-auto px-8">
        <div className="flex items-center gap-2 justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold">All Employees</h2>
          <Link
            className="px-4 py-2 rounded-md bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold"
            href="/add-employee"
          >
            Add Employee
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {employees.map((emp) => (
            <div
              key={emp.id}
              className="bg-white shadow-lg border border-primary rounded-lg overflow-hidden"
            >
              <div className="p-4 text-center">
                <Image
                  width={144}
                  height={144}
                  src={emp.photoURL || "/assets/default-avatar.jpg"}
                  alt={emp.firstName}
                  className="mb-2 size-36 object-cover rounded-full mx-auto"
                />
                <h3 className="text-lg font-semibold">
                  {emp.firstName || "N/A"} {emp.middleName} {emp.surname}
                </h3>
                <p className="text-gray-600">{emp.phoneNumber || "N/A"}</p>
                <p className="text-gray-600">{emp.email || "N/A"}</p>
                <div className="mt-4 flex flex-col justify-center items-center">
                  <QRCodeSVG
                    value={`/feedback/${emp.id}`}
                    size={128}
                    fgColor="#000000"
                    bgColor="#ffffff"
                  />
                  <h6 className="text-sm mt-1">Scan to Feedback</h6>
                </div>

                {/* Display Total Rating */}
                <div className="mt-4">
                  <p className="font-semibold">
                    Total Rating: {emp.averageRating} ⭐
                  </p>
                </div>
              </div>

              {/* <Link
                href={`/feedback/${emp.id}`}
                className="block p-4 text-center font-semibold bg-red-500 text-white"
              >
                Feedback
              </Link> */}
              <Link
                href={`/employee/${emp.id}`}
                className="block p-4 text-center font-semibold bg-red-500 text-white"
              >
                Full View
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
