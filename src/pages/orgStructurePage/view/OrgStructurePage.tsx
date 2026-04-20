import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { BindDeviceModal } from '@/features/bind-device';
import { CreateDepartmentModal } from '@/features/create-department';
import { DeleteConfirmModal } from '@/features/deleteModal/view/DeleteModal';
import { EditDepartmentModal } from '@/features/edit-department';
import { DepartmentAccordion } from '@/widgets/DepartmentAccordion';
import { DevicesSection } from '@/widgets/DevicesSection';
import { DevicesTable } from '@/widgets/DevicesTable';
import { EmployeesSection } from '@/widgets/EmployeesSection';
import { OrganizationHeader } from '@/widgets/OrganizationHeader';
import { OrganizationTabs } from '@/widgets/OrganizationTabs';
import type { Department, OrgTab, UnassignedDevice } from '../model/types';
import { mapDepartmentsWithEmployees } from '../model/mappers';
import {
  useCompanyDepartments,
  useCreateDepartment,
  useDeleteDepartment,
} from '../model/useDepartments';
import { useCompanyEmployees } from '../model/useOrgStructure';
import styles from './OrgStructurePage.module.scss';

export const OrgStructurePage = () => {
  const { t } = useTranslation();
  const { companyId } = useParams<{ companyId: string }>();

  const parsedCompanyId = Number(companyId);
  const hasValidCompanyId = Number.isFinite(parsedCompanyId);

  const [activeTab, setActiveTab] = useState<OrgTab>('employees');
  const [searchQuery, setSearchQuery] = useState('');
  const [unassignedDevices, setUnassignedDevices] = useState<UnassignedDevice[]>([]);

  const [isCreateDeptOpen, setIsCreateDeptOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<UnassignedDevice | null>(null);

  const [deptToDelete, setDeptToDelete] = useState<Department | null>(null);
  const [employeeToDelete, setEmployeeToDelete] = useState<{
    empId: string;
    deptId: string;
    empName?: string;
  } | null>(null);

  const {
    data: employees = [],
    isLoading: isEmployeesLoading,
    isError: isEmployeesError,
    error: employeesError,
  } = useCompanyEmployees(hasValidCompanyId ? parsedCompanyId : undefined);

  const {
    data: departmentsData = [],
    isLoading: isDepartmentsLoading,
    isError: isDepartmentsError,
    error: departmentsError,
  } = useCompanyDepartments(hasValidCompanyId ? parsedCompanyId : undefined);

  const createDepartmentMutation = useCreateDepartment(
    hasValidCompanyId ? parsedCompanyId : undefined,
  );
  const deleteDepartmentMutation = useDeleteDepartment(
    hasValidCompanyId ? parsedCompanyId : undefined,
  );

  const departments = useMemo(() => {
    return mapDepartmentsWithEmployees(departmentsData, employees);
  }, [departmentsData, employees]);

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

  const handleCreateDept = async (name: string) => {
    try {
      await createDepartmentMutation.mutateAsync({
        name,
        companyId: parsedCompanyId,
      });
      setIsCreateDeptOpen(false);
    } catch (error) {
      console.error('Failed to create department', error);
      alert('Failed to create department');
    }
  };

  const handleEditDept = async (name: string) => {
    console.warn('Edit department API is not connected yet', name, selectedDept);
    setSelectedDept(null);
  };

  const handleDeleteDeptConfirm = async () => {
    if (!deptToDelete) return;

    try {
      await deleteDepartmentMutation.mutateAsync(Number(deptToDelete.id));
      setDeptToDelete(null);
    } catch (error) {
      console.error('Failed to delete department', error);
      alert('Failed to delete department. It may still contain employees.');
    }
  };

  const handleDeleteEmployeeConfirm = () => {
    console.warn('Delete employee API is not connected yet', employeeToDelete);
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

    console.warn('Bind device API is not connected yet', data);
    setSelectedDevice(null);
  };

  const isLoading = isEmployeesLoading || isDepartmentsLoading;
  const isError = isEmployeesError || isDepartmentsError;
  const error = employeesError || departmentsError;

  if (!companyId || !hasValidCompanyId) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>Missing companyId in URL</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <OrganizationHeader
        title={t('settings.organization.title')}
        subtitle={
          t('settings.organization.subtitle') || 'Company organization overview'
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
                {isLoading ? (
                  <div>Loading structure...</div>
                ) : isError ? (
                  <div>
                    Failed to load structure
                    {error instanceof Error ? `: ${error.message}` : ''}
                  </div>
                ) : filteredDepartments.length === 0 ? (
                  <div>Departments and employees not found</div>
                ) : (
                  filteredDepartments.map((dept) => (
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
                  ))
                )}
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
        key={selectedDept?.id ?? 'edit-dept-closed'}
        open={!!selectedDept}
        onClose={() => setSelectedDept(null)}
        department={selectedDept}
        onSave={handleEditDept}
      />

      <BindDeviceModal
        key={selectedDevice?.id ?? 'bind-device-closed'}
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
        title="Delete department"
        description={`Are you sure you want to delete department "${deptToDelete?.name ?? ''}"?`}
        confirmText="Delete"
      />

      <DeleteConfirmModal
        open={!!employeeToDelete}
        onClose={() => setEmployeeToDelete(null)}
        onConfirm={handleDeleteEmployeeConfirm}
        title="Delete employee"
        description={`Are you sure you want to delete employee "${employeeToDelete?.empName ?? ''}"?`}
        confirmText="Delete"
      />
    </div>
  );
};
