import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './CompanyDetailsPage.module.scss';
import { Button } from '@/shared/ui/button/view/Button';
import { Typography } from '@/shared/ui/typoghraphy/view/Typography';
import { IoChevronBackOutline } from 'react-icons/io5';
import { Chip } from '@/shared/ui/chipButton/view/ChipButton';

import { ResetPasswordModal } from '@/features/company-password-reset/view/ResetPasswordModal';
import { ConfirmStatusModal } from '@/features/company-status-update/view/ConfirmStatusModal';
import { useActivateCompany, useBlockCompany, useCompany } from '@/pages/companies/model/useCompany';
import type { CompanyStatus } from '@/pages/companies/types/CompaniesTypes';

export const CompanyDetailsPage = () => {
  const navigate = useNavigate();
  const { companyId } = useParams<{ companyId: string }>();

  const parsedCompanyId = Number(companyId);

  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<{ id: number; email: string } | null>(null);

  const { data: company, isLoading, isError, error } = useCompany(parsedCompanyId);
  const blockCompanyMutation = useBlockCompany();
  const activateCompanyMutation = useActivateCompany();

  const admins = useMemo(() => {
    return [
      {
        id: 'admin-1',
        fio: '—',
        login: company?.email ?? '—',
        passwordRaw: '—',
      },
    ];
  }, [company]);

  const handleConfirmStatus = async () => {
    if (!company) return;

    try {
      if (company.status === 'ACTIVE') {
        await blockCompanyMutation.mutateAsync(company.id);
      } else {
        await activateCompanyMutation.mutateAsync(company.id);
      }

      setStatusModalOpen(false);
    } catch (e) {
      console.error('Не удалось изменить статус компании', e);
      alert('Не удалось изменить статус компании');
    }
  };

  const getStatusLabel = (status: CompanyStatus) => {
    return status === 'ACTIVE' ? 'Active' : 'Suspended';
  };

  const getStatusTone = (status: CompanyStatus) => {
    return status === 'ACTIVE' ? 'green' : 'red';
  };

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <div className={styles.emptyState}>Загрузка...</div>
        </div>
      </div>
    );
  }

  if (isError || !company) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <Button
            variant="ghost"
            leftIcon={<IoChevronBackOutline />}
            onClick={() => navigate(-1)}
            className={styles.backBtn}
          >
            <Typography variant="h3">Назад</Typography>
          </Button>
        </div>

        <div className={styles.card}>
          <div className={styles.emptyState}>
            Ошибка загрузки компании
            {error instanceof Error ? `: ${error.message}` : ''}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Button
          variant="ghost"
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
            tone={getStatusTone(company.status)}
            className={styles.statusBadge}
            onClick={(e) => {
              e.stopPropagation();
              setStatusModalOpen(true);
            }}
          >
            {getStatusLabel(company.status)}
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
              {admins.map((admin) => (
                <tr key={admin.id}>
                  <td>{admin.fio}</td>
                  <td>{admin.login}</td>
                  <td>{admin.passwordRaw}</td>
                  <td className={styles.alignRight}>
                    <Button
                      variant="primary"
                      size="large"
                      onClick={() => {
                        setSelectedAdmin({ id: parsedCompanyId, email: admin.login });
                        setResetModalOpen(true);
                      }}
                    >
                      Сбросить пароль
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ResetPasswordModal
        open={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        userId={selectedAdmin?.id ?? null}
        email={selectedAdmin?.email ?? ''}
      />

      <ConfirmStatusModal
        open={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        onConfirm={handleConfirmStatus}
        status={company.status}
      />
    </div>
  );
};