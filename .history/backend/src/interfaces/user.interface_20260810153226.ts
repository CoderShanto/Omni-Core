export type UserRole =
  | "super_admin"
  | "ceo"
  | "manager"
  | "employee"
  | "client";

export interface IUser {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}