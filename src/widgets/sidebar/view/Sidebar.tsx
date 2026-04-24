import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { paths } from '@/shared/constants/constants';
import classNames from 'classnames';
import {
  IoSettingsOutline,
  IoDocumentTextOutline,
  IoChevronDownOutline,
} from 'react-icons/io5';
import logoUrl from '@/shared/assets/images/logo.svg';
import styles from './Sidebar.module.scss';
import { LogOutIcon } from '@/shared/assets/icons';
import { useLogout } from '@/features/auth/loginForm/model/useLogin';
import { useAuthStore } from '@/shared/lib/model/AuthStore';
import { Typography } from '@/shared/ui';

interface SidebarItemProps {
  id: string;
  icon?: React.ElementType;
  label: string;
  active?: boolean;
  hasSubmenu?: boolean;
  isOpen?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  nested?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon: Icon,
  label,
  active,
  hasSubmenu,
  isOpen,
  onClick,
  children,
  nested = false,
}) => {
  return (
    <div className={styles.itemWrapper}>
      <button
        type="button"
        className={classNames(styles.item, {
          [styles.active]: active,
          [styles.hasSubmenu]: hasSubmenu,
          [styles.isOpen]: isOpen,
          [styles.nested]: nested,
          [styles.withoutIcon]: nested || !Icon,
        })}
        onClick={onClick}
      >
        {!nested && Icon && (
          <span className={styles.iconWrapper}>
            <Icon className={styles.icon} />
          </span>
        )}

        <Typography variant="h5" weight="regular" className={styles.label}>
          {label}
        </Typography>

        {hasSubmenu && (
          <span className={classNames(styles.arrow, { [styles.open]: isOpen })}>
            <IoChevronDownOutline />
          </span>
        )}
      </button>

      {isOpen && children && <div className={styles.submenu}>{children}</div>}
    </div>
  );
};

export const Sidebar: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const logoutMutation = useLogout();
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const user = useAuthStore((state) => state.user);

  const role = user?.role;

  const isSuperAdmin = role === 'SUPER_ADMIN';
  const isAdmin = role === 'ADMIN';
  const isOperator = role === 'OPERATOR';

  const canSeeReports = isAdmin || isOperator;
  const canSeeSettings = isOperator;

  const [openMenus, setOpenMenus] = useState<string[]>(() => {
    const initial: string[] = [];

    if (
      canSeeSettings &&
      (
        location.pathname.startsWith(paths.SETTINGS) ||
        location.pathname.startsWith(paths.DASHBOARD_WORK_SCHEDULES) ||
        location.pathname.startsWith(paths.DASHBOARD_ORG_STRUCTURE_BASE) ||
        location.pathname.startsWith(paths.CATEGORIZATION) ||
        location.pathname.startsWith(paths.CALENDAR)
      )
    ) {
      initial.push('settings');
    }

    if (
      canSeeReports &&
      (
        location.pathname.startsWith(paths.DASHBOARD_REPORTS) ||
        location.pathname.startsWith(paths.DASHBOARD_DAY_DETAILS) ||
        location.pathname.startsWith(paths.DASHBOARD_EMPLOYEE_RATING) ||
        location.pathname.startsWith(paths.WORK_TIME) ||
        location.pathname.startsWith(paths.ACTIVITY)
      )
    ) {
      initial.push('reports');
    }

    return initial;
  });

  const toggleMenu = (menuId: string) => {
    setOpenMenus((prev) =>
      prev.includes(menuId) ? prev.filter((id) => id !== menuId) : [...prev, menuId],
    );
  };

  const handleItemClick = (id: string, hasSubmenu?: boolean, path?: string) => {
    if (hasSubmenu) {
      toggleMenu(id);
      return;
    }

    if (path) {
      navigate(path);
    }
  };

  const handleLogout = () => {
    if (!refreshToken) {
      navigate(paths.AUTH, { replace: true });
      return;
    }

    logoutMutation.mutate(
      { refreshToken },
      {
        onSettled: () => {
          navigate(paths.AUTH, { replace: true });
        },
      },
    );
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <button type="button" className={styles.brand} onClick={() => navigate(paths.HOME)}>
          <img src={logoUrl} alt="KickAider Logo" className={styles.logo} />
          <Typography variant="h4" weight="bold" className={styles.brandName}>
            Metricon
          </Typography>
        </button>
      </div>

      <nav className={styles.nav}>
        {isSuperAdmin && (
          <SidebarItem
            id="companies"
            icon={IoDocumentTextOutline}
            label={t('sidebar.companies', 'Список компаний')}
            active={location.pathname.startsWith(paths.COMPANIES)}
            onClick={() => handleItemClick('companies', false, paths.COMPANIES)}
          />
        )}

        {isAdmin && (
          <SidebarItem
            id="create_operator"
            icon={IoDocumentTextOutline}
            label={t('sidebar.createOperator', 'Создать оператора')}
            active={location.pathname.startsWith(paths.CREATE_OPERATOR)}
            onClick={() => handleItemClick('create_operator', false, paths.CREATE_OPERATOR)}
          />
        )}

        {canSeeReports && (
          <SidebarItem
            id="reports"
            icon={IoDocumentTextOutline}
            label={t('sidebar.reports')}
            isOpen={openMenus.includes('reports')}
            onClick={() => handleItemClick('reports', true)}
          >
            <SidebarItem
              id="reports-main"
              label={t('sidebar.reports')}
              nested
              active={location.pathname === paths.DASHBOARD_REPORTS}
              onClick={() => handleItemClick('reports-main', false, paths.DASHBOARD_REPORTS)}
            />
            <SidebarItem
              id="reports-day-details"
              label={t('sidebar.dayDetails')}
              nested
              active={location.pathname === paths.DASHBOARD_DAY_DETAILS}
              onClick={() =>
                handleItemClick('reports-day-details', false, paths.DASHBOARD_DAY_DETAILS)
              }
            />
            <SidebarItem
              id="reports-employee-rating"
              label={t('sidebar.employeeRating')}
              nested
              active={location.pathname === paths.DASHBOARD_EMPLOYEE_RATING}
              onClick={() =>
                handleItemClick(
                  'reports-employee-rating',
                  false,
                  paths.DASHBOARD_EMPLOYEE_RATING,
                )
              }
            />
            <SidebarItem
              id="reports-work-time"
              label={t('sidebar.workTime')}
              nested
              active={location.pathname === paths.WORK_TIME}
              onClick={() => handleItemClick('reports-work-time', false, paths.WORK_TIME)}
            />
            <SidebarItem
              id="reports-activity"
              label={t('nav.reports.activity')}
              nested
              active={location.pathname.startsWith(paths.ACTIVITY)}
              onClick={() => handleItemClick('reports-activity', false, paths.ACTIVITY)}
            />
          </SidebarItem>
        )}

        {canSeeSettings && (
          <SidebarItem
            id="settings"
            icon={IoSettingsOutline}
            label={t('sidebar.settings')}
            isOpen={openMenus.includes('settings')}
            onClick={() => handleItemClick('settings', true)}
          >
            <SidebarItem
              id="settings-calendar"
              label={t('sidebar.calendar')}
              nested
              active={location.pathname.startsWith(paths.CALENDAR)}
              onClick={() => handleItemClick('settings-calendar', false, paths.CALENDAR)}
            />
            <SidebarItem
              id="settings-categorization"
              label={t('sidebar.categorization')}
              nested
              active={location.pathname === paths.CATEGORIZATION}
              onClick={() =>
                handleItemClick('settings-categorization', false, paths.CATEGORIZATION)
              }
            />
            <SidebarItem
              id="settings-schedules"
              label={t('sidebar.workSchedules')}
              nested
              active={location.pathname === paths.DASHBOARD_WORK_SCHEDULES}
              onClick={() =>
                handleItemClick('settings-schedules', false, paths.DASHBOARD_WORK_SCHEDULES)
              }
            />
            <SidebarItem
              id="settings-org-structure"
              label={t('sidebar.orgStructure')}
              nested
              active={location.pathname.startsWith(paths.DASHBOARD_ORG_STRUCTURE_BASE)}
              onClick={() => {
                const companyId = user?.companyId;

                if (!companyId) {
                  console.error('Missing companyId in auth user');
                  return;
                }

                handleItemClick(
                  'settings-org-structure',
                  false,
                  paths.getOrgStructurePath(companyId),
                );
              }}
            />
            <SidebarItem
              id="settings-general"
              label={t('nav.settings.general')}
              nested
              active={location.pathname === paths.SETTINGS}
              onClick={() => handleItemClick('settings-general', false, paths.SETTINGS)}
            />
          </SidebarItem>
        )}
      </nav>

      <div className={styles.footer}>
        <button
          type="button"
          className={styles.logoutBtn}
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
        >
          <span className={styles.logoutIcon}>
            <LogOutIcon />
          </span>
          <Typography variant="body2" className={styles.logoutLabel}>
            {logoutMutation.isPending ? 'Выход...' : t('sidebar.logout', 'Выйти')}
          </Typography>
        </button>
      </div>
    </aside>
  );
};