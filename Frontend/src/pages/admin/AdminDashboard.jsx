import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  UserPlus, Users, Upload, LogOut,
  BookOpen, Book, ArrowDownUp, CornerDownLeft, User,
  Library
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/admin/dashboard`, {
          withCredentials: true,
          timeout: 5000
        });

        if (response.data?.user) {
          setUser(response.data.user);
          setError(null);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          console.log('Authentication failed, redirecting to login');
          navigate("/login");
        } else {
          setError('Failed to load dashboard data. Please refresh the page.');
          console.error('Dashboard error:', err);
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-red-600 text-center p-6 bg-white rounded-xl shadow-lg max-w-md mx-4">
          <div className="mb-4">⚠️</div>
          <p className="mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-3">
                <Library className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                  Welcome, <span className="text-blue-600">{user.name}</span>
                </h1>
              </div>
              <p className="text-gray-500 mt-1">Library Management System</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  Online
                </span>
                <span className="text-sm text-gray-500 mt-1">
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Sections */}
        <div className="space-y-6">
          {/* User Management */}
          <Section 
            title="User Management" 
            description="Manage student and librarian accounts"
          >
            {/* <ActionCard
              title="Add Librarian"
              description="Create new librarian account"
              icon={UserPlus}
              onClick={() => navigate("/add-librarian")}
              color="bg-purple-600"
            /> */}
            <ActionCard
              title="Register Student"
              description="Add new student to system"
              icon={UserPlus}
              onClick={() => navigate("/create-student")}
              color="bg-blue-600"
            />
            <ActionCard
              title="View Students"
              description="Manage student records"
              icon={Users}
              onClick={() => navigate("/view-students")}
              color="bg-teal-600"
            />
            <ActionCard
              title="Bulk Register"
              description="Import multiple students"
              icon={Upload}
              onClick={() => navigate("/bulk-import-students")}
              color="bg-amber-600"
            />
          </Section>

          {/* Book Management */}
          <Section 
            title="Book Management" 
            description="Handle library inventory and transactions"
          >
            <ActionCard
              title="View Books"
              description="Browse and manage inventory"
              icon={Book}
              onClick={() => navigate("/view-books")}
              color="bg-indigo-600"
            />
            <ActionCard
              title="Bulk Add Books"
              description="Import multiple books"
              icon={Upload}
              onClick={() => navigate("/bulk-import-books")}
              color="bg-sky-600"
            />
            <ActionCard
              title="Issue Books"
              description="Process book loans"
              icon={ArrowDownUp}
              onClick={() => navigate("/issue-books")}
              color="bg-pink-600"
            />
            <ActionCard
              title="Return Books"
              description="Handle book returns"
              icon={CornerDownLeft}
              onClick={() => navigate("/return-books")}
              color="bg-orange-600"
            />
          </Section>

          {/* Reports & History */}
          <Section 
            title="Reports & History" 
            description="View transaction history and generate reports"
          >
            <ActionCard
              title="Transaction History"
              description="View all book transactions"
              icon={BookOpen}
              onClick={() => navigate("/history-books")}
              color="bg-blue-700"
            />
          </Section>
        </div>
      </main>
    </div>
  );
};

const Section = ({ title, description, children }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm">
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      <p className="text-gray-500 text-sm mt-1">{description}</p>
    </div>
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {children}
    </div>
  </div>
);

const ActionCard = ({ title, description, icon: Icon, onClick, color }) => (
  <button
    onClick={onClick}
    className={`w-full text-left rounded-xl p-6 ${color} hover:opacity-90 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg`}
  >
    <div className="flex items-center gap-4">
      <div className="bg-white/10 p-3 rounded-lg">
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div>
        <h3 className="font-medium text-white">{title}</h3>
        <p className="text-white/80 text-sm mt-1">{description}</p>
      </div>
    </div>
  </button>
);

export default AdminDashboard;