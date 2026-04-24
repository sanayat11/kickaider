export interface ApiError {
  code: string;
  message: string;
  timestamp: string;
  path: string;
  errors?: Record<string, string[]>;
}

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
  error?: ApiError | null;
  timestamp: string;
}

export interface EmployeeApiResponse {
  success: boolean;
  data: EmployeeApiItem;
  error?: ApiError | null;
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
  error?: ApiError | null;
  timestamp: string;
}

export interface DepartmentApiResponse {
  success: boolean;
  data: DepartmentApiItem;
  error?: ApiError | null;
  timestamp: string;
}

export interface EmptyApiResponse {
  success: boolean;
  data: Record<string, never>;
  error?: ApiError | null;
  timestamp: string;
}

export interface DeviceApiItem {
  id: number;
  deviceUuid: string;
  employeeId: number | null;
  companyId: number;
  deviceName: string;
  hostname: string;
  osName: string;
  macAddresses: string[];
  publicIp: string;
  agentVersion: string;
  status: 'PENDING' | 'ALLOWED' | 'BLOCKED';
  firstSeenAt: string;
  lastSeenAt: string;
  approvedBy?: number | null;
  approvedAt?: string | null;
  blockedBy?: number | null;
  blockedAt?: string | null;
  createdAt: string;
}

export interface PendingDevicesApiResponse {
  success?: boolean;
  data?: {
    devices: DeviceApiItem[];
    total: number;
  };
  devices?: DeviceApiItem[];
  total?: number;
  error?: ApiError | null;
  timestamp?: string;
}

export interface PendingDevicesData {
  devices: DeviceApiItem[];
  total: number;
}

export type OrgTab = 'employees' | 'devices' | 'management';

export interface CompanyDevicesApiResponse {
  success?: boolean;
  data?: DeviceApiItem[] | { devices: DeviceApiItem[]; total: number };
  devices?: DeviceApiItem[];
  total?: number;
  error?: ApiError | null;
  timestamp?: string;
}

export interface Employee {
  id: string;
  name: string;
  position: string;
  employeeNumber?: string;
  departmentId?: string;
  userId?: number;
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
