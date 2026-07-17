// Signature element: a satin-ribbon squiggle used under section titles
// throughout the app — a quiet nod to the wedding theme, not a generic
// hairline rule or numbered marker.
export default function Ribbon({ color = 'var(--color-rose-400)', width = 72 }) {
  return (
    <svg
      width={width}
      height="10"
      viewBox="0 0 72 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mt-2"
      aria-hidden="true"
    >
      <path
        d="M1 7C6 2 10 2 15 5.5C20 9 24 9 29 5.5C34 2 38 2 43 5.5C48 9 52 9 57 5.5C62 2 66 2 71 5.5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}
