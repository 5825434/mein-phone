const base = {
  viewBox: '0 0 20 20',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export function HomeIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M3 9.5 10 4l7 5.5" />
      <path d="M5 8.5V16h10V8.5" />
    </svg>
  )
}

export function UsersIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="7.5" cy="6.5" r="2.5" />
      <path d="M2.5 16c0-2.8 2.2-5 5-5s5 2.2 5 5" />
      <circle cx="14" cy="7" r="2" />
      <path d="M13 11.2c1.9.4 3.5 2.2 3.5 4.8" />
    </svg>
  )
}

export function SwapIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M3 7h11l-2.3-2.3M17 13H6l2.3 2.3" />
    </svg>
  )
}

export function BoxIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M3 6.5 10 3l7 3.5-7 3.5-7-3.5Z" />
      <path d="M3 6.5V14l7 3.5 7-3.5V6.5" />
    </svg>
  )
}

export function CartIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M3 5h2l1.6 8.4a1.5 1.5 0 0 0 1.5 1.2h6a1.5 1.5 0 0 0 1.5-1.3L17 7H6" />
      <circle cx="8.5" cy="17" r="1" />
      <circle cx="14.5" cy="17" r="1" />
    </svg>
  )
}

export function TruckIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="2.5" y="8" width="9" height="6" />
      <path d="M11.5 10.5H15l2.5 2.5V14h-6" />
      <circle cx="6" cy="16" r="1.3" />
      <circle cx="14.5" cy="16" r="1.3" />
    </svg>
  )
}

export function ChartIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 16.5V11M9.5 16.5V6M15 16.5v-8" />
    </svg>
  )
}

export function GearIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="10" cy="10" r="2.6" />
      <path d="M10 3.5v1.7M10 14.8v1.7M16.5 10h-1.7M5.2 10H3.5M14.6 5.4l-1.2 1.2M6.6 13.4l-1.2 1.2M14.6 14.6l-1.2-1.2M6.6 6.6 5.4 5.4" />
    </svg>
  )
}
