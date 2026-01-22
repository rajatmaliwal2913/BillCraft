import { useState } from "react";
import {
  signIn,
  signUp,
  signInWithGoogle,
  signInWithPhone,
  verifyPhoneOtp,
} from "../utils/auth";

export default function Auth() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async () => {
    try {
      setLoading(true);
      setError(null);

      if (isSignup) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    try {
      setError(null);
      await signInWithPhone(phone);
      setOtpSent(true);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setError(null);
      await verifyPhoneOtp(phone, otp);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-indigo-700">
          Billcraft
        </h1>

        {/* GOOGLE */}
        <button
          onClick={signInWithGoogle}
          className="w-full mb-4 border py-2 rounded hover:bg-gray-50"
        >
          Continue with Google
        </button>

        <div className="text-center text-gray-400 mb-4">
          — OR —
        </div>

        {/* EMAIL */}
        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-2"
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
        />

        <button
          onClick={handleEmailAuth}
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
        >
          {isSignup ? "Sign Up" : "Login"}
        </button>

        <p
          onClick={() => setIsSignup(!isSignup)}
          className="text-sm text-center mt-3 cursor-pointer text-indigo-600"
        >
          {isSignup
            ? "Already have an account? Login"
            : "New user? Create an account"}
        </p>

        {/* PHONE OTP */}
        <div className="mt-6 border-t pt-4">
          <p className="text-sm mb-2">
            Login with Phone
          </p>

          <input
            placeholder="+91XXXXXXXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border rounded px-3 py-2 mb-2"
          />

          {!otpSent ? (
            <button
              onClick={handleSendOtp}
              className="w-full border py-2 rounded"
            >
              Send OTP
            </button>
          ) : (
            <>
              <input
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full border rounded px-3 py-2 mb-2"
              />
              <button
                onClick={handleVerifyOtp}
                className="w-full border py-2 rounded"
              >
                Verify OTP
              </button>
            </>
          )}
        </div>

        {error && (
          <p className="text-red-600 text-sm mt-4 text-center">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
