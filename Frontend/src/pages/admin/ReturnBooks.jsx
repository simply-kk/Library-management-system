import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoadingSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-blue-50/50 p-4 rounded border mb-6">
      <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
    </div>
    <div className="space-y-4">
      {[1, 2].map((i) => (
        <div key={i} className="flex justify-between items-center p-4 border rounded">
          <div className="w-full">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          </div>
          <div className="h-10 w-24 bg-gray-200 rounded ml-4"></div>
        </div>
      ))}
    </div>
  </div>
);

const ReturnBooks = () => {
  const [rollNumber, setRollNumber] = useState("");
  const [student, setStudent] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [returningBookId, setReturningBookId] = useState(""); // For disabling button during return

  axios.defaults.withCredentials = true;
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  const handleSearch = async () => {
    if (!rollNumber.trim()) {
      toast.warning("Please enter a roll number");
      return;
    }

    setStudent(null);
    setBooks([]);
    setLoading(true);
    setHasSearched(true);

    try {
      const res = await axios.get(`/api/issues/student-by-roll/${rollNumber}`);
      if (res.data.success) {
        setStudent(res.data.student);
        await fetchUnreturnedBooks(res.data.student._id);
      } else {
        toast.error(res.data.message || "Student not found");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error searching for student");
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreturnedBooks = async (studentId) => {
    try {
      const res = await axios.get(`/api/returns/student/${studentId}`);
      if (res.data.success) {
        setBooks(res.data.books);
        if (res.data.books.length === 0) {
          toast.info("No unreturned books.");
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error fetching unreturned books");
    }
  };

  const handleReturn = async (book) => {
    if (!student || !book.issuedBookId || !book.issueId) {
      toast.error("Missing return information");
      return;
    }

    setReturningBookId(book.issuedBookId); // Disable this button

    try {
      const res = await axios.post("/api/returns", {
        studentId: student._id,
        bookId: book._id,
        issueId: book.issueId,
        issuedBookId: book.issuedBookId, // ✅ correct key
      });

      if (res.data.success) {
        toast.success("✅ Book returned successfully!");
        setBooks((prev) => prev.filter((b) => b.issuedBookId !== book.issuedBookId));
      } else {
        toast.error(res.data.message || "Failed to return book.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error returning book.");
    } finally {
      setReturningBookId(""); // Re-enable buttons
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">📕 Return Books</h2>

        <div className="mb-6">
          <label className="block font-medium text-gray-700 mb-1">Roll Number</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="border px-4 py-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter roll number"
              disabled={loading}
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400 transition-colors duration-200 min-w-[120px]"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div>
                  <span className="ml-2">Searching...</span>
                </div>
              ) : (
                "Search"
              )}
            </button>
          </div>
        </div>

        {loading ? (
          <LoadingSkeleton />
        ) : (
          <>
            {student && (
              <div className="bg-blue-50 p-4 rounded border mb-6 transform transition-all duration-200 hover:shadow-md">
                <p className="font-semibold">👤 {student.name}</p>
                <p className="text-sm text-gray-600">
                  🎓 {student.department} | 🆔 {student.rollNumber} {student.batch && `| 🎯 Batch: ${student.batch}`}
                </p>
              </div>
            )}

            {hasSearched && !loading && (
              <div className="mt-6">
                {books.length > 0 ? (
                  <div className="space-y-4">
                    {books.map((book) => (
                      <div
                        key={book.issuedBookId}
                        className="flex justify-between items-center p-4 border rounded hover:shadow-md transition-shadow duration-200"
                      >
                        <div>
                          <h6 className="text-xs text-gray-500 mt-1">Accession: {book.accessionNumber}</h6>
                          <h4 className="font-medium text-lg">{book.bookName}</h4>
                          <p className="text-sm text-gray-600">by {book.authorName}</p>
                          <p className="text-xs text-gray-500">Issued: {formatDate(book.issueDate)}</p>
                          <p className="text-xs text-gray-500">
                            Due: {formatDate(book.dueDate)}{" "}
                            {book.isOverdue && (
                              <span className="text-red-600 font-semibold ml-1 animate-pulse">(Overdue)</span>
                            )}
                          </p>
                        </div>
                        <button
                          onClick={() => handleReturn(book)}
                          disabled={returningBookId === book.issuedBookId}
                          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:bg-gray-400 transition-colors duration-200 min-w-[120px] flex items-center justify-center"
                        >
                          {returningBookId === book.issuedBookId ? (
                            <>
                              <div className="w-4 h-4 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                              Returning...
                            </>
                          ) : (
                            "Return"
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  student && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">📚 This student has no books to return.</p>
                    </div>
                  )
                )}
                {!student && hasSearched && !loading && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">🔍 No student found with this roll number.</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ReturnBooks;

