import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { paths } from '@/shared/constants/constants';
import classNames from 'classnames';
import {
    IoSettingsOutline,
    IoDocumentTextOutline,
    IoChevronDownOutline,
    IoMenuOutline,
    IoCloseOutline,
    IoCalendarOutline,
    IoBusinessOutline,
    IoBarChartOutline
} from 'react-icons/io5';
import styles from './Sidebar.module.scss';

interface SidebarItemProps {
    id: string;
    icon: React.ElementType;
    label: string;
    collapsed: boolean;
    active?: boolean;
    badge?: number;
    hasSubmenu?: boolean;
    isOpen?: boolean;
    onClick?: () => void;
    children?: React.ReactNode;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
    icon: Icon,
    label,
    collapsed,
    active,
    badge,
    hasSubmenu,
    isOpen,
    onClick,
    children
}) => {
    return (
        <>
            <div
                className={classNames(styles.item, {
                    [styles.active]: active,
                    [styles.collapsed]: collapsed,
                    [styles.hasSubmenu]: hasSubmenu,
                    [styles.isOpen]: isOpen
                })}
                onClick={onClick}
            >
                <div className={styles.iconWrapper}>
                    <Icon className={styles.icon} />
                </div>
                {!collapsed && (
                    <>
                        <span className={styles.label}>{label}</span>
                        <div className={styles.rightContent}>
                            {badge !== undefined && badge > 0 && (
                                <span className={styles.badge}>{badge}</span>
                            )}
                            {hasSubmenu && (
                                <div className={classNames(styles.arrow, { [styles.open]: isOpen })}>
                                    <IoChevronDownOutline />
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
            {!collapsed && isOpen && children && (
                <div className={styles.submenu}>
                    {children}
                </div>
            )}
        </>
    );
};

export const Sidebar: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [openMenus, setOpenMenus] = useState<string[]>(['settings', 'reports']);

    const location = useLocation();
    const navigate = useNavigate();

    const toggleCollapse = () => setCollapsed(!collapsed);

    const toggleMenu = (menuId: string) => {
        setOpenMenus(prev =>
            prev.includes(menuId)
                ? prev.filter(id => id !== menuId)
                : [...prev, menuId]
        );
    };

    const handleItemClick = (id: string, hasSubmenu?: boolean, path?: string) => {
        if (hasSubmenu) {
            toggleMenu(id);
        } else if (path) {
            navigate(path);
        }
    };

    return (
        <aside className={classNames(styles.sidebar, { [styles.collapsed]: collapsed })}>
            <div className={styles.header}>
                <button className={styles.toggleBtn} onClick={toggleCollapse}>
                    {collapsed ? <IoMenuOutline /> : <IoCloseOutline />}
                </button>
            </div>

            <nav className={styles.nav}>
                <SidebarItem
                    id="settings"
                    icon={IoSettingsOutline}
                    label="Настройки"
                    collapsed={collapsed}
                    hasSubmenu
                    isOpen={openMenus.includes('settings')}
                    onClick={() => handleItemClick('settings', true)}
                >
                    <SidebarItem
                        id="settings-1"
                        icon={IoSettingsOutline}
                        label="Настройки"
                        collapsed={collapsed}
                        active={location.pathname === paths.DASHBOARD_SETTINGS}
                        onClick={() => handleItemClick('settings-1', false, paths.DASHBOARD_SETTINGS)}
                    />
                    <SidebarItem
                        id="settings-schedules"
                        icon={IoCalendarOutline}
                        label="Рабочие графики"
                        collapsed={collapsed}
                        active={location.pathname === paths.DASHBOARD_WORK_SCHEDULES}
                        onClick={() => handleItemClick('settings-schedules', false, paths.DASHBOARD_WORK_SCHEDULES)}
                    />
                    <SidebarItem
                        id="settings-org-structure"
                        icon={IoBusinessOutline}
                        label="Структура организации"
                        collapsed={collapsed}
                        active={location.pathname === paths.DASHBOARD_ORG_STRUCTURE}
                        onClick={() => handleItemClick('settings-org-structure', false, paths.DASHBOARD_ORG_STRUCTURE)}
                    />
                </SidebarItem>

                <SidebarItem
                    id="reports"
                    icon={IoDocumentTextOutline}
                    label="Отчеты"
                    collapsed={collapsed}
                    hasSubmenu
                    isOpen={openMenus.includes('reports')}
                    onClick={() => handleItemClick('reports', true)}
                >
                    <SidebarItem
                        id="reports-1"
                            icon={IoDocumentTextOutline}
                            label="Отчеты"
                            collapsed={collapsed}
                            active={location.pathname === paths.DASHBOARD_REPORTS}
                            onClick={() => handleItemClick('reports-1', false, paths.DASHBOARD_REPORTS)}
                        />
                        <SidebarItem
                            id="reports-day-details"
                            icon={IoCalendarOutline}
                            label="Детали дня"
                            collapsed={collapsed}
                            active={location.pathname === paths.DASHBOARD_DAY_DETAILS}
                            onClick={() => handleItemClick('reports-day-details', false, paths.DASHBOARD_DAY_DETAILS)}
                        />
                        <SidebarItem
                            id="reports-employee-rating"
                            icon={IoBarChartOutline}
                            label="Рейтинг сотрудников"
                            collapsed={collapsed}
                            active={location.pathname === paths.DASHBOARD_EMPLOYEE_RATING}
                            onClick={() => handleItemClick('reports-employee-rating', false, paths.DASHBOARD_EMPLOYEE_RATING)}
                        />
                    </SidebarItem>
                </nav>
            </aside>
        );
    };
