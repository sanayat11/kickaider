import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { CreateDepartmentModal } from '@/features/create-department';
import { DeleteConfirmModal } from '@/features/deleteModal/view/DeleteModal';
import { EditEmployeeModal } from '@/features/editEmployeeModal/view/EditEmployeeModal';
import { DepartmentAccordion } from '@/widgets/DepartmentAccordion';
import { DevicesSection } from '@/widgets/DevicesSection';
import { DevicesTable } from '@/widgets/DevicesTable';
import { EmployeesSection } from '@/widgets/EmployeesSection';
import { OrganizationHeader } from '@/widgets/OrganizationHeader';
import { OrganizationTabs } from '@/widgets/OrganizationTabs';
import type { Department, Employee, OrgTab, UnassignedDevice } from '../model/types';
import { mapDepartmentsWithEmployees } from '../model/mappers';
import {
  useCompanyDepartments,
  useCreateDepartment,
  useDeleteDepartment,
} from '../model/useDepartments';
import { useCompanyEmployees } from '../model/useOrgStructure';
import { useBlockEmployee, useUpdateEmployee } from '../model/useEmployees';
import { useApproveDevice, usePendingDevices } from '../model/useDevice';
import styles from './OrgStructurePage.module.scss';

const formatLastSeen = (value?: string | null) => {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return date.toLocaleString('ru-RU');
};

export const OrgStructurePage = () => {
  const { t } = useTranslation();
  const { companyId } = useParams<{ companyId: string }>();

  const parsedCompanyId = Number(companyId);
  const hasValidCompanyId = Number.isFinite(parsedCompanyId);

  const [activeTab, setActiveTab] = useState<OrgTab>('employees');
  const [searchQuery, setSearchQuery] = useState('');

  const [isCreateDeptOpen, setIsCreateDeptOpen] = useState(false);
  const [deptToDelete, setDeptToDelete] = useState<Department | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<(Employee & { deptId: string }) | null>(
    null,
  );
  const [employeeToBlock, setEmployeeToBlock] = useState<{
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

  const {
    data: pendingDevices = [],
    isLoading: isDevicesLoading,
    isError: isDevicesError,
    error: devicesError,
  } = usePendingDevices();

  const createDepartmentMutation = useCreateDepartment(
    hasValidCompanyId ? parsedCompanyId : undefined,
  );
  const deleteDepartmentMutation = useDeleteDepartment(
    hasValidCompanyId ? parsedCompanyId : undefined,
  );
  const updateEmployeeMutation = useUpdateEmployee(
    hasValidCompanyId ? parsedCompanyId : undefined,
  );
  const blockEmployeeMutation = useBlockEmployee(
    hasValidCompanyId ? parsedCompanyId : undefined,
  );
  const approveDeviceMutation = useApproveDevice();

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
            emp.position.toLowerCase().includes(query) ||
            (emp.employeeNumber ?? '').toLowerCase().includes(query),
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

  const unassignedDevices = useMemo<UnassignedDevice[]>(() => {
    return pendingDevices.map((device) => ({
      id: String(device.id),
      hostname: device.hostname || device.deviceName || `Device #${device.id}`,
      lastSeen: formatLastSeen(device.lastSeenAt || device.firstSeenAt),
    }));
  }, [pendingDevices]);

  const handleCreateDept = async (name: string) => {
    try {
      await createDepartmentMutation.mutateAsync({
        name: name.trim(),
        companyId: parsedCompanyId,
      });

      setIsCreateDeptOpen(false);
    } catch (error) {
      console.error('Failed to create department', error);
      alert('Не удалось создать отдел');
    }
  };

  const handleDeleteDeptConfirm = async () => {
    if (!deptToDelete) return;

    try {
      await deleteDepartmentMutation.mutateAsync(Number(deptToDelete.id));
      setDeptToDelete(null);
    } catch (error) {
      console.error('Failed to delete department', error);
      alert('Не удалось удалить отдел. Возможно, в нём ещё есть сотрудники.');
    }
  };

  const handleSaveEmployee = async (data: {
    employeeId: string;
    departmentId: string;
    position: string;
    employeeNumber: string;
  }) => {
    try {
      await updateEmployeeMutation.mutateAsync({
        id: Number(data.employeeId),
        payload: {
          departmentId: Number(data.departmentId),
          position: data.position,
          employeeNumber: data.employeeNumber,
        },
      });

      setSelectedEmployee(null);
    } catch (error) {
      console.error('Failed to update employee', error);
      alert('Не удалось обновить сотрудника');
    }
  };

  const handleBlockEmployeeConfirm = async () => {
    if (!employeeToBlock) return;

    try {
      await blockEmployeeMutation.mutateAsync(Number(employeeToBlock.empId));
      setEmployeeToBlock(null);
    } catch (error) {
      console.error('Failed to block employee', error);
      alert('Не удалось заблокировать сотрудника');
    }
  };

  const handleApproveDevice = async (device: UnassignedDevice) => {
    try {
      await approveDeviceMutation.mutateAsync({
        id: Number(device.id),
        alias: device.hostname,
      });
    } catch (error) {
      console.error('Failed to approve device', error);
      alert('Не удалось подтвердить устройство');
    }
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
        subtitle={t('settings.organization.subtitle') || 'Company organization overview'}
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
                  <div>Загрузка структуры...</div>
                ) : isError ? (
                  <div>
                    Не удалось загрузить структуру
                    {error instanceof Error ? `: ${error.message}` : ''}
                  </div>
                ) : filteredDepartments.length === 0 ? (
                  <div>Отделы и сотрудники не найдены</div>
                ) : (
                  filteredDepartments.map((dept) => (
                    <DepartmentAccordion
                      key={dept.id}
                      department={dept}
                      defaultExpanded={!!searchQuery}
                      onDeleteDept={(deptId) => {
                        const department = departments.find((item) => item.id === deptId) ?? null;
                        setDeptToDelete(department);
                      }}
                      onEditEmployee={(emp, deptId) => {
                        setSelectedEmployee({
                          ...emp,
                          deptId,
                          departmentId: deptId,
                        });
                      }}
                      onDeleteEmployee={(empId, deptId) => {
                        const department = departments.find((d) => d.id === deptId);
                        const employee = department?.employees.find((e) => e.id === empId);

                        setEmployeeToBlock({
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
                {isDevicesLoading ? (
                  <div>Загрузка устройств...</div>
                ) : isDevicesError ? (
                  <div>
                    Не удалось загрузить устройства
                    {devicesError instanceof Error ? `: ${devicesError.message}` : ''}
                  </div>
                ) : (
                  <DevicesTable devices={unassignedDevices} onApprove={handleApproveDevice} />
                )}
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

      <EditEmployeeModal
        key={selectedEmployee?.id ?? 'edit-employee-closed'}
        open={!!selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
        employee={selectedEmployee}
        departments={departments}
        onSave={handleSaveEmployee}
      />

      <DeleteConfirmModal
        open={!!deptToDelete}
        onClose={() => setDeptToDelete(null)}
        onConfirm={handleDeleteDeptConfirm}
        title="Удалить отдел"
        description={`Вы уверены, что хотите удалить отдел "${deptToDelete?.name ?? ''}"?`}
        confirmText="Удалить"
      />

      <DeleteConfirmModal
        open={!!employeeToBlock}
        onClose={() => setEmployeeToBlock(null)}
        onConfirm={handleBlockEmployeeConfirm}
        title="Заблокировать сотрудника"
        description={`Вы уверены, что хотите заблокировать сотрудника "${employeeToBlock?.empName ?? ''}"?`}
        confirmText="Заблокировать"
      />
    </div>
  );
};