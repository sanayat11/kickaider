import { useState, useEffect } from 'react';
import { Button } from '@/shared/ui/button/view/Button';
import { SelectDropdown } from '@/shared/ui/selectDropdown/view/selectDropdown';
import { settingsMockApi } from '@/shared/api/mock/settings.mock';
import type { GeneralSettings } from '@/shared/api/mock/settings.mock';
import { useTranslation } from 'react-i18next';
import styles from './Tabs.module.scss';
import type { FC } from 'react';
import { Typography } from '@/shared/ui';

export const SettingsTab: FC = () => {
  const { i18n } = useTranslation();
  const [settings, setSettings] = useState<GeneralSettings>({
    timezone: 'Europe/Moscow',
    language: 'ru',
    idleThreshold: 10,
    lateTolerance: 5,
  });

  useEffect(() => {
    settingsMockApi.getGeneralSettings().then(setSettings);
  }, []);

  const handleSave = async () => {
    try {
      await settingsMockApi.saveGeneralSettings(settings);
      if (settings.language !== i18n.language) {
        await i18n.changeLanguage(settings.language);
      }
      alert('Настройки сохранены');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className={styles.tabWrapper}>
      <div className={styles.grid2}>
        <div className={styles.formGroup}>
          <Typography variant='h4' className={styles.label}>Часовой пояс компании</Typography>
          <SelectDropdown
            value={settings.timezone}
            onChange={v => setSettings(p => ({ ...p, timezone: v as string }))}
            options={[
              { label: 'Europe/Moscow', value: 'Europe/Moscow' },
              { label: 'Asia/Bishkek', value: 'Asia/Bishkek' },
              { label: 'Europe/Berlin', value: 'Europe/Berlin' },
              { label: 'America/New_York', value: 'America/New_York' },
            ]}
          />
        </div>

        <div className={styles.formGroup}>
          <Typography variant='h4' className={styles.label}>Язык интерфейса</Typography>
          <SelectDropdown
            value={settings.language}
            onChange={v => setSettings(p => ({ ...p, language: v as 'ru' | 'en' }))}
            options={[
              { label: 'Русский', value: 'ru' },
              { label: 'English', value: 'en' },
            ]}
          />
        </div>

        <div className={styles.formGroup}>
          <Typography variant='h4' className={styles.label}>Порог бездействия (сек)</Typography>
          <SelectDropdown
            value={String(settings.idleThreshold)}
            onChange={v => setSettings(p => ({ ...p, idleThreshold: Number(v) }))}
            options={[
              { label: '5', value: '5' },
              { label: '10', value: '10' },
              { label: '15', value: '15' },
              { label: '30', value: '30' },
              { label: '60', value: '60' },
            ]}
          />
        </div>

        <div className={styles.formGroup}>
          <Typography variant='h4' className={styles.label}>Допуск опозданий (мин)</Typography>
          <SelectDropdown
            value={String(settings.lateTolerance)}
            onChange={v => setSettings(p => ({ ...p, lateTolerance: Number(v) }))}
            options={[
              { label: '0', value: '0' },
              { label: '5', value: '5' },
              { label: '10', value: '10' },
              { label: '15', value: '15' },
              { label: '30', value: '30' },
            ]}
          />
        </div>
      </div>

      <div className={styles.saveBtnWrap}>
        <Button variant="primary" size='large' fullWidth className={styles.saveBtn} onClick={handleSave}>Сохранить</Button>
      </div>
    </div>
  );
};
