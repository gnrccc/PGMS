export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen">
      {/* Add your navigation, sidebar, etc. */}
      <main>{children}</main>
    </div>
  );
}
