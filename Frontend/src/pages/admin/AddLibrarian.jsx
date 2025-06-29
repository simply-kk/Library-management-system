import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AddLibrarian = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const departmentOptions = [
        { value: "Computer Science & Engineering", label: "Computer Science & Engineering" },
        // Add more options if needed
    ];

    const validationSchema = yup.object().shape({
        name: yup
            .string()
            .matches(/^[A-Za-z\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes")
            .required("Name is required"),
        email: yup
            .string()
            .email("Invalid email")
            .required("Email is required"),
        phone: yup
            .string()
            .matches(/^\d{10}$/, "Phone number must be 10 digits")
            .required("Phone is required"),
        password: yup
            .string()
            .min(6, "Password must be at least 6 characters")
            .required("Password is required"),
        department: yup
            .string()
            .required("Department is required"),
    });

    const handleSubmit = async (values, { resetForm }) => {
        setLoading(true);
        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/admin/create-librarian`,
                values,
                { withCredentials: true }
            );
            if (response.status === 201) {
                toast.success("✅ Librarian created successfully!");
                resetForm();
                setTimeout(() => navigate("/admin-dashboard"), 2000);
            }
        } catch (err) {
            const msg = err.response?.data?.message || "❌ Failed to create librarian. Please try again.";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-3xl font-semibold text-center text-blue-600 mb-6">Add Librarian</h1>

            <Formik
                initialValues={{
                    name: "",
                    email: "",
                    phone: "",
                    password: "",
                    department: "",
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ setFieldValue, values }) => (
                    <Form className="space-y-5">
                        {/* Name */}
                        <div>
                            <label className="block mb-1 font-medium text-gray-700">Name</label>
                            <Field
                                type="text"
                                name="name"
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="Enter full name"
                            />
                            <ErrorMessage name="name" component="div" className="text-sm text-red-500 mt-1" />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block mb-1 font-medium text-gray-700">Email</label>
                            <Field
                                type="email"
                                name="email"
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="Enter email"
                            />
                            <ErrorMessage name="email" component="div" className="text-sm text-red-500 mt-1" />
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block mb-1 font-medium text-gray-700">Phone</label>
                            <Field
                                type="tel"
                                name="phone"
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="Enter 10-digit phone"
                            />
                            <ErrorMessage name="phone" component="div" className="text-sm text-red-500 mt-1" />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block mb-1 font-medium text-gray-700">Password</label>
                            <Field
                                type="password"
                                name="password"
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="Enter password"
                            />
                            <ErrorMessage name="password" component="div" className="text-sm text-red-500 mt-1" />
                        </div>

                        {/* Department */}
                        <div>
                            <label className="block mb-1 font-medium text-gray-700">Department</label>
                            <Select
                                name="department"
                                options={departmentOptions}
                                value={departmentOptions.find(opt => opt.value === values.department)}
                                onChange={(option) => setFieldValue("department", option.value)}
                                className="text-sm"
                                placeholder="Select department"
                            />
                            <ErrorMessage name="department" component="div" className="text-sm text-red-500 mt-1" />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-2 px-4 rounded text-white font-medium ${
                                loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                            }`}
                        >
                            {loading ? "Submitting..." : "Add Librarian"}
                        </button>
                    </Form>
                )}
            </Formik>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        </div>
    );
};

export default AddLibrarian;
