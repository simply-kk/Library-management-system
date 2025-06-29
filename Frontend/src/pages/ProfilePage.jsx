import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  User, Mail, Phone, BookOpen,
  GraduationCap, Hash, Lock, Save,
  Edit, Check, X, ChevronLeft, Eye, EyeOff
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: ""
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [messages, setMessages] = useState({ error: "", success: "" });
  const [loading, setLoading] = useState({
    profile: false,
    password: false
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const isStudent = user?.role === "student";
  const colorScheme = {
    bg: isStudent ? "bg-green-600" : "bg-blue-600",
    bgHover: isStudent ? "hover:bg-green-700" : "hover:bg-blue-700",
    border: isStudent ? "border-green-500" : "border-blue-500",
    text: isStudent ? "text-green-600" : "text-blue-600",
    bgLight: isStudent ? "bg-green-100" : "bg-blue-100",
    textLight: isStudent ? "text-green-800" : "text-blue-800",
    icon: isStudent ? "text-green-600" : "text-blue-600"
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const endpoint = window.location.pathname.includes("librarian")
          ? `${API_BASE_URL}/api/admin/profile`
          : `${API_BASE_URL}/api/student/profile`;

        const res = await axios.get(endpoint, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });

        const userData = res.data.user || res.data;
        if (!userData) {
          throw new Error("No user data received from server");
        }

        setUser(userData);
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
          department: userData.department || "",
          ...(userData.role === "student" && {
            batch: userData.batch || "",
            rollNumber: userData.rollNumber || "",
          }),
        });
      } catch (err) {
        console.error("Profile fetch error:", err);
        const errorMessage = err.response?.data?.message || 
                           err.message || 
                           "Failed to load profile. Please try again later.";
        setError(errorMessage);

        if (err.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(prev => ({ ...prev, profile: false }));
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, profile: true }));
    setMessages({ error: "", success: "" });

    try {
      const endpoint = window.location.pathname.includes("librarian")
        ? `${API_BASE_URL}/api/admin/profile`
        : `${API_BASE_URL}/api/student/profile`;

      const res = await axios.put(endpoint, formData, {
        withCredentials: true,
      });

      setUser(res.data.user || res.data);
      setIsEditing(false);
      setMessages({ 
        success: "Profile updated successfully!", 
        error: "" 
      });
      
      // Update localStorage name if changed
      if (formData.name && formData.name !== localStorage.getItem("name")) {
        localStorage.setItem("name", formData.name);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                         "Failed to update profile. Please check your data and try again.";
      setMessages({
        error: errorMessage,
        success: ""
      });
    } finally {
      setLoading(prev => ({ ...prev, profile: false }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, password: true }));
    setMessages({ error: "", success: "" });

    // Validation
    if (!passwordData.current || !passwordData.new || !passwordData.confirm) {
      setMessages({ error: "All password fields are required", success: "" });
      setLoading(prev => ({ ...prev, password: false }));
      return;
    }

    if (passwordData.new.length < 6) {
      setMessages({
        error: "Password must be at least 6 characters long",
        success: ""
      });
      setLoading(prev => ({ ...prev, password: false }));
      return;
    }

    if (passwordData.new !== passwordData.confirm) {
      setMessages({
        error: "New password and confirmation do not match",
        success: ""
      });
      setLoading(prev => ({ ...prev, password: false }));
      return;
    }

    try {
      const passwordEndpoint = window.location.pathname.includes("librarian")
        ? `${API_BASE_URL}/api/admin/change-password`
        : `${API_BASE_URL}/api/student/change-password`;

      const response = await axios.post(
        passwordEndpoint,
        {
          currentPassword: passwordData.current,
          newPassword: passwordData.new,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setMessages({
          success: "Password changed successfully! You'll be logged out shortly...",
          error: ""
        });
        setPasswordData({ current: "", new: "", confirm: "" });

        setTimeout(() => {
          navigate("/logout");
        }, 2000);
      } else {
        setMessages({
          error: response.data.error || "Password change failed",
          success: ""
        });
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error ||
                         err.response?.data?.message ||
                         "Password change failed. Please check your current password and try again.";
      setMessages({
        error: errorMessage,
        success: ""
      });
    } finally {
      setLoading(prev => ({ ...prev, password: false }));
    }
  };

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong>Error:</strong> {error}
        </div>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (loading.profile || !user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-4">Loading profile data...</span>
      </div>
    );
  }

  const profileFields = [
    { icon: User, label: "Name", key: "name", editable: !isStudent },
    { icon: Mail, label: "Email", key: "email", editable: false },
    { icon: Phone, label: "Phone", key: "phone", editable: true },
    { icon: BookOpen, label: "Department", key: "department", editable: !isStudent },
    ...(isStudent
      ? [
          { icon: GraduationCap, label: "Batch", key: "batch", editable: false },
          { icon: Hash, label: "Roll Number", key: "rollNumber", editable: false },
        ]
      : []),
  ];

  return (
    <div className="max-w-4xl mx-auto p-4">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
      >
        <ChevronLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${colorScheme.bgLight} ${colorScheme.textLight}`}>
          {isStudent ? "Student" : "Librarian"}
        </div>
      </div>

      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-medium flex items-center gap-2 ${
            activeTab === "profile"
              ? `border-b-2 ${colorScheme.border} ${colorScheme.text}`
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("profile")}
        >
          <User className="w-4 h-4" /> Profile
        </button>
        <button
          className={`px-4 py-2 font-medium flex items-center gap-2 ${
            activeTab === "password"
              ? `border-b-2 ${colorScheme.border} ${colorScheme.text}`
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("password")}
        >
          <Lock className="w-4 h-4" /> Password
        </button>
      </div>

      {activeTab === "profile" && (
        <div className="bg-white rounded-lg shadow p-6">
          {isEditing ? (
            <form onSubmit={handleProfileSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {profileFields.map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium mb-1">
                      {field.label}
                    </label>
                    <input
                      type={field.key === "email" ? "email" : "text"}
                      name={field.key}
                      value={formData[field.key] || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [field.key]: e.target.value,
                        })
                      }
                      className={`w-full p-2 border rounded ${
                        field.editable ? "" : "bg-gray-100 cursor-not-allowed"
                      }`}
                      disabled={!field.editable || loading.profile}
                      required={field.editable}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  disabled={loading.profile}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 ${colorScheme.bg} ${colorScheme.bgHover} text-white rounded flex items-center`}
                  disabled={loading.profile}
                >
                  {loading.profile ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2" size={16} /> Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {profileFields.map((field) => (
                  <div key={field.key} className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${colorScheme.bgLight} ${colorScheme.icon}`}>
                      <field.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{field.label}</p>
                      <p className="font-medium">
                        {user[field.key] || "Not provided"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className={`px-4 py-2 ${colorScheme.bg} ${colorScheme.bgHover} text-white rounded flex items-center`}
              >
                <Edit className="mr-2" size={16} /> Edit Profile
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === "password" && (
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handlePasswordSubmit}>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword.current ? "text" : "password"}
                    name="current"
                    value={passwordData.current}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        current: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded pr-10"
                    required
                    disabled={loading.password}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("current")}
                    className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                    aria-label={showPassword.current ? "Hide password" : "Show password"}
                  >
                    {showPassword.current ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  New Password (min 6 chars)
                </label>
                <div className="relative">
                  <input
                    type={showPassword.new ? "text" : "password"}
                    name="new"
                    value={passwordData.new}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, new: e.target.value })
                    }
                    className="w-full p-2 border rounded pr-10"
                    required
                    minLength={6}
                    disabled={loading.password}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("new")}
                    className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                    aria-label={showPassword.new ? "Hide password" : "Show password"}
                  >
                    {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword.confirm ? "text" : "password"}
                    name="confirm"
                    value={passwordData.confirm}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirm: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded pr-10"
                    required
                    disabled={loading.password}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirm")}
                    className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                    aria-label={showPassword.confirm ? "Hide password" : "Show password"}
                  >
                    {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>
            
            <button
              type="submit"
              className={`px-4 py-2 ${colorScheme.bg} ${colorScheme.bgHover} text-white rounded flex items-center justify-center w-full`}
              disabled={loading.password}
            >
              {loading.password ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                  Changing Password...
                </>
              ) : (
                <>
                  <Lock className="mr-2" size={16} />
                  Change Password
                </>
              )}
            </button>
          </form>
        </div>
      )}
      
      {messages.error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded flex items-start gap-2">
          <X className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <p>{messages.error}</p>
        </div>
      )}
      
      {messages.success && (
        <div className="mt-4 p-3 bg-green-100 text-green-700 rounded flex items-start gap-2">
          <Check className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <p>{messages.success}</p>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;