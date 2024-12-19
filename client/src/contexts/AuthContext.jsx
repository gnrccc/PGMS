import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import Loading from "@/components/ui/loading";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check auth status when component mounts
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/auth/check",
          {
            withCredentials: true,
          }
        );
        setUser(response.data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        credentials,
        {
          withCredentials: true,
        }
      );
      setUser(response.data.user);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:3000/api/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const createAdmin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/create-admin"
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  if (loading) {
    return <Loading variant="skeleton" size="lg" />;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, createAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
