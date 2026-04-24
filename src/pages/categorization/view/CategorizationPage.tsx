import React, { useState } from 'react';
import classNames from 'classnames';
import { Typography } from '@/shared/ui/typoghraphy/view/Typography';
import { Modal } from '@/shared/ui/modal/view/Modal';
import { Button } from '@/shared/ui/button/view/Button';
import { Chip } from '@/shared/ui/chipButton/view/ChipButton';
import { BaseInput } from '@/shared/ui/input/view/BaseInput';
import { ArrowDownIcon } from '@/shared/assets/icons/IconArrowDown';
import { IoAddOutline } from 'react-icons/io5';

import { useCategorization } from '../model/useCategorization';
import type { Category } from '../model/types';
import { CategorizationFilters } from '../ui/CategorizationFilters';
import { CategorizationTable } from '../ui/CategorizationTable';
import { CategorizationRow } from '../ui/CategorizationRow';
import { CategorizationPagination } from '../ui/CategorizationPagination';
import { CategorizationSkeleton } from '../ui/CategorizationSkeleton';
import { CategorizationEmpty } from '../ui/CategorizationEmpty';

import styles from './CategorizationPage.module.scss';

const CATEGORY_OPTIONS: Array<{ label: string; value: Category; tone: 'green' | 'red' | 'yellow' }> = [
  { label: 'Продуктивно',    value: 'productive',   tone: 'green'  },
  { label: 'Непродуктивно',  value: 'unproductive', tone: 'red'    },
  { label: 'Нейтрально',     value: 'neutral',      tone: 'yellow' },
];

export const CategorizationPage: React.FC = () => {
  const {
    rows,
    loading,
    search,
    filter,
    page,
    pageSize,
    totalPages,
    updatingIds,
    setSearch,
    setFilter,
    setPage,
    setPageSize,
    handleCategoryChange,
    handleReset,
    handleResetAll,
    handleCreate,
  } = useCategorization();

  const [isResetAllModalOpen, setIsResetAllModalOpen] = useState(false);
  const [rowToReset, setRowToReset] = useState<string | null>(null);

  // Create modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createDomain, setCreateDomain] = useState('');
  const [createCategory, setCreateCategory] = useState<Category | null>(null);
  const [isCatDropOpen, setIsCatDropOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');

  const openCreate = () => {
    setCreateDomain('');
    setCreateCategory(null);
    setCreateError('');
    setIsCatDropOpen(false);
    setIsCreateOpen(true);
  };

  const handleCreateSubmit = async () => {
    if (!createDomain.trim()) { setCreateError('Введите domain сайта'); return; }
    if (!createCategory) { setCreateError('Выберите категорию'); return; }
    setCreateError('');
    setCreateLoading(true);
    try {
      await handleCreate(createDomain.trim(), createCategory);
      setIsCreateOpen(false);
    } catch {
      setCreateError('Сайт не найден в справочнике или не удалось создать override');
    } finally {
      setCreateLoading(false);
    }
  };

  const selectedCatOption = CATEGORY_OPTIONS.find((o) => o.value === createCategory);

  return (
    <div className={styles.wrapper}>
      <div className={classNames(styles.categorizationPage)}>
        <header className={styles.header}>
          <div className={styles.titleSection}>
            <Typography variant="h1" weight="bold" context='dashboard' className={styles.pageTitle}>
              Категоризация приложений
            </Typography>
            <Typography variant="h4" weight="regular" context='dashboard' className={styles.pageSubtitle}>
              Общий аналитический обзор по компании или сотруднику
            </Typography>
          </div>

          <div className={styles.headerActions}>
            <button className={styles.addBtn} onClick={openCreate}>
              <IoAddOutline size={16} />
              Добавить сайт
            </button>
            <button className={styles.resetBtn} onClick={() => setIsResetAllModalOpen(true)}>
              Сбросить
            </button>
          </div>
        </header>

        <section className={styles.controlsCard}>
          <CategorizationFilters
            search={search}
            setSearch={setSearch}
            filter={filter}
            setFilter={setFilter}
          />

          <div className={styles.tableWrap}>
            {loading ? (
              <CategorizationSkeleton />
            ) : rows.length === 0 ? (
              <CategorizationEmpty />
            ) : (
              <CategorizationTable>
                {rows.map((row) => (
                  <CategorizationRow
                    key={row.id}
                    row={row}
                    isUpdating={updatingIds.includes(row.id)}
                    onCategoryChange={handleCategoryChange}
                    onReset={setRowToReset}
                  />
                ))}
              </CategorizationTable>
            )}
          </div>

          <CategorizationPagination
            page={page}
            pageSize={pageSize}
            totalPages={totalPages}
            setPage={setPage}
            setPageSize={setPageSize}
          />
        </section>

        {/* Reset All Modal */}
        <Modal open={isResetAllModalOpen} onClose={() => setIsResetAllModalOpen(false)} title="Сбросить все правила?" size="sm" className={styles.modalCustom}>
          <div className={styles.modalBody}>
            <div className={styles.modalActions}>
              <Button variant="primary" className={styles.modalBtn} size='large' onClick={() => { handleResetAll(); setIsResetAllModalOpen(false); }}>
                Сбросить
              </Button>
              <Button variant="outline" size='large' className={styles.modalBtn} onClick={() => setIsResetAllModalOpen(false)}>
                Отмена
              </Button>
            </div>
          </div>
        </Modal>

        {/* Reset Single Modal */}
        <Modal open={!!rowToReset} onClose={() => setRowToReset(null)} title="Сбросить категорию?" size='sm' className={styles.modalCustom}>
          <div className={styles.modalBody}>
            <div className={styles.modalActions}>
              <Button variant="primary" size='large' className={styles.modalBtn} onClick={() => { if (rowToReset) handleReset(rowToReset); setRowToReset(null); }}>
                Сбросить
              </Button>
              <Button variant="outline" size='large' className={styles.modalBtn} onClick={() => setRowToReset(null)}>
                Отмена
              </Button>
            </div>
          </div>
        </Modal>

        {/* Create Modal */}
        <Modal open={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Добавить сайт" size="sm" className={styles.modalCustom}>
          <div className={styles.createModalBody}>

            <div className={styles.createField}>
              <label className={styles.createLabel}>Сайт</label>
              <BaseInput
                value={createDomain}
                onChange={(e) => setCreateDomain(e.target.value)}
                placeholder="example.com"
                className={styles.createSelect}
              />
            </div>

            <div className={styles.createField}>
              <label className={styles.createLabel}>Категория</label>
              <div className={styles.createCatDropWrapper}>
                <div
                  className={classNames(styles.createCatTrigger, { [styles.active]: isCatDropOpen })}
                  onClick={() => setIsCatDropOpen((v) => !v)}
                >
                  {selectedCatOption ? (
                    <Chip tone={selectedCatOption.tone} variant="filter" isActionable={false} className={styles.createChip}>
                      {selectedCatOption.label}
                    </Chip>
                  ) : (
                    <span className={styles.createCatPlaceholder}>Выберите категорию</span>
                  )}
                  <ArrowDownIcon className={classNames(styles.createChevron, { [styles.open]: isCatDropOpen })} />
                </div>

                {isCatDropOpen && (
                  <div className={styles.createCatMenu}>
                    {CATEGORY_OPTIONS.map((opt) => (
                      <div key={opt.value} className={styles.createCatOption} onClick={() => { setCreateCategory(opt.value); setIsCatDropOpen(false); }}>
                        <Chip tone={opt.tone} variant="filter" isActionable={false} className={styles.createChip}>
                          {opt.label}
                        </Chip>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {createError && <p className={styles.createError}>{createError}</p>}

            <div className={styles.modalActions}>
              <Button variant="primary" size='large' className={styles.modalBtn} onClick={handleCreateSubmit} disabled={createLoading}>
                {createLoading ? 'Сохранение...' : 'Применить'}
              </Button>
              <Button variant="outline" size='large' className={styles.modalBtn} onClick={() => setIsCreateOpen(false)}>
                Отмена
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};
