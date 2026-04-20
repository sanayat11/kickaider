import { useState } from 'react';
import { Button } from '@/shared/ui/button/view/Button';
import { TrashIcon } from '@/shared/assets/icons/index';
import { settingsMockApi } from '@/shared/api/mock/settings.mock';
import type { AdminAccount } from '@/shared/api/mock/settings.mock';
import { CreateAccountModal } from '@/features/account-admin-create/view/CreateAccountModal';
import { ChangePasswordModal } from '@/features/account-admin-password-update/view/ChangePasswordModal';
import { ConfirmDeleteModal } from '@/features/account-admin-delete/view/ConfirmDeleteModal';
import styles from './Tabs.module.scss';
import type { FC } from 'react';
import { Checkbox } from '@/shared/ui/checkbox/view/CheckBox';

const ACCOUNTS_STORAGE_KEY = 'kickaider:adminAccounts';

const getStoredAccounts = (): AdminAccount[] => {
  const stored = localStorage.getItem(ACCOUNTS_STORAGE_KEY);

  if (stored) {
    return JSON.parse(stored) as AdminAccount[];
  }

  return [
    {
      id: 'admin-1',
      login: 'admin',
      password: 'admin',
      createdAt: new Date().toISOString(),
    },
  ];
};

export const AccountsTab: FC = () => {
  const [accounts, setAccounts] = useState<AdminAccount[]>(() => getStoredAccounts());
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [changePwdModalOpen, setChangePwdModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const loadAccounts = () => {
    setAccounts(getStoredAccounts());
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === accounts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(accounts.map(a => a.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleDelete = async () => {
    try {
      for (const id of selectedIds) {
        await settingsMockApi.deleteAdminAccount(id);
      }
      setSelectedIds([]);
      setDeleteModalOpen(false);
      loadAccounts();
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreate = async (data: Omit<AdminAccount, 'id' | 'createdAt'>) => {
    try {
      await settingsMockApi.createAdminAccount(data);
      loadAccounts();
    } catch (e) {
      console.error(e);
    }
  };

  const openChangePassword = (id: string) => {
    console.warn('Change password is mocked for account', id);
    setChangePwdModalOpen(true);
  };

  return (
    <div className={styles.tabWrapper}>
      <div className={styles.headerRow}>
        <h2 className={styles.title} style={{ color: '#1a1f4d' }}>Учетные записи</h2>
        <div className={styles.actions}>
          <Button variant="primary" onClick={() => setCreateModalOpen(true)}>Создать аккаунт</Button>
          <button 
            className={styles.dangerOutlineBtn} 
            onClick={() => setDeleteModalOpen(true)}
          >
            <TrashIcon className={styles.trashIcon} />
          </button>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: '40px' }}>
                <div className={styles.checkboxContainer}>
                  <Checkbox 
                    checked={accounts.length > 0 && selectedIds.length === accounts.length} 
                    onChange={toggleSelectAll} 
                  />
                </div>
              </th>
              <th>Логин</th>
              <th>Дата создания</th>
              <th style={{ textAlign: 'right' }}>Действие</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map(acc => (
              <tr key={acc.id}>
                <td>
                  <div className={styles.checkboxContainer}>
                    <Checkbox 
                      checked={selectedIds.includes(acc.id)} 
                      onChange={() => toggleSelect(acc.id)} 
                    />
                  </div>
                </td>
                <td>
                  <span style={{ color: '#4e5bd9', fontWeight: 500 }}>{acc.login || `DESKTOP-${acc.id.toUpperCase()}`}</span>
                </td>
                <td>{new Date(acc.createdAt).toLocaleDateString('ru-RU')}</td>
                <td style={{ textAlign: 'right' }}>
                  <Button variant="primary" size='medium' onClick={() => openChangePassword(acc.id)}>Изменить пароль</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CreateAccountModal 
        open={createModalOpen} 
        onClose={() => setCreateModalOpen(false)} 
        onSubmit={handleCreate} 
      />

      <ChangePasswordModal 
        open={changePwdModalOpen} 
        onClose={() => setChangePwdModalOpen(false)} 
        onSubmit={() => {
          setChangePwdModalOpen(false);
        }} 
      />

      <ConfirmDeleteModal 
        open={deleteModalOpen} 
        onClose={() => setDeleteModalOpen(false)} 
        onConfirm={handleDelete} 
      />
    </div>
  );
};
