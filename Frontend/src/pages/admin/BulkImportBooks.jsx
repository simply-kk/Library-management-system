import { useState } from "react";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const BulkImportBooks = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [importResults, setImportResults] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setImportResults(null);

        if (!file) {
            setError("Please upload a CSV file!");
            return;
        }

        // Ensure file type is CSV
        if (!file.name.endsWith(".csv")) {
            setError("Invalid file format! Please upload a .csv file.");
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const { data } = await axios.post(
               `${API_BASE_URL}/api/books/bulk-import-books`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    withCredentials: true,
                }
            );

            setMessage(data.message);
            setImportResults({
                inserted: data.inserted || 0,
                duplicates: data.duplicates || 0,
                errors: data.errors || 0,
                duplicateEntries: data.duplicateEntries || [],
                errorEntries: data.errorEntries || [],
            });
        } catch (error) {
            setError(error.response?.data?.message || "Failed to import books!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
                <h2 className="text-3xl font-semibold text-center mb-6 text-blue-600">
                    Bulk Import Books
                </h2>

                {/* CSV Format Guide */}
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-700 mb-2">CSV Format Guide:</h3>
                    <p className="text-sm text-gray-600 mb-2">Your CSV file should include the following columns:</p>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        <li>Accession Number (unique identifier)</li>
                        <li>Author Name</li>
                        <li>Book Name</li>
                        <li>Category (e.g., Computer Network, Operating System, Database)</li>
                        <li>Publication</li>
                        <li>Year</li>
                        <li>Total Pages</li>
                        <li>Supplier</li>
                        <li>Price</li>
                    </ul>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <input
                            type="file"
                            accept=".csv"
                            className="w-full p-3 border rounded-lg"
                            onChange={(e) => setFile(e.target.files[0])}
                            required
                        />
                        <p className="text-sm text-gray-500 mt-2">Upload your CSV file here</p>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg transition duration-200"
                        disabled={loading}
                    >
                        {loading ? "Importing Books..." : "Import Books"}
                    </button>

                    {error && (
                        <div className="p-3 bg-red-50 text-red-500 rounded-lg text-center">
                            {error}
                        </div>
                    )}
                    
                    {message && (
                        <div className="p-3 bg-green-50 text-green-500 rounded-lg text-center">
                            {message}
                        </div>
                    )}

                    {importResults && (
                        <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                            <h3 className="text-lg font-semibold mb-2">Import Summary:</h3>
                            <p className="text-green-600">✅ Inserted: {importResults.inserted}</p>
                            <p className="text-yellow-600">⚠️ Duplicates: {importResults.duplicates}</p>
                            <p className="text-red-600">❌ Errors: {importResults.errors}</p>

                            {/* Show duplicate entries */}
                            {importResults.duplicateEntries.length > 0 && (
                                <div className="mt-2">
                                    <h4 className="font-medium">Duplicate Entries Skipped:</h4>
                                    <ul className="text-sm text-gray-700 max-h-40 overflow-auto border p-2 rounded-lg">
                                        {importResults.duplicateEntries.map((entry, index) => (
                                            <li key={index}>
                                                📌 {entry.accessionNumber || "Unknown Accession Number"} - {entry.error}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Show errors */}
                            {importResults.errorEntries.length > 0 && (
                                <div className="mt-2">
                                    <h4 className="font-medium">Errors Found:</h4>
                                    <ul className="text-sm text-gray-700 max-h-40 overflow-auto border p-2 rounded-lg">
                                        {importResults.errorEntries.map((entry, index) => (
                                            <li key={index}>
                                                ❌ {entry.accessionNumber || "Unknown Accession Number"} - {entry.error}
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

export default BulkImportBooks;
