"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { firestore } from "../../../lib/firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
} from "firebase/firestore";

const FeedbackPage = () => {
  const pathname = usePathname();
  const employeeId = pathname?.split("/").pop(); // Extract employee ID from URL

  const [employee, setEmployee] = useState(null); // Store employee details
  const [feedback, setFeedback] = useState("");
  const [employeeFeedback, setEmployeeFeedback] = useState([]);
  const [rating, setRating] = useState(0); // Rating state (1 to 5)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(""); // For success message

  useEffect(() => {
    if (!employeeId) {
      setError("No Employee ID found");
      setLoading(false);
      return;
    }

    const fetchEmployeeData = async () => {
      try {
        // Fetch employee data (first name, etc.) from Firestore
        const employeeRef = doc(firestore, "employees", employeeId); // Reference to employee document
        const employeeDoc = await getDoc(employeeRef);

        if (employeeDoc.exists()) {
          setEmployee(employeeDoc.data()); // Store employee data
        } else {
          setError("Employee not found");
        }

        // Fetch existing feedback for the employee using their ID
        const feedbackQuery = query(
          collection(firestore, "feedback"),
          where("employeeId", "==", employeeId)
        );
        const querySnapshot = await getDocs(feedbackQuery);
        setEmployeeFeedback(querySnapshot.docs.map((doc) => doc.data()));

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Error fetching feedback data");
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, [employeeId]); // Re-run when employeeId changes

  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating); // Update the rating when a star is clicked
  };

  const handleSubmitFeedback = async () => {
    if (!feedback.trim() || rating === 0) return; // Don't submit if feedback or rating is missing

    try {
      // Add feedback to Firestore
      await addDoc(collection(firestore, "feedback"), {
        employeeId: employeeId,
        feedback: feedback,
        rating: rating, // Include rating
        timestamp: new Date(),
      });

      // Update local feedback state
      setEmployeeFeedback((prev) => [...prev, { feedback, rating }]);
      setFeedback(""); // Clear feedback input
      setRating(0); // Clear rating
      setSuccessMessage("Thank you for your feedback!"); // Show success message
    } catch (err) {
      console.error("Error submitting feedback:", err);
      setError("Failed to submit feedback");
    }
  };

  if (loading) {
    return <p className="text-center text-lg">Loading data...</p>;
  }

  if (error) {
    return <p className="text-center text-red-600">Error: {error}</p>;
  }

  return (
    <section className="py-8 flex-1 flex items-center justify-center">
      <div className="w-full max-w-2xl mx-auto px-6 py-8 bg-white shadow-md rounded-lg">
        {/* Display employee's first name in the header */}
        <h1 className="text-xl font-semibold mb-6">
          Provide Feedback for <br /> {employee?.firstName}{" "}
          {employee?.middleName} {employee?.surname}
        </h1>

        {/* Success message */}
        {successMessage && (
          <p className="text-green-600 font-semibold mb-4">{successMessage}</p>
        )}

        {/* Rating System (1 to 5 stars) */}
        <div className="flex items-center mb-6">
          <p className="mr-4 text-lg">Rate the employee:</p>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => handleRatingChange(star)}
              className={`cursor-pointer text-xl ${
                star <= rating ? "text-yellow-500" : "text-gray-300"
              }`}
            >
              ★
            </span>
          ))}
        </div>

        {/* Feedback Form */}
        <textarea
          value={feedback}
          onChange={handleFeedbackChange}
          placeholder="Enter your feedback"
          rows="4"
          className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
        ></textarea>
        <button
          onClick={handleSubmitFeedback}
          className="w-full py-2 bg-primary text-white font-semibold rounded-md hover:bg-primary-dark transition duration-300"
        >
          Submit Feedback
        </button>

        {/* Display existing feedback */}
        {/* <h3 className="text-xl font-semibold mt-8 mb-4">Previous Feedback:</h3>
      {employeeFeedback.length > 0 ? (
        <ul className="space-y-4">
          {employeeFeedback.map((feedbackItem, index) => (
            <li
              key={index}
              className="p-4 border border-gray-200 rounded-md bg-gray-50 shadow-sm"
            >
              <p className="text-gray-800">{feedbackItem.feedback}</p>
              <p className="text-yellow-500">
                Rating: {feedbackItem.rating} ⭐
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">No feedback yet.</p>
      )} */}
      </div>
    </section>
  );
};

export default FeedbackPage;
