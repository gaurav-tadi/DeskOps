import { useNavigate, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case "ADMIN":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "AGENT":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "CLIENT":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getDashboardPath = (role) => {
    switch (role) {
      case "ADMIN":
        return "/admin-dashboard";
      case "AGENT":
        return "/agent-dashboard";
      default:
        return "/client-dashboard";
    }
  };

  if (!user) return null;

  return (
    <nav className="border-b border-gray-200 bg-white shadow-sm">
      <div className="deskops-nav-inner mx-auto flex max-w-7xl flex-nowrap items-center justify-between gap-2 px-3 py-2 sm:gap-3 sm:px-6 sm:py-3 lg:px-8">
        <div className="deskops-nav-brand min-w-0 flex shrink items-center space-x-2 sm:space-x-3">
          <Link
            to={getDashboardPath(user.role)}
            className="group flex items-center gap-3 text-gray-900 transition hover:scale-[1.02] dark:text-white"
          >
            <span className="deskops-logo-mark" aria-hidden="true">
              <span className="deskops-logo-core">D</span>
              <span className="deskops-logo-spark">+</span>
            </span>
            <span className="deskops-brand-name flex flex-col leading-none">
              <span className="text-lg font-black tracking-tight">DeskOps</span>
              <span className="mt-1 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400">
                Helpdesk
              </span>
            </span>
          </Link>
        </div>

        <div className="deskops-nav-actions flex shrink-0 items-center justify-end gap-1.5 sm:gap-4">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-sm font-semibold text-gray-800">
              {user.name || user.email}
            </span>
            <span className="text-xs text-gray-500">{user.email}</span>
          </div>

          <span
            className={`deskops-nav-role inline-flex items-center rounded-full border px-2 py-0.5 text-[0.65rem] font-semibold ${getRoleBadgeStyle(
              user.role,
            )}`}
          >
            {user.role}
          </span>

          <button
            type="button"
            onClick={toggleDarkMode}
            aria-label={
              darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
            aria-pressed={darkMode}
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            className="theme-toggle deskops-nav-theme cursor-pointer rounded-xl border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 sm:px-3 sm:py-2"
          >
            <span className="flex items-center gap-2">
              <span
                key={darkMode ? "sun" : "moon"}
                className="theme-toggle-icon text-base leading-none"
                aria-hidden="true"
              >
                {darkMode ? "☀" : "☾"}
              </span>
              <span>{darkMode ? "Light" : "Dark"}</span>
            </span>
          </button>

          <div className="h-6 w-px bg-gray-200"></div>

          <button
            type="button"
            onClick={handleLogout}
            className="deskops-nav-logout cursor-pointer rounded-lg bg-gray-100 px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 focus:outline-none transition sm:px-3"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
