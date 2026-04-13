import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CompanyDetailsPage.module.scss';
import { Button } from '@/shared/ui/button/view/Button';
import { Typography } from '@/shared/ui/typoghraphy/view/Typography';
import { IoChevronBackOutline } from 'react-icons/io5';
import { Chip } from '@/shared/ui/chipButton/view/ChipButton';

import { ResetPasswordModal } from '@/features/company-password-reset/view/ResetPasswordModal';
import { ConfirmStatusModal } from '@/features/company-status-update/view/ConfirmStatusModal';

const MOCK_COMPANY = {
  id: '1',
  name: 'ОсОО "Компания 123"',
  status: 'Suspended', 
  admins: [
    { id: 'admin1', fio: 'Бектемирова Аяна итд', login: 'Санаят /nicenice', passwordRaw: 'Санаят /nicenice' }
  ]
};

export const CompanyDetailsPage = () => {
  const navigate = useNavigate();
  const [company, setCompany] = useState(MOCK_COMPANY);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const cycleStatus = () => {
    setCompany(prev => ({...prev, status: prev.status === 'Active' ? 'Suspended' : 'Active'}));
    setStatusModalOpen(false);
  };

  return (
    <div className={styles.page}> 
      <div className={styles.header}>
        <Button
          variant='ghost'
          leftIcon={<IoChevronBackOutline />}
          onClick={() => navigate(-1)}
          className={styles.backBtn}
        >
          <Typography variant="h3">Назад</Typography>
        </Button>
      </div>

      <div className={styles.card}>
        <div className={styles.companyTitleRow}>
          <div className={styles.title}>{company.name}</div>
          <Chip 
            tone={company.status === 'Active' ? 'green' : 'red'}
            className={styles.statusBadge}
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              setStatusModalOpen(true);
            }}
          >
            {company.status}
          </Chip>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ADMIN(ФИО)</th>
                <th>Логин</th>
                <th>Пароль</th>
                <th className={styles.alignRight}>Действие</th>
              </tr>
            </thead>
            <tbody>
              {company.admins.map(admin => (
                <tr key={admin.id}>
                  <td>{admin.fio}</td>
                  <td>{admin.login}</td>
                  <td>{admin.passwordRaw}</td>
                  <td className={styles.alignRight}>
                    <Button variant="primary" size="large" onClick={() => setResetModalOpen(true)}>
                      Сбросить пароль
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ResetPasswordModal open={resetModalOpen} onClose={() => setResetModalOpen(false)} />
      <ConfirmStatusModal 
        open={statusModalOpen} 
        onClose={() => setStatusModalOpen(false)} 
        onConfirm={cycleStatus}
        status={company.status} 
      />
    </div>
  );
};
