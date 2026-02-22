
export type CalendarStatusType = 'vacation' | 'sick' | 'trip' | 'absence';

export interface CalendarStatus {
    id: string;
    employeeId: string;
    date: string; // YYYY-MM-DD
    status: CalendarStatusType;
}

const STORAGE_KEY = 'kickaider:productionCalendar';

const mockRequest = <T>(data: T, delay = 300): Promise<T> => {
    return new Promise(resolve => setTimeout(() => resolve(data), delay));
};

const getStoredStatuses = (): CalendarStatus[] => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
};

const saveStatuses = (statuses: CalendarStatus[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(statuses));
};

export const productionCalendarMockApi = {
    getCalendarStatuses: async (params: { month: string, employeeId?: string }): Promise<CalendarStatus[]> => {
        const statuses = getStoredStatuses();
        let filtered = statuses.filter(s => s.date.startsWith(params.month));

        if (params.employeeId && params.employeeId !== 'all') {
            filtered = filtered.filter(s => s.employeeId === params.employeeId);
        }

        return mockRequest(filtered);
    },

    setCalendarStatus: async (data: Omit<CalendarStatus, 'id'>): Promise<CalendarStatus> => {
        const statuses = getStoredStatuses();
        // Remove existing for this date/employee
        const filtered = statuses.filter(s => !(s.employeeId === data.employeeId && s.date === data.date));

        const newStatus: CalendarStatus = {
            ...data,
            id: Math.random().toString(36).substr(2, 9)
        };

        filtered.push(newStatus);
        saveStatuses(filtered);
        return mockRequest(newStatus);
    },

    setCalendarRange: async (params: { employeeId: string, from: string, to: string, status: CalendarStatusType }): Promise<void> => {
        const statuses = getStoredStatuses();
        const fromDate = new Date(params.from);
        const toDate = new Date(params.to);

        // Filter out existing in range
        let updated = statuses.filter(s => {
            if (s.employeeId !== params.employeeId) return true;
            const d = new Date(s.date);
            return d < fromDate || d > toDate;
        });

        // Add range
        const current = new Date(fromDate);
        while (current <= toDate) {
            const dateStr = current.toISOString().split('T')[0];
            updated.push({
                id: Math.random().toString(36).substr(2, 9),
                employeeId: params.employeeId,
                date: dateStr,
                status: params.status
            });
            current.setDate(current.getDate() + 1);
        }

        saveStatuses(updated);
        return mockRequest(undefined);
    },

    removeCalendarStatus: async (params: { employeeId: string, date: string }): Promise<void> => {
        const statuses = getStoredStatuses();
        const filtered = statuses.filter(s => !(s.employeeId === params.employeeId && s.date === params.date));
        saveStatuses(filtered);
        return mockRequest(undefined);
    }
};
