import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BulkImportStudents = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [duplicates, setDuplicates] = useState([]);
    const [validationErrors, setValidationErrors] = useState([]);
    const navigate = useNavigate();

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setError("Please select a file!");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");
        setDuplicates([]);
        setValidationErrors([]);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/admin/bulk-import-students`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    withCredentials: true,
                }
            );

            setSuccess(`Successfully created ${response.data.created} students!`);
            setDuplicates(response.data.duplicates);
            setValidationErrors(response.data.errors);
        } catch (error) {
            console.error("Import error:", error);
            setError(
                error.response?.data?.message || 
                error.message || 
                "Failed to import students. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">
                    Bulk Import Students
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            CSV File
                        </label>
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            File should contain name, email, phone, department, batch, and rollNumber columns
                        </p>
                    </div>
                    
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                            loading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </span>
                        ) : "Import Students"}
                    </button>

                    {/* Status Messages */}
                    {error && (
                        <div className="p-3 text-sm text-red-700 bg-red-100 rounded-md">
                            {error}
                        </div>
                    )}
                    
                    {success && (
                        <div className="p-3 text-sm text-green-700 bg-green-100 rounded-md">
                            {success}
                        </div>
                    )}

                    {/* Display Issues */}
                    {(duplicates.length > 0 || validationErrors.length > 0) && (
                        <div className="space-y-4">
                            {duplicates.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700">
                                        Duplicate Entries ({duplicates.length})
                                    </h3>
                                    <ul className="mt-1 text-xs text-red-600 space-y-1">
                                        {duplicates.map((dup, index) => (
                                            <li key={index}>
                                                {dup.student.email}: {dup.error}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            
                            {validationErrors.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700">
                                        Validation Errors ({validationErrors.length})
                                    </h3>
                                    <ul className="mt-1 text-xs text-red-600 space-y-1">
                                        {validationErrors.map((err, index) => (
                                            <li key={index}>
                                                Row {err.row.email}: {err.error}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default BulkImportStudents;