"use client";

import { useState } from "react";
import { firestore, auth, storage } from "../../lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AddEmployee() {
  const [employee, setEmployee] = useState({
    photo: null, // Add photo state
    firstName: "",
    surname: "",
    middleName: "",
    email: "",
    phoneNumber: "",
    street: "",
    town: "",
    postcode: "",
    country: "",
    city: "",
  });
  const [loading, setLoading] = useState(false); // To handle the loading state during upload

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee({ ...employee, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEmployee({ ...employee, photo: file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser; // Get the current user from Firebase Authentication

      if (!user) {
        alert("Please log in to add an employee.");
        return;
      }

      setLoading(true); // Start loading

      // If there's a photo, upload it
      let photoURL = "";
      if (employee.photo) {
        const storageRef = ref(
          storage,
          `employee_photos/${employee.photo.name}`
        );
        const snapshot = await uploadBytes(storageRef, employee.photo);
        photoURL = await getDownloadURL(snapshot.ref); // Get the URL of the uploaded photo
      }

      const userId = user.uid; // Get the user's UID
      await addDoc(collection(firestore, "employees"), {
        firstName: employee.firstName,
        surname: employee.surname,
        middleName: employee.middleName,
        phoneNumber: employee.phoneNumber,
        street: employee.street,
        town: employee.town,
        postcode: employee.postcode,
        country: employee.country,
        city: employee.city,
        email: employee.email,
        userId, // Attach the UID to the employee document
        photoURL, // Store the photo URL in Firestore (instead of the File object)
      });

      alert("Employee added successfully!");
      setEmployee({
        // Reset form fields after successful submission
        firstName: "",
        surname: "",
        middleName: "",
        phoneNumber: "",
        email: "",
        street: "",
        town: "",
        postcode: "",
        country: "",
        city: "",

        photo: null, // Reset photo
      });

      router.push("/"); // Redirect user to dashboard
    } catch (error) {
      console.error("Error adding employee:", error.message);
      alert("There was an error adding the employee.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Add Employee</h1>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2"
      >
        {Object.keys(employee).map((key) => {
          // Handle photo upload separately
          if (key === "photo") {
            return (
              <div
                key={key}
                className="flex flex-col text-center justify-center items-center sm:col-span-2"
              >
                <input
                  type="file"
                  name={key}
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mt-2 p-2 border rounded-md"
                  hidden
                  id="Upload_Photo"
                />
                <label htmlFor="Upload_Photo" className="cursor-pointer">
                  <Image
                    width={144}
                    height={144}
                    src={
                      employee.photo
                        ? URL.createObjectURL(employee.photo)
                        : "/assets/default-avatar.jpg" // Default image if no photo is uploaded
                    }
                    alt="Upload a photo"
                    className="rounded-full object-cover size-36"
                  />
                  <span className="inline-block mt-2 text-sm font-semibold text-black">
                    Upload Photo
                  </span>
                </label>
              </div>
            );
          }

          // Adjust required fields
          const isRequired =
            key === "firstName" ||
            key === "surname" ||
            key === "email" ||
            key === "phoneNumber"; // Define required fields

          return (
            <div key={key} className="flex flex-col">
              <label
                htmlFor={key}
                className="text-sm font-medium text-gray-700 capitalize"
              >
                {key.replace(/([A-Z])/g, " $1")} {/* Formatting key names */}
                {isRequired && "*"}
              </label>
              <input
                name={key}
                value={employee[key]}
                onChange={handleChange}
                placeholder={key.replace(/([A-Z])/g, " $1")}
                required={isRequired} // Set required conditionally
                className="mt-2 p-2 border rounded-md placeholder:capitalize"
              />
            </div>
          );
        })}
        <div className="col-span-1 sm:col-span-2 flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full sm:w-auto px-6 py-2 bg-primary-600 text-white font-semibold rounded-md shadow-sm hover:bg-primary-500 focus:outline-none"
          >
            {loading ? "Uploading..." : "Add Employee"}
          </button>
        </div>
      </form>
    </div>
  );
}
