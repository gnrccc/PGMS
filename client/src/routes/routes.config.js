import AdminDashboard from "@/pages/admin/Dashboard";
import StaffDashboard from "@/pages/staff/Dashboard";
import TrainerDashboard from "@/pages/trainer/Dashboard";
import MemberDashboard from "@/pages/member/Dashboard";
import Login from "@/pages/auth/Login";
import DashboardLayout from "@/layouts/DashboardLayout";
import AdminStaff from "@/pages/admin/Staff";
import AdminValidity from "@/pages/admin/Validity";

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
    path: "/admin/staff",
    element: AdminStaff,
    roles: ["admin"],
    layout: DashboardLayout,
  },
  {
    path: "/admin/validity",
    element: AdminValidity,
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
