import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user, createAdmin } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [hasAdmin, setHasAdmin] = useState(true);
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      userName: "",
      password: "",
    },
  });

  // Check if admin exists
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/auth/check-admin"
        );
        setHasAdmin(response.data.hasAdmin);
      } catch (error) {
        console.error("Error checking admin:", error);
        setHasAdmin(false);
      }
    };
    checkAdmin();
  }, []);

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      const dashboardPath = getDashboardPath(user.role);
      navigate(dashboardPath, { replace: true });
    }
  }, [user, navigate]);

  const onSubmit = async (data) => {
    try {
      const response = await login(data);
      toast.success("Login successful!");
      const from =
        location.state?.from?.pathname || getDashboardPath(response.user.role);
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message || "Login failed");
      reset({ password: "" });
    }
  };

  const handleCreateAdmin = async () => {
    setIsCreatingAdmin(true);
    try {
      const response = await createAdmin();

      toast.success(
        `Admin account created! Username: ${response.adminCredentials.userName}, Password: ${response.adminCredentials.password}`
      );

      const loginResponse = await login({
        userName: response.adminCredentials.userName,
        password: response.adminCredentials.password,
      });

      const from =
        location.state?.from?.pathname ||
        getDashboardPath(loginResponse.user.role);
      navigate(from, { replace: true });

      setHasAdmin(true);
    } catch (error) {
      toast.error(error.message || "Failed to create admin");
    } finally {
      setIsCreatingAdmin(false);
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
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-2xl font-heading font-bold">
            Praktisado Gym | Login
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userName" className="font-medium">
                Username
              </Label>
              <Input
                id="userName"
                type="text"
                disabled={isSubmitting}
                {...register("userName", {
                  required: "Please enter your username",
                })}
              />
              {errors.userName && (
                <p className="text-sm text-red-500">
                  {errors.userName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  disabled={isSubmitting}
                  {...register("password", {
                    required: "Please enter your password",
                  })}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 transform"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                  <span>Logging in...</span>
                </div>
              ) : (
                "Login"
              )}
            </Button>
          </form>

          {/* Create Admin Button */}
          {!hasAdmin && (
            <div className="space-y-2 pt-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    No admin account found
                  </span>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleCreateAdmin}
                disabled={isCreatingAdmin}
              >
                {isCreatingAdmin ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-primary"></div>
                    <span>Creating Admin...</span>
                  </div>
                ) : (
                  "Create Admin Account"
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
