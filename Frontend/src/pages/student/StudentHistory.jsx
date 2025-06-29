import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Utility: Format date to dd-mm-yyyy
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB"); // dd/mm/yyyy
};

const StudentHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/student/history`, { withCredentials: true })
      .then((res) => setTransactions(res.data.transactions))
      .catch((err) => {
        console.error("Error fetching history:", err);
        navigate("/student/dashboard");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-solid"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">📚 Transaction History</h1>
        <button
          onClick={() => navigate("/student/dashboard")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow"
        >
          ⬅ Back to Dashboard
        </button>
      </div>

      {transactions.length > 0 ? (
        <div className="overflow-x-auto rounded-lg shadow ring-1 ring-gray-300">
          <table className="min-w-full divide-y divide-gray-200 bg-white">
            <thead className="bg-gray-100 text-gray-700 text-sm font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 text-left">Book</th>
                <th className="py-3 px-4 text-left">Issued On</th>
                <th className="py-3 px-4 text-left">Due Date</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Returned On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm">
              {transactions.map((txn, index) => (
                <tr key={index} className="hover:bg-gray-50 transition">
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">{txn.book.bookName}</div>
                    <div className="text-gray-600 text-sm">{txn.book.authorName}</div>
                    <div className="text-xs text-gray-400">Acc#: {txn.book.accessionNumber}</div>
                  </td>
                  <td className="py-3 px-4">{formatDate(txn.issueDate)}</td>
                  <td className="py-3 px-4">{formatDate(txn.dueDate)}</td>
                  <td className="py-3 px-4">
                    {txn.returned ? (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        Returned
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                        Not Returned
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {txn.returned ? formatDate(txn.returnedAt) : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-600 text-lg">No transaction history found.</p>
        </div>
      )}
    </div>
  );
};

export default StudentHistory;
