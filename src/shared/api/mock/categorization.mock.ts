export type Category = 'productive' | 'unproductive' | 'neutral' | 'uncategorized';
export type Source = 'hardcoded' | 'manual';

export interface CategorizationRow {
    id: string;
    name: string;
    type: 'web' | 'app';
    category: Category;
    source: Source;
    updatedAt?: string;
    hardcodedCategory?: Category;
}

const STORAGE_KEY = 'kickaider:categorization';

const INITIAL_DATA: CategorizationRow[] = [
    { id: '1', name: 'google.com', type: 'web', category: 'productive', source: 'hardcoded', hardcodedCategory: 'productive' },
    { id: '2', name: 'youtube.com', type: 'web', category: 'neutral', source: 'hardcoded', hardcodedCategory: 'neutral' },
    { id: '3', name: 'facebook.com', type: 'web', category: 'unproductive', source: 'hardcoded', hardcodedCategory: 'unproductive' },
    { id: '4', name: 'github.com', type: 'web', category: 'productive', source: 'hardcoded', hardcodedCategory: 'productive' },
    { id: '5', name: 'vscodium.exe', type: 'app', category: 'productive', source: 'hardcoded', hardcodedCategory: 'productive' },
    { id: '6', name: 'slack.exe', type: 'app', category: 'neutral', source: 'hardcoded', hardcodedCategory: 'neutral' },
    { id: '7', name: 'telegram.exe', type: 'app', category: 'unproductive', source: 'hardcoded', hardcodedCategory: 'unproductive' },
    { id: '8', name: 'figma.com', type: 'web', category: 'productive', source: 'hardcoded', hardcodedCategory: 'productive' },
    { id: '9', name: 'stackoverflow.com', type: 'web', category: 'productive', source: 'hardcoded', hardcodedCategory: 'productive' },
    { id: '10', name: 'zoom.exe', type: 'app', category: 'neutral', source: 'hardcoded', hardcodedCategory: 'neutral' },
    { id: '11', name: 'notion.so', type: 'web', category: 'productive', source: 'hardcoded', hardcodedCategory: 'productive' },
    { id: '12', name: 'spotify.exe', type: 'app', category: 'unproductive', source: 'hardcoded', hardcodedCategory: 'unproductive' },
    { id: '13', name: 'jira.atlassian.com', type: 'web', category: 'productive', source: 'hardcoded', hardcodedCategory: 'productive' },
    { id: '14', name: 'trello.com', type: 'web', category: 'productive', source: 'hardcoded', hardcodedCategory: 'productive' },
    { id: '15', name: 'chrome.exe', type: 'app', category: 'neutral', source: 'hardcoded', hardcodedCategory: 'neutral' },
    { id: '16', name: 'reddit.com', type: 'web', category: 'unproductive', source: 'hardcoded', hardcodedCategory: 'unproductive' },
    { id: '17', name: 'linkedin.com', type: 'web', category: 'neutral', source: 'hardcoded', hardcodedCategory: 'neutral' },
    { id: '18', name: 'docker.exe', type: 'app', category: 'productive', source: 'hardcoded', hardcodedCategory: 'productive' },
    { id: '19', name: 'postman.exe', type: 'app', category: 'productive', source: 'hardcoded', hardcodedCategory: 'productive' },
    { id: '20', name: 'steam.exe', type: 'app', category: 'unproductive', source: 'hardcoded', hardcodedCategory: 'unproductive' },
    { id: '21', name: 'unknown-site.io', type: 'web', category: 'uncategorized', source: 'hardcoded', hardcodedCategory: 'uncategorized' },
    { id: '22', name: 'mystery.app', type: 'app', category: 'uncategorized', source: 'hardcoded', hardcodedCategory: 'uncategorized' },
];

const getStoredData = (): CategorizationRow[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
        return INITIAL_DATA;
    }
    return JSON.parse(stored);
};

const saveStoredData = (data: CategorizationRow[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const categorizationMockApi = {
    getCategorizationList: async (params: { search?: string, filter?: 'all' | 'uncategorized' | 'manual', type?: 'all' | 'web' | 'app' }): Promise<CategorizationRow[]> => {
        await new Promise(resolve => setTimeout(resolve, 400));
        let data = getStoredData();

        if (params.search) {
            const q = params.search.toLowerCase();
            data = data.filter(r => r.name.toLowerCase().includes(q));
        }

        if (params.filter === 'uncategorized') {
            data = data.filter(r => r.category === 'uncategorized');
        } else if (params.filter === 'manual') {
            data = data.filter(r => r.source === 'manual');
        }

        if (params.type && params.type !== 'all') {
            data = data.filter(r => r.type === params.type);
        }

        return data;
    },

    setCategory: async (id: string, category: Category): Promise<CategorizationRow> => {
        await new Promise(resolve => setTimeout(resolve, 300));
        const data = getStoredData();
        const index = data.findIndex(r => r.id === id);
        if (index === -1) throw new Error('Not found');

        data[index] = {
            ...data[index],
            category,
            source: 'manual',
            updatedAt: new Date().toISOString()
        };

        saveStoredData(data);
        return data[index];
    },

    resetToDefault: async (id: string): Promise<CategorizationRow> => {
        await new Promise(resolve => setTimeout(resolve, 300));
        const data = getStoredData();
        const index = data.findIndex(r => r.id === id);
        if (index === -1) throw new Error('Not found');

        const hardcoded = data[index].hardcodedCategory || 'uncategorized';
        data[index] = {
            ...data[index],
            category: hardcoded,
            source: 'hardcoded',
            updatedAt: new Date().toISOString()
        };

        saveStoredData(data);
        return data[index];
    },

    resetAllManual: async (): Promise<void> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const data = getStoredData();
        const resetData = data.map(r => ({
            ...r,
            category: r.hardcodedCategory || 'uncategorized',
            source: 'hardcoded' as Source
        }));
        saveStoredData(resetData);
    }
};
