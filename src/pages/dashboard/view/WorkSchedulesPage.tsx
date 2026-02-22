import React, { useState } from 'react';
import classNames from 'classnames';
import styles from './WorkSchedulesPage.module.scss';
import { IoTimeOutline, IoChevronDownOutline, IoSearchOutline, IoBusinessOutline, IoGridOutline, IoPeopleOutline } from 'react-icons/io5';

// Types for Schedule
interface Schedule {
    startTime: string;
    endTime: string;
    lunchDuration: string;
    workDays: string[];
}

interface DepartmentData {
    id: string;
    name: string;
    inheritCompany: boolean;
    schedule: Schedule; // custom or effective if inherited
}

interface EmployeeData {
    id: string;
    name: string;
    initials: string;
    department: string;
    inheritDepartment: boolean;
    schedule: Schedule; // custom or effective if inherited
}

// Mock Data
const defaultCompanySchedule: Schedule = {
    startTime: '09:00',
    endTime: '18:00',
    lunchDuration: '1 час',
    workDays: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт'],
};

const mockDepartments: DepartmentData[] = [
    { id: 'd1', name: 'IT Отдел', inheritCompany: true, schedule: { ...defaultCompanySchedule } },
    { id: 'd2', name: 'HR Отдел', inheritCompany: false, schedule: { startTime: '10:00', endTime: '19:00', lunchDuration: '1 час', workDays: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт'] } },
    { id: 'd3', name: 'Отдел продаж', inheritCompany: false, schedule: { startTime: '08:00', endTime: '17:00', lunchDuration: '1 час', workDays: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'] } },
];

const mockEmployees: EmployeeData[] = [
    { id: 'e1', name: 'Иванов Иван', initials: 'ИИ', department: 'IT Отдел', inheritDepartment: true, schedule: { ...defaultCompanySchedule } },
    { id: 'e2', name: 'Смирнова Анна', initials: 'СА', department: 'HR Отдел', inheritDepartment: true, schedule: { startTime: '10:00', endTime: '19:00', lunchDuration: '1 час', workDays: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт'] } },
    { id: 'e3', name: 'Петров Петр', initials: 'ПП', department: 'Отдел продаж', inheritDepartment: false, schedule: { startTime: '09:00', endTime: '15:00', lunchDuration: '30 минут', workDays: ['Пн', 'Ср', 'Пт'] } }, // Part-time custom
    { id: 'e4', name: 'Сауле Абдыкадырова Sakewa', initials: 'СА', department: 'IT Отдел', inheritDepartment: false, schedule: { startTime: '11:00', endTime: '20:00', lunchDuration: '1 час', workDays: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт'] } },
];

const WEEK_DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export const WorkSchedulesPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'company' | 'departments' | 'employees'>('company');
    
    // State for mock data to allow local toggling (simulating saves)
    const [companySchedule, setCompanySchedule] = useState<Schedule>(defaultCompanySchedule);
    const [departments, setDepartments] = useState<DepartmentData[]>(mockDepartments);
    const [employees, setEmployees] = useState<EmployeeData[]>(mockEmployees);

    // Expand state for accordions
    const [expandedDept, setExpandedDept] = useState<string | null>(null);
    const [expandedEmp, setExpandedEmp] = useState<string | null>(null);

    // Employee filters
    const [empSearch, setEmpSearch] = useState('');
    const [empDeptFilter, setEmpDeptFilter] = useState('Все отделы');

    const handleTabChange = (tab: 'company' | 'departments' | 'employees') => {
        setActiveTab(tab);
    };

    // --- Helper to render schedule form ---
    const renderScheduleForm = (
        schedule: Schedule, 
        isInherited: boolean, 
        onToggleInherit?: () => void, 
        inheritLabel?: string,
        onScheduleChange?: (field: keyof Schedule, value: any) => void
    ) => {
        return (
            <div className={styles.scheduleForm}>
                {onToggleInherit && (
                    <div className={styles.inheritToggleWrapper}>
                        <label className={styles.toggleLabel}>
                            <input 
                                type="checkbox" 
                                checked={isInherited} 
                                onChange={onToggleInherit} 
                            />
                            <span className={styles.toggleSlider}></span>
                        </label>
                        <span className={styles.inheritText}>{inheritLabel}</span>
                    </div>
                )}

                <div className={classNames(styles.formGrid, { [styles.disabled]: isInherited })}>
                    <div className={styles.inputGroup}>
                        <label>Начало рабочего дня</label>
                        <div className={styles.inputWrapper}>
                            <IoTimeOutline className={styles.inputIcon} />
                            <input 
                                type="time" 
                                value={schedule.startTime} 
                                disabled={isInherited}
                                onChange={(e) => onScheduleChange?.('startTime', e.target.value)}
                            />
                        </div>
                    </div>
                    
                    <div className={styles.inputGroup}>
                        <label>Конец рабочего дня</label>
                        <div className={styles.inputWrapper}>
                            <IoTimeOutline className={styles.inputIcon} />
                            <input 
                                type="time" 
                                value={schedule.endTime} 
                                disabled={isInherited}
                                onChange={(e) => onScheduleChange?.('endTime', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Длительность обеда</label>
                        <select 
                            value={schedule.lunchDuration} 
                            disabled={isInherited}
                            onChange={(e) => onScheduleChange?.('lunchDuration', e.target.value)}
                        >
                            <option>Без обеда</option>
                            <option>30 минут</option>
                            <option>45 минут</option>
                            <option>1 час</option>
                            <option>1.5 часа</option>
                        </select>
                    </div>

                    <div className={styles.inputGroup} style={{ gridColumn: '1 / -1' }}>
                        <label>Рабочие дни</label>
                        <div className={styles.daysSelector}>
                            {WEEK_DAYS.map(day => (
                                <div 
                                    key={day} 
                                    className={classNames(styles.dayBtn, { 
                                        [styles.active]: schedule.workDays.includes(day),
                                        [styles.disabledToggle]: isInherited
                                    })}
                                    onClick={() => {
                                        if (isInherited || !onScheduleChange) return;
                                        const newDays = schedule.workDays.includes(day) 
                                            ? schedule.workDays.filter(d => d !== day)
                                            : [...schedule.workDays, day];
                                        onScheduleChange('workDays', newDays);
                                    }}
                                >
                                    {day}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {!isInherited && (
                     <div className={styles.actionsBox}>
                        <button className={styles.saveBtn}>Сохранить график</button>
                    </div>
                )}
            </div>
        );
    };

    // --- Tab Renderers ---

    const renderCompanyTab = () => (
        <div className={styles.tabContent}>
            <div className={styles.cardHeader}>
                <h3>График работы компании (по умолчанию)</h3>
                <p>Этот график применяется ко всем отделам и сотрудникам, если у них не задан индивидуальный график.</p>
            </div>
            {renderScheduleForm(companySchedule, false, undefined, undefined, (field, value) => {
                setCompanySchedule(prev => ({ ...prev, [field]: value }));
            })}
        </div>
    );

    const renderDepartmentsTab = () => (
        <div className={styles.tabContent}>
            <div className={styles.listContainer}>
                {departments.map(dept => (
                    <div key={dept.id} className={classNames(styles.accordionItem, { [styles.expanded]: expandedDept === dept.id })}>
                        <div 
                            className={styles.accordionHeader} 
                            onClick={() => setExpandedDept(expandedDept === dept.id ? null : dept.id)}
                        >
                            <div className={styles.headerInfo}>
                                <h4>{dept.name}</h4>
                                <span className={styles.effectiveSchedule}>
                                    {dept.inheritCompany ? 'Наследует от компании' : 'Свой график'} · {dept.schedule.startTime} - {dept.schedule.endTime}
                                </span>
                            </div>
                            <IoChevronDownOutline className={styles.arrowIcon} />
                        </div>
                        
                        {expandedDept === dept.id && (
                            <div className={styles.accordionBody}>
                                {renderScheduleForm(
                                    dept.schedule, 
                                    dept.inheritCompany, 
                                    () => {
                                        setDepartments(prev => prev.map(d => 
                                            d.id === dept.id ? { 
                                                ...d, 
                                                inheritCompany: !d.inheritCompany,
                                                schedule: !d.inheritCompany ? companySchedule : d.schedule // if turning on inherit, show company sched
                                            } : d
                                        ));
                                    },
                                    "Использовать график компании",
                                    (field, value) => {
                                        setDepartments(prev => prev.map(d => 
                                            d.id === dept.id ? { ...d, schedule: { ...d.schedule, [field]: value } } : d
                                        ));
                                    }
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    const renderEmployeesTab = () => {
        let filteredApps = employees;
        if (empDeptFilter !== 'Все отделы') {
            filteredApps = filteredApps.filter(e => e.department === empDeptFilter);
        }
        if (empSearch.trim()) {
            filteredApps = filteredApps.filter(e => e.name.toLowerCase().includes(empSearch.toLowerCase()));
        }

        return (
            <div className={styles.tabContent}>
                <div className={styles.filterRow}>
                    <div className={styles.searchBox}>
                        <IoSearchOutline className={styles.searchIcon} />
                        <input 
                            type="text" 
                            placeholder="Поиск сотрудника..." 
                            value={empSearch}
                            onChange={(e) => setEmpSearch(e.target.value)}
                        />
                    </div>
                    <select 
                        className={styles.deptSelect}
                        value={empDeptFilter}
                        onChange={(e) => setEmpDeptFilter(e.target.value)}
                    >
                        <option value="Все отделы">Все отделы</option>
                        {mockDepartments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                    </select>
                </div>

                <div className={styles.listContainer}>
                    {filteredApps.map(emp => {
                        const parentDept = departments.find(d => d.name === emp.department);
                        const effectiveParentSchedule = parentDept ? parentDept.schedule : companySchedule;

                        return (
                        <div key={emp.id} className={classNames(styles.accordionItem, { [styles.expanded]: expandedEmp === emp.id })}>
                            <div 
                                className={styles.accordionHeader} 
                                onClick={() => setExpandedEmp(expandedEmp === emp.id ? null : emp.id)}
                            >
                                <div className={styles.headerInfo}>
                                    <div className={styles.empTitle}>
                                        <div className={styles.avatar}>{emp.initials}</div>
                                        <div>
                                            <h4>{emp.name}</h4>
                                            <span className={styles.deptSub}>{emp.department}</span>
                                        </div>
                                    </div>
                                    <span className={styles.effectiveSchedule}>
                                        {emp.inheritDepartment ? 'Наследует графики отдела' : 'Свой график'} · {emp.schedule.startTime} - {emp.schedule.endTime}
                                    </span>
                                </div>
                                <IoChevronDownOutline className={styles.arrowIcon} />
                            </div>
                            
                            {expandedEmp === emp.id && (
                                <div className={styles.accordionBody}>
                                    {renderScheduleForm(
                                        emp.schedule, 
                                        emp.inheritDepartment, 
                                        () => {
                                            setEmployees(prev => prev.map(e => 
                                                e.id === emp.id ? { 
                                                    ...e, 
                                                    inheritDepartment: !e.inheritDepartment,
                                                    schedule: !e.inheritDepartment ? effectiveParentSchedule : e.schedule
                                                } : e
                                            ));
                                        },
                                        "Использовать график отдела",
                                        (field, value) => {
                                            setEmployees(prev => prev.map(e => 
                                                e.id === emp.id ? { ...e, schedule: { ...e.schedule, [field]: value } } : e
                                            ));
                                        }
                                    )}
                                </div>
                            )}
                        </div>
                    )})}
                    {filteredApps.length === 0 && (
                        <div className={styles.emptyResults}>Ничего не найдено</div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.headerArea}>
                <h2>Рабочие графики</h2>
                <p>Настройка времени работы, обедов и выходных дней.</p>
            </div>

            <main className={styles.main}>
                <div className={styles.card}>
                    <div className={styles.tabsHeader}>
                        <button 
                            className={classNames(styles.tabBtn, { [styles.active]: activeTab === 'company' })}
                            onClick={() => handleTabChange('company')}
                        >
                            <IoBusinessOutline size={18} />
                            Компания
                        </button>
                        <button 
                            className={classNames(styles.tabBtn, { [styles.active]: activeTab === 'departments' })}
                            onClick={() => handleTabChange('departments')}
                        >
                            <IoGridOutline size={18} />
                            Отделы
                        </button>
                        <button 
                            className={classNames(styles.tabBtn, { [styles.active]: activeTab === 'employees' })}
                            onClick={() => handleTabChange('employees')}
                        >
                            <IoPeopleOutline size={18} />
                            Сотрудники
                        </button>
                    </div>

                    <div className={styles.tabsBody}>
                        {activeTab === 'company' && renderCompanyTab()}
                        {activeTab === 'departments' && renderDepartmentsTab()}
                        {activeTab === 'employees' && renderEmployeesTab()}
                    </div>
                </div>
            </main>
        </div>
    );
};
