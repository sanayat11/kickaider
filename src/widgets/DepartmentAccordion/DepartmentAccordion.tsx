import { type FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { IoChevronDownOutline } from 'react-icons/io5';
import { Typography } from '@/shared/ui/typoghraphy/view/Typography';
import { Button } from '@/shared/ui/button/view/Button';
import { TrashSimpleIcon } from '@/shared/assets/icons';
import { EmployeesTable } from '../EmployeesTable/EmployeesTable';
import type { Department, Employee } from '../../pages/orgStructurePage/model/types';
import styles from './DepartmentAccordion.module.scss';

interface DepartmentAccordionProps {
  department: Department;
  defaultExpanded?: boolean;
  onDeleteDept: (id: string) => void;
  onEditEmployee: (emp: Employee, deptId: string) => void;
  onDeleteEmployee: (empId: string, deptId: string) => void;
}

export const DepartmentAccordion: FC<DepartmentAccordionProps> = ({
  department,
  defaultExpanded = false,
  onDeleteDept,
  onEditEmployee,
  onDeleteEmployee,
}) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={classNames(styles.root, { [styles.expanded]: isExpanded })}>
      <div className={styles.header}>
        <div className={styles.info} onClick={() => setIsExpanded(!isExpanded)}>
          <div className={styles.titleGroup}>
            <Typography variant="h5" weight="bold" className={styles.title}>
              {department.name.toUpperCase()} | {department.employees.length}{' '}
              {t('settings.organization.employees.ppl')} |
            </Typography>
          </div>

          <div className={styles.tableHeaders}>
            <Typography variant="h5" weight="bold" className={styles.colTitle}>
              {t('settings.organization.employees.table.position')}
            </Typography>
            <Typography variant="h5" weight="bold" className={styles.colTitle}>
              {t('settings.organization.employees.table.actions')}
            </Typography>
          </div>
        </div>

        <div className={styles.actions}>
          <Button
            variant="ghost"
            size="small"
            iconOnly
            leftIcon={<TrashSimpleIcon className={styles.deptIcon} />}
            onClick={() => onDeleteDept(department.id)}
            className={styles.deptAction}
          />
          <IoChevronDownOutline
            className={styles.arrow}
            onClick={() => setIsExpanded(!isExpanded)}
          />
        </div>
      </div>

      {isExpanded && (
        <div className={styles.body}>
          {department.employees.length === 0 ? (
            <div className={styles.empty}>
              <Typography variant="h5" color="secondary">
                {t('settings.organization.employees.emptyDept')}
              </Typography>
            </div>
          ) : (
            <EmployeesTable
              employees={department.employees}
              onEdit={(emp) => onEditEmployee(emp, department.id)}
              onDelete={(empId) => onDeleteEmployee(empId, department.id)}
              hideHeader
            />
          )}
        </div>
      )}
    </div>
  );
};