export interface ITeam {
  name: string;

  company: string;

  department: string;

  teamLead: string;

  description: string;

  status: "active" | "inactive";
}