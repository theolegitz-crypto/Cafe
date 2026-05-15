import { menuCategories, menuItems } from '../data/menu';
import { MenuCategory, MenuItem } from '../types/menu';

export interface MenuPayload {
  categories: MenuCategory[];
  items: MenuItem[];
}

function filterAvailable(items: MenuItem[]) {
  return items.filter((item) => item.isAvailable !== false);
}

export async function loadMenu(): Promise<MenuPayload> {
  try {
    const response = await fetch('/api/menu', {
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`menu_load_failed_${response.status}`);
    }

    const payload = (await response.json()) as MenuPayload;
    return {
      categories: payload.categories?.length ? payload.categories : menuCategories,
      items: filterAvailable(payload.items ?? menuItems),
    };
  } catch {
    return {
      categories: menuCategories,
      items: filterAvailable(menuItems),
    };
  }
}
