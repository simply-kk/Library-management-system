
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./components/ProtectedRoute";
import LibrarianLogin from "./pages/LibrarianLogin";
import StudentLogin from "./pages/StudentLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import StudentDashboard from "./pages/student/StudentDashboard";
import CreateStudent from "./pages/admin/CreateStudent";
import ViewStudents from "./pages/admin/ViewStudents";
import EditStudent from "./pages/admin/EditStudent";
import BulkImportStudents from "./pages/admin/BulkImportStudents";
import AddLibrarian from "./pages/admin/AddLibrarian";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import BulkImportBooks from "./pages/admin/BulkImportBooks";
import ViewBooks from "./pages/admin/ViewBooks";
import IssueBooks from "./pages/admin/IssueBooks";
import ReturnBooks from "./pages/admin/ReturnBooks";
import HistoryView from "./pages/admin/HistorySearch";
import StudentHistory from './pages/student/StudentHistory';
import ProfilePage from "./pages/ProfilePage";
import MainLayout from "./components/MainLayout";
import PublicLayout from "./components/PublicLayout";
import LibrarianRegister from "./pages/LibrarianRegister";

function App() {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                {/* 
                    <Route path="/" element={<HomePage />} />
                    <Route path="/librarian-login" element={<LibrarianLogin />} />
                    <Route path="/student-login" element={<StudentLogin />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} /> */}

                <Route element={<PublicLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/librarian-login" element={<LibrarianLogin />} />
                    <Route path="/student-login" element={<StudentLogin />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/librarian-register" element={<LibrarianRegister />} />
                </Route>
                <Route element={<MainLayout />}>
                    {/* Protected Routes for Librarian */}
                    <Route element={<ProtectedRoute allowedRole="librarian" />}>
                        <Route path="/admin-dashboard" element={<AdminDashboard />} />
                        <Route path="/create-student" element={<CreateStudent />} />
                        <Route path="/view-students" element={<ViewStudents />} />
                        <Route path="/edit-student/:id" element={<EditStudent />} />
                        <Route path="/bulk-import-students" element={<BulkImportStudents />} />
                        <Route path="/add-librarian" element={<AddLibrarian />} />
                        <Route path="/bulk-import-books" element={<BulkImportBooks />} />
                        <Route path="/view-books" element={<ViewBooks />} />
                        <Route path="/issue-books" element={<IssueBooks />} />
                        <Route path="/return-books" element={<ReturnBooks />} />
                        <Route path="/history-books" element={<HistoryView />} />
                        <Route path="/librarian/profile" element={<ProfilePage />} />

                    </Route>

                    {/* Protected Routes for Student */}
                    <Route element={<ProtectedRoute allowedRole="student" />}>
                        <Route path="/student-dashboard" element={<StudentDashboard />} />
                        <Route path="/student/history" element={<StudentHistory />} />
                        <Route path="/student/profile" element={<ProfilePage />} />
                    </Route>
                </Route>

                {/* Catch-all Route */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;
