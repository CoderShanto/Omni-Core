const API_URL = "http://localhost:5000/api";

export type RegisterData = {
  name: string;
  email: string;
  password: string;
  role?: string;
};

export const registerUser = async (
  data: RegisterData
) => {
  const response = await fetch(
    `${API_URL}/auth/register`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Registration failed"
    );
  }

  return result;
};