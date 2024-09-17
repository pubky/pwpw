export type TCategory = {
  id: string;
  name: string;
};

export type TCategories = TCategory[];

export type TItem = {
  id: string;
  title: string;
  category?: string;
  username?: string;
  password?: string;
  url?: string;
  notes?: string;
};

export type TItems = TItem[];
