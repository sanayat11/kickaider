import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
// import { IoTrashOutline } from 'react-icons/io5';
import {TrashIcon} from '@/shared/assets/icons/index'
import {EditIcon} from '@/shared/assets/icons/IconEdit'
import { Avatar } from '@/shared/ui/avatar/view/Avatar';
import { Typography } from '@/shared/ui/typoghraphy/view/Typography';
import { Button } from '@/shared/ui/button/view/Button';
import type { Employee } from '../../pages/orgStructurePage/model/types';
import styles from './EmployeesTable.module.scss';

interface EmployeesTableProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (id: string) => void;
  hideHeader?: boolean;
}

export const EmployeesTable: FC<EmployeesTableProps> = ({ 
  employees, 
  onEdit, 
  onDelete,
  hideHeader = false 
}) => {
  const { t } = useTranslation();

  return (
    <table className={styles.table}>
      {!hideHeader && (
        <thead>
          <tr>
            <th className={styles.nameCol}>
              <Typography variant="h5" weight="bold">
                {t('settings.organization.employees.table.fullName')}
              </Typography>
            </th>
            <th className={styles.posCol}>
              <Typography variant="h5" weight="bold">
                {t('settings.organization.employees.table.position')}
              </Typography>
            </th>
            <th className={styles.actionsCol}>
              <Typography variant="h5" weight="bold">
                {t('settings.organization.employees.table.actions')}
              </Typography>
            </th>
          </tr>
        </thead>
      )}
      <tbody>
        {employees.map((emp) => (
          <tr key={emp.id}>
            <td className={styles.nameCol}>
              <div className={styles.nameCell}>
                <Avatar
                  initials={emp.name.substring(0, 2).toUpperCase()}
                  size="sm"
                  className={styles.avatar}
                />
                <Typography variant="h5" weight="bold" className={styles.nameText}>
                  {emp.name}
                </Typography>
              </div>
            </td>
            <td className={styles.posCol}>
              <Typography variant="h5" className={styles.posText}>
                {emp.position}
              </Typography>
            </td>
            <td className={styles.actionsCol}>
              <div className={styles.actions}>
                <Button
                  variant='iconGhost'
                  iconOnly
                  leftIcon={<EditIcon color='#5B67F3' className={styles.editIcon} />}
                  onClick={() => onEdit(emp)}
                  className={styles.editBtn}
                />
                <Button
                  variant="ghost"
                  tone="red"
                  size="small"
                  iconOnly
                  leftIcon={<TrashIcon className={styles.trashIcon}/>}
                  onClick={() => onDelete(emp.id)}
                  className={styles.deleteBtn}
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
