import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/routes/ProtectedRoute";
import { publicRoutes, protectedRoutes } from "@/routes/routes.config";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          {publicRoutes.map(({ path, element: Element }) => (
            <Route key={path} path={path} element={<Element />} />
          ))}

          {/* Protected Routes */}
          {protectedRoutes.map(
            ({ path, element: Element, roles, layout: Layout }) => (
              <Route
                key={path}
                path={path}
                element={
                  <ProtectedRoute allowedRoles={roles}>
                    {Layout ? (
                      <Layout>
                        <Element />
                      </Layout>
                    ) : (
                      <Element />
                    )}
                  </ProtectedRoute>
                }
              />
            )
          )}

          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
