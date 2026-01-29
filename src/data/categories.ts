export interface Category {
  id: string;
  name: string;
  iconName: string;
  color: string;
  bgColor: string;
  emoji: string;
  description?: string;
  createdAt?: string;
}

// Default categories for BhaktiSetu
export const defaultCategories: Category[] = [
  {
    id: '146dee06-cb24-4d77-a57f-bfddb1afb74c',
    name: 'Kirtankar',
    iconName: 'Mic',
    color: '#FF9933',
    bgColor: 'bg-[#FF9933]',
    emoji: '🕉️',
    description: 'Professional Kirtan performers',
    createdAt: '2026-01-01',
  },
  {
    id: 'gayak',
    name: 'Gayak (Singer)',
    iconName: 'Music',
    color: '#00AEEF',
    bgColor: 'bg-[#00AEEF]',
    emoji: '🎤',
    description: 'Devotional singers and vocalists',
    createdAt: '2026-01-01',
  },
  {
    id: 'achari',
    name: 'Achari (Pooja)',
    iconName: 'Droplet',
    color: '#800000',
    bgColor: 'bg-[#800000]',
    emoji: '🔱',
    description: 'Pooja ceremony experts',
    createdAt: '2026-01-01',
  },
  {
    id: 'lighting',
    name: 'Lighting / Mandap',
    iconName: 'Lightbulb',
    color: '#FFD700',
    bgColor: 'bg-[#FFD700]',
    emoji: '💡',
    description: 'Lighting and mandap decoration services',
    createdAt: '2026-01-01',
  },
  {
    id: 'mrudung',
    name: 'Mrudung Vadak',
    iconName: 'Drum',
    color: '#A0522D',
    bgColor: 'bg-[#A0522D]',
    emoji: '🥁',
    description: 'Traditional drum players',
    createdAt: '2026-01-01',
  },
  {
    id: 'harmonium',
    name: 'Harmonium Player',
    iconName: 'Piano',
    color: '#008080',
    bgColor: 'bg-[#008080]',
    emoji: '🎹',
    description: 'Skilled harmonium players',
    createdAt: '2026-01-01',
  },
  {
    id: 'bhajani',
    name: 'Bhajani Mandal',
    iconName: 'Users',
    color: '#9932CC',
    bgColor: 'bg-[#9932CC]',
    emoji: '👥',
    description: 'Traditional bhajan singing groups',
    createdAt: '2026-01-01',
  },
  {
    id: 'photographer',
    name: 'Photographer',
    iconName: 'Camera',
    color: '#A9A9A9',
    bgColor: 'bg-[#A9A9A9]',
    emoji: '🎥',
    description: 'Event photography and videography',
    createdAt: '2026-01-01',
  },
];

// In-memory storage for categories (simulating a database)
let categories: Category[] = [...defaultCategories];

export const getCategories = (): Category[] => {
  return [...categories];
};

export const addCategory = (category: Omit<Category, 'createdAt'>): Category => {
  const newCategory: Category = {
    ...category,
    createdAt: new Date().toISOString(),
  };
  categories.push(newCategory);
  return newCategory;
};

export const updateCategory = (id: string, updates: Partial<Category>): Category | null => {
  const index = categories.findIndex(cat => cat.id === id);
  if (index === -1) return null;
  
  categories[index] = { ...categories[index], ...updates };
  return categories[index];
};

export const deleteCategory = (id: string): boolean => {
  const initialLength = categories.length;
  categories = categories.filter(cat => cat.id !== id);
  return categories.length < initialLength;
};

export const resetCategories = () => {
  categories = [...defaultCategories];
};
