import type { TUser } from "../types/user.types";

const UserCard = ({ name, email }: TUser) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-xl transition duration-300">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg">
          {name.charAt(0).toUpperCase()}
        </div>

        <div>
          <h3 className="font-semibold text-lg">
            {name}
          </h3>

          <p className="text-gray-500 text-sm">
            User Account
          </p>
        </div>
      </div>

      <div className="border-t pt-3">
        <p className="text-gray-600">
          📧 {email}
        </p>
      </div>
    </div>
  );
};

export default UserCard;