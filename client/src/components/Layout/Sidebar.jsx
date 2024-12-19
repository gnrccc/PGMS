import { useLocation, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileCog,
  Bolt,
  Settings,
  ChevronDown,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";

export default function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();
  const [openItems, setOpenItems] = useState({});

  const adminRoutes = [
    {
      title: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "File Maintenance",
      icon: FileCog,
      subitems: [
        {
          title: "Staff Management",
          href: "/admin/staff",
        },
        {
          title: "Validity Management",
          href: "/admin/validity",
        },
        {
          title: "Rate Management",
          href: "/admin/rate",
        },
        {
          title: "Trainer Management",
          href: "/admin/trainer",
        },
        {
          title: "Discount Management",
          href: "/admin/discount",
        },
        {
          title: "Vat Management",
          href: "/admin/vat",
        },
        {
          title: "Regular Member Criteria",
          href: "/admin/regular-member-criteria",
        },
        {
          title: "Freeze Management",
          href: "/admin/freeze",
        },
        {
          title: "Equipment Type Management",
          href: "/admin/equipment-type",
        },
        {
          title: "Equipment Item Management",
          href: "/admin/equipment-item",
        },
        {
          title: "Trainer Rate Management",
          href: "/admin/trainer-rate",
        },
        {
          title: "Walkin Rate Management",
          href: "/admin/walkin-rate",
        },
      ],
    },
    {
      title: "Process",
      icon: Bolt,
      subitems: [
        {
          title: "Customer",
          href: "/admin/customer",
        },
        {
          title: "Members",
          href: "/admin/members",
        },
        {
          title: "Regular Members",
          href: "/admin/regular-members",
        },
        {
          title: "Member Check-In",
          href: "/admin/member-check-in",
        },
        {
          title: "Gym Equipment",
          href: "/admin/gym-equipment",
        },
      ],
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  const staffRoutes = [
    {
      title: "Dashboard",
      href: "/staff/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Process",
      icon: Bolt,
      subitems: [
        {
          title: "Customer",
          href: "/admin/customer",
        },
        {
          title: "Members",
          href: "/admin/members",
        },
        {
          title: "Regular Members",
          href: "/admin/regular-members",
        },
        {
          title: "Member Check-In",
          href: "/admin/member-check-in",
        },
        {
          title: "Gym Equipment",
          href: "/admin/gym-equipment",
        },
      ],
    },
  ];

  const routes = user?.role === "admin" ? adminRoutes : staffRoutes;

  const toggleItem = (title) => {
    setOpenItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <div className="flex h-full w-56 flex-col border-r bg-background">
      <div className="flex-1 overflow-y-auto">
        <nav className="flex flex-col gap-2 p-4">
          {routes.map((route) => (
            <div key={route.title}>
              {route.subitems ? (
                <Collapsible
                  open={openItems[route.title]}
                  onOpenChange={() => toggleItem(route.title)}
                >
                  <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
                    <div className="flex items-center gap-2">
                      <route.icon className="h-4 w-4" />
                      {route.title}
                    </div>
                    <ChevronDown
                      className={cn("h-4 w-4 transition-transform", {
                        "rotate-180": openItems[route.title],
                      })}
                    />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-1 space-y-1">
                    {route.subitems.map((subitem) => (
                      <Link
                        key={subitem.href}
                        to={subitem.href}
                        className={cn(
                          "block rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                          location.pathname === subitem.href
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        {subitem.title}
                      </Link>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <Link
                  to={route.href}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                    location.pathname === route.href
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  <route.icon className="h-4 w-4" />
                  {route.title}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}
