import { firestore } from "../../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import EmployeeFullView from "@/components/EmployeeFullView";

export default async function EmployeeFullViewPage() {
  return (
    <>
      <EmployeeFullView />
    </>
  );
}

// This function is required when using `output: export` to pre-generate pages with dynamic routes.
export async function generateStaticParams() {
  // Get all employee IDs from your Firestore or any data source.
  const employeesSnapshot = await getDocs(collection(firestore, "employees"));
  const employees = employeesSnapshot.docs.map((doc) => doc.id);

  // Return the list of dynamic parameters (employee IDs).
  return employees.map((id) => ({
    id: id,
  }));
}
