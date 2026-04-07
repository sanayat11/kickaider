import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { AttachmentIcon } from '@/shared/assets/icons';
import styles from './DayDetailsPage.module.scss';
import { DayDetailsChart } from '../../dayDetailsChart/view/DayDetailsChart';
import type { DayActivityData } from '../../dayDetailsChart/view/DayDetailsChart';
import { BASE_EMPLOYEES } from '@/shared/api/mock/employees.mock';
import { DayDetailsFilter } from './DayDetailsFilter';
import { Pagination } from '@/shared/ui';

const mockData1: DayActivityData = {
    employeeName: 'Сауле Абдыкадырова Sakewa',
    date: '2026-02-18',
    department: 'Парсеры',
    donutSegments: [
        { type: 'neutral', percent: 94.6, duration: '01:03:14' },
        { type: 'unproductive', percent: 3.9, duration: '00:02:38' },
        { type: 'uncategorized', percent: 1.4, duration: '00:00:54' },
    ],
    timelineSegments: [
        { id: '1', type: 'neutral', startPercent: 70, widthPercent: 1.5, tooltipTime: '16:00-16:05' },
        { id: '2', type: 'neutral', startPercent: 71, widthPercent: 2, tooltipTime: '16:05-16:15' },
        { id: '3', type: 'uncategorized', startPercent: 73, widthPercent: 0.5, tooltipTime: '16:20-16:22' },
        { id: '4', type: 'neutral', startPercent: 76, widthPercent: 1, tooltipTime: '16:45-16:50' },
        { id: '5', type: 'neutral', startPercent: 78, widthPercent: 3, tooltipTime: '16:55-17:07' },
    ],
    stats: {
        active: '00:03:38',
        productive: '00:00:05',
        unproductive: '-',
        neutral: '00:02:38',
        uncategorized: '00:00:54',
        firstActivity: '16:52:00',
        lastActivity: '17:07:00',
        timeAtWork: '00:15:00',
    }
};

const mockData2: DayActivityData = {
    employeeName: 'Сауле Абдыкадырова Sakewa',
    date: '2026-02-19',
    department: 'Парсеры',
    donutSegments: [
        { type: 'unproductive', percent: 58.8, duration: '03:13:30' },
        { type: 'productive', percent: 12.6, duration: '00:41:30' },
        { type: 'uncategorized', percent: 11.3, duration: '00:37:07' },
        { type: 'neutral', percent: 17.3, duration: '00:56:57' },
    ],
    timelineSegments: [
        { id: '10', type: 'neutral', startPercent: 40, widthPercent: 1, tooltipTime: '12:30' },
        { id: '11', type: 'productive', startPercent: 55, widthPercent: 2, tooltipTime: '14:00' },
        { id: '12', type: 'uncategorized', startPercent: 58, widthPercent: 1.5, tooltipTime: '14:20' },
        { id: '13', type: 'neutral', startPercent: 65, widthPercent: 4, tooltipTime: '15:15' },
        { id: '14', type: 'unproductive', startPercent: 70, widthPercent: 10, tooltipTime: '16:00' },
        { id: '15', type: 'productive', startPercent: 82, widthPercent: 3, tooltipTime: '17:30' },
        { id: '16', type: 'unproductive', startPercent: 86, widthPercent: 2, tooltipTime: '18:00' },
    ],
    stats: {
        active: '02:15:37',
        productive: '00:41:30',
        unproductive: '00:00:01',
        neutral: '00:56:57',
        uncategorized: '00:37:07',
        firstActivity: '12:30:00',
        lastActivity: '17:59:00',
        timeAtWork: '05:29:00',
    }
};

// mockDataWeek / mockDataMonth placeholders
const mockDataWeek: DayActivityData[] = [
    {
        ...mockData1,
        date: 'Неделя 1',
        stats: { ...mockData1.stats, timeAtWork: '40:15:00' }
    },
    {
        ...mockData2,
        employeeName: 'Иванов Иван',
        department: 'IT',
        date: 'Неделя 1',
        stats: { ...mockData2.stats, timeAtWork: '38:29:00' }
    },
    {
        ...mockData1,
        employeeName: 'Смирнова Анна',
        department: 'HR',
        date: 'Неделя 1',
        stats: { ...mockData1.stats, timeAtWork: '42:10:00' }
    }
];

const mockDataMonth: DayActivityData[] = [
    {
        ...mockData1,
        date: 'Февраль',
        stats: { ...mockData1.stats, timeAtWork: '160:15:00' }
    },
    {
        ...mockData2,
        employeeName: 'Петров Петр',
        department: 'Marketing',
        date: 'Февраль',
        stats: { ...mockData2.stats, timeAtWork: '155:29:00' }
    }
];

export const DayDetailsPage: React.FC = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const passedEmployee = location.state?.selectedEmployee;

    const [period, setPeriod] = useState('');

    const getInitialEmployee = () => {
        if (!passedEmployee) return 'All';
        const found = BASE_EMPLOYEES.find(e => e.name === passedEmployee);
        return found ? found.name : 'All';
    };
    const [selectedEmployee, setSelectedEmployee] = useState(getInitialEmployee());
    const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 21));

    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const renderCharts = () => {
        let activeData: DayActivityData[] = [];
        if (!period) {
            activeData = [
                mockData1,
                mockData2,
                { ...mockData1, employeeName: 'Иванов Иван', department: 'IT' },
                { ...mockData2, employeeName: 'Смирнова Анна', department: 'HR' }
            ];
        }
        if (period === 'Week') activeData = mockDataWeek;
        if (period === 'Month') activeData = mockDataMonth;

        if (selectedEmployee !== 'All') {
            activeData = activeData.filter(d => d.employeeName === selectedEmployee);
            if (activeData.length === 0) {
                activeData = [
                    { ...mockData1, employeeName: selectedEmployee, department: BASE_EMPLOYEES.find(e => e.name === selectedEmployee)?.department || 'IT' },
                    { ...mockData2, employeeName: selectedEmployee, department: BASE_EMPLOYEES.find(e => e.name === selectedEmployee)?.department || 'IT' }
                ];
            }
        }

        const fullData = [...activeData];
        if (fullData.length > 0 && fullData.length < 15 && !period && selectedEmployee === 'All') {
            for(let i=0; i<30; i++) {
                fullData.push({...fullData[i % activeData.length], employeeName: `${fullData[i % activeData.length].employeeName} (Копия ${i + 1})`});
            }
        }

        const totalPages = Math.max(1, Math.ceil(fullData.length / itemsPerPage));
        const safeCurrentPage = Math.min(currentPage, totalPages);
        const currentItems = fullData.slice((safeCurrentPage - 1) * itemsPerPage, safeCurrentPage * itemsPerPage);

        return (
            <>
                <div className={styles.generatedContent}>
                    {currentItems.map((data, idx) => (
                        <DayDetailsChart key={idx} data={{ ...data, date: !period ? currentDate.toLocaleDateString('ru-RU') : data.date }} />
                    ))}
                    {currentItems.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#8a91b4' }}>
                            {t('reports.rating.noDataFilter')}
                        </div>
                    )}
                </div>

                {fullData.length > 0 && (
                    <Pagination
                        variant="bar"
                        currentPage={safeCurrentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        pageSize={itemsPerPage}
                        onPageSizeChange={(size) => { setItemsPerPage(size); setCurrentPage(1); }}
                        pageSizeLabel={t('reports.rating.showEntries')}
                        infoText={(_, total) => `${t('reports.rating.of', 'из')} ${total}`}
                        className={styles.paginationBlock}
                    />
                )}
            </>
        );
    };

    return (
        <div className={styles.container}>
            <div className={styles.pageHeader}>
                <div className={styles.headerText}>
                    <h1>{t('dayDetails.title')}</h1>
                    <p>{t('dayDetails.subtitle', 'Общий аналитический обзор по компании или сотруднику')}</p>
                </div>
                <button className={styles.exportBtn}>
                    Экспорт XLS
                    <AttachmentIcon className={styles.exportIcon} />
                </button>
            </div>

            <div className={styles.filtersSection}>
                <DayDetailsFilter
                    period={period}
                    onPeriodChange={setPeriod}
                    currentDate={currentDate}
                    onDateChange={(date) => { setCurrentDate(date); setCurrentPage(1); }}
                    selectedEmployee={selectedEmployee}
                    onEmployeeChange={setSelectedEmployee}
                />
            </div>

            <main className={styles.main}>
                {renderCharts()}
            </main>
        </div>
    );
};
