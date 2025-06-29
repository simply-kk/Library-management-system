import { useState } from "react";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const CreateStudent = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [department, setDepartment] = useState("");
    const [batch, setBatch] = useState("");
    const [rollNumber, setRollNumber] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Predefined list of departments
    const departments = [
        "Computer Science & Engineering",
    ];

    // Validate name (alphabets, spaces, hyphens, and apostrophes)
    const validateName = (name) => {
        const regex = /^[A-Za-z\s'-]+$/;
        return regex.test(name);
    };

    // Validate email format
    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    // Validate phone number (10 digits)
    const validatePhone = (phone) => {
        const regex = /^\d{10}$/;
        return regex.test(phone);
    };

    // Validate batch (format: YYYY-YYYY)
    const validateBatch = (batch) => {
        const regex = /^\d{4}-\d{4}$/;
        return regex.test(batch);
    };

    // Validate roll number (only numbers)
    const validateRollNumber = (rollNumber) => {
        const regex = /^\d+$/;
        return regex.test(rollNumber);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        // Validate inputs
        if (!validateName(name)) {
            setError("Name can only contain alphabets, spaces, hyphens, and apostrophes!");
            setLoading(false);
            return;
        }

        if (!validateEmail(email)) {
            setError("Please enter a valid email address!");
            setLoading(false);
            return;
        }

        if (!validatePhone(phone)) {
            setError("Please enter a valid 10-digit phone number!");
            setLoading(false);
            return;
        }

        if (!department) {
            setError("Please select a department!");
            setLoading(false);
            return;
        }

        if (!validateBatch(batch)) {
            setError("Batch must be in the format YYYY-YYYY (e.g., 2021-2025)!");
            setLoading(false);
            return;
        }

        if (!validateRollNumber(rollNumber)) {
            setError("Roll number can only contain numbers!");
            setLoading(false);
            return;
        }

        try {
            await axios.post(
                `${API_BASE_URL}/api/admin/create-student`,
                { name, email, phone, department, batch, rollNumber },
                { withCredentials: true }
            );

            // Show success message
            setSuccess("Student account created successfully!");

            // Reset the form after successful submission
            resetForm();

            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccess("");
            }, 3000);
        } catch (error) {
            setError(error.response?.data?.message || "Failed to create student account.");
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setName("");
        setEmail("");
        setPhone("");
        setDepartment("");
        setBatch("");
        setRollNumber("");
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-3xl font-semibold text-center mb-6 text-blue-600">Create Student Account</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name Field */}
                    <div>
                        <input
                            type="text"
                            placeholder="Name"
                            className="w-full p-3 border rounded-lg"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                if (error) setError("");
                            }}
                            required
                        />
                        {!validateName(name) && name && (
                            <p className="text-red-500 text-sm mt-1">
                                Name can only contain alphabets, spaces, hyphens, and apostrophes!
                            </p>
                        )}
                    </div>

                    {/* Email Field */}
                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full p-3 border rounded-lg"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (error) setError("");
                            }}
                            required
                        />
                        {!validateEmail(email) && email && (
                            <p className="text-red-500 text-sm mt-1">
                                Please enter a valid email address!
                            </p>
                        )}
                    </div>

                    {/* Phone Field */}
                    <div>
                        <input
                            type="text"
                            placeholder="Phone"
                            className="w-full p-3 border rounded-lg"
                            value={phone}
                            onChange={(e) => {
                                setPhone(e.target.value);
                                if (error) setError("");
                            }}
                            required
                        />
                        {!validatePhone(phone) && phone && (
                            <p className="text-red-500 text-sm mt-1">
                                Please enter a valid 10-digit phone number!
                            </p>
                        )}
                    </div>

                    {/* Department Dropdown */}
                    <div>
                        <select
                            value={department}
                            onChange={(e) => {
                                setDepartment(e.target.value);
                                if (error) setError("");
                            }}
                            className="w-full p-3 border rounded-lg"
                            required
                        >
                            <option value="" disabled>Select Department</option>
                            {departments.map((dept, index) => (
                                <option key={index} value={dept}>{dept}</option>
                            ))}
                        </select>
                    </div>

                    {/* Batch Field */}
                    <div>
                        <input
                            type="text"
                            placeholder="Batch (e.g., 2021-2025)"
                            className="w-full p-3 border rounded-lg"
                            value={batch}
                            onChange={(e) => {
                                setBatch(e.target.value);
                                if (error) setError("");
                            }}
                            required
                        />
                        {!validateBatch(batch) && batch && (
                            <p className="text-red-500 text-sm mt-1">
                                Batch must be in the format YYYY-YYYY (e.g., 2021-2025)!
                            </p>
                        )}
                    </div>

                    {/* Roll Number Field */}
                    <div>
                        <input
                            type="text"
                            placeholder="Roll Number"
                            className="w-full p-3 border rounded-lg"
                            value={rollNumber}
                            onChange={(e) => {
                                setRollNumber(e.target.value);
                                if (error) setError("");
                            }}
                            required
                        />
                        {!validateRollNumber(rollNumber) && rollNumber && (
                            <p className="text-red-500 text-sm mt-1">
                                Roll number can only contain numbers!
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg flex items-center justify-center"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="flex items-center">
                                <svg
                                    className="animate-spin h-5 w-5 mr-3 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                Creating...
                            </span>
                        ) : (
                            "Create Student"
                        )}
                    </button>

                    {/* Error Message */}
                    {error && <p className="text-red-500 text-center">{error}</p>}

                    {/* Success Message */}
                    {success && (
                        <div className="mt-4 p-4 bg-green-100 rounded-lg">
                            <p className="text-green-700 text-center">{success}</p>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default CreateStudent;