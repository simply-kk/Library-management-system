import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const DEPARTMENTS = [
  "Computer Science & Engineering",
  "Electronics & Communication Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Electrical Engineering",
  "Information Technology",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biotechnology",
  "Management",
  "Humanities",
  "Other"
];

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\d{10}$/;

const LibrarianRegister = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    department: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = "Name is required.";
    if (!emailRegex.test(form.email)) errors.email = "Invalid email address.";
    if (!phoneRegex.test(form.phone)) errors.phone = "Phone must be 10 digits.";
    if (!form.password || form.password.length < 6) errors.password = "Password must be at least 6 characters.";
    if (!form.department) errors.department = "Department is required.";
    return errors;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFieldErrors({ ...fieldErrors, [e.target.name]: undefined });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setLoading(true);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/librarian-register`,
        form
      );
      setSuccess(res.data.message || "Registration successful!");
      setTimeout(() => navigate("/librarian-login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-3xl font-semibold text-center mb-6 text-blue-600">Librarian Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="w-full p-3 border rounded-lg"
              value={form.name}
              onChange={handleChange}
              required
            />
            {fieldErrors.name && <p className="text-red-500 text-sm mt-1">{fieldErrors.name}</p>}
          </div>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full p-3 border rounded-lg"
              value={form.email}
              onChange={handleChange}
              required
            />
            {fieldErrors.email && <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>}
          </div>
          <div>
            <input
              type="text"
              name="phone"
              placeholder="Phone (10 digits)"
              className="w-full p-3 border rounded-lg"
              value={form.phone}
              onChange={handleChange}
              required
              maxLength={10}
            />
            {fieldErrors.phone && <p className="text-red-500 text-sm mt-1">{fieldErrors.phone}</p>}
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full p-3 border rounded-lg"
              value={form.password}
              onChange={handleChange}
              required
            />
            {fieldErrors.password && <p className="text-red-500 text-sm mt-1">{fieldErrors.password}</p>}
          </div>
          <div>
            <select
              name="department"
              className="w-full p-3 border rounded-lg"
              value={form.department}
              onChange={handleChange}
              required
            >
              <option value="">Select Department</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            {fieldErrors.department && <p className="text-red-500 text-sm mt-1">{fieldErrors.department}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg flex items-center justify-center"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
          {error && <p className="text-red-500 text-center">{error}</p>}
          {success && <p className="text-green-600 text-center">{success}</p>}
        </form>
        <div className="mt-4 text-center">
          <span className="text-gray-600">Already have an account? </span>
          <Link to="/librarian-login" className="text-blue-500 hover:text-blue-600">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LibrarianRegister; 