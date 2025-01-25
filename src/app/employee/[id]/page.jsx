import { firestore } from "../../../lib/firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import EmployeeFullView from "@/components/EmployeeFullView";

// Server-side fetching function for the employee page
export default async function EmployeeFullViewPage({ params }) {
  const { id } = params;

  try {
    // Fetch employee data from Firestore
    const employeeDocRef = doc(firestore, "employees", id);
    const employeeDocSnap = await getDoc(employeeDocRef);

    if (!employeeDocSnap.exists()) {
      throw new Error("Employee not found");
    }

    const employee = employeeDocSnap.data();

    // Fetch feedback for this employee
    const feedbackQuery = query(
      collection(firestore, "feedback"),
      where("employeeId", "==", id)
    );
    const feedbackSnapshot = await getDocs(feedbackQuery);
    const feedbackData = feedbackSnapshot.docs.map((doc) => {
      const data = doc.data();
      const timestamp = new Date(
        data.timestamp.seconds * 1000
      ).toLocaleString();
      return {
        ...data,
        timestamp,
      };
    });

    // Calculate average rating
    const averageRating =
      feedbackData.length > 0
        ? (
            feedbackData.reduce((sum, feedback) => sum + feedback.rating, 0) /
            feedbackData.length
          ).toFixed(1)
        : 0;

    // Pass data to the client component
    return (
      <div className="min-h-screen flex flex-col">
        <EmployeeFullView
          employee={employee}
          feedback={feedbackData}
          averageRating={averageRating}
        />
      </div>
    );
  } catch (error) {
    console.error(error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-center text-2xl text-red-500">
          Error: {error.message}
        </p>
      </div>
    );
  }
}

// Static paths for each dynamic route
export async function generateStaticParams() {
  // Fetch all employee IDs from Firestore (or a similar data source)
  const employeeSnapshot = await getDocs(collection(firestore, "employees"));
  const employeeIds = employeeSnapshot.docs.map((doc) => doc.id);

  // Generate paths for each employee
  return employeeIds.map((id) => ({
    id,
  }));
}
