type CardProps = {
  children: React.ReactNode;
};

const Card = ({ children }: CardProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-5">
      {children}
    </div>
  );
};

export default Card;