import type { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { IoSearchOutline, IoAddOutline } from 'react-icons/io5';
import { BaseInput } from '@/shared/ui/input/view/BaseInput';
import { Button } from '@/shared/ui/button/view/Button';
import styles from './EmployeesSection.module.scss';

interface EmployeesSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddDept: () => void;
  children: ReactNode;
}

export const EmployeesSection: FC<EmployeesSectionProps> = ({
  searchQuery,
  onSearchChange,
  onAddDept,
  children,
}) => {
  const { t } = useTranslation();

  return (
    <div className={styles.root}>
      <div className={styles.actionBar}>
        <div className={styles.searchBox}>
          <BaseInput
            type="text"
            placeholder={t('settings.organization.employees.search')}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            icon={<IoSearchOutline />}
          />
        </div>
        <Button
          variant="primary"
          leftIcon={<IoAddOutline size={18} />}
          onClick={onAddDept}
        >
          {t('settings.organization.employees.addDept')}
        </Button>
      </div>

      <div className={styles.list}>
        {children}
      </div>
    </div>
  );
};
