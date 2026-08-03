type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

const SearchBar = ({
  value,
  onChange,
}: SearchBarProps) => {
  return (
    <input
      type="text"
      placeholder="Search..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border rounded-lg px-4 py-2 w-full"
    />
  );
};

export default SearchBar;