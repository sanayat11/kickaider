import type { Department, DepartmentApiItem, EmployeeApiItem } from './types';

export const mapDepartmentsWithEmployees = (
  departments: DepartmentApiItem[],
  employees: EmployeeApiItem[],
): Department[] => {
  const departmentMap = new Map<string, Department>();

  departments.forEach((dept) => {
    departmentMap.set(String(dept.id), {
      id: String(dept.id),
      name: dept.name,
      employees: [],
    });
  });

  employees.forEach((employee) => {
    const departmentId = String(employee.departmentId);

    if (!departmentMap.has(departmentId)) {
      departmentMap.set(departmentId, {
        id: departmentId,
        name: `Отдел #${departmentId}`,
        employees: [],
      });
    }

    departmentMap.get(departmentId)!.employees.push({
      id: String(employee.id),
      name: `Сотрудник #${employee.userId}`,
      position: employee.position || '—',
      employeeNumber: employee.employeeNumber || '',
      departmentId,
      userId: employee.userId,
    });
  });

  return Array.from(departmentMap.values());
};