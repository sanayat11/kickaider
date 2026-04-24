import React from 'react';
import { WorkSchedulesHeader } from '../ui/WorkSchedulesHeader/WorkSchedulesHeader';
import { WorkSchedulesTabs } from '../ui/WorkSchedulesTabs/WorkSchedulesTabs';
import { CompanyScheduleSection } from '../ui/CompanyScheduleSection/CompanyScheduleSection';
import { DepartmentsScheduleSection } from '../ui/DepartmentsScheduleSection/DepartmentsScheduleSection';
import { EmployeesScheduleSection } from '../ui/EmployeesScheduleSection/EmployeesScheduleSection';
import { useWorkSchedulesPage } from '../model/useWorkSchedulesPage';
import styles from './WorkSchedulesPage.module.scss';

export const WorkSchedulesPage: React.FC = () => {
    const {
        activeTab,
        handleTabChange,
        companySchedule,
        companyLoading,
        companySaving,
        scheduleKey,
        saveCompanySchedule,
        departments,
        departmentsLoading,
        savingDepartmentIds,
        loadingDepartmentScheduleIds,
        saveDepartmentSchedule,
        ensureDepartmentScheduleLoaded,
        employeesLoading,
        savingEmployeeIds,
        loadingEmployeeScheduleIds,
        filteredEmployees,
        saveEmployeeSchedule,
        ensureEmployeeScheduleLoaded,
        changeEmployeeScheduleDate,
        empSearch,
        setEmpSearch,
        empDeptFilter,
        setEmpDeptFilter,
    } = useWorkSchedulesPage();

    return (
        <div className={styles.page}>
            <div className={styles.wrapper}>
                <div className={styles.pageHeader}>
                    <WorkSchedulesHeader />
                </div>

                <WorkSchedulesTabs activeTab={activeTab} onChange={handleTabChange} />

                <div className={styles.contentCard}>
                    {activeTab === 'company' && (
                        <CompanyScheduleSection
                            schedule={companySchedule}
                            loading={companyLoading}
                            saving={companySaving}
                            scheduleKey={scheduleKey}
                            onSave={saveCompanySchedule}
                        />
                    )}
                    
                    {activeTab === 'departments' && (
                        <DepartmentsScheduleSection
                            departments={departments}
                            loading={departmentsLoading}
                            savingIds={savingDepartmentIds}
                            loadingScheduleIds={loadingDepartmentScheduleIds}
                            companySchedule={companySchedule}
                            onSaveDepartmentSchedule={saveDepartmentSchedule}
                            onOpenDepartment={ensureDepartmentScheduleLoaded}
                        />
                    )}
                    
                    {activeTab === 'employees' && (
                        <EmployeesScheduleSection
                            employees={filteredEmployees}
                            loading={employeesLoading}
                            savingIds={savingEmployeeIds}
                            loadingScheduleIds={loadingEmployeeScheduleIds}
                            departments={departments}
                            searchQuery={empSearch}
                            onSearchChange={setEmpSearch}
                            filterType={empDeptFilter}
                            onFilterChange={setEmpDeptFilter}
                            onSaveEmployeeSchedule={saveEmployeeSchedule}
                            onOpenEmployee={ensureEmployeeScheduleLoaded}
                            onEmployeeDateChange={changeEmployeeScheduleDate}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};
