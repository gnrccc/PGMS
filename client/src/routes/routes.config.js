import AdminDashboard from "@/pages/admin/Dashboard";
import StaffDashboard from "@/pages/staff/Dashboard";
import TrainerDashboard from "@/pages/trainer/Dashboard";
import MemberDashboard from "@/pages/member/Dashboard";
import Login from "@/pages/auth/Login";
import DashboardLayout from "@/layouts/DashboardLayout";

export const publicRoutes = [
  {
    path: "/login",
    element: Login,
  },
];

export const protectedRoutes = [
  {
    path: "/admin/dashboard",
    element: AdminDashboard,
    roles: ["admin"],
    layout: DashboardLayout,
  },
  {
    path: "/staff/dashboard",
    element: StaffDashboard,
    roles: ["staff"],
    layout: DashboardLayout,
  },
  {
    path: "/trainer/dashboard",
    element: TrainerDashboard,
    roles: ["trainer"],
  },
  {
    path: "/member/dashboard",
    element: MemberDashboard,
    roles: ["member"],
    layout: DashboardLayout,
  },
];
