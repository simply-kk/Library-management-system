import { Outlet, Link, useLocation } from "react-router-dom";
import { Home, LogIn, Menu, X, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

const PublicLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null); // 'librarian' | 'student' | null
  const location = useLocation();

  // Close mobile menu and dropdowns when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [location]);

  // Dropdown handlers
  const handleDropdownDesktop = (type, open) => {
    if (window.innerWidth >= 768) {
      setOpenDropdown(open ? type : null);
    }
  };
  const handleDropdownMobile = (type) => {
    if (window.innerWidth < 768) {
      setOpenDropdown(openDropdown === type ? null : type);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Public Navbar */}
      <header className="backdrop-blur-md bg-white/70 border-b-4 border-transparent shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Brand */}
            <Link 
              to="/" 
              className="flex items-center space-x-2 focus:outline-none group"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-700 via-fuchsia-600 to-pink-500 bg-clip-text text-transparent tracking-tight group-hover:opacity-80 transition-opacity">
                College Library Portal
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4">
              <NavLink to="/" icon={<Home className="w-5 h-5" />}>Home</NavLink>
              {/* Librarian Dropdown */}
              <div
                className="relative group"
                onMouseEnter={() => handleDropdownDesktop('librarian', true)}
                onMouseLeave={() => handleDropdownDesktop('librarian', false)}
              >
                <button
                  className="flex items-center space-x-1 px-5 py-2 rounded-full text-base font-semibold transition-all duration-200 focus:outline-none select-none text-blue-800 hover:bg-blue-100 hover:text-fuchsia-700 bg-white/60 group-hover:bg-blue-50"
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={openDropdown === 'librarian'}
                  onClick={() => handleDropdownMobile('librarian')}
                >
                  <LogIn className="w-5 h-5" />
                  <span>Librarian</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${openDropdown === 'librarian' ? "rotate-180" : "rotate-0"}`} />
                </button>
                <div
                  className={`absolute left-0 mt-3 min-w-[200px] rounded-2xl shadow-2xl bg-white/95 backdrop-blur border border-blue-100 z-20 transition-all duration-200 origin-top transform ${openDropdown === 'librarian' ? "opacity-100 scale-y-100 pointer-events-auto" : "opacity-0 scale-y-95 pointer-events-none"}`}
                  style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)" }}
                >
                  <DropdownLink to="/librarian-login">Login</DropdownLink>
                  <DropdownLink to="/librarian-register">Register</DropdownLink>
                </div>
              </div>
              {/* Student Dropdown */}
              <div
                className="relative group"
                onMouseEnter={() => handleDropdownDesktop('student', true)}
                onMouseLeave={() => handleDropdownDesktop('student', false)}
              >
                <button
                  className="flex items-center space-x-1 px-5 py-2 rounded-full text-base font-semibold transition-all duration-200 focus:outline-none select-none text-blue-800 hover:bg-blue-100 hover:text-fuchsia-700 bg-white/60 group-hover:bg-blue-50"
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={openDropdown === 'student'}
                  onClick={() => handleDropdownMobile('student')}
                >
                  <LogIn className="w-5 h-5" />
                  <span>Student</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${openDropdown === 'student' ? "rotate-180" : "rotate-0"}`} />
                </button>
                <div
                  className={`absolute left-0 mt-3 min-w-[180px] rounded-2xl shadow-2xl bg-white/95 backdrop-blur border border-blue-100 z-20 transition-all duration-200 origin-top transform ${openDropdown === 'student' ? "opacity-100 scale-y-100 pointer-events-auto" : "opacity-0 scale-y-95 pointer-events-none"}`}
                  style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)" }}
                >
                  <DropdownLink to="/student-login">Login</DropdownLink>
                </div>
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-full text-blue-700 hover:text-fuchsia-600 hover:bg-blue-50 focus:outline-none shadow"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-7 h-7" />
                ) : (
                  <Menu className="w-7 h-7" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div
            className={`md:hidden transition-all duration-300 ease-in-out ${
              mobileMenuOpen ? "max-h-96 py-2" : "max-h-0 overflow-hidden"
            }`}
          >
            <div className="flex flex-col space-y-2 pt-2 pb-4 rounded-2xl bg-gradient-to-br from-blue-100 via-fuchsia-100 to-pink-100 shadow-lg mx-2">
              <MobileNavLink to="/" icon={<Home className="w-5 h-5" />} active={location.pathname === "/"}>Home</MobileNavLink>
              {/* Librarian Dropdown Mobile */}
              <div>
                <button
                  className="flex items-center w-full space-x-2 px-5 py-3 rounded-full text-base font-semibold transition-all duration-200 text-blue-800 hover:bg-blue-100 hover:text-fuchsia-700 bg-white/60"
                  onClick={() => handleDropdownMobile('librarian')}
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={openDropdown === 'librarian'}
                >
                  <LogIn className="w-5 h-5" />
                  <span>Librarian</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${openDropdown === 'librarian' ? "rotate-180" : "rotate-0"}`} />
                </button>
                {openDropdown === 'librarian' && (
                  <div className="ml-6 mt-1 flex flex-col space-y-1 animate-fade-in-down">
                    <MobileDropdownLink to="/librarian-login">Login</MobileDropdownLink>
                    <MobileDropdownLink to="/librarian-register">Register</MobileDropdownLink>
                  </div>
                )}
              </div>
              {/* Student Dropdown Mobile */}
              <div>
                <button
                  className="flex items-center w-full space-x-2 px-5 py-3 rounded-full text-base font-semibold transition-all duration-200 text-blue-800 hover:bg-blue-100 hover:text-fuchsia-700 bg-white/60"
                  onClick={() => handleDropdownMobile('student')}
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={openDropdown === 'student'}
                >
                  <LogIn className="w-5 h-5" />
                  <span>Student</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${openDropdown === 'student' ? "rotate-180" : "rotate-0"}`} />
                </button>
                {openDropdown === 'student' && (
                  <div className="ml-6 mt-1 flex flex-col space-y-1 animate-fade-in-down">
                    <MobileDropdownLink to="/student-login">Login</MobileDropdownLink>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur border-t py-6 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} College Library Portal
          </div>
        </div>
      </footer>
    </div>
  );
};

// Reusable NavLink component for desktop
const NavLink = ({ to, icon, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center space-x-2 px-5 py-2 rounded-full text-base font-semibold transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 select-none
        ${isActive
          ? "bg-gradient-to-r from-blue-600 via-fuchsia-600 to-pink-500 text-white shadow-lg scale-105"
          : "text-blue-800 hover:bg-blue-100 hover:text-fuchsia-700 bg-white/60"
        }`}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
};

const DropdownLink = ({ to, children }) => (
  <Link
    to={to}
    className="block px-6 py-4 text-lg font-semibold rounded-xl hover:bg-gradient-to-r hover:from-blue-100 hover:to-fuchsia-100 hover:text-fuchsia-700 text-blue-800 transition-colors mb-1"
    tabIndex={0}
  >
    {children}
  </Link>
);

// Reusable MobileNavLink component
const MobileNavLink = ({ to, icon, children, active }) => (
  <Link
    to={to}
    className={`flex items-center px-5 py-3 text-base font-semibold rounded-full transition-all duration-200 shadow-sm select-none
      ${active
        ? "bg-gradient-to-r from-blue-600 via-fuchsia-600 to-pink-500 text-white shadow-lg scale-105"
        : "text-blue-800 hover:bg-blue-100 hover:text-fuchsia-700 bg-white/60"
      }`}
  >
    <span className="mr-3">{icon}</span>
    {children}
  </Link>
);

const MobileDropdownLink = ({ to, children }) => (
  <Link
    to={to}
    className="block px-6 py-3 text-lg font-semibold rounded-xl hover:bg-gradient-to-r hover:from-blue-100 hover:to-fuchsia-100 hover:text-fuchsia-700 text-blue-800 transition-colors mb-1"
    tabIndex={0}
  >
    {children}
  </Link>
);

export default PublicLayout;