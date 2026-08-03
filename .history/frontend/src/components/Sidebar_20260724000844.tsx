import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen p-5">
      <h2 className="text-2xl font-bold mb-8">
        Omni Core
      </h2>

      <nav className="space-y-4">

        <Link to="/" className="block hover:text-blue-400">
          Dashboard
        </Link>

        <Link
          to="/companies"
          className="block hover:text-blue-400"
        >
          Companies
        </Link>

        <Link
          to="/departments"
          className="block hover:text-blue-400"
        >
          Departments
        </Link>

        <Link
          to="/positions"
          className="block hover:text-blue-400"
        >
          Positions
        </Link>

        <Link
          to="/employees"
          className="block hover:text-blue-400"
        >
          Employees
        </Link>

        <Link
          to="/teams"
          className="block hover:text-blue-400"
        >
          Teams
        </Link>

      </nav>
    </aside>
  );
};

export default Sidebar;