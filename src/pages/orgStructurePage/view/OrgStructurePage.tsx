import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { OrganizationHeader } from '@/widgets/OrganizationHeader';
import { OrganizationTabs } from '@/widgets/OrganizationTabs';
import { EmployeesSection } from '@/widgets/EmployeesSection';
import { DevicesSection } from '@/widgets/DevicesSection';
import { DepartmentAccordion } from '@/widgets/DepartmentAccordion';
import { DevicesTable } from '@/widgets/DevicesTable';
import { CreateDepartmentModal } from '@/features/create-department';
import { EditDepartmentModal } from '@/features/edit-department';
import { BindDeviceModal } from '@/features/bind-device';
import { DeleteConfirmModal } from '@/features/deleteModal/view/DeleteModal';

import type { Department, UnassignedDevice, OrgTab } from '../model/types';
import { initialDepartments, initialUnassigned } from '../model/mockData';

import styles from './OrgStructurePage.module.scss';

export const OrgStructurePage = () => {
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState<OrgTab>('employees');
  const [searchQuery, setSearchQuery] = useState('');
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [unassignedDevices, setUnassignedDevices] = useState<UnassignedDevice[]>(initialUnassigned);

  const [isCreateDeptOpen, setIsCreateDeptOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<UnassignedDevice | null>(null);

  const [deptToDelete, setDeptToDelete] = useState<Department | null>(null);
  const [employeeToDelete, setEmployeeToDelete] = useState<{
    empId: string;
    deptId: string;
    empName?: string;
  } | null>(null);

  const filteredDepartments = useMemo(() => {
    if (!searchQuery.trim()) return departments;

    const query = searchQuery.toLowerCase();

    return departments
      .map((dept) => {
        const filteredEmployees = dept.employees.filter(
          (emp) =>
            emp.name.toLowerCase().includes(query) ||
            emp.position.toLowerCase().includes(query),
        );

        const isDeptMatch = dept.name.toLowerCase().includes(query);

        if (isDeptMatch) {
          return dept;
        }

        if (filteredEmployees.length > 0) {
          return { ...dept, employees: filteredEmployees };
        }

        return null;
      })
      .filter(Boolean) as Department[];
  }, [departments, searchQuery]);

  const handleCreateDept = (name: string) => {
    const newDept: Department = {
      id: Date.now().toString(),
      name,
      employees: [],
    };

    setDepartments((prev) => [...prev, newDept]);
  };

  const handleEditDept = (name: string) => {
    if (!selectedDept) return;

    setDepartments((prev) =>
      prev.map((dept) =>
        dept.id === selectedDept.id ? { ...dept, name } : dept,
      ),
    );
  };

  const handleDeleteDeptConfirm = () => {
    if (!deptToDelete) return;

    setDepartments((prev) => prev.filter((dept) => dept.id !== deptToDelete.id));
    setDeptToDelete(null);
  };

  const handleDeleteEmployeeConfirm = () => {
    if (!employeeToDelete) return;

    setDepartments((prev) =>
      prev.map((dept) =>
        dept.id === employeeToDelete.deptId
          ? {
              ...dept,
              employees: dept.employees.filter(
                (emp) => emp.id !== employeeToDelete.empId,
              ),
            }
          : dept,
      ),
    );

    setEmployeeToDelete(null);
  };

  const handleBindDevice = (data: {
    employeeName: string;
    position: string;
    deptId: string;
    deviceId?: string;
  }) => {
    setUnassignedDevices((prev) =>
      prev.filter((device) => device.id !== data.deviceId),
    );

    setDepartments((prev) =>
      prev.map((dept) =>
        dept.id === data.deptId
          ? {
              ...dept,
              employees: [
                ...dept.employees,
                {
                  id: Date.now().toString(),
                  name: data.employeeName,
                  position: data.position,
                },
              ],
            }
          : dept,
      ),
    );
  };

  return (
    <div className={styles.container}>
      <OrganizationHeader
        title={t('settings.organization.title')}
        subtitle={
          t('settings.organization.subtitle') ||
          'Общий аналитический обзор по компании или сотруднику'
        }
      />

      <main className={styles.main}>
        <div className={styles.card}>
          <OrganizationTabs
            activeTab={activeTab}
            onChange={setActiveTab}
            unassignedCount={unassignedDevices.length}
          />

          <div className={styles.tabsBody}>
            {activeTab === 'employees' ? (
              <EmployeesSection
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onAddDept={() => setIsCreateDeptOpen(true)}
              >
                {filteredDepartments.map((dept) => (
                  <DepartmentAccordion
                    key={dept.id}
                    department={dept}
                    defaultExpanded={!!searchQuery}
                    onEditDept={(department) => setSelectedDept(department)}
                    onDeleteDept={(deptId) => {
                      const department =
                        departments.find((item) => item.id === deptId) ?? null;
                      setDeptToDelete(department);
                    }}
                    onEditEmployee={(emp) => {
                      console.log('Edit employee', emp);
                    }}
                    onDeleteEmployee={(empId, deptId) => {
                      const department = departments.find((d) => d.id === deptId);
                      const employee = department?.employees.find((e) => e.id === empId);

                      setEmployeeToDelete({
                        empId,
                        deptId,
                        empName: employee?.name,
                      });
                    }}
                  />
                ))}
              </EmployeesSection>
            ) : (
              <DevicesSection>
                <DevicesTable
                  devices={unassignedDevices}
                  onAssign={(device) => setSelectedDevice(device)}
                />
              </DevicesSection>
            )}
          </div>
        </div>
      </main>

      <CreateDepartmentModal
        open={isCreateDeptOpen}
        onClose={() => setIsCreateDeptOpen(false)}
        onSave={handleCreateDept}
      />

      <EditDepartmentModal
        open={!!selectedDept}
        onClose={() => setSelectedDept(null)}
        department={selectedDept}
        onSave={handleEditDept}
      />

      <BindDeviceModal
        open={!!selectedDevice}
        onClose={() => setSelectedDevice(null)}
        device={selectedDevice}
        departments={departments}
        onSave={handleBindDevice}
      />

      <DeleteConfirmModal
        open={!!deptToDelete}
        onClose={() => setDeptToDelete(null)}
        onConfirm={handleDeleteDeptConfirm}
        title="Удалить отдел"
        description={`Вы действительно хотите удалить отдел "${deptToDelete?.name ?? ''}"?`}
        confirmText="Удалить"
      />

      <DeleteConfirmModal
        open={!!employeeToDelete}
        onClose={() => setEmployeeToDelete(null)}
        onConfirm={handleDeleteEmployeeConfirm}
        title="Удалить сотрудника"
        description={`Вы действительно хотите удалить сотрудника "${employeeToDelete?.empName ?? ''}"?`}
        confirmText="Удалить"
      />
    </div>
  );
};