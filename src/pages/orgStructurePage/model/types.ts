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

export type OrgTab = 'employees' | 'devices';
