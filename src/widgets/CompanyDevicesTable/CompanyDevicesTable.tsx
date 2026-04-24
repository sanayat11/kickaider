import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@/shared/ui/typoghraphy/view/Typography';
import { Button } from '@/shared/ui/button/view/Button';
import type { DeviceApiItem } from '../../pages/orgStructurePage/model/types';
import styles from './CompanyDevicesTable.module.scss';

interface CompanyDevicesTableProps {
  devices: DeviceApiItem[];
  employeeMap: Map<number, string>;
  onApprove: (device: DeviceApiItem) => void;
  onBlock: (device: DeviceApiItem) => void;
  onUnblock: (device: DeviceApiItem) => void;
  onEditAlias: (device: DeviceApiItem) => void;
}

const STATUS_LABELS: Record<DeviceApiItem['status'], string> = {
  PENDING: 'Ожидает',
  ALLOWED: 'Разрешён',
  BLOCKED: 'Заблокирован',
};

const STATUS_CLASS: Record<DeviceApiItem['status'], string> = {
  PENDING: styles.pending,
  ALLOWED: styles.allowed,
  BLOCKED: styles.blocked,
};

const formatDate = (value?: string | null) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('ru-RU');
};

export const CompanyDevicesTable: FC<CompanyDevicesTableProps> = ({
  devices,
  employeeMap,
  onApprove,
  onBlock,
  onUnblock,
  onEditAlias,
}) => {
  const { t } = useTranslation();

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>
            <Typography variant="h5" className={styles.headerText}>
              {t('devices.management.table.device', { defaultValue: 'Устройство' })}
            </Typography>
          </th>
          <th>
            <Typography variant="h5" className={styles.headerText}>
              {t('devices.management.table.status', { defaultValue: 'Статус' })}
            </Typography>
          </th>
          <th>
            <Typography variant="h5" className={styles.headerText}>
              {t('devices.management.table.employee', { defaultValue: 'Сотрудник' })}
            </Typography>
          </th>
          <th>
            <Typography variant="h5" className={styles.headerText}>
              {t('devices.management.table.os', { defaultValue: 'ОС' })}
            </Typography>
          </th>
          <th>
            <Typography variant="h5" className={styles.headerText}>
              {t('devices.management.table.lastSeen', { defaultValue: 'Последняя активность' })}
            </Typography>
          </th>
          <th className={styles.actionsCol}>
            <Typography variant="h5" className={styles.headerText}>
              {t('devices.management.table.actions', { defaultValue: 'Действия' })}
            </Typography>
          </th>
        </tr>
      </thead>

      <tbody>
        {devices.length === 0 ? (
          <tr className={styles.emptyRow}>
            <td colSpan={6}>
              <Typography variant="h5" color="secondary">
                {t('devices.management.empty', { defaultValue: 'Устройства не найдены' })}
              </Typography>
            </td>
          </tr>
        ) : (
          devices.map((device) => (
            <tr key={device.id}>
              <td>
                <div className={styles.deviceCell}>
                  <Typography variant="h5" className={styles.deviceName}>
                    {device.hostname || device.deviceName || `Device #${device.id}`}
                  </Typography>
                  {device.deviceName && device.hostname && device.deviceName !== device.hostname && (
                    <Typography variant="h5" className={styles.aliasText}>
                      {device.deviceName}
                    </Typography>
                  )}
                </div>
              </td>
              <td>
                <span className={`${styles.badge} ${STATUS_CLASS[device.status]}`}>
                  <span className={styles.badgeDot} />
                  {STATUS_LABELS[device.status]}
                </span>
              </td>
              <td>
                <Typography variant="h5" className={styles.metaText}>
                  {device.employeeId ? (employeeMap.get(device.employeeId) ?? `ID ${device.employeeId}`) : '—'}
                </Typography>
              </td>
              <td>
                <Typography variant="h5" className={styles.metaText}>
                  {device.osName || '—'}
                </Typography>
              </td>
              <td>
                <Typography variant="h5" className={styles.metaText}>
                  {formatDate(device.lastSeenAt)}
                </Typography>
              </td>
              <td className={styles.actionsCol}>
                <div className={styles.actions}>
                  <Button variant="outline" size="small" onClick={() => onEditAlias(device)}>
                    {t('devices.management.aliasBtn', { defaultValue: 'Переименовать' })}
                  </Button>

                  {device.status === 'PENDING' && (
                    <Button variant="primary" size="small" onClick={() => onApprove(device)}>
                      {t('devices.management.approveBtn', { defaultValue: 'Разрешить' })}
                    </Button>
                  )}

                  {device.status !== 'BLOCKED' && (
                    <Button variant="outline" size="small" tone="red" onClick={() => onBlock(device)}>
                      {t('devices.management.blockBtn', { defaultValue: 'Блокировать' })}
                    </Button>
                  )}

                  {device.status === 'BLOCKED' && (
                    <Button variant="primary" size="small" onClick={() => onUnblock(device)}>
                      {t('devices.management.unblockBtn', { defaultValue: 'Разблокировать' })}
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

