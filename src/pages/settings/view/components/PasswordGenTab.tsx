import { useState } from 'react';
import { Button } from '@/shared/ui/button/view/Button';
import { BaseInput } from '@/shared/ui/input/view/BaseInput';
import { IoSearchOutline } from 'react-icons/io5';
import { GeneratePasswordModal } from '@/features/agent-password-generate/view/GeneratePasswordModal';
import styles from './Tabs.module.scss';
import type { FC } from 'react';

export const PasswordGenTab: FC = () => {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className={styles.tabWrapper}>
      <div className={styles.headerRow}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <h2 className={styles.title} style={{ color: '#4e5bd9' }}>Генерация пароля для остановки агента</h2>
          <span style={{ fontSize: '13px', color: '#8a91b4' }}>Создайте одноразовый пароль для остановки агента</span>
        </div>
      </div>

      <div className={styles.searchWrap}>
        <BaseInput 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
          placeholder="Поиск отдела или сотрудника"
          icon={<IoSearchOutline />}
        />
      </div>

      <div className={styles.saveBtnWrap} style={{ width: '280px' }}>
        <Button variant="primary" fullWidth onClick={() => setModalOpen(true)}>Сгенерировать пароль</Button>
      </div>

      <GeneratePasswordModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};
