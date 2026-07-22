export interface IUser {
  name: string;
  email: string;
  password: string;
  role?: "super_admin" | "ceo" | "manager" | "employee";
}