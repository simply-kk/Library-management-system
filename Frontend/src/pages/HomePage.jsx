import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Book, User, Shield, Info, Star, Mail } from "lucide-react";

const HomePage = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (role === "librarian") navigate("/admin-dashboard");
    else if (role === "student") navigate("/student-dashboard");
  }, [role, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-200 to-pink-100 select-none relative overflow-hidden">
      {/* Decorative blurred shape */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-blue-300 via-purple-300 to-pink-200 rounded-full blur-3xl opacity-40 z-0" />
      <div className="py-16 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl sm:text-6xl font-extrabold mb-6 cursor-default tracking-tight">
              <span className="bg-gradient-to-r from-blue-700 via-fuchsia-600 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
                College Library Portal
              </span>
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-10 cursor-default font-medium">
              Your digital gateway to books, resources, and academic excellence.
            </p>
          </div>

          {/* Login Section */}
          <div className="max-w-2xl mx-auto mb-16">
            <div className="grid md:grid-cols-2 gap-6">
              <button
                onClick={() => navigate("/librarian-login")}
                className="bg-gradient-to-r from-blue-600 to-fuchsia-600 text-white px-8 py-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-400 cursor-pointer select-none font-semibold text-lg backdrop-blur-md bg-opacity-80"
              >
                <h3 className="text-2xl font-bold mb-2">Librarian Login</h3>
                <p className="text-blue-100 text-sm">Access management system</p>
              </button>
              <button
                onClick={() => navigate("/student-login")}
                className="bg-gradient-to-r from-fuchsia-500 to-blue-500 text-white px-8 py-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 cursor-pointer select-none font-semibold text-lg backdrop-blur-md bg-opacity-80"
              >
                <h3 className="text-2xl font-bold mb-2">Student Login</h3>
                <p className="text-blue-100 text-sm">Access your account</p>
              </button>
            </div>
          </div>

          {/* Info/Features Section */}
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <InfoCard
              icon={<Star className="w-8 h-8 text-fuchsia-600" />}
              title="Why use our portal?"
              description="Seamless access to library resources, easy book management, and a user-friendly experience for both students and librarians."
            />
            <InfoCard
              icon={<Book className="w-8 h-8 text-blue-600" />}
              title="Features"
              description="Digital catalog, borrowing history, notifications, and secure access—all in one place."
            />
            <InfoCard
              icon={<Mail className="w-8 h-8 text-pink-500" />}
              title="Contact Info"
              description="Need help? Email us at library@college.edu or visit the library help desk."
            />
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Book className="w-8 h-8 text-blue-600" />}
              title="Digital Library"
              description="Access e-books and online resources anytime, anywhere."
            />
            <FeatureCard
              icon={<User className="w-8 h-8 text-fuchsia-600" />}
              title="User Portal"
              description="Manage your library account and borrowings easily."
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8 text-pink-500" />}
              title="Secure Access"
              description="Safe and protected academic environment."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white/70 backdrop-blur-md p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer select-none transform hover:-translate-y-1 hover:scale-105">
    <div className="flex items-center justify-center w-14 h-14 mb-6 rounded-xl bg-gradient-to-br from-blue-100 via-fuchsia-100 to-pink-100">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

const InfoCard = ({ icon, title, description }) => (
  <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl shadow border border-blue-100 flex flex-col items-center text-center hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer">
    <div className="mb-4">{icon}</div>
    <h4 className="text-lg font-bold mb-2 text-blue-800">{title}</h4>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
);

export default HomePage;