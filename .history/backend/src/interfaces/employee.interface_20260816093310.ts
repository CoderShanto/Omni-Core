export interface IEmployee {
  employeeId: string;

  user: string;

  companyId: string;

  department: string;

  position: string;

  salary: number;

  joiningDate: Date;

  status?: "active" | "inactive";
}