export interface AppActivity {
    name: string;
    duration: string;
}

export type ActivityState = 'productive' | 'neutral' | 'unproductive' | 'uncategorized' | 'idle' | 'nodata';

export interface ActivityBlock {
    start: string;
    end: string;
    state: ActivityState;
    topApps: AppActivity[];
    productivityPercent: number;
    activityTime: string;
    idleTime: string;
    appName: string;
    windowTitle: string;
    url?: string;
    hostname?: string;
}

export interface Employee {
    id: string;
    fullName: string;
    department: string;
    hostname: string;
    timeline: ActivityBlock[];
}

export interface ActivityEvent {
    id: string;
    timestamp: string;
    duration: string;
    type: 'app' | 'web' | 'idle';
    appName: string;
    windowTitle?: string;
    url?: string;
    screenshotUrl?: string;
    state: ActivityState;
}

export interface EmployeeDayDetails {
    header: {
        employeeId: string;
        fullName: string;
        department: string;
        hostname: string;
        date: string;
    };
    shortViewRows: {
        period: string;
        activityMinutes: string;
        idleMinutes: string;
        apps: string[];
    }[];
    fullViewEvents: ActivityEvent[];
}

const DEPARTMENTS = ['Company', 'IT', 'Marketing', 'Sales', 'HR', 'Finance'];

const formatTime = (minutes: number): string => {
    const h = Math.floor(minutes / 60);
    const m = Math.floor(minutes % 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
};

const generateTimeline = (): ActivityBlock[] => {
    const blocks: ActivityBlock[] = [];
    let currentTime = 8 * 60; // 08:00
    const endTime = 18 * 60;   // 18:00

    while (currentTime < endTime) {
        const duration = 30 + Math.floor(Math.random() * 60); // 30-90 min
        const state = ['productive', 'neutral', 'unproductive', 'uncategorized', 'idle'][Math.floor(Math.random() * 5)] as ActivityState;

        const start = formatTime(currentTime);
        currentTime += duration;
        const end = formatTime(Math.min(currentTime, endTime));

        blocks.push({
            start,
            end,
            state,
            productivityPercent: state === 'productive' ? 80 + Math.floor(Math.random() * 20) : Math.floor(Math.random() * 60),
            activityTime: formatTime(duration - 5),
            idleTime: '00:05',
            appName: ['Google Chrome', 'VS Code', 'Slack', 'Terminal', 'Figma'][Math.floor(Math.random() * 5)],
            windowTitle: 'Work context - KickAider',
            url: state === 'productive' ? 'https://github.com/kickaider' : undefined,
            topApps: [
                { name: 'Google Chrome', duration: '15m' },
                { name: 'VS Code', duration: '10m' },
                { name: 'Slack', duration: '5m' }
            ]
        });
    }
    return blocks;
};

export const activityMockApi = {
    getTimelineDay: async (params: { date: string, departments: string[], searchQuery?: string }): Promise<Employee[]> => {
        await new Promise(resolve => setTimeout(resolve, 500));

        const names = [
            'Иванов Иван', 'Петров Петр', 'Сидорова Анна', 'Кузнецова Елена',
            'Смирнов Алексей', 'Волков Дмитрий', 'Морозова Ольга', 'Новиков Артем'
        ];

        let employees = names.map((name, index) => ({
            id: `emp-${index + 1}`,
            fullName: name,
            department: DEPARTMENTS[1 + (index % (DEPARTMENTS.length - 1))],
            hostname: `WORKSTATION-${index + 101}`,
            timeline: generateTimeline()
        }));

        if (params.departments.length > 0 && !params.departments.includes('Company')) {
            employees = employees.filter(e => params.departments.includes(e.department));
        }

        if (params.searchQuery) {
            const query = params.searchQuery.toLowerCase();
            employees = employees.filter(e =>
                e.fullName.toLowerCase().includes(query) ||
                e.timeline.some(b => b.appName.toLowerCase().includes(query))
            );
        }

        return employees;
    },

    getEmployeeDayDetails: async (params: { employeeId: string, date: string }): Promise<EmployeeDayDetails> => {
        await new Promise(resolve => setTimeout(resolve, 600));

        const names = ['Иванов Иван', 'Петров Петр', 'Сидорова Анна', 'Кузнецова Елена'];
        const name = names[parseInt(params.employeeId.split('-')[1]) - 1] || 'Исполнитель';

        const events: ActivityEvent[] = [];
        let time = 9 * 60; // 09:00
        const endDay = 18 * 60;

        while (time < endDay) {
            const isIdle = Math.random() < 0.15;
            const duration = 10 + Math.floor(Math.random() * 20);
            const type = isIdle ? 'idle' : (Math.random() < 0.4 ? 'web' : 'app');
            const apps = ['VS Code', 'Google Chrome', 'Slack', 'Terminal', 'Figma'];
            const app = apps[Math.floor(Math.random() * apps.length)];

            events.push({
                id: Math.random().toString(36).substr(2, 9),
                timestamp: formatTime(time),
                duration: formatTime(duration),
                type: type as any,
                appName: isIdle ? 'Бездействие' : app,
                windowTitle: isIdle ? undefined : (type === 'web' ? 'KickAider Admin' : 'Source Code Editor'),
                url: type === 'web' ? 'https://app.kickaider.com' : undefined,
                screenshotUrl: !isIdle ? 'https://via.placeholder.com/160x90/4E61F6/FFFFFF?text=Activity' : undefined,
                state: isIdle ? 'idle' : (['productive', 'neutral', 'unproductive'][Math.floor(Math.random() * 3)] as any)
            });

            time += duration;
        }

        const shortViewRows = [];
        for (let i = 0; i < events.length; i += 3) {
            const blockEvents = events.slice(i, i + 3);
            const actMins = blockEvents.filter(e => e.type !== 'idle').reduce((acc, e) => acc + (parseInt(e.duration.split(':')[0]) * 60 + parseInt(e.duration.split(':')[1])), 0);
            const idleMins = blockEvents.filter(e => e.type === 'idle').reduce((acc, e) => acc + (parseInt(e.duration.split(':')[0]) * 60 + parseInt(e.duration.split(':')[1])), 0);

            shortViewRows.push({
                period: `${blockEvents[0].timestamp} - ${formatTime(parseInt(blockEvents[blockEvents.length - 1].timestamp.split(':')[0]) * 60 + parseInt(blockEvents[blockEvents.length - 1].timestamp.split(':')[1]) + 30)}`,
                activityMinutes: formatTime(actMins),
                idleMinutes: formatTime(idleMins),
                apps: Array.from(new Set(blockEvents.filter(e => e.type !== 'idle').map(e => e.appName)))
            });
        }

        return {
            header: {
                employeeId: params.employeeId,
                fullName: name,
                department: 'IT',
                hostname: 'DESKTOP-RKL123',
                date: params.date
            },
            shortViewRows,
            fullViewEvents: events
        };
    }
};
