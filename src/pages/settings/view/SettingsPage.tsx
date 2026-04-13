import React, { useState } from 'react';
import styles from './SettingsPage.module.scss';
import tabsStyles from './components/Tabs.module.scss';
import { SettingsTab } from './components/SettingsTab';
import { AccountsTab } from './components/AccountsTab';
import { PasswordGenTab } from './components/PasswordGenTab';
import { SegmentedControl } from '@/shared/ui/segmentedControl/view/SegmentedControl';

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'settings' | 'accounts' | 'password'>('settings');

  return (
    <div className={styles.page}>
      <div className={tabsStyles.pageHeader}>
        <h1 className={tabsStyles.pageTitle}>Общие настройки и учетные записи</h1>
        <div className={tabsStyles.pageSubtitle}>Настройка времени работы, обедов и выходных дней.</div>
      </div>

      <div className={tabsStyles.card}>
        <div style={{ marginBottom: '24px' }}>
          <SegmentedControl
            value={activeTab}
            onChange={(val) => setActiveTab(val as any)}
            options={[
              { label: 'Настройки', value: 'settings' },
              { label: 'Учетные записи', value: 'accounts' },
              { label: 'Генерация пароля', value: 'password' },
            ]}
          />
        </div>

        <div className={styles.tabContent}>
          {activeTab === 'settings' && <SettingsTab />}
          {activeTab === 'accounts' && <AccountsTab />}
          {activeTab === 'password' && <PasswordGenTab />}
        </div>
      </div>
    </div>
  );
};