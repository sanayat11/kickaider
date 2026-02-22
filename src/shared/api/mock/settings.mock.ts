
export interface GeneralSettings {
    timezone: string;
    language: 'ru' | 'en';
    idleThreshold: number;
    lateTolerance: number;
}

export interface AdminAccount {
    id: string;
    login: string;
    password?: string;
    createdAt: string;
}

export interface AgentStopPassword {
    employeeId: string;
    password: string;
    createdAt: string;
    used: boolean;
}

const STORAGE_KEYS = {
    GENERAL: 'kickaider:generalSettings',
    ACCOUNTS: 'kickaider:adminAccounts',
    STOP_PASSWORDS: 'kickaider:agentStopPasswords'
};

const mockDelay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

const DEFAULT_SETTINGS: GeneralSettings = {
    timezone: 'Europe/Moscow',
    language: 'ru',
    idleThreshold: 10,
    lateTolerance: 5
};

const DEFAULT_ACCOUNTS: AdminAccount[] = [
    {
        id: 'admin-1',
        login: 'admin',
        password: 'admin',
        createdAt: new Date().toISOString()
    }
];

export const settingsMockApi = {
    // General Settings
    getGeneralSettings: async (): Promise<GeneralSettings> => {
        await mockDelay();
        const stored = localStorage.getItem(STORAGE_KEYS.GENERAL);
        return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
    },

    saveGeneralSettings: async (settings: GeneralSettings): Promise<void> => {
        await mockDelay();
        localStorage.setItem(STORAGE_KEYS.GENERAL, JSON.stringify(settings));
    },

    // Admin Accounts
    getAdminAccounts: async (): Promise<AdminAccount[]> => {
        await mockDelay();
        const stored = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
        return stored ? JSON.parse(stored) : DEFAULT_ACCOUNTS;
    },

    createAdminAccount: async (data: Omit<AdminAccount, 'id' | 'createdAt'>): Promise<AdminAccount> => {
        await mockDelay();
        const accounts = await settingsMockApi.getAdminAccounts();

        if (accounts.some(acc => acc.login === data.login)) {
            throw new Error('Account with this login already exists');
        }

        const newAccount: AdminAccount = {
            id: `admin-${Date.now()}`,
            login: data.login,
            password: data.password,
            createdAt: new Date().toISOString()
        };

        const updated = [...accounts, newAccount];
        localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(updated));
        return newAccount;
    },

    deleteAdminAccount: async (id: string): Promise<void> => {
        await mockDelay();
        const accounts = await settingsMockApi.getAdminAccounts();
        const updated = accounts.filter(acc => acc.id !== id);
        localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(updated));
    },

    // Agent Stop Passwords
    generateAgentStopPassword: async (employeeId: string): Promise<AgentStopPassword> => {
        await mockDelay();
        const passwords = await settingsMockApi.getAgentStopPasswords();

        // Generate random 6-8 char string
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const length = 6 + Math.floor(Math.random() * 3);
        let password = '';
        for (let i = 0; i < length; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        const newEntry: AgentStopPassword = {
            employeeId,
            password,
            createdAt: new Date().toISOString(),
            used: false
        };

        // Replace existing for this employee or add new
        const updated = passwords.filter(p => p.employeeId !== employeeId);
        updated.push(newEntry);

        localStorage.setItem(STORAGE_KEYS.STOP_PASSWORDS, JSON.stringify(updated));
        return newEntry;
    },

    getAgentStopPasswords: async (): Promise<AgentStopPassword[]> => {
        await mockDelay();
        const stored = localStorage.getItem(STORAGE_KEYS.STOP_PASSWORDS);
        return stored ? JSON.parse(stored) : [];
    }
};
