export interface EmployeeApiItem {
  id: number;
  userId: number;
  companyId: number;
  departmentId: number;
  position: string;
  hireDate: string;
  employeeNumber: string;
  status: 'ACTIVE' | 'BLOCKED';
  createdAt: string;
}

export interface EmployeesApiResponse {
  success: boolean;
  data: EmployeeApiItem[];
  error?: {
    code: string;
    message: string;
    timestamp: string;
    path: string;
    errors?: Record<string, string[]>;
  } | null;
  timestamp: string;
}