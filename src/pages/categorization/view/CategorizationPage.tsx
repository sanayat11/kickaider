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

                <Modal
                    open={isResetAllModalOpen}
                    onClose={() => setIsResetAllModalOpen(false)}
                    title="Сбросить все правила?"
                    size="sm"
                    className={styles.modalCustom}
                >
                    <div className={styles.modalBody}>

                        <div className={styles.modalActions}>
                            <Button
                                variant="primary"
                                className={styles.modalBtn}
                                size='large'
                                onClick={() => {
                                    handleResetAll();
                                    setIsResetAllModalOpen(false);
                                }}
                            >
                                Сбросить
                            </Button>

                            <Button
                                variant="outline"
                                size='large'
                                className={styles.modalBtn}
                                onClick={() => setIsResetAllModalOpen(false)}
                            >
                                Отмена
                            </Button>
                        </div>
                    </div>
                </Modal>

                <Modal
                    open={!!rowToReset}
                    onClose={() => setRowToReset(null)}
                    title="Удалить файл?"
                    size='sm'
                    className={styles.modalCustom}
                >
                    <div className={styles.modalBody}>

                        <div className={styles.modalActions}>
                            <Button
                                variant="primary"
                                size='large'
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
                                size='large'
                                className={styles.modalBtn}
                                onClick={() => setRowToReset(null)}
                            >
                                Отмена
                            </Button>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
};