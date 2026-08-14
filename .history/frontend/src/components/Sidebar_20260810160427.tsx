import { Link } from "react-router-dom";

const Sidebar = () => {
  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const role = user.role;

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen p-5">

      <h2 className="text-2xl font-bold mb-8">
        Omni Core
      </h2>

      <p className="text-sm text-slate-400 mb-6">
        {user.name}
        <br />
        {role}
      </p>

      <nav className="space-y-4">

        <Link
          to="/"
          className="block hover:text-blue-400"
        >
          Dashboard
        </Link>

        {(role === "super_admin" ||
          role === "ceo") && (
          <Link
            to="/companies"
            className="block hover:text-blue-400"
          >
            Companies
          </Link>
        )}

      </nav>
    </aside>
  );
};

export default Sidebar;