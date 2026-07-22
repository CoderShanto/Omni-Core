type Props = {
  name: string;
  email: string;
};

const UserCard = ({ name, email }: Props) => {
  return (
    <div
      style={{
        border: "1px solid gray",
        padding: "10px",
        margin: "10px",
      }}
    >
      <h3>{name}</h3>
      <p>{email}</p>
    </div>
  );
};

export default UserCard;