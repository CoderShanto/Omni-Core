export type UserRole =
  | "super_admin"
  | "ceo"
  | "manager"
  | "team_lead"
  | "employee"
  | "client";

export interface IUser {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  companyId?: string | null;
  jobTitle?: string | null;
  customJobTitle?: string | null;
}