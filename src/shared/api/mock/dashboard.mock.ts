export interface AppData {
    name: string;
    productive: number;
    neutral: number;
    unproductive: number;
    total: string;
}

export interface DeptEfficiency {
    name: string;
    productive: number;
    neutral: number;
    unproductive: number;
    uncategorized: number;
    idle: number;
}

export interface DynamicsPoint {
    label: string;
    productive: number;
    neutral: number;
    unproductive: number;
    uncategorized: number;
    total: string;
}

export interface DashboardData {
    employees: string[];
    appData: AppData[];
    efficiencyDept: DeptEfficiency[];
    dynamics: {
        day: DynamicsPoint[];
        week: DynamicsPoint[];
    };
}

export const MOCK_DASHBOARD_DATA: DashboardData = {
    employees: ['Компания', 'Иван Иванов', 'Петр Петров', 'Анна Сидорова'],
    appData: [
        { name: 'VS Code', productive: 70, neutral: 20, unproductive: 10, total: '05:30' },
        { name: 'Google Chrome', productive: 40, neutral: 30, unproductive: 30, total: '03:15' },
        { name: 'Slack', productive: 20, neutral: 70, unproductive: 10, total: '01:45' },
        { name: 'YouTube', productive: 5, neutral: 15, unproductive: 80, total: '01:00' },
        { name: 'Excel', productive: 90, neutral: 5, unproductive: 5, total: '00:45' },
    ],
    efficiencyDept: [
        { name: 'IT', productive: 60, neutral: 15, unproductive: 10, uncategorized: 10, idle: 5 },
        { name: 'Sales', productive: 45, neutral: 20, unproductive: 20, uncategorized: 10, idle: 5 },
        { name: 'HR', productive: 70, neutral: 10, unproductive: 5, uncategorized: 10, idle: 5 },
        { name: 'Design', productive: 55, neutral: 20, unproductive: 10, uncategorized: 10, idle: 5 },
    ],
    dynamics: {
        day: [
            { label: '01.02.26', productive: 60, neutral: 10, unproductive: 5, uncategorized: 10, total: '08:45' },
            { label: '02.02.26', productive: 70, neutral: 5, unproductive: 10, uncategorized: 10, total: '07:30' },
            { label: '03.02.26', productive: 50, neutral: 20, unproductive: 10, uncategorized: 10, total: '08:00' },
            { label: '04.02.26', productive: 80, neutral: 5, unproductive: 0, uncategorized: 10, total: '09:00' },
            { label: '05.02.26', productive: 40, neutral: 30, unproductive: 10, uncategorized: 10, total: '06:00' },
            { label: '06.02.26', productive: 10, neutral: 5, unproductive: 5, uncategorized: 5, total: '01:00' },
            { label: '07.02.26', productive: 0, neutral: 0, unproductive: 0, uncategorized: 0, total: '00:00' },
        ],
        week: [
            { label: 'Week 1', productive: 350, neutral: 50, unproductive: 50, uncategorized: 50, total: '40:00' },
            { label: 'Week 2', productive: 400, neutral: 30, unproductive: 20, uncategorized: 40, total: '42:00' },
            { label: 'Week 3', productive: 300, neutral: 100, unproductive: 50, uncategorized: 60, total: '38:00' },
            { label: 'Week 4', productive: 380, neutral: 40, unproductive: 30, uncategorized: 50, total: '41:00' },
        ]
    }
};

export const dashboardApi = {
    getDashboardData: (): Promise<DashboardData> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(MOCK_DASHBOARD_DATA);
            }, 600);
        });
    },

    getAppsData: (): Promise<AppData[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(MOCK_DASHBOARD_DATA.appData);
            }, 400);
        });
    },
};
