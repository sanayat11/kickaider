import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@/shared/ui/typoghraphy/view/Typography';
import { Button } from '@/shared/ui/button/view/Button';
import type { UnassignedDevice } from '../../pages/orgStructurePage/model/types';
import styles from './DevicesTable.module.scss';

interface DevicesTableProps {
  devices: UnassignedDevice[];
  onAssign: (device: UnassignedDevice) => void;
}

export const DevicesTable: FC<DevicesTableProps> = ({ devices, onAssign }) => {
  const { t } = useTranslation();

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>
            <Typography variant="h5" weight="bold" className={styles.headerText}>
              {t('settings.organization.devices.table.pending') || 'Ожидают привязки'}
            </Typography>
          </th>
          <th>
            <Typography variant="h5" weight="bold" className={styles.headerText}>
              {t('settings.organization.devices.table.activity') || 'Последняя активность'}
            </Typography>
          </th>
          <th className={styles.actionsCol}>
            <Typography variant="h5" weight="bold" className={styles.headerText}>
              {t('settings.organization.devices.table.action') || 'Действие'}
            </Typography>
          </th>
        </tr>
      </thead>
      <tbody>
        {devices.map((device) => (
          <tr key={device.id}>
            <td>
              <Typography variant="h5" color="secondary" className={styles.hostname}>
                {device.hostname}
              </Typography>
            </td>
            <td>
              <Typography variant="h5" color="secondary" className={styles.lastSeen}>
                {device.lastSeen}
              </Typography>
            </td>
            <td className={styles.actionsCol}>
              <Button
                variant="primary"
                size="large"
                onClick={() => onAssign(device)}
                className={styles.assignBtn}
              >
                {t('settings.organization.devices.assignBtn')}
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
