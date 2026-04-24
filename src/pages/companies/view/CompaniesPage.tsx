import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CompaniesPage.module.scss';
import { SegmentedControl } from '@/shared/ui/segmentedControl/view/SegmentedControl';
import { BaseInput } from '@/shared/ui/input/view/BaseInput';
import { Button } from '@/shared/ui/button/view/Button';
import { Typography } from '@/shared/ui/typoghraphy/view/Typography';
import { IoSearchOutline } from 'react-icons/io5';
import { paths } from '@/shared/constants/constants';
import { CreateCompanyModal } from '@/features/company-create/view/CreateCompanyModal';
import { Chip } from '@/shared/ui/chipButton/view/ChipButton';
import { SelectDropdown } from '@/shared/ui/selectDropdown/view/SelectDropdown';
import { ConfirmStatusModal } from '@/features/company-status-update/view/ConfirmStatusModal';
import {
  useCompanies,
  useBlockCompany,
  useActivateCompany,
} from '../model/useCompany';
import type { CompanyStatus } from '../types/CompaniesTypes';

const COMPANY_STATUS_OPTIONS = [
  {
    label: <Chip tone="red" isActionable={false}>Suspended</Chip>,
    value: 'SUSPENDED',
  },
  {
    label: <Chip tone="green" isActionable={false}>Active</Chip>,
    value: 'ACTIVE',
  },
];

export const CompaniesPage = () => {
  const navigate = useNavigate();

  const [filter, setFilter] = useState<'all' | 'active' | 'suspended'>('all');
  const [search, setSearch] = useState('');
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);
  const [selectedCompanyStatus, setSelectedCompanyStatus] = useState<CompanyStatus>('ACTIVE');

  const { data: companies = [], isLoading, isError, error } = useCompanies();
  const blockCompanyMutation = useBlockCompany();
  const activateCompanyMutation = useActivateCompany();

  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      const matchesSearch =
        company.name.toLowerCase().includes(search.toLowerCase()) ||
        company.email.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === 'all' ||
        (filter === 'active' && company.status === 'ACTIVE') ||
        (filter === 'suspended' && company.status === 'SUSPENDED');

      return matchesSearch && matchesFilter;
    });
  }, [companies, search, filter]);

  const openStatusModal = (companyId: number, currentStatus: CompanyStatus) => {
    setSelectedCompanyId(companyId);
    setSelectedCompanyStatus(currentStatus);
    setConfirmModalOpen(true);
  };

  const closeStatusModal = () => {
    setConfirmModalOpen(false);
    setSelectedCompanyId(null);
    setSelectedCompanyStatus('ACTIVE');
  };

  const handleConfirmStatus = async () => {
    if (!selectedCompanyId) return;

    try {
      if (selectedCompanyStatus === 'ACTIVE') {
        await blockCompanyMutation.mutateAsync(selectedCompanyId);
      } else {
        await activateCompanyMutation.mutateAsync(selectedCompanyId);
      }

      closeStatusModal();
    } catch (e) {
      console.error('Не удалось изменить статус компании', e);
      alert('Не удалось изменить статус компании');
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.titleBlock}>
          <Typography
            variant="h1"
            context="dashboard"
            weight="bold"
            className={styles.title}
          >
            Список компаний
          </Typography>

          <Typography
            variant="h5"
            context="dashboard"
            weight="regular"
            className={styles.subtitle}
          >
            Общий аналитический обзор по компании или сотруднику
          </Typography>
        </div>
      </header>

      <div className={styles.segmentedWrap}>
        <SegmentedControl
          value={filter}
          size="medium"
          onChange={(val) => setFilter(val as 'all' | 'active' | 'suspended')}
          className={styles.segmentedControl}
          options={[
            { label: 'Все', value: 'all' },
            { label: 'Active', value: 'active' },
            { label: 'Suspended', value: 'suspended' },
          ]}
        />
      </div>

      <div className={styles.controlsWrapper}>
        <div className={styles.searchRow}>
          <div className={styles.searchWrap}>
            <BaseInput
              placeholder="Поиск компании"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<IoSearchOutline />}
              className={styles.searchInp}
            />
          </div>

          <Button
            type="button"
            variant="primary"
            size="medium"
            className={styles.createBtn}
            onClick={() => setCreateModalOpen(true)}
          >
            Создать компанию
          </Button>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.tableContainer}>
          {isLoading ? (
            <div className={styles.emptyState}>Загрузка...</div>
          ) : isError ? (
            <div className={styles.emptyState}>
              Ошибка загрузки компаний
              {error instanceof Error ? `: ${error.message}` : ''}
            </div>
          ) : filteredCompanies.length === 0 ? (
            <div className={styles.emptyState}>Компании не найдены</div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Компании</th>
                  <th>Email</th>
                  <th className={styles.alignRight}>Статус</th>
                </tr>
              </thead>

              <tbody>
                {filteredCompanies.map((company) => (
                  <tr
                    key={company.id}
                    onClick={() =>
                      navigate(
                        paths.COMPANY_DETAILS.replace(':companyId', String(company.id))
                      )
                    }
                    style={{ cursor: 'pointer' }}
                  >
                    <td className={styles.primaryText}>{company.name}</td>
                    <td>{company.email}</td>

                    <td
                      className={styles.alignRight}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <SelectDropdown
                        value={company.status}
                        onChange={(newStatus) => {
                          if (newStatus !== company.status) {
                            openStatusModal(company.id, company.status);
                          }
                        }}
                        options={COMPANY_STATUS_OPTIONS}
                        size="sm"
                        variant="ghost"
                        showChevron={false}
                        className={styles.statusSelect}
                        menuClassName={styles.statusMenu}
                        optionClassName={styles.statusOption}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <CreateCompanyModal
        open={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />

      <ConfirmStatusModal
        open={isConfirmModalOpen}
        onClose={closeStatusModal}
        onConfirm={handleConfirmStatus}
        status={selectedCompanyStatus}
      />
    </div>
  );
};