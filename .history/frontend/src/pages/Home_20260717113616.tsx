import UserCard from "../components/UserCard";

const Home = () => {
  return (
    <div>
      <h1>Users</h1>

      <UserCard
        name="Shanto"
        email="shanto@gmail.com"
      />

      <UserCard
        name="Rahim"
        email="rahim@gmail.com"
      />
    </div>
  );
};

export default Home;