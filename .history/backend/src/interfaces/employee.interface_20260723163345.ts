export interface IEmployee {
  employeeId: string;

  user: string;

  company: string;

  department: string;

  designation: string;

  salary: number;

  joiningDate: Date;

  status: "active" | "inactive";
}