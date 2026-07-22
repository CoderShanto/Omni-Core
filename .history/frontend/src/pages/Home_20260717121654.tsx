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
    <div>
      <h1>Users From MongoDB</h1>

      {users.map((user) => (
        <UserCard
          key={user._id}
          {...user}
        />
      ))}
    </div>
  );
};

export default Home;