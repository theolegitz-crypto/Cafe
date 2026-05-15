import { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

function baseProps(props: IconProps) {
  return {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.9,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    ...props,
  };
}

export function SearchIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16L20 20" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M4 7H20" />
      <path d="M4 12H20" />
      <path d="M4 17H20" />
    </svg>
  );
}

export function CartIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M4 6H6L8.2 15.2C8.4 15.9 9 16.4 9.8 16.4H17.1C17.9 16.4 18.6 15.9 18.7 15.1L20 9H7.1" />
      <circle cx="10" cy="19" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="17" cy="19" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ContactsIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M12 21C16 17.2 19 14 19 10.3C19 6.8 16.1 4 12.5 4C10.5 4 8.8 4.9 7.7 6.4C6.7 5 5.1 4 3.3 4C2.9 4 2.4 4 2 4.1" />
      <path d="M12 21C8 17.2 5 14 5 10.3C5 9.7 5.1 9.1 5.3 8.5" />
      <circle cx="12" cy="10.5" r="2.2" />
    </svg>
  );
}

export function InstallIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M12 4V14" />
      <path d="M8.5 10.5L12 14L15.5 10.5" />
      <path d="M5 18H19" />
    </svg>
  );
}
