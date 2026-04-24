export type Category = 'productive' | 'unproductive' | 'neutral' | 'uncategorized';
export type Source = 'hardcoded' | 'manual';

export interface CategorizationRow {
  id: string; // domain used as stable key
  websiteId: number;
  name: string;
  type: 'web' | 'app';
  category: Category;
  source: Source;
  updatedAt?: string;
}
