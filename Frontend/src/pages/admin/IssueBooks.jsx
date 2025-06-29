import { useState, useEffect } from "react";
import axios from "axios";

const IssueBooks = () => {
  const [accessionNumber, setAccessionNumber] = useState("");
  const [bookDetails, setBookDetails] = useState(null);
  const [rollNumber, setRollNumber] = useState("");
  const [studentDetails, setStudentDetails] = useState(null);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;;
    setDueDate(addDaysToDate(getTodayDate(), 14));
  }, []);

  const getTodayDate = () => new Date().toISOString().split("T")[0];

  const addDaysToDate = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result.toISOString().split("T")[0];
  };

  const fetchStudentDetails = async () => {
    setError("");
    setStudentDetails(null);
    if (!rollNumber.trim()) return;

    try {
      setLoading(true);
      const res = await axios.get(`/api/issues/student-by-roll/${rollNumber}`);
      if (res.data.success) {
        setStudentDetails(res.data.student);
      } else {
        setError("Student not found.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching student");
    } finally {
      setLoading(false);
    }
  };

  const fetchBookDetails = async () => {
    setError("");
    setBookDetails(null);
    if (!accessionNumber.trim()) return;

    try {
      setLoading(true);
      const res = await axios.get(`/api/issues/book/${accessionNumber}`);
      if (res.data.success) {
        setBookDetails(res.data.book);
      } else {
        setError("Book not found.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching book");
    } finally {
      setLoading(false);
    }
  };

  const addBook = () => {
    if (bookDetails && !selectedBooks.some((b) => b._id === bookDetails._id)) {
      setSelectedBooks([...selectedBooks, bookDetails]);
      setAccessionNumber("");
      setBookDetails(null);
    } else {
      setError("Book already selected or invalid.");
    }
  };

  const removeBook = (bookId) => {
    setSelectedBooks((prev) => prev.filter((b) => b._id !== bookId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!studentDetails || selectedBooks.length === 0 || !dueDate) {
      return setError("All fields are required.");
    }

    const selectedDate = new Date(dueDate);
    const today = new Date(getTodayDate());
    if (selectedDate < today) {
      return setError("Due date cannot be in the past.");
    }

    try {
      setLoading(true);
      const res = await axios.post("/api/issues/issue", {
        studentId: studentDetails._id,
        bookIds: selectedBooks.map((b) => b._id),
        issueDate: getTodayDate(),
        dueDate,
      });

      if (res.data.success) {
        setSuccess("✅ Books issued successfully!");
        setSelectedBooks([]);
        setAccessionNumber("");
        setStudentDetails(null);
        setRollNumber("");
        setDueDate(addDaysToDate(getTodayDate(), 14));
      } else {
        setError(res.data.message || "Failed to issue books.");
      }
    } catch (err) {
      const backendMsg = err.response?.data?.message;
      const conflict = err.response?.data?.alreadyHasBooks || err.response?.data?.unavailableBooks;
      if (conflict?.length > 0) {
        setError(`${backendMsg}. Conflict with book IDs: ${conflict.join(", ")}`);
      } else {
        setError(backendMsg || "Server error.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">📘 Issue Books</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Student */}
        <div>
          <label className="block font-semibold mb-1">Roll Number</label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              className="border rounded px-3 py-2 w-full"
              placeholder="Enter roll number"
            />
            <button
              type="button"
              onClick={fetchStudentDetails}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              disabled={loading}
            >
              Fetch Student
            </button>
          </div>
          {studentDetails && (
            <div className="mt-2 text-sm text-gray-600">
              👤 {studentDetails.name} | 🎓 {studentDetails.department} | 🏷️ Batch: {studentDetails.batch}
            </div>
          )}
        </div>

        {/* Book */}
        <div>
          <label className="block font-semibold mb-1">Accession Number</label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={accessionNumber}
              onChange={(e) => setAccessionNumber(e.target.value)}
              className="border rounded px-3 py-2 w-full"
              placeholder="Enter accession number"
            />
            <button
              type="button"
              onClick={fetchBookDetails}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              disabled={loading}
            >
              Fetch Book
            </button>
          </div>

          {bookDetails && (
            <div className="mt-2 flex justify-between items-center bg-gray-100 px-3 py-2 rounded">
              <div>
                📖 {bookDetails.bookName} by {bookDetails.authorName}
              </div>
              <button
                type="button"
                onClick={addBook}
                className="text-blue-600 font-semibold hover:underline"
              >
                ➕ Add
              </button>
            </div>
          )}
        </div>

        {/* Selected Books */}
        {selectedBooks.length > 0 && (
          <div>
            <label className="block font-semibold mb-1">📚 Selected Books:</label>
            <ul className="space-y-1">
              {selectedBooks.map((book) => (
                <li
                  key={book._id}
                  className="flex justify-between bg-gray-50 p-2 rounded items-center"
                >
                  <span>
                    {book.bookName} - {book.accessionNumber}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeBook(book._id)}
                    className="text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Due Date */}
        <div>
          <label className="block font-semibold mb-1">📅 Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="border rounded px-3 py-2"
            min={getTodayDate()}
            required
          />
        </div>

        {/* Feedback */}
        {error && <div className="text-red-600 font-medium">{error}</div>}
        {success && <div className="text-green-600 font-medium">{success}</div>}

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Processing..." : "📤 Issue Books"}
        </button>
      </form>
    </div>
  );
};

export default IssueBooks;
