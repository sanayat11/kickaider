import React, { useState } from 'react';
import classNames from 'classnames';
import {
    IoSettingsOutline,
    IoDocumentTextOutline,
    IoChevronDownOutline,
    IoMenuOutline,
    IoCloseOutline
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
    const [activeId, setActiveId] = useState('settings-1');
    const [openMenus, setOpenMenus] = useState<string[]>(['settings']);

    const toggleCollapse = () => setCollapsed(!collapsed);

    const toggleMenu = (menuId: string) => {
        setOpenMenus(prev =>
            prev.includes(menuId)
                ? prev.filter(id => id !== menuId)
                : [...prev, menuId]
        );
    };

    const handleItemClick = (id: string, hasSubmenu?: boolean) => {
        if (hasSubmenu) {
            toggleMenu(id);
        } else {
            setActiveId(id);
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
                        active={activeId === 'settings-1'}
                        onClick={() => handleItemClick('settings-1')}
                    />
                    <SidebarItem
                        id="settings-2"
                        icon={IoSettingsOutline}
                        label="Настройки"
                        collapsed={collapsed}
                        badge={99}
                        active={activeId === 'settings-2'}
                        onClick={() => handleItemClick('settings-2')}
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
                        active={activeId === 'reports-1'}
                        onClick={() => handleItemClick('reports-1')}
                    />
                    <SidebarItem
                        id="reports-2"
                        icon={IoDocumentTextOutline}
                        label="Отчеты"
                        collapsed={collapsed}
                        badge={99}
                        active={activeId === 'reports-2'}
                        onClick={() => handleItemClick('reports-2')}
                    />
                </SidebarItem>
            </nav>
        </aside>
    );
};
