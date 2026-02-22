import React, { useState } from 'react';
import { IoChevronBackOutline, IoChevronForwardOutline, IoCalendarOutline } from 'react-icons/io5';
import styles from './DayDetailsPage.module.scss';
import { DayDetailsChart } from './components/DayDetailsChart/DayDetailsChart';
import type { DayActivityData } from './components/DayDetailsChart/DayDetailsChart';

const mockData1: DayActivityData = {
    employeeName: 'Сауле Абдыкадырова Sakewa',
    date: '2026-02-18',
    department: 'Парсеры',
    donutSegments: [
        { type: 'neutral', percent: 94.6, duration: '01:03:14' },
        { type: 'idle', percent: 3.9, duration: '00:02:38' },
        { type: 'uncategorized', percent: 1.4, duration: '00:00:54' },
    ],
    timelineSegments: [
        { id: '1', type: 'neutral', startPercent: 70, widthPercent: 1.5, tooltipTime: '16:00-16:05' },
        { id: '2', type: 'neutral', startPercent: 71, widthPercent: 2, tooltipTime: '16:05-16:15' },
        { id: '3', type: 'idle', startPercent: 73, widthPercent: 0.5, tooltipTime: '16:20-16:22' },
        { id: '4', type: 'neutral', startPercent: 76, widthPercent: 1, tooltipTime: '16:45-16:50' },
        { id: '5', type: 'neutral', startPercent: 78, widthPercent: 3, tooltipTime: '16:55-17:07' },
    ],
    stats: {
        idle: '01:03:14',
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
        { type: 'idle', percent: 58.8, duration: '03:13:30' },
        { type: 'productive', percent: 12.6, duration: '00:41:30' },
        { type: 'uncategorized', percent: 11.3, duration: '00:37:07' },
        { type: 'neutral', percent: 17.3, duration: '00:56:57' },
    ],
    timelineSegments: [
        { id: '10', type: 'neutral', startPercent: 40, widthPercent: 1, tooltipTime: '12:30' },
        { id: '11', type: 'productive', startPercent: 55, widthPercent: 2, tooltipTime: '14:00' },
        { id: '12', type: 'uncategorized', startPercent: 58, widthPercent: 1.5, tooltipTime: '14:20' },
        { id: '13', type: 'neutral', startPercent: 65, widthPercent: 4, tooltipTime: '15:15' },
        { id: '14', type: 'idle', startPercent: 70, widthPercent: 10, tooltipTime: '16:00' },
        { id: '15', type: 'productive', startPercent: 82, widthPercent: 3, tooltipTime: '17:30' },
        { id: '16', type: 'idle', startPercent: 86, widthPercent: 2, tooltipTime: '18:00' },
    ],
    stats: {
        idle: '03:13:30',
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
    const [isGenerated, setIsGenerated] = useState(false);
    const [period, setPeriod] = useState('Day');
    const [selectedEmployee, setSelectedEmployee] = useState('All');
    const [currentDate, setCurrentDate] = useState('2026-02-21');

    const handleGenerate = () => {
        setIsGenerated(true);
    };

    const handlePrevDay = () => {
        const date = new Date(currentDate);
        date.setDate(date.getDate() - 1);
        setCurrentDate(date.toISOString().split('T')[0]);
    };

    const handleNextDay = () => {
        const date = new Date(currentDate);
        date.setDate(date.getDate() + 1);
        setCurrentDate(date.toISOString().split('T')[0]);
    };

    const renderCharts = () => {
        let activeData: DayActivityData[] = [];
        if (period === 'Day') {
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
            activeData = activeData.filter(d => {
                if (selectedEmployee === 'Sakewa' && d.employeeName.includes('Sakewa')) return true;
                if (selectedEmployee === 'Ivanov' && d.employeeName.includes('Иванов')) return true;
                if (selectedEmployee === 'Smirnova' && d.employeeName.includes('Смирнова')) return true;
                return false;
            });
        }

        return activeData.map((data, idx) => <DayDetailsChart key={idx} data={{ ...data, date: period === 'Day' ? new Date(currentDate).toLocaleDateString('ru-RU') : data.date }} />);
    };

    return (
        <div className={styles.container}>
            <div className={styles.filtersBar}>
                <div className={styles.filterGroup}>
                    <div className={styles.labelGroup}>
                        <span>Период:</span>
                        <select className={styles.select} value={period} onChange={(e) => setPeriod(e.target.value)}>
                            <option value="Day">День</option>
                            <option value="Week">Неделя</option>
                            <option value="Month">Месяц</option>
                        </select>
                    </div>

                    <div className={styles.dateNav}>
                        <div className={styles.dateInputWrapper}>
                            <input 
                                type="date" 
                                value={currentDate} 
                                onChange={(e) => setCurrentDate(e.target.value)}
                                className={styles.dateInput}
                            />
                        </div>
                        <div className={styles.dateActions}>
                            <div className={styles.arrows}>
                                <button onClick={handlePrevDay}><IoChevronBackOutline /></button>
                                <button onClick={handleNextDay}><IoChevronForwardOutline /></button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.filterGroup}>
                    <div className={styles.labelGroup}>
                        <span>Сотрудник:</span>
                        <select className={styles.select} value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)}>
                            <option value="All">Все сотрудники</option>
                            <option value="Sakewa">Сауле Абдыкадырова Sakewa</option>
                            <option value="Ivanov">Иванов Иван</option>
                            <option value="Smirnova">Смирнова Анна</option>
                        </select>
                    </div>
                    <label className={styles.checkboxLabel}>
                        <input type="checkbox" defaultChecked />
                        <span className={styles.checkmark}></span>
                        Только рабочее время
                    </label>
                </div>

                <div className={styles.actionGroup}>
                    <button className={styles.generateBtn} onClick={handleGenerate}>
                        Сформировать
                    </button>
                    <button className={styles.exportBtn}>
                        → XLS
                    </button>
                </div>
            </div>

            <main className={styles.main}>
                {!isGenerated ? (
                    <div className={styles.emptyState}>
                        <h2>Детали дня</h2>
                        <div className={styles.infoBox}>
                            <span className={styles.infoIcon}>i</span>
                            <p>Выберите параметры отчета и нажмите на кнопку «Сформировать»</p>
                        </div>
                    </div>
                ) : (
                    <div className={styles.generatedContent}>
                        {renderCharts()}
                    </div>
                )}
            </main>
        </div>
    );
};
