import { useState } from 'react';
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
import { SelectDropdown } from '@/shared/ui/selectDropdown/view/selectDropdown';

// Mocks
const initialCompanies = [
  { id: '1', name: 'ОсОО "Компания 123"', adminFio: 'Бектемирова Аяна Бектемировна', status: 'Suspended' },
  { id: '2', name: 'ОсОО "Компания 123"', adminFio: 'Бегайым /nicenice', status: 'Active' },
  { id: '3', name: 'ОсОО "Компания 123"', adminFio: 'Бегайым /nicenice', status: 'Suspended' },
  { id: '4', name: 'ОсОО "Компания 123"', adminFio: 'Бегайым /nicenice', status: 'Suspended' }
];

const COMPANY_STATUS_OPTIONS = [
  { label: <Chip tone="red">Suspended</Chip>, value: 'Suspended' },
  { label: <Chip tone="green">Active</Chip>, value: 'Active' }
];

export const CompaniesPage = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [companies, setCompanies] = useState(initialCompanies);

  const filteredCompanies = companies.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || c.status.toLowerCase() === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.titleBlock}>
          <Typography variant="h1" context='dashboard' weight='bold' className={styles.title}>Список компаний</Typography>
          <Typography variant="h5" context='dashboard' weight='regular' className={styles.subtitle}>Общий аналитический обзор по компании или сотруднику</Typography>
        </div>
      </header>

      <div className={styles.segmentedWrap}>
        <SegmentedControl
          value={filter}
          size='medium'
          onChange={(val) => setFilter(val as string)}
          className={styles.segmentedControl}
          options={[
            { label: 'Все', value: 'all' },
            { label: 'Active', value: 'active' },
            { label: 'Suspended', value: 'suspended' }
          ]}
        />
      </div>
       <div className={styles.controlsWrapper}>
          <div className={styles.searchRow}>
            <div className={styles.searchWrap}>
              <BaseInput 
                placeholder="Поиск сотрудника" 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
                icon={<IoSearchOutline />}
                className={styles.searchInp}
              />
            </div>
            <Button variant="primary" size='medium' className={styles.createBtn} onClick={() => setCreateModalOpen(true)}>
              Создать компанию
            </Button>
          </div>
        </div>

      <div className={styles.card}>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Компании</th>
                 <th>ADMIN(ФИО)</th>
                 <th className={styles.alignRight}>Статус</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.map(company => (
                <tr key={company.id} onClick={() => navigate(paths.COMPANY_DETAILS.replace(':companyId', company.id))} style={{ cursor: 'pointer' }}>
                  <td className={styles.primaryText}>{company.name}</td>
                  <td>{company.adminFio}</td>
                  <td className={styles.alignRight} onClick={(e) => e.stopPropagation()}>
                    <SelectDropdown
                      value={company.status}
                      onChange={(newStatus) => {
                        setCompanies(prev => prev.map(c => 
                          c.id === company.id ? { ...c, status: newStatus as string } : c
                        ));
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
        </div>
      </div>
      <CreateCompanyModal open={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} />
    </div>
  );
};
