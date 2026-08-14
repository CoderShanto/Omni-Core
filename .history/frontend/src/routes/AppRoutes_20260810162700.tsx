import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Dashboard from "../pages/Dashboard";
import Companies from "../pages/Companies";
import Departments from "../pages/Departments";
import Positions from "../pages/Positions";
import Employees from "../pages/Employees";
import Teams from "../pages/Teams";
import Login from "../pages/Login";
import Register from "../pages/Register";

import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* Protected */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={<Dashboard />}
          />

          <Route
            path="companies"
            element={<Companies />}
          />

          <Route
            path="departments"
            element={<Departments />}
          />

          <Route
            path="positions"
            element={<Positions />}
          />

          <Route
            path="employees"
            element={<Employees />}
          />

          <Route
            path="teams"
            element={<Teams />}
          />
        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;