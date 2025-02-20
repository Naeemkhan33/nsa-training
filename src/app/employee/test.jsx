"use client";

import { useEffect, useState } from "react";
import { firestore } from "../../../lib/firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { jsPDF } from "jspdf"; // Import jsPDF

export default function EmployeeFullView() {
  const pathname = usePathname();
  const id = pathname?.split("/").pop();

  const [employee, setEmployee] = useState(null);
  const [employeeFeedback, setEmployeeFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    if (!id) return;

    const fetchEmployee = async () => {
      try {
        const docRef = doc(firestore, "employees", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setEmployee(docSnap.data());
        } else {
          setError("Employee not found.");
        }

        const feedbackQuery = query(
          collection(firestore, "feedback"),
          where("employeeId", "==", id)
        );
        const feedbackSnapshot = await getDocs(feedbackQuery);
        const feedbackData = feedbackSnapshot.docs.map((doc) => doc.data());
        setEmployeeFeedback(feedbackData);

        if (feedbackData.length > 0) {
          const totalRating = feedbackData.reduce(
            (sum, feedback) => sum + feedback.rating,
            0
          );
          const avgRating = totalRating / feedbackData.length;
          setAverageRating(avgRating.toFixed(1));
        } else {
          setAverageRating(0);
        }

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  // Function to download the page as PDF
  const downloadPDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(22);
    doc.text("Employee Details", 14, 20);

    // Add employee name
    doc.setFontSize(16);
    doc.text(
      `${employee.firstName} ${employee.middleName} ${employee.surname}`,
      14,
      30
    );

    // Add average rating
    doc.text(`Total Rating: ${averageRating} ⭐`, 14, 40);

    // Add employee details
    doc.setFontSize(14);
    doc.text(`Phone: ${employee.phoneNumber}`, 14, 50);
    doc.text(`Email: ${employee.email}`, 14, 60);
    doc.text(`Street: ${employee.street}`, 14, 70);
    doc.text(`City: ${employee.city}`, 14, 80);
    doc.text(`Postcode: ${employee.postcode}`, 14, 90);
    doc.text(`Country: ${employee.country}`, 14, 100);

    // Add feedback
    doc.text("Reviews:", 14, 110);
    let yOffset = 120;
    employeeFeedback.forEach((feedbackItem) => {
      doc.text(`Feedback: ${feedbackItem.feedback}`, 14, yOffset);
      doc.text(`Rating: ${feedbackItem.rating} ⭐`, 14, yOffset + 10);
      doc.text(
        `Submitted on: ${new Date(
          feedbackItem.timestamp.seconds * 1000
        ).toLocaleString()}`,
        14,
        yOffset + 20
      );
      yOffset += 30;
    });

    // Save the PDF
    doc.save("employee_details.pdf");
  };

  if (loading) {
    return (
      <p className="text-center text-2xl text-gray-400 animate-pulse">
        Loading...
      </p>
    );
  }

  if (error) {
    return <p className="text-center text-2xl text-red-500">Error: {error}</p>;
  }

  return (
    <>
      <section className="pb-12">
        <div className="h-56 bg-gradient-to-br to-primary-400 from-primary-600" />
        <div className="container mx-auto px-6">
          {/* Employee Header (Image & Info) */}

          <div className="flex justify-center -mt-20">
            <Image
              width={176}
              height={176}
              className="size-44 rounded-full shadow-lg border-4 border-primary-500"
              src={employee.photoURL || "/assets/default-avatar.jpg"}
              alt={employee.firstName}
            />
          </div>

          {/* Employee Details */}
          <div className="py-4 text-center">
            <h2 className="text-gray-800 text-3xl font-bold">
              {employee.firstName} {employee.middleName} {employee.surname}
            </h2>
            {/* Total Rating */}
            <div className="mb-6">
              <p className="text-xl font-semibold text-gray-700">
                Total Rating: {averageRating} to 5 ⭐
              </p>
            </div>
          </div>

          <div className="bg-white mt-6 p-8 shadow-lg rounded-lg">
            <div>
              <h3 className="mb-4 text-2xl font-semibold text-black">
                Employee Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-800 md:text-lg">
                <div className="flex flex-col justify-end">
                  <span className="font-semibold">Phone:</span>
                  <p className="mt-1">{employee.phoneNumber}</p>
                </div>
                <div className="flex flex-col justify-end">
                  <span className="font-semibold">Email:</span>
                  <p className="mt-1">{employee.email}</p>
                </div>
                <div className="flex flex-col justify-end">
                  <span className="font-semibold">Street:</span>
                  <p className="mt-1">{employee.street}</p>
                </div>
                <div className="flex flex-col justify-end">
                  <span className="font-semibold">City:</span>
                  <p className="mt-1">{employee.city}</p>
                </div>
                <div className="flex flex-col justify-end">
                  <span className="font-semibold">Postcode:</span>
                  <p className="mt-1">{employee.postcode}</p>
                </div>
                <div className="flex flex-col justify-end">
                  <span className="font-semibold">Country:</span>
                  <p className="mt-1">{employee.country}</p>
                </div>
              </div>
            </div>
            <hr className="mt-6" />
            {/* Feedback Section */}
            <div className="mt-6">
              <h3 className="text-2xl font-semibold text-black">Reviews</h3>

              {employeeFeedback.length > 0 ? (
                <ul className="space-y-4 divide-y divide-gray-300">
                  {employeeFeedback.map((feedbackItem, index) => (
                    <li key={index} className="pt-4">
                      <div className="text-lg text-gray-700 mb-3">
                        <strong>Feedback:</strong>
                        <p>{feedbackItem.feedback}</p>
                      </div>
                      <p className="text-sm text-gray-600">
                        <strong>Rating:</strong> {feedbackItem.rating} ⭐
                      </p>
                      <p className="text-sm text-gray-500">
                        Submitted on:{" "}
                        {new Date(
                          feedbackItem.timestamp.seconds * 1000
                        ).toLocaleString()}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">No feedback yet.</p>
              )}
            </div>
          </div>

          {/* Download Button */}
          <div className="mt-6 text-center">
            <button
              onClick={downloadPDF}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg"
            >
              Download as PDF
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
