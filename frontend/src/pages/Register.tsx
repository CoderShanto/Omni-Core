import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  registerUser,
  type RegisterData,
  type UserRole,
} from "../services/auth.service";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<RegisterData>({
    name: "",
    email: "",
    password: "",
    role: "employee",
    companyId: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const data: RegisterData = {
        ...formData,
        companyId:
          formData.role === "super_admin"
            ? undefined
            : formData.companyId,
      };

      await registerUser(data);

      alert("Registration successful");

      navigate("/login");
    } catch (error: any) {
      setError(
        error.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-6 border rounded-lg"
      >
        <h1 className="text-2xl font-bold mb-6">
          Create Account
        </h1>

        {error && (
          <p className="text-red-500 mb-4">
            {error}
          </p>
        )}

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full border p-3 rounded mb-4"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full border p-3 rounded mb-4"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full border p-3 rounded mb-4"
        />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full border p-3 rounded mb-4"
        >
          <option value="employee">
            Employee
          </option>

          <option value="manager">
            Manager
          </option>

          <option value="ceo">
            CEO
          </option>

          <option value="client">
            Client
          </option>

          <option value="super_admin">
            Super Admin
          </option>
        </select>

        {formData.role !== "super_admin" && (
          <input
            type="text"
            name="companyId"
            placeholder="Company ID"
            value={formData.companyId}
            onChange={handleChange}
            required
            className="w-full border p-3 rounded mb-6"
          />
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded"
        >
          {loading ? "Creating..." : "Register"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/login")}
          className="w-full mt-3 text-blue-600"
        >
          Already have an account? Login
        </button>
      </form>
    </div>
  );
};

export default Register;