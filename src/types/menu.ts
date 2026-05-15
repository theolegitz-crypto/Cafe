export type MenuCategory =
  | 'Закуски'
  | 'Салаты'
  | 'Горячие блюда'
  | 'Напитки'
  | 'Десерты';

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
}
