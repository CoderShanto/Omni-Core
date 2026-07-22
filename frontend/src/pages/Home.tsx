import axios from "axios";
import { useEffect, useState } from "react";
import UserCard from "../components/UserCard";
import type { TUser } from "../types/user.types";

const Home = () => {
  const [users, setUsers] = useState<TUser[]>([]);

  const fetchUsers = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/users"
    );

    setUsers(res.data.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <div className="bg-slate-900 text-white py-6 shadow-lg">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-3xl font-bold">
            MERN User Dashboard
          </h1>
          <p className="text-slate-300 mt-2">
            Users fetched from MongoDB
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-6xl mx-auto px-6 mt-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-slate-700">
            Total Users
          </h2>

          <p className="text-4xl font-bold text-blue-600 mt-2">
            {users.length}
          </p>
        </div>
      </div>

      {/* User Grid */}
      <div className="max-w-6xl mx-auto px-6 mt-8">
        <h2 className="text-2xl font-bold mb-4">
          User List
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <UserCard
              key={user._id}
              {...user}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;