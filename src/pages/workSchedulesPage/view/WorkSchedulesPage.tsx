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
        handleCompanyScheduleChange,
        departments,
        toggleDepartmentInheritance,
        handleDepartmentScheduleChange,
        filteredEmployees,
        empSearch,
        setEmpSearch,
        empDeptFilter,
        setEmpDeptFilter,
        toggleEmployeeInheritance,
        handleEmployeeScheduleChange,
    } = useWorkSchedulesPage();

    return (
        <div className={styles.page}>
            <div className={styles.wrapper}>
                <div className={styles.pageHeader}>
                    <WorkSchedulesHeader />
                </div>

                <div className={styles.contentCard}>
                    <WorkSchedulesTabs activeTab={activeTab} onChange={handleTabChange} />

                    {activeTab === 'company' && (
                        <CompanyScheduleSection 
                            schedule={companySchedule} 
                            onChange={handleCompanyScheduleChange} 
                        />
                    )}
                    
                    {activeTab === 'departments' && (
                        <DepartmentsScheduleSection
                            departments={departments}
                            companySchedule={companySchedule}
                            onToggleInheritance={toggleDepartmentInheritance}
                            onChangeSchedule={handleDepartmentScheduleChange}
                        />
                    )}
                    
                    {activeTab === 'employees' && (
                        <EmployeesScheduleSection
                            employees={filteredEmployees}
                            departments={departments}
                            companySchedule={companySchedule}
                            searchQuery={empSearch}
                            onSearchChange={setEmpSearch}
                            filterType={empDeptFilter}
                            onFilterChange={setEmpDeptFilter}
                            onToggleInheritance={toggleEmployeeInheritance}
                            onChangeSchedule={handleEmployeeScheduleChange}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};
