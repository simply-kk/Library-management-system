import { Outlet, useNavigate } from "react-router-dom";
import logo from "../assets/HNBG-new-logo.png";
import { useState, useEffect } from "react";
import {
  User,
  LogOut,
  Home,
  BookOpen,
  Users,
  History,
  Menu,
  X,
  ChevronDown
} from "lucide-react";

const MainLayout = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    role: '',
    name: 'User',
    initials: 'U'
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    const role = localStorage.getItem("role") || '';
    const name = localStorage.getItem("name") || 'User';
    const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

    setUserData({ role, name, initials });

    // Close dropdowns when clicking outside
    const handleClickOutside = (e) => {
      if (!e.target.closest('.nav-dropdown') && !e.target.closest('.user-dropdown')) {
        setShowDropdown(false);
        setActiveDropdown(null);
      }
    };
    document.addEventListener('click', handleClickOutside);

    // Listen for logout in other tabs
    const handleStorageLogout = (event) => {
      if (event.key === "logout") {
        navigate("/login");
      }
    };
    window.addEventListener("storage", handleStorageLogout);

    return () => {
      document.removeEventListener('click', handleClickOutside);
      window.removeEventListener("storage", handleStorageLogout);
    };
  }, [navigate]);

  const isStudent = userData.role === "student";
  const colorScheme = {
    bg: isStudent ? "bg-green-600" : "bg-blue-600",
    bgHover: isStudent ? "hover:bg-green-700" : "hover:bg-blue-700",
    bgLight: isStudent ? "bg-green-100" : "bg-blue-100",
    text: isStudent ? "text-green-800" : "text-blue-800",
    icon: isStudent ? "text-green-600" : "text-blue-600",
    border: isStudent ? "border-green-200" : "border-blue-200"
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.setItem("logout", Date.now());
      localStorage.clear();
      navigate("/login");
    }
  };

  const navigationItems = isStudent ? [
    { icon: Home, label: "Dashboard", path: "/student-dashboard" },
    { icon: BookOpen, label: "My Books", path: "/student/history" },
    { icon: User, label: "Profile", path: "/student/profile" },
  ] : [
    { icon: Home, label: "Dashboard", path: "/admin-dashboard" },
    {
      icon: Users,
      label: "Students",
      subItems: [
        { label: "View All", path: "/view-students" },
        { label: "Add Student", path: "/create-student" },
        { label: "Bulk Import", path: "/bulk-import-students" }
      ]
    },
    {
      icon: BookOpen,
      label: "Books",
      subItems: [
        { label: "View All", path: "/view-books" },
        { label: "Issue Books", path: "/issue-books" },
        { label: "Return Books", path: "/return-books" },
        { label: "Bulk Import", path: "/bulk-import-books" }
      ]
    },
    { icon: History, label: "History", path: "/history-books" },
  ];

  const NavItem = ({ item, isMobile = false }) => {
    const isActive = window.location.pathname === item.path;
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isDropdownOpen = activeDropdown === item.label;

    const handleClick = () => {
      if (hasSubItems) {
        setActiveDropdown(isDropdownOpen ? null : item.label);
      } else {
        navigate(item.path);
        setShowMobileMenu(false);
        setActiveDropdown(null);
      }
    };

    return (
      <div className={`relative nav-dropdown ${isMobile ? 'w-full' : ''}`}>
        <button
          onClick={handleClick}
          className={`${isMobile ? 'w-full' : 'px-3'} py-2 rounded-md flex items-center gap-2 ${
            isActive
              ? `${colorScheme.bgLight} ${colorScheme.text}`
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <item.icon className="w-5 h-5" />
          <span>{item.label}</span>
          {hasSubItems && (
            <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          )}
        </button>

        {hasSubItems && isDropdownOpen && (
          <div className={`${
            isMobile 
              ? 'relative w-full bg-gray-50 mt-1 rounded-md'
              : 'absolute top-full left-0 mt-1 w-48 bg-white shadow-lg rounded-md border'
          }`}>
            {item.subItems.map((subItem, index) => (
              <button
                key={index}
                onClick={() => {
                  navigate(subItem.path);
                  setShowMobileMenu(false);
                  setActiveDropdown(null);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                {subItem.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header/Navigation */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <button
                onClick={() => navigate(isStudent ? "/student-dashboard" : "/admin-dashboard")}
                className="flex items-center space-x-2"
              >
                <img src={logo} alt="HNBG Library Logo" className="h-8 w-auto" />
                <span className="hidden md:inline text-lg font-semibold text-gray-800">
                  Library System
                </span>
              </button>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-2">
              {navigationItems.map((item, index) => (
                <NavItem key={index} item={item} />
              ))}
            </nav>

            {/* User Dropdown */}
            <div className="flex items-center gap-4">
              {/* Mobile menu button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                {showMobileMenu ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>

              <div className="relative user-dropdown">
                <button
                  onClick={() => setShowDropdown(prev => !prev)}
                  className={`flex items-center space-x-2 ${colorScheme.bgLight} ${colorScheme.text} px-3 py-1 rounded-full hover:opacity-90 transition-opacity`}
                  aria-label="User menu"
                  aria-expanded={showDropdown}
                >
                  <span className="font-medium hidden sm:inline">{userData.name}</span>
                  <div className={`w-8 h-8 ${colorScheme.bg} text-white rounded-full flex items-center justify-center font-bold text-sm`}>
                    {userData.initials}
                  </div>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md border z-50">
                    <button
                      onClick={() => {
                        const profilePath = isStudent ? "/student/profile" : "/librarian/profile";
                        navigate(profilePath);
                        setShowDropdown(false);
                      }}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <User className={`w-4 h-4 mr-2 ${colorScheme.icon}`} />
                      My Profile
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {showMobileMenu && (
            <div className="md:hidden py-2 border-t">
              <nav className="space-y-1">
                {navigationItems.map((item, index) => (
                  <NavItem key={index} item={item} isMobile={true} />
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
