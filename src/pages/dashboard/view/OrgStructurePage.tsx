import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import styles from './OrgStructurePage.module.scss';
import { IoChevronDownOutline, IoSearchOutline, IoTrashOutline, IoPencilOutline, IoAddOutline, IoCloseOutline, IoDesktopOutline, IoPeopleOutline } from 'react-icons/io5';

// --- Types ---
interface Employee {
    id: string;
    name: string;
    position: string;
}

interface Department {
    id: string;
    name: string;
    employees: Employee[];
}

interface UnassignedDevice {
    id: string;
    hostname: string;
    lastSeen: string;
}

// --- Mock Data ---
const initialDepartments: Department[] = [
    {
        id: 'd1',
        name: 'IT Отдел',
        employees: [
            { id: 'e1', name: 'Иванов Иван', position: 'Frontend Developer' },
            { id: 'e2', name: 'Сауле Абдыкадырова Sakewa', position: 'Backend Developer' },
        ],
    },
    {
        id: 'd2',
        name: 'HR Отдел',
        employees: [
            { id: 'e3', name: 'Смирнова Анна', position: 'HR Manager' },
        ],
    },
];

const initialUnassigned: UnassignedDevice[] = [
    { id: 'u1', hostname: 'DESKTOP-NEW123', lastSeen: '10 минут назад' },
    { id: 'u2', hostname: 'LAPTOP-GUEST01', lastSeen: '2 часа назад' },
];

export const OrgStructurePage: React.FC = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<'employees' | 'devices'>('employees');

    const [departments, setDepartments] = useState<Department[]>(initialDepartments);
    const [unassignedDevices, setUnassignedDevices] = useState<UnassignedDevice[]>(initialUnassigned);

    // Accordion state
    const [expandedDepts, setExpandedDepts] = useState<Record<string, boolean>>({
        'd1': true,
        'd2': true
    });

    const [searchQuery, setSearchQuery] = useState('');

    const toggleDept = (id: string) => {
        setExpandedDepts(prev => ({ ...prev, [id]: !prev[id] }));
    };

    // --- Modal States ---
    const [isDeptModalOpen, setDeptModalOpen] = useState(false);
    const [deptModalMode, setDeptModalMode] = useState<'create' | 'edit'>('create');
    const [editingDeptId, setEditingDeptId] = useState<string | null>(null);
    const [deptFormName, setDeptFormName] = useState('');

    const [isEmpModalOpen, setEmpModalOpen] = useState(false);
    const [editingEmpId, setEditingEmpId] = useState<string | null>(null);
    const [empFormName, setEmpFormName] = useState('');
    const [empFormPosition, setEmpFormPosition] = useState('');
    const [empFormDeptId, setEmpFormDeptId] = useState('');

    const [isBindModalOpen, setBindModalOpen] = useState(false);
    const [bindingDeviceId, setBindingDeviceId] = useState<string | null>(null);

    // --- Actions ---
    const openCreateDeptModal = () => {
        setDeptModalMode('create');
        setDeptFormName('');
        setDeptModalOpen(true);
    };

    const filteredDepartments = useMemo(() => {
        if (!searchQuery.trim()) return departments;

        const lowerQuery = searchQuery.toLowerCase();

        return departments.map(dept => {
            if (dept.name.toLowerCase().includes(lowerQuery)) {
                return dept; // Keep whole department, maybe expand it?
            }

            const matchingEmployees = dept.employees.filter(emp =>
                emp.name.toLowerCase().includes(lowerQuery) ||
                emp.position.toLowerCase().includes(lowerQuery)
            );

            if (matchingEmployees.length > 0) {
                return { ...dept, employees: matchingEmployees };
            }

            return null;
        }).filter(Boolean) as Department[];
    }, [departments, searchQuery]);

    const openEditDeptModal = (dept: Department) => {
        setDeptModalMode('edit');
        setEditingDeptId(dept.id);
        setDeptFormName(dept.name);
        setDeptModalOpen(true);
    };

    const handleSaveDept = () => {
        if (!deptFormName.trim()) return;

        if (deptModalMode === 'create') {
            const newDept: Department = {
                id: `d${Date.now()}`,
                name: deptFormName,
                employees: []
            };
            setDepartments([...departments, newDept]);
            setExpandedDepts(prev => ({ ...prev, [newDept.id]: true }));
        } else if (deptModalMode === 'edit' && editingDeptId) {
            setDepartments(departments.map(d => d.id === editingDeptId ? { ...d, name: deptFormName } : d));
        }
        setDeptModalOpen(false);
    };

    const handleDeleteDept = (id: string) => {
        // Optional: show confirmation here
        setDepartments(departments.filter(d => d.id !== id));
    };

    const openEditEmpModal = (emp: Employee, deptId: string) => {
        setEditingEmpId(emp.id);
        setEmpFormName(emp.name);
        setEmpFormPosition(emp.position);
        setEmpFormDeptId(deptId);
        setEmpModalOpen(true);
    };

    const handleSaveEmp = () => {
        if (!empFormName.trim() || !editingEmpId) return;

        // Find old department and remove
        let oldDeptId = '';
        departments.forEach(d => {
            if (d.employees.some(e => e.id === editingEmpId)) oldDeptId = d.id;
        });

        const empClone = departments.find(d => d.id === oldDeptId)?.employees.find(e => e.id === editingEmpId);
        if (!empClone) return;

        const updatedEmp = { ...empClone, name: empFormName, position: empFormPosition };

        setDepartments(departments.map(d => {
            if (d.id === oldDeptId && d.id !== empFormDeptId) {
                // Removing from old dept
                return { ...d, employees: d.employees.filter(e => e.id !== editingEmpId) };
            }
            if (d.id === empFormDeptId && d.id !== oldDeptId) {
                // Adding to new dept
                return { ...d, employees: [...d.employees, updatedEmp] };
            }
            if (d.id === oldDeptId && d.id === empFormDeptId) {
                // Just updating within the same dept
                return { ...d, employees: d.employees.map(e => e.id === editingEmpId ? updatedEmp : e) };
            }
            return d;
        }));

        setEmpModalOpen(false);
    };

    const handleDeleteEmp = (empId: string, deptId: string) => {
        setDepartments(departments.map(d => {
            if (d.id === deptId) {
                return { ...d, employees: d.employees.filter(e => e.id !== empId) };
            }
            return d;
        }));
    };

    const openBindModal = (device: UnassignedDevice) => {
        setBindingDeviceId(device.id);
        setEmpFormName('');
        setEmpFormPosition('');
        setEmpFormDeptId(departments.length > 0 ? departments[0].id : '');
        setBindModalOpen(true);
    };

    const handleBindDevice = () => {
        if (!empFormName.trim() || !empFormDeptId || !bindingDeviceId) return;

        const newEmp: Employee = {
            id: `e${Date.now()}`,
            name: empFormName,
            position: empFormPosition || 'Сотрудник',
        };

        // Add to department
        setDepartments(departments.map(d => d.id === empFormDeptId ? { ...d, employees: [...d.employees, newEmp] } : d));

        // Remove from unassigned
        setUnassignedDevices(unassignedDevices.filter(d => d.id !== bindingDeviceId));

        setBindModalOpen(false);
    };


    // --- Renderers ---
    const renderEmployeesTab = () => (
        <div className={styles.tabContent}>
            <div className={styles.actionBar}>
                <div className={styles.searchBox}>
                    <IoSearchOutline className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder={t('settings.organization.employees.search')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <button className={styles.primaryBtn} onClick={openCreateDeptModal}>
                    <IoAddOutline size={18} />
                    {t('settings.organization.employees.addDept')}
                </button>
            </div>

            <div className={styles.departmentsList}>
                {filteredDepartments.map(dept => (
                    <div key={dept.id} className={classNames(styles.deptAccordion, { [styles.expanded]: expandedDepts[dept.id] || searchQuery.trim().length > 0 })}>
                        <div className={styles.deptHeader}>
                            <div className={styles.deptInfo} onClick={() => toggleDept(dept.id)}>
                                <IoChevronDownOutline className={styles.arrowIcon} />
                                <h3>{dept.name}</h3>
                                <span className={styles.badge}>{dept.employees.length} {t('settings.organization.employees.ppl')}</span>
                            </div>
                            <div className={styles.deptActions}>
                                <button className={styles.iconBtn} onClick={() => openEditDeptModal(dept)} title={t('settings.organization.employees.editDept')}>
                                    <IoPencilOutline size={16} />
                                </button>
                                <button className={classNames(styles.iconBtn, styles.dangerBtn)} onClick={() => handleDeleteDept(dept.id)} title={t('settings.organization.employees.deleteDept')}>
                                    <IoTrashOutline size={16} />
                                </button>
                            </div>
                        </div>

                        {(expandedDepts[dept.id] || searchQuery.trim().length > 0) && (
                            <div className={styles.deptBody}>
                                {dept.employees.length === 0 ? (
                                    <div className={styles.emptyStateContainer}>{t('settings.organization.employees.emptyDept')}</div>
                                ) : (
                                    <table className={styles.empTable}>
                                        <thead>
                                            <tr>
                                                <th>{t('settings.organization.employees.table.fullName')}</th>
                                                <th>{t('settings.organization.employees.table.position')}</th>
                                                <th className={styles.actionsCol}>{t('settings.organization.employees.table.actions')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {dept.employees.map(emp => (
                                                <tr key={emp.id}>
                                                    <td>
                                                        <div className={styles.empNameCol}>
                                                            <div className={styles.avatar}>{emp.name.substring(0, 2).toUpperCase()}</div>
                                                            {emp.name}
                                                        </div>
                                                    </td>
                                                    <td className={styles.positionText}>{emp.position}</td>
                                                    <td className={styles.actionsCol}>
                                                        <button className={styles.iconBtn} onClick={() => openEditEmpModal(emp, dept.id)}>
                                                            <IoPencilOutline size={16} />
                                                        </button>
                                                        <button className={classNames(styles.iconBtn, styles.dangerBtn)} onClick={() => handleDeleteEmp(emp.id, dept.id)}>
                                                            <IoTrashOutline size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        )}
                    </div>
                ))}

                {filteredDepartments.length === 0 && (
                    <div className={styles.emptyResults}>{t('settings.organization.employees.noResults')}</div>
                )}
            </div>
        </div>
    );

    const renderDevicesTab = () => (
        <div className={styles.tabContent}>
            <div className={styles.cardHeader}>
                <h3>{t('settings.organization.devices.title')}</h3>
                <p>{t('settings.organization.devices.subtitle')}</p>
            </div>

            <div className={styles.deviceList}>
                {unassignedDevices.length === 0 ? (
                    <div className={styles.emptyResults}>{t('settings.organization.devices.allAssigned')}</div>
                ) : (
                    <table className={styles.empTable}>
                        <thead>
                            <tr>
                                <th>{t('settings.organization.devices.table.hostname')}</th>
                                <th>{t('settings.organization.devices.table.lastSeen')}</th>
                                <th className={styles.actionsCol}>{t('settings.organization.employees.table.actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {unassignedDevices.map(device => (
                                <tr key={device.id}>
                                    <td>
                                        <div className={styles.hostNameCol}>
                                            <IoDesktopOutline className={styles.desktopIcon} size={18} />
                                            {device.hostname}
                                        </div>
                                    </td>
                                    <td className={styles.positionText}>{device.lastSeen}</td>
                                    <td className={styles.actionsCol}>
                                        <button className={styles.primaryBtnSm} onClick={() => openBindModal(device)}>
                                            {t('settings.organization.devices.assignBtn')}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );

    return (
        <div className={styles.container}>
            <div className={styles.headerArea}>
                <h2>{t('settings.organization.title')}</h2>
                <p>{t('settings.organization.subtitle')}</p>
            </div>

            <main className={styles.main}>
                <div className={styles.card}>
                    <div className={styles.tabsHeader}>
                        <button
                            className={classNames(styles.tabBtn, { [styles.active]: activeTab === 'employees' })}
                            onClick={() => setActiveTab('employees')}
                        >
                            <IoPeopleOutline size={18} />
                            {t('settings.organization.tabs.employees')}
                        </button>
                        <button
                            className={classNames(styles.tabBtn, { [styles.active]: activeTab === 'devices' })}
                            onClick={() => setActiveTab('devices')}
                        >
                            <IoDesktopOutline size={18} />
                            {t('settings.organization.tabs.devices')}
                            {unassignedDevices.length > 0 && <span className={styles.tabBadge}>{unassignedDevices.length}</span>}
                        </button>
                    </div>

                    <div className={styles.tabsBody}>
                        {activeTab === 'employees' && renderEmployeesTab()}
                        {activeTab === 'devices' && renderDevicesTab()}
                    </div>
                </div>
            </main>

            {/* --- Modals --- */}

            {/* Department Modal */}
            {isDeptModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h3>{deptModalMode === 'create' ? t('settings.organization.modals.dept.create') : t('settings.organization.modals.dept.edit')}</h3>
                            <button className={styles.closeBtn} onClick={() => setDeptModalOpen(false)}>
                                <IoCloseOutline size={24} />
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.inputGroup}>
                                <label>{t('settings.organization.modals.dept.name')}</label>
                                <input
                                    type="text"
                                    value={deptFormName}
                                    onChange={(e) => setDeptFormName(e.target.value)}
                                    placeholder={t('settings.organization.modals.dept.placeholder')}
                                    autoFocus
                                />
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <button className={styles.ghostBtn} onClick={() => setDeptModalOpen(false)}>{t('common.cancel')}</button>
                            <button className={styles.primaryBtn} onClick={handleSaveDept} disabled={!deptFormName.trim()}>
                                {t('common.save')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Employee Edit Modal */}
            {isEmpModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h3>{t('settings.organization.modals.emp.edit')}</h3>
                            <button className={styles.closeBtn} onClick={() => setEmpModalOpen(false)}>
                                <IoCloseOutline size={24} />
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.inputGroup}>
                                <label>ФИО Сотрудника</label>
                                <input
                                    type="text"
                                    value={empFormName}
                                    onChange={(e) => setEmpFormName(e.target.value)}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Должность</label>
                                <input
                                    type="text"
                                    value={empFormPosition}
                                    onChange={(e) => setEmpFormPosition(e.target.value)}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Отдел</label>
                                <select
                                    value={empFormDeptId}
                                    onChange={(e) => setEmpFormDeptId(e.target.value)}
                                >
                                    {departments.map(d => (
                                        <option key={d.id} value={d.id}>{d.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <button className={styles.ghostBtn} onClick={() => setEmpModalOpen(false)}>{t('common.cancel')}</button>
                            <button className={styles.primaryBtn} onClick={handleSaveEmp} disabled={!empFormName.trim()}>
                                {t('common.save')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Bind Device Modal */}
            {isBindModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h3>Привязать устройство</h3>
                            <button className={styles.closeBtn} onClick={() => setBindModalOpen(false)}>
                                <IoCloseOutline size={24} />
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <p className={styles.modalDesc}>
                                {t('settings.organization.modals.bind.desc1')}<strong>{unassignedDevices.find(d => d.id === bindingDeviceId)?.hostname}</strong>{t('settings.organization.modals.bind.desc2')}
                            </p>
                            <div className={styles.inputGroup}>
                                <label>{t('settings.organization.modals.emp.name')}</label>
                                <input
                                    type="text"
                                    value={empFormName}
                                    onChange={(e) => setEmpFormName(e.target.value)}
                                    placeholder={t('settings.organization.modals.emp.namePlaceholder')}
                                    autoFocus
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>{t('settings.organization.modals.emp.position')}</label>
                                <input
                                    type="text"
                                    value={empFormPosition}
                                    onChange={(e) => setEmpFormPosition(e.target.value)}
                                    placeholder={t('settings.organization.modals.emp.positionPlaceholder')}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>{t('settings.organization.modals.emp.dept')}</label>
                                <select
                                    value={empFormDeptId}
                                    onChange={(e) => setEmpFormDeptId(e.target.value)}
                                >
                                    {departments.map(d => (
                                        <option key={d.id} value={d.id}>{d.name}</option>
                                    ))}
                                    {departments.length === 0 && <option value="" disabled>{t('settings.organization.modals.emp.createDeptFirst')}</option>}
                                </select>
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <button className={styles.ghostBtn} onClick={() => setBindModalOpen(false)}>{t('common.cancel')}</button>
                            <button className={styles.primaryBtn} onClick={handleBindDevice} disabled={!empFormName.trim() || !empFormDeptId}>
                                {t('settings.organization.modals.bind.assignBtn')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};
