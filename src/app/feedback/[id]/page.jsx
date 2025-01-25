import { firestore } from "../../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import FeedbackComponent from "@/components/FeedbackComponent";

// FeedbackPage Component
export default function FeedbackPage() {
  return (
    <div>
      <FeedbackComponent />
    </div>
  );
}

// Static generation for dynamic paths
export async function generateStaticParams() {
  try {
    // Fetch all employee IDs from the 'employees' collection in Firestore
    const employeesSnapshot = await getDocs(collection(firestore, "employees"));
    const employees = employeesSnapshot.docs.map((doc) => doc.id);

    // Return an array of params with employee IDs
    return employees.map((id) => ({
      id: id,
    }));
  } catch (error) {
    console.error("Error fetching employee IDs:", error);
    return []; // Return an empty array in case of error
  }
}
