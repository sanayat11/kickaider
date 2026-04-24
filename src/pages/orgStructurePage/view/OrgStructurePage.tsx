import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { BlockDeviceModal } from '@/features/block-device-modal';
import { CreateDepartmentModal } from '@/features/create-department';
import { CreateEmployeeModal } from '@/features/create-employee';
import { DeleteConfirmModal } from '@/features/deleteModal/view/DeleteModal';
import { EditEmployeeModal } from '@/features/editEmployeeModal/view/EditEmployeeModal';
import { EditAliasModal } from '@/features/edit-device-alias/view/EditAliasModal';
import { DepartmentAccordion } from '@/widgets/DepartmentAccordion';
import { DevicesSection } from '@/widgets/DevicesSection';
import { DevicesTable } from '@/widgets/DevicesTable';
import { CompanyDevicesTable } from '@/widgets/CompanyDevicesTable';
import { EmployeesSection } from '@/widgets/EmployeesSection';
import { OrganizationHeader } from '@/widgets/OrganizationHeader';
import { OrganizationTabs } from '@/widgets/OrganizationTabs';
import type { Department, DeviceApiItem, Employee, OrgTab } from '../model/types';
import { mapDepartmentsWithEmployees } from '../model/mappers';
import {
  useCompanyDepartments,
  useCreateDepartment,
  useDeleteDepartment,
} from '../model/useDepartments';
import { useCompanyEmployees } from '../model/useOrgStructure';
import { useBlockEmployee, useChangeEmployeePassword, useCreateEmployeeWithUser, useUpdateEmployee } from '../model/useEmployees';
import {
  useApproveDevice,
  useBlockDevice,
  useCompanyDevices,
  usePendingDevices,
  useUnblockDevice,
  useUpdateDeviceAlias,
} from '../model/useDevice';
import styles from './OrgStructurePage.module.scss';

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
  const [deviceForAlias, setDeviceForAlias] = useState<DeviceApiItem | null>(null);
  const [deviceToBlock, setDeviceToBlock] = useState<DeviceApiItem | null>(null);
  const [addEmployeeDept, setAddEmployeeDept] = useState<Department | null>(null);

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
    data: pendingDevicesData = { devices: [], total: 0 },
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
  const createEmployeeWithUserMutation = useCreateEmployeeWithUser(
    hasValidCompanyId ? parsedCompanyId : undefined,
  );
  const changeEmployeePasswordMutation = useChangeEmployeePassword();
  const approveDeviceMutation = useApproveDevice();
  const blockDeviceMutation = useBlockDevice();
  const unblockDeviceMutation = useUnblockDevice();
  const updateDeviceAliasMutation = useUpdateDeviceAlias();

  const {
    data: companyDevices = [],
    isLoading: isCompanyDevicesLoading,
    isError: isCompanyDevicesError,
    error: companyDevicesError,
  } = useCompanyDevices();

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

  const employeeMap = useMemo(() => {
    const map = new Map<number, string>();
    employees.forEach((emp) => {
      map.set(emp.id, `Сотрудник #${emp.userId}`);
    });
    return map;
  }, [employees]);

  const pendingDevices = pendingDevicesData.devices;
  const pendingDevicesTotal = pendingDevicesData.total;

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
  }) => {
    try {
      await updateEmployeeMutation.mutateAsync({
        id: Number(data.employeeId),
        payload: {
          departmentId: Number(data.departmentId),
          position: data.position,
          employeeNumber: '',
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

  const handleChangeEmployeePassword = async (employeeId: string, newPassword: string) => {
    try {
      await changeEmployeePasswordMutation.mutateAsync({ id: Number(employeeId), newPassword });
      alert('Пароль успешно изменён');
    } catch (error) {
      console.error('Failed to change password', error);
      alert('Не удалось сменить пароль');
    }
  };

  const handleCreateEmployee = async (data: {
    email: string;
    password: string;
    name: string;
    departmentId: number;
    position: string;
    hireDate: string;
  }) => {
    try {
      await createEmployeeWithUserMutation.mutateAsync(data);
      setAddEmployeeDept(null);
    } catch (error) {
      console.error('Failed to create employee', error);
      alert('Не удалось создать сотрудника');
    }
  };

  const handleApproveDevice = async (device: DeviceApiItem) => {
    try {
      await approveDeviceMutation.mutateAsync({
        id: device.id,
        alias: device.deviceName || device.hostname || `Device #${device.id}`,
      });
    } catch (error) {
      console.error('Failed to approve device', error);
      alert('Не удалось подтвердить устройство');
    }
  };

  const handleApproveCompanyDevice = async (device: DeviceApiItem) => {
    try {
      await approveDeviceMutation.mutateAsync({
        id: device.id,
        alias: device.deviceName || device.hostname,
      });
    } catch (error) {
      console.error('Failed to approve device', error);
      alert('Не удалось разрешить устройство');
    }
  };

  const handleBlockDeviceConfirm = async (deviceId: number, reason: string) => {
    try {
      await blockDeviceMutation.mutateAsync({ id: deviceId, reason });
      setDeviceToBlock(null);
    } catch (error) {
      console.error('Failed to block device', error);
      alert('Не удалось заблокировать устройство');
    }
  };

  const handleUnblockDevice = async (device: DeviceApiItem) => {
    try {
      await unblockDeviceMutation.mutateAsync(device.id);
    } catch (error) {
      console.error('Failed to unblock device', error);
      alert('Не удалось разблокировать устройство');
    }
  };

  const handleSaveAlias = async (deviceId: number, alias: string) => {
    try {
      await updateDeviceAliasMutation.mutateAsync({ id: deviceId, alias });
      setDeviceForAlias(null);
    } catch (error) {
      console.error('Failed to update alias', error);
      alert('Не удалось переименовать устройство');
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
            unassignedCount={pendingDevicesTotal}
          />

          <div className={styles.tabsBody}>
            {activeTab === 'management' ? (
              isCompanyDevicesLoading ? (
                <div>Загрузка устройств...</div>
              ) : isCompanyDevicesError ? (
                <div>
                  Не удалось загрузить устройства
                  {companyDevicesError instanceof Error ? `: ${companyDevicesError.message}` : ''}
                </div>
              ) : (
                <CompanyDevicesTable
                  devices={companyDevices}
                  employeeMap={employeeMap}
                  onApprove={handleApproveCompanyDevice}
                  onBlock={(device) => setDeviceToBlock(device)}
                  onUnblock={handleUnblockDevice}
                  onEditAlias={(device) => setDeviceForAlias(device)}
                />
              )
            ) : activeTab === 'employees' ? (
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
                      onAddEmployee={(deptId) => {
                        const department = departments.find((item) => item.id === deptId) ?? null;
                        setAddEmployeeDept(department);
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
                  <DevicesTable devices={pendingDevices} onApprove={handleApproveDevice} />
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
        onChangePassword={handleChangeEmployeePassword}
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

      <BlockDeviceModal
        open={!!deviceToBlock}
        onClose={() => setDeviceToBlock(null)}
        device={deviceToBlock}
        onConfirm={handleBlockDeviceConfirm}
        isLoading={blockDeviceMutation.isPending}
      />

      <EditAliasModal
        open={!!deviceForAlias}
        onClose={() => setDeviceForAlias(null)}
        device={deviceForAlias}
        onSave={handleSaveAlias}
        isLoading={updateDeviceAliasMutation.isPending}
      />

      {addEmployeeDept && (
        <CreateEmployeeModal
          open={!!addEmployeeDept}
          onClose={() => setAddEmployeeDept(null)}
          departmentId={Number(addEmployeeDept.id)}
          departmentName={addEmployeeDept.name}
          onSave={handleCreateEmployee}
          isLoading={createEmployeeWithUserMutation.isPending}
        />
      )}
    </div>
  );
};


