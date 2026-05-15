import { MenuTag } from '../types/menu';

export const formatPrice = (price: number) =>
  new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(price);

export const buildPlaceholderImage = (
  label: string,
  accentFrom: string,
  accentTo: string,
) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f9fbff" />
          <stop offset="100%" stop-color="#edf3fa" />
        </linearGradient>
        <linearGradient id="dish" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${accentFrom}" />
          <stop offset="100%" stop-color="${accentTo}" />
        </linearGradient>
      </defs>
      <rect width="600" height="600" rx="42" fill="url(#bg)" />
      <rect x="24" y="24" width="552" height="552" rx="36" fill="none" stroke="rgba(125,144,166,0.16)" />
      <circle cx="300" cy="276" r="178" fill="#ffffff" />
      <circle cx="300" cy="276" r="132" fill="url(#dish)" opacity="0.96" />
      <circle cx="250" cy="234" r="28" fill="rgba(255,255,255,0.26)" />
      <circle cx="336" cy="314" r="22" fill="rgba(255,255,255,0.22)" />
      <circle cx="376" cy="244" r="16" fill="rgba(255,255,255,0.18)" />
      <text
        x="300"
        y="88"
        fill="#7d90a6"
        font-size="18"
        font-family="Manrope, Arial, sans-serif"
        text-anchor="middle"
        letter-spacing="8"
      >
        NABEREZHNYE CHELNY
      </text>
      <text
        x="300"
        y="520"
        fill="#142033"
        font-size="34"
        font-family="Manrope, Arial, sans-serif"
        font-weight="700"
        text-anchor="middle"
        letter-spacing="2"
      >
        ${label.toUpperCase()}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

export const formatModeLabel = (mode: 'table' | 'pickup' | 'delivery') => {
  if (mode === 'delivery') {
    return 'Доставка';
  }

  if (mode === 'pickup') {
    return 'Самовывоз';
  }

  return 'В зале';
};

export const tagStyles: Record<MenuTag, string> = {
  Хит: 'bg-ink text-white',
  Новинка: 'bg-accentSoft text-accentDeep',
  Острое: 'bg-[#fff1df] text-[#c86b00]',
  Вегетарианское: 'bg-successSoft text-success',
};
