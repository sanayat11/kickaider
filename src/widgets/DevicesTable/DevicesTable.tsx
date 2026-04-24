import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@/shared/ui/typoghraphy/view/Typography';
import { Button } from '@/shared/ui/button/view/Button';
import type { DeviceApiItem } from '../../pages/orgStructurePage/model/types';
import styles from './DevicesTable.module.scss';

interface DevicesTableProps {
  devices: DeviceApiItem[];
  onApprove: (device: DeviceApiItem) => void;
}

const formatLastSeen = (value?: string | null) => {
  if (!value) return '-';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';

  return date.toLocaleString('ru-RU');
};

export const DevicesTable: FC<DevicesTableProps> = ({ devices, onApprove }) => {
  const { t } = useTranslation();

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>
            <Typography variant="h5" weight="bold" className={styles.headerText}>
              {t('settings.organization.devices.table.pending', {
                defaultValue: 'Ожидают подтверждения',
              })}
            </Typography>
          </th>
          <th>
            <Typography variant="h5" weight="bold" className={styles.headerText}>
              {t('settings.organization.devices.table.activity', {
                defaultValue: 'Последняя активность',
              })}
            </Typography>
          </th>
          <th className={styles.actionsCol}>
            <Typography variant="h5" weight="bold" className={styles.headerText}>
              {t('settings.organization.devices.table.action', {
                defaultValue: 'Действие',
              })}
            </Typography>
          </th>
        </tr>
      </thead>

      <tbody>
        {devices.length === 0 ? (
          <tr>
            <td colSpan={3}>
              <Typography variant="h5" color="secondary" className={styles.hostname}>
                {t('settings.organization.devices.empty', {
                  defaultValue: 'Нет ожидающих устройств',
                })}
              </Typography>
            </td>
          </tr>
        ) : (
          devices.map((device) => (
            <tr key={device.id}>
              <td>
                <div>
                  <Typography variant="h5" color="secondary" className={styles.hostname}>
                    {device.hostname || device.deviceName || `Device #${device.id}`}
                  </Typography>
                  {device.deviceName &&
                    device.hostname &&
                    device.deviceName !== device.hostname && (
                      <Typography variant="h5" color="secondary" className={styles.lastSeen}>
                        {device.deviceName}
                      </Typography>
                    )}
                </div>
              </td>
              <td>
                <Typography variant="h5" color="secondary" className={styles.lastSeen}>
                  {formatLastSeen(device.lastSeenAt || device.firstSeenAt)}
                </Typography>
              </td>
              <td className={styles.actionsCol}>
                <Button
                  variant="primary"
                  size="medium"
                  onClick={() => onApprove(device)}
                  className={styles.assignBtn}
                >
                  {t('settings.organization.devices.approveBtn', {
                    defaultValue: 'Подтвердить',
                  })}
                </Button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};
