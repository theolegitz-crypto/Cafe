export type MenuCategory =
  | 'Закуски'
  | 'Салаты'
  | 'Горячее'
  | 'Пицца'
  | 'Напитки'
  | 'Десерты';

export type MenuTag = 'Хит' | 'Новинка' | 'Острое' | 'Вегетарианское';

export type OrderMode = 'table' | 'pickup' | 'delivery';

export interface ModifierOption {
  id: string;
  name: string;
  price: number;
  defaultSelected?: boolean;
}

export interface MenuItem {
  id: string;
  category: MenuCategory;
  name: string;
  description: string;
  price: number;
  portion: string;
  imageLabel: string;
  accentFrom: string;
  accentTo: string;
  tags: MenuTag[];
  ingredients: string[];
  modifiers: ModifierOption[];
  calories: string;
  popular?: boolean;
  promoText?: string;
}

export interface CartLine {
  id: string;
  itemId: string;
  quantity: number;
  modifierIds: string[];
  comment: string;
}
