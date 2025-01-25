"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import html2pdf from "html2pdf.js";

export default function EmployeeFullView({
  employee,
  feedback,
  averageRating,
}) {
  const [isClient, setIsClient] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false); // Track image loading state

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Function to download the full page as PDF
  const downloadPDF = () => {
    const element = document.getElementById("employee-details");

    const options = {
      margin: 5,
      filename: "employee_details.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    // Only trigger pdf generation if image is loaded
    if (isImageLoaded) {
      html2pdf().from(element).set(options).save();
    } else {
      console.log("Image is still loading, please wait.");
    }
  };

  const handleImageLoad = () => {
    setIsImageLoaded(true); // Set the image as loaded
  };

  if (!isClient) return null; // Prevent rendering on the server side

  return (
    <section className="pb-12" id="employee-details">
      <div className="h-56 bg-gradient-to-br to-primary-400 from-primary-600" />
      <div className="container mx-auto px-6">
        {/* Employee Header */}
        <div className="flex justify-center -mt-20">
          <Image
            width={176}
            height={176}
            className="size-44 rounded-full shadow-lg border-4 border-primary-500"
            src={employee.photoURL || "/default-avatar.png"}
            alt={employee.firstName}
            onLoadingComplete={handleImageLoad} // Set image loaded state on load
          />
        </div>

        {/* Employee Details */}
        <div className="pt-4 text-center">
          <h2 className="text-gray-800 text-3xl font-bold">
            {employee.firstName} {employee.middleName} {employee.surname}
          </h2>
          <div className="mb-6">
            <p className="text-xl font-semibold text-gray-700">
              Total Rating: {averageRating} to 5 ⭐
            </p>
          </div>
        </div>

        {/* Employee Info */}
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

          {/* Feedback Section */}
          <div className="mt-6">
            <h3 className="text-2xl font-semibold text-black">Reviews</h3>
            {feedback.length > 0 ? (
              <ul className="space-y-4 divide-y divide-gray-300">
                {feedback.map((feedbackItem, index) => (
                  <li key={index} className="pt-4">
                    <div className="text-lg text-gray-700 mb-3">
                      <strong>Feedback:</strong>
                      <p>{feedbackItem.feedback}</p>
                    </div>
                    <p className="text-sm text-gray-600">
                      <strong>Rating:</strong> {feedbackItem.rating} ⭐
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
  );
}
