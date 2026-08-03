type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean;
};

const Button = ({
  children,
  onClick,
  type = "button",
  className = "",
  disabled = false,
}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        bg-blue-600
        text-white
        px-4
        py-2
        rounded-lg
        hover:bg-blue-700
        transition
        disabled:bg-gray-400
        disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;