import { useState, useMemo } from 'react';
import type { WorkSchedulesTab, Schedule, DepartmentData, EmployeeData } from './types';

const defaultCompanySchedule: Schedule = {
    startTime: '09:00',
    endTime: '18:00',
    lunchDuration: '1h',
    workDays: ['mon', 'tue', 'wed', 'thu', 'fri'],
};

const mockDepartments: DepartmentData[] = [
    { id: 'd1', name: 'IT Отдел', inheritCompany: true, schedule: { ...defaultCompanySchedule } },
    { id: 'd2', name: 'HR Отдел', inheritCompany: false, schedule: { startTime: '10:00', endTime: '19:00', lunchDuration: '1h', workDays: ['mon', 'tue', 'wed', 'thu', 'fri'] } },
    { id: 'd3', name: 'Отдел продаж', inheritCompany: false, schedule: { startTime: '08:00', endTime: '17:00', lunchDuration: '1h', workDays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'] } },
];

const mockEmployees: EmployeeData[] = [
    { id: 'e1', name: 'Иванов Иван', initials: 'ИИ', department: 'IT Отдел', inheritDepartment: true, schedule: { ...defaultCompanySchedule } },
    { id: 'e2', name: 'Смирнова Анна', initials: 'СА', department: 'HR Отдел', inheritDepartment: true, schedule: { startTime: '10:00', endTime: '19:00', lunchDuration: '1h', workDays: ['mon', 'tue', 'wed', 'thu', 'fri'] } },
    { id: 'e3', name: 'Петров Петр', initials: 'ПП', department: 'Отдел продаж', inheritDepartment: false, schedule: { startTime: '09:00', endTime: '15:00', lunchDuration: '30min', workDays: ['mon', 'wed', 'fri'] } },
    { id: 'e4', name: 'Сауле Абдыкадырова Sakewa', initials: 'СА', department: 'IT Отдел', inheritDepartment: false, schedule: { startTime: '11:00', endTime: '20:00', lunchDuration: '1h', workDays: ['mon', 'tue', 'wed', 'thu', 'fri'] } },
];

export const useWorkSchedulesPage = () => {
    const [activeTab, setActiveTab] = useState<WorkSchedulesTab>('company');

    const [companySchedule, setCompanySchedule] = useState<Schedule>(defaultCompanySchedule);
    const [departments, setDepartments] = useState<DepartmentData[]>(mockDepartments);
    const [employees, setEmployees] = useState<EmployeeData[]>(mockEmployees);

    const [empSearch, setEmpSearch] = useState('');
    const [empDeptFilter, setEmpDeptFilter] = useState('all');

    const handleTabChange = (tab: WorkSchedulesTab) => {
        setActiveTab(tab);
    };

    const handleCompanyScheduleChange = (field: keyof Schedule, value: any) => {
        setCompanySchedule(prev => ({ ...prev, [field]: value }));
    };

    const toggleDepartmentInheritance = (deptId: string) => {
        setDepartments(prev => prev.map(d =>
            d.id === deptId ? {
                ...d,
                inheritCompany: !d.inheritCompany,
                schedule: !d.inheritCompany ? { ...companySchedule } : d.schedule
            } : d
        ));
    };

    const handleDepartmentScheduleChange = (deptId: string, field: keyof Schedule, value: any) => {
        setDepartments(prev => prev.map(d =>
            d.id === deptId ? { ...d, schedule: { ...d.schedule, [field]: value } } : d
        ));
    };

    const toggleEmployeeInheritance = (empId: string, effectiveParentSchedule: Schedule) => {
         setEmployees(prev => prev.map(e =>
            e.id === empId ? {
                ...e,
                inheritDepartment: !e.inheritDepartment,
                schedule: !e.inheritDepartment ? { ...effectiveParentSchedule } : e.schedule
            } : e
        ));
    };

    const handleEmployeeScheduleChange = (empId: string, field: keyof Schedule, value: any) => {
        setEmployees(prev => prev.map(e =>
            e.id === empId ? { ...e, schedule: { ...e.schedule, [field]: value } } : e
        ));
    };

    const filteredEmployees = useMemo(() => {
        let result = employees;
        if (empDeptFilter !== 'all' && empDeptFilter !== 'time') {
            result = result.filter(e => e.department === empDeptFilter);
        }
        if (empSearch.trim()) {
            const lowerQuery = empSearch.toLowerCase();
            result = result.filter(e => e.name.toLowerCase().includes(lowerQuery));
        }
        return result;
    }, [employees, empSearch, empDeptFilter]);

    return {
        activeTab,
        handleTabChange,
        companySchedule,
        handleCompanyScheduleChange,
        departments,
        toggleDepartmentInheritance,
        handleDepartmentScheduleChange,
        employees,
        filteredEmployees,
        empSearch,
        setEmpSearch,
        empDeptFilter,
        setEmpDeptFilter,
        toggleEmployeeInheritance,
        handleEmployeeScheduleChange,
    };
};
