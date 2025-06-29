import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ViewStudents = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const limit = 10;

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchStudents = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/admin/students?page=${currentPage}&limit=${limit}&search=${debouncedSearch}`,
        { withCredentials: true }
      );
      setStudents(res.data.students);
      setTotalPages(res.data.totalPages || 1);
    } catch {
      setError("Failed to fetch students. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [currentPage, debouncedSearch]);

  const handleEdit = (id) => navigate(`/edit-student/${id}`);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/students/${id}`, {
        withCredentials: true,
      });
      fetchStudents();
    } catch {
      setError("Failed to delete student.");
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center sm:text-left">👨‍🎓 View Students</h1>

      <input
        type="text"
        placeholder="Search by name, batch, or roll number..."
        className="w-full sm:w-1/2 mb-4 p-2 border border-gray-300 rounded"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
      />

      {loading ? (
        <p className="text-center text-blue-500">Loading students...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <>
          {/* Table view */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full bg-white border border-gray-200 rounded-lg shadow-md">
              <thead className="bg-gray-100 text-xs text-gray-600 uppercase">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Department</th>
                  <th className="p-3 text-left">Batch</th>
                  <th className="p-3 text-left">Roll No</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student._id} className="hover:bg-gray-50">
                    <td className="p-3">{student.name}</td>
                    <td className="p-3">{student.email}</td>
                    <td className="p-3">{student.department}</td>
                    <td className="p-3">{student.batch}</td>
                    <td className="p-3">{student.rollNumber}</td>
                    <td className="p-3 space-x-2">
                      <button
                        onClick={() => handleEdit(student._id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(student._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Card layout on small screens */}
          <div className="md:hidden space-y-4">
            {students.map((student) => (
              <div key={student._id} className="border border-gray-200 rounded-lg p-4 shadow bg-white">
                <h2 className="text-lg font-semibold">{student.name}</h2>
                <p className="text-sm text-gray-600">📧 {student.email}</p>
                <p className="text-sm">🏫 {student.department}</p>
                <p className="text-sm">🎓 {student.batch} | Roll No: {student.rollNumber}</p>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleEdit(student._id)}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(student._id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination controls */}
          <div className="mt-6 flex justify-center items-center space-x-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">Page {currentPage} of {totalPages}</span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ViewStudents;

