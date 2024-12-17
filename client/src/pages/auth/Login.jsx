import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react"; // Make sure lucide-react is installed
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useAuth();
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      const dashboardPath = getDashboardPath(user.role);
      navigate(dashboardPath, { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await login(formData);
      toast.success("Login successful!");
      const from =
        location.state?.from?.pathname || getDashboardPath(data.user.role);
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message || "Login failed");
      setIsLoading(false);
      setFormData({ userName: "", password: "" });
    } finally {
      setIsLoading(false);
    }
  };

  const getDashboardPath = (role) => {
    switch (role) {
      case "admin":
        return "/admin/dashboard";
      case "staff":
        return "/staff/dashboard";
      case "trainer":
        return "/trainer/dashboard";
      case "member":
        return "/member/dashboard";
      default:
        return "/login";
    }
  };

  if (user) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 p-6">
        <h2 className="text-center text-3xl font-bold">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              name="userName"
              placeholder="Username"
              disabled={isLoading}
              value={formData.userName}
              onChange={(e) =>
                setFormData({ ...formData, userName: e.target.value })
              }
              className="w-full rounded border p-2"
            />
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              disabled={isLoading}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full rounded border p-2 pr-10" // Added pr-10 for padding right
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 transform"
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-500" />
              ) : (
                <Eye className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded bg-primary p-2 text-white disabled:opacity-50"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
