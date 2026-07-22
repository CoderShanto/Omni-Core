import axios from "axios";
import { useEffect, useState } from "react";
import UserCard from "../components/UserCard";
import { TUser } from "../types/user.types";

const Home = () => {
  const [users, setUsers] = useState<TUser[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/users"
    );

    setUsers(res.data.data);
  };

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