import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const navLinks = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/projects", label: "Projects" },
  { to: "/tasks", label: "Tasks" },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <header className="bg-slate-900 text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <h1 className="text-lg font-semibold">Team Task Manager</h1>
        <nav className="flex items-center gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`rounded px-3 py-1 text-sm ${
                location.pathname === link.to ? "bg-slate-700" : "hover:bg-slate-800"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-300">{user?.name}</span>
          <button
            type="button"
            onClick={logout}
            className="rounded bg-rose-500 px-3 py-1 text-sm hover:bg-rose-600"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
