import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const EditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    batch: "",
    rollNumber: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/admin/students/${id}`, {
          withCredentials: true,
        });
        setStudent(res.data);
      } catch (err) {
        setError("Failed to load student. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError("");

    try {
      await axios.put(`${API_BASE_URL}/api/admin/students/${id}`, student, {
        withCredentials: true,
      });
      toast.success("Student updated successfully!");
      setTimeout(() => navigate("/view-students"), 2000);
    } catch (err) {
      const message = err.response?.data?.message || "Failed to update student.";
      toast.error(message);
      setError(message);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-600">Loading student data...</p>;
  if (error && !submitLoading) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-3xl font-semibold text-center mb-6">Edit Student</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { label: "Name", name: "name", type: "text" },
          { label: "Email", name: "email", type: "email" },
          { label: "Phone", name: "phone", type: "text" },
          { label: "Department", name: "department", type: "text" },
          { label: "Batch", name: "batch", type: "text" },
          { label: "Roll Number", name: "rollNumber", type: "text" },
        ].map(({ label, name, type }) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
              type={type}
              name={name}
              value={student[name]}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        ))}

        <button
          type="submit"
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition duration-200 ${
            submitLoading ? "opacity-60 cursor-not-allowed" : ""
          }`}
          disabled={submitLoading}
        >
          {submitLoading ? "Updating..." : "Update Student"}
        </button>
      </form>
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default EditStudent;
