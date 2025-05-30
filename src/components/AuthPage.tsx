import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AuthPage: React.FC = () => {
  const { signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isConfirmationSent, setIsConfirmationSent] = useState(false);
  const navigate = useNavigate();

  // Effect to check for Supabase confirmation parameters on load
  useEffect(() => {
    const handleDeepLink = async () => {
      const queryParams = new URLSearchParams(window.location.search);
      const type = queryParams.get("type");
      const accessToken = queryParams.get("access_token");

      if (type === "signup" && accessToken) {
        // Supabase has handled the session. Redirect to login.
        setIsLogin(true); // Switch to login view
        // Clear the URL parameters and replace the history entry
        navigate(window.location.pathname, { replace: true });
      }
    };

    handleDeepLink();

    // Although navigate({ replace: true }) handles most cases,
    // keeping popstate listener might be useful depending on specific browser behaviors
    // window.addEventListener('popstate', handleDeepLink);
    // return () => window.removeEventListener('popstate', handleDeepLink);
  }, [navigate]); // Add navigate to dependency array

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setIsConfirmationSent(false);

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
        setIsConfirmationSent(true);
        setEmail("");
        setPassword("");
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          {isLogin ? "Login" : "Sign Up"}
        </h2>
        {error && (
          <div className="mb-4 p-3 bg-warning-100 text-warning-700 rounded-md text-sm">
            {error}
          </div>
        )}

        {isConfirmationSent ? (
          <div className="text-center text-green-600 dark:text-green-400">
            A confirmation email has been sent. Please check your inbox.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <input
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
            </button>
          </form>
        )}

        <div className="mt-4 text-center">
          <button
            className="text-primary-500 hover:underline text-sm"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin
              ? "Don't have an account? Sign Up"
              : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
