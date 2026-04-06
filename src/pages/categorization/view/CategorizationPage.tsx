import React, { useState } from 'react';
import classNames from 'classnames';
import { Typography } from '@/shared/ui/typoghraphy/view/Typography';
import { Modal } from '@/shared/ui/modal/view/Modal';
import { Button } from '@/shared/ui/button/view/Button';

import { useCategorization } from '../model/useCategorization';
import { CategorizationFilters } from '../ui/CategorizationFilters';
import { CategorizationTable } from '../ui/CategorizationTable';
import { CategorizationRow } from '../ui/CategorizationRow';
import { CategorizationPagination } from '../ui/CategorizationPagination';
import { CategorizationSkeleton } from '../ui/CategorizationSkeleton';
import { CategorizationEmpty } from '../ui/CategorizationEmpty';

import styles from './CategorizationPage.module.scss';

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
    } = useCategorization();

    const [isResetAllModalOpen, setIsResetAllModalOpen] = useState(false);
    const [rowToReset, setRowToReset] = useState<string | null>(null);

    return (
        <div className={classNames(styles.categorizationPage)}>
            <header className={styles.header}>
                <div className={styles.titleSection}>
                    <Typography variant="h1" weight="bold">Категоризация приложений</Typography>
                    <Typography variant="h4" weight="regular">
                        Общий аналитический обзор по компании или сотруднику
                    </Typography>
                </div>
                <button 
                  className={styles.resetBtn} 
                  onClick={() => setIsResetAllModalOpen(true)}
                >
                  Сбросить
                </button>
            </header>

            <section className={styles.controlsCard}>
                <CategorizationFilters 
                    search={search}
                    setSearch={setSearch}
                    filter={filter}
                    setFilter={setFilter}
                />
                
                {loading ? (
                    <CategorizationSkeleton />
                ) : rows.length === 0 ? (
                    <CategorizationEmpty />
                ) : (
                    <CategorizationTable>
                        {rows.map(row => (
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

                <CategorizationPagination 
                    page={page}
                    pageSize={pageSize}
                    totalPages={totalPages}
                    setPage={setPage}
                    setPageSize={setPageSize}
                />
            </section>

            {/* CONFIRM RESET ALL MODAL */}
            <Modal
                open={isResetAllModalOpen}
                onClose={() => setIsResetAllModalOpen(false)}
                title="Сбросить все правила?"
                size="sm"
                className={styles.modalCustom}
            >
                <div className={styles.modalBody}>
                    <Typography variant="h5" color="secondary" weight="regular">
                        Это действие вернет все приложения к их стандартным категориям.
                    </Typography>
                    <div className={styles.modalActions}>
                        <Button 
                            variant="primary" 
                            className={styles.modalBtn}
                            onClick={() => {
                                handleResetAll();
                                setIsResetAllModalOpen(false);
                            }}
                        >
                            Сбросить
                        </Button>
                        <Button 
                            variant="outline" 
                            className={styles.modalBtn}
                            onClick={() => setIsResetAllModalOpen(false)}
                        >
                            Отмена
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* CONFIRM INDIVIDUAL RESET MODAL */}
            <Modal
                open={!!rowToReset}
                onClose={() => setRowToReset(null)}
                title="Удалить файл?"
                size="sm"
                className={styles.modalCustom}
            >
                <div className={styles.modalBody}>
                    <Typography variant="h5" color="secondary" weight="regular">
                        Вы уверены, что хотите сбросить категорию для этого приложения?
                    </Typography>
                    <div className={styles.modalActions}>
                        <Button 
                            variant="primary" 
                            className={styles.modalBtn}
                            onClick={() => {
                                if (rowToReset) handleReset(rowToReset);
                                setRowToReset(null);
                            }}
                        >
                            Удалить
                        </Button>
                        <Button 
                            variant="outline" 
                            className={styles.modalBtn}
                            onClick={() => setRowToReset(null)}
                        >
                            Отмена
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
