import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Format to dd-mm-yyyy
const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString("en-GB");

const StudentDashboard = () => {
  const [user, setUser] = useState(null);
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .all([
        axios.get(`${API_BASE_URL}/api/student/dashboard`, { withCredentials: true }),
        axios.get(`${API_BASE_URL}/api/student/issued-books`, { withCredentials: true }),
      ])
      .then(
        axios.spread((userRes, booksRes) => {
          setUser(userRes.data.user);
          setIssuedBooks(booksRes.data.books);
        })
      )
      .catch(() => navigate("/"))
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-600 border-solid"></div>
      </div>
    );
  }

  const overdueCount = issuedBooks.filter(
    (book) => new Date(book.dueDate) < new Date()
  ).length;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Welcome Message */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">👋 Welcome, {user.name}</h1>
        <p className="text-gray-500 mt-1">Here’s a quick overview of your library activity.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <DashboardCard label="Currently Borrowed Books" value={issuedBooks.length} color="bg-blue-100" />
        <DashboardCard label="Overdue Books" value={overdueCount} color="bg-red-100" />
        <div className="bg-green-100 p-5 rounded-lg shadow text-center">
          <Link to="/student/history" className="text-green-700 font-medium hover:underline">
            📖 View Borrow/Return History
          </Link>
        </div>
      </div>

      {/* Currently Borrowed Books List */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-blue-700 mb-4">📚 Currently Borrowed Books</h2>
        {issuedBooks.length === 0 ? (
          <p className="text-gray-500">You have no books currently borrowed.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {issuedBooks.map((book) => (
              <li key={book._id} className="py-4">
                <div className="text-lg font-medium text-gray-800">{book.bookName}</div>
                <div className="text-sm text-gray-600">by {book.authorName}</div>
                <div className="text-sm text-gray-500 mt-1">
                  <p>📅 Issued: {formatDate(book.issueDate)}</p>
                  <p className={new Date(book.dueDate) < new Date() ? "text-red-600 font-semibold" : ""}>
                    ⏰ Due: {formatDate(book.dueDate)}
                    {new Date(book.dueDate) < new Date() && " (Overdue)"}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const DashboardCard = ({ label, value, color }) => (
  <div className={`${color} p-5 rounded-lg shadow text-center`}>
    <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
    <p className="text-sm font-medium text-gray-700 mt-1">{label}</p>
  </div>
);

export default StudentDashboard;
