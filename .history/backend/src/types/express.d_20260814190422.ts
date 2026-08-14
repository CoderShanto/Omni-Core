declare namespace Express {
  export interface Request {
    user: {
      userId: string;
      role: "super_admin" | "ceo" | "manager" | "team_lead" | "employee" | "client";
      companyId?: string;
    };
  }
}