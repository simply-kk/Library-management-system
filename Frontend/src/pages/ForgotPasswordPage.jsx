import { useState, useRef } from "react";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ForgotPasswordPage = () => {

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [step, setStep] = useState(1); // Step 1: Request OTP, Step 2: Verify OTP & Reset Password
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const otpInputRef = useRef(null); // Ref for OTP input focus

    // ✅ Step 1: Request OTP (Optimized)
    const handleRequestOtp = async (e) => {
        e.preventDefault();
        if (!email.trim()) return setMessage("Please enter a valid email.");

        setLoading(true);
        setMessage("");

        try {
            const { data } = await axios.post(`${API_BASE_URL}/api/auth/forgot-password`, { email });
            setMessage(data.message);
            setStep(2); // Move to OTP verification step
            setTimeout(() => otpInputRef.current?.focus(), 500); // Auto-focus OTP input
        } catch (error) {
            setMessage(error.response?.data?.message || "Error sending OTP.");
        } finally {
            setLoading(false);
        }
    };

    // ✅ Step 2: Verify OTP and Reset Password (Optimized)
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (!otp.trim() || !password.trim()) return setMessage("OTP and Password cannot be empty.");

        setLoading(true);
        setMessage("");

        try {
            const { data } = await axios.post(`${API_BASE_URL}/api/auth/verify-otp`, {
                email,
                otp,
                newPassword: password,
            });

            setMessage(data.message);
            setTimeout(() => (window.location.href = "/student-login"), 2000); // Redirect to login after success
        } catch (error) {
            setMessage(error.response?.data?.message || "Error resetting password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                {step === 1 ? (
                    <>
                        <h2 className="text-3xl font-semibold text-center mb-6 text-blue-600">Forgot Password</h2>
                        <form onSubmit={handleRequestOtp} className="space-y-4">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full p-3 border rounded-lg"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <button
                                type="submit"
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg flex justify-center"
                                disabled={loading}
                            >
                                {loading ? "Sending OTP..." : "Send OTP"}
                            </button>
                        </form>
                    </>
                ) : (
                    <>
                        <h2 className="text-3xl font-semibold text-center mb-6 text-blue-600">Enter OTP & Reset Password</h2>
                        <form onSubmit={handleVerifyOtp} className="space-y-4">
                            <input
                                type="text"
                                ref={otpInputRef}
                                placeholder="Enter OTP"
                                className="w-full p-3 border rounded-lg"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                            />
                            <input
                                type="password"
                                placeholder="Enter new password"
                                className="w-full p-3 border rounded-lg"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="submit"
                                className="w-full bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg flex justify-center"
                                disabled={loading}
                            >
                                {loading ? "Resetting Password..." : "Reset Password"}
                            </button>
                        </form>
                    </>
                )}
                {message && <p className="text-center mt-4 text-gray-700">{message}</p>}
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
