import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { IoPeopleOutline, IoDesktopOutline } from 'react-icons/io5';
import { SegmentedControl } from '@/shared/ui/segmentedControl/view/SegmentedControl';
import type { OrgTab } from '../../pages/orgStructurePage/model/types';
import styles from './OrganizationTabs.module.scss';

interface OrganizationTabsProps {
  activeTab: OrgTab;
  onChange: (tab: OrgTab) => void;
  unassignedCount: number;
}

export const OrganizationTabs: FC<OrganizationTabsProps> = ({ activeTab, onChange, unassignedCount }) => {
  const { t } = useTranslation();

  const options = [
    {
      value: 'employees',
      label: (
        <div className={styles.tabLabel}>
          <IoPeopleOutline size={18} />
          <span>{t('settings.organization.tabs.employees')}</span>
        </div>
      ),
    },
    {
      value: 'devices',
      label: (
        <div className={styles.tabLabel}>
          <IoDesktopOutline size={18} />
          <span>{t('settings.organization.tabs.devices')}</span>
          {unassignedCount > 0 && <span className={styles.badge}>{unassignedCount}</span>}
        </div>
      ),
    },
  ];

  return (
    <div className={styles.root}>
      <SegmentedControl
        options={options}
        value={activeTab}
        size='medium'
        onChange={(val) => onChange(val as OrgTab)}
        className={styles.segmented}
      />
    </div>
  );
};
