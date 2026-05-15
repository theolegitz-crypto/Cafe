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
          <stop offset="0%" stop-color="#f8fbff" />
          <stop offset="100%" stop-color="#eef3f9" />
        </linearGradient>
        <linearGradient id="dish" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${accentFrom}" />
          <stop offset="100%" stop-color="${accentTo}" />
        </linearGradient>
      </defs>
      <rect width="600" height="600" rx="42" fill="url(#bg)" />
      <rect x="34" y="34" width="532" height="532" rx="34" fill="none" stroke="rgba(118,136,161,0.18)" />
      <circle cx="300" cy="270" r="176" fill="#ffffff" />
      <circle cx="300" cy="270" r="132" fill="url(#dish)" opacity="0.95" />
      <circle cx="255" cy="232" r="26" fill="rgba(255,255,255,0.26)" />
      <circle cx="340" cy="320" r="20" fill="rgba(255,255,255,0.2)" />
      <circle cx="378" cy="242" r="15" fill="rgba(255,255,255,0.18)" />
      <text
        x="300"
        y="86"
        fill="#7688a1"
        font-size="18"
        font-family="Manrope, Arial, sans-serif"
        text-anchor="middle"
        letter-spacing="6"
      >
        AMBER TABLE
      </text>
      <text
        x="300"
        y="518"
        fill="#152033"
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
