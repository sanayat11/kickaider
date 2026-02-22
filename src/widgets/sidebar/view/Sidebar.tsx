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
    IoTimeOutline,
    IoCalendarOutline
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
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();

    const [collapsed, setCollapsed] = useState(false);
    const [openMenus, setOpenMenus] = useState<string[]>(() => {
        const initial = ['settings', 'reports'];
        if (location.pathname === paths.ACTIVITY) {
            if (!initial.includes('reports')) initial.push('reports');
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
                        id="settings-1"
                        icon={IoSettingsOutline}
                        label={t('sidebar.settings')}
                        collapsed={collapsed}
                        active={location.pathname === paths.DASHBOARD_SETTINGS}
                        onClick={() => handleItemClick('settings-1', false, paths.DASHBOARD_SETTINGS)}
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
        </aside>
    );
};
