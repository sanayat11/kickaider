export type WorkSchedulesTab = 'company' | 'departments' | 'employees';

export interface Schedule {
    startTime: string;
    endTime: string;
    lunchDuration: string;
    workDays: string[];
}

export interface DepartmentData {
    id: string;
    name: string;
    inheritCompany: boolean;
    schedule: Schedule;
}

export interface EmployeeData {
    id: string;
    name: string;
    initials: string;
    department: string;
    inheritDepartment: boolean;
    schedule: Schedule;
}
