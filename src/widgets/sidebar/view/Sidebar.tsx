import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
    IoBarChartOutline,
    IoTimeOutline,
    IoLogOutOutline,
} from 'react-icons/io5';
import logoUrl from '@/shared/assets/images/logo.svg';
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
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();

    const [collapsed, setCollapsed] = useState(false);
    const [openMenus, setOpenMenus] = useState<string[]>(() => {
        const initial: string[] = [];
        
        // Auto-open menus if the current route is within them
        if (location.pathname.startsWith(paths.SETTINGS) ||
            location.pathname.startsWith(paths.DASHBOARD_WORK_SCHEDULES) ||
            location.pathname.startsWith(paths.DASHBOARD_ORG_STRUCTURE) ||
            location.pathname.startsWith(paths.CATEGORIZATION) ||
            location.pathname.startsWith(paths.CALENDAR)) {
            initial.push('settings');
        }
        
        if (location.pathname.startsWith(paths.DASHBOARD_REPORTS) ||
            location.pathname.startsWith(paths.DASHBOARD_DAY_DETAILS) ||
            location.pathname.startsWith(paths.DASHBOARD_EMPLOYEE_RATING) ||
            location.pathname.startsWith(paths.WORK_TIME) ||
            location.pathname.startsWith(paths.ACTIVITY)) {
            initial.push('reports');
        }

        return initial;
    });

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
                {!collapsed && (
                    <div className={styles.brand}>
                        <img src={logoUrl} alt="KickAider Logo" className={styles.logo} />
                        <span className={styles.brandName}>KickAider</span>
                    </div>
                )}
                <button className={styles.toggleBtn} onClick={toggleCollapse}>
                    {collapsed ? <IoMenuOutline /> : <IoCloseOutline />}
                </button>
            </div>

            <nav className={styles.nav}>
                <SidebarItem
                    id="settings"
                    icon={IoSettingsOutline}
                    label={t('sidebar.settings')}
                    collapsed={collapsed}
                    hasSubmenu
                    isOpen={openMenus.includes('settings')}
                    onClick={() => handleItemClick('settings', true)}
                >

                    <SidebarItem
                        id="settings-schedules"
                        icon={IoCalendarOutline}
                        label={t('sidebar.workSchedules')}
                        collapsed={collapsed}
                        active={location.pathname === paths.DASHBOARD_WORK_SCHEDULES}
                        onClick={() => handleItemClick('settings-schedules', false, paths.DASHBOARD_WORK_SCHEDULES)}
                    />
                    <SidebarItem
                        id="settings-org-structure"
                        icon={IoBusinessOutline}
                        label={t('sidebar.orgStructure')}
                        collapsed={collapsed}
                        active={location.pathname === paths.DASHBOARD_ORG_STRUCTURE}
                        onClick={() => handleItemClick('settings-org-structure', false, paths.DASHBOARD_ORG_STRUCTURE)}
                    />
                    <SidebarItem
                        id="settings-categorization"
                        icon={IoTimeOutline}
                        label={t('sidebar.categorization')}
                        collapsed={collapsed}
                        active={location.pathname === paths.CATEGORIZATION}
                        onClick={() => handleItemClick('settings-categorization', false, paths.CATEGORIZATION)}
                    />
                    <SidebarItem
                        id="settings-calendar"
                        icon={IoCalendarOutline}
                        label={t('sidebar.calendar')}
                        collapsed={collapsed}
                        active={location.pathname.startsWith(paths.CALENDAR)}
                        onClick={() => handleItemClick('settings-calendar', false, paths.CALENDAR)}
                    />
                    <SidebarItem
                        id="settings-general"
                        icon={IoSettingsOutline}
                        label={t('nav.settings.general')}
                        collapsed={collapsed}
                        active={location.pathname === paths.SETTINGS}
                        onClick={() => handleItemClick('settings-general', false, paths.SETTINGS)}
                    />
                </SidebarItem>

                <SidebarItem
                    id="reports"
                    icon={IoDocumentTextOutline}
                    label={t('sidebar.reports')}
                    collapsed={collapsed}
                    hasSubmenu
                    isOpen={openMenus.includes('reports')}
                    onClick={() => handleItemClick('reports', true)}
                >
                    <SidebarItem
                        id="reports-1"
                        icon={IoDocumentTextOutline}
                        label={t('sidebar.reports')}
                        collapsed={collapsed}
                        active={location.pathname === paths.DASHBOARD_REPORTS}
                        onClick={() => handleItemClick('reports-1', false, paths.DASHBOARD_REPORTS)}
                    />
                    <SidebarItem
                        id="reports-day-details"
                        icon={IoCalendarOutline}
                        label={t('sidebar.dayDetails')}
                        collapsed={collapsed}
                        active={location.pathname === paths.DASHBOARD_DAY_DETAILS}
                        onClick={() => handleItemClick('reports-day-details', false, paths.DASHBOARD_DAY_DETAILS)}
                    />
                    <SidebarItem
                        id="reports-employee-rating"
                        icon={IoBarChartOutline}
                        label={t('sidebar.employeeRating')}
                        collapsed={collapsed}
                        active={location.pathname === paths.DASHBOARD_EMPLOYEE_RATING}
                        onClick={() => handleItemClick('reports-employee-rating', false, paths.DASHBOARD_EMPLOYEE_RATING)}
                    />
                    <SidebarItem
                        id="reports-work-time"
                        icon={IoDocumentTextOutline}
                        label={t('sidebar.workTime')}
                        collapsed={collapsed}
                        active={location.pathname === paths.WORK_TIME}
                        onClick={() => handleItemClick('reports-work-time', false, paths.WORK_TIME)}
                    />
                    <SidebarItem
                        id="reports-activity"
                        icon={IoTimeOutline}
                        label={t('nav.reports.activity')}
                        collapsed={collapsed}
                        active={location.pathname.startsWith(paths.ACTIVITY)}
                        onClick={() => handleItemClick('reports-activity', false, paths.ACTIVITY)}
                    />
                </SidebarItem>
            </nav>

            <div className={styles.footer}>
                <div 
                    className={classNames(styles.logoutBtn, { [styles.collapsed]: collapsed })}
                    onClick={() => navigate('/')}
                >
                    <IoLogOutOutline className={styles.icon} />
                    {!collapsed && <span>{t('sidebar.logout', 'Выйти')}</span>}
                </div>
            </div>
        </aside>
    );
};
