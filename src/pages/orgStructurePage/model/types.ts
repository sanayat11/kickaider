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

export interface DepartmentApiItem {
  id: number;
  name: string;
  companyId: number;
  createdAt: string;
}

export interface DepartmentsApiResponse {
  success: boolean;
  data: DepartmentApiItem[];
  error?: {
    code: string;
    message: string;
    timestamp: string;
    path: string;
    errors?: Record<string, string[]>;
  } | null;
  timestamp: string;
}

export interface DepartmentApiResponse {
  success: boolean;
  data: DepartmentApiItem;
  error?: {
    code: string;
    message: string;
    timestamp: string;
    path: string;
    errors?: Record<string, string[]>;
  } | null;
  timestamp: string;
}

export interface EmptyApiResponse {
  success: boolean;
  data: Record<string, never>;
  error?: {
    code: string;
    message: string;
    timestamp: string;
    path: string;
    errors?: Record<string, string[]>;
  } | null;
  timestamp: string;
}

// UI Types
export type OrgTab = 'employees' | 'devices';

export interface Employee {
  id: string;
  name: string;
  position: string;
}

export interface Department {
  id: string;
  name: string;
  employees: Employee[];
}

export interface UnassignedDevice {
  id: string;
  hostname: string;
  lastSeen: string;
}