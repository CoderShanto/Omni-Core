export type UserRole =
  | "super_admin"
  | "ceo"
  | "manager"
  | "team_lead"
  | "employee"
  | "client";

export type JobTitle =
  | "project_manager"
  | "tech_lead"
  | "software_developer"
  | "qa_engineer"
  | "ui_ux_designer"
  | "business_analyst"
  | "devops_engineer"
  | "sales_business_development"
  | "other";

export interface IUser {
  name: string;

  email: string;

  password: string;

  role?: UserRole;

  companyId?: string;

  jobTitle?: JobTitle | null;

  customJobTitle?: string | null;
}