export interface IEmployee {
  employeeId: string;

  user: string;

  company: string;

  department: string;

  position: string;

  salary: number;

  joiningDate: Date;

  status: "active" | "inactive";
}