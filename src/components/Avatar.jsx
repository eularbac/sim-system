const PALETTE = [
  { bg: 'var(--color-rose-400)', fg: '#fff' },
  { bg: 'var(--color-terracotta-400)', fg: '#fff' },
  { bg: 'var(--color-sage-400)', fg: '#fff' },
  { bg: 'var(--color-gold-400)', fg: 'var(--color-espresso-900)' },
  { bg: 'var(--color-rose-600)', fg: '#fff' },
]

function initials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

function colorFor(name = '') {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return PALETTE[Math.abs(hash) % PALETTE.length]
}

export default function Avatar({ name, size = 32 }) {
  const { bg, fg } = colorFor(name)
  return (
    <span
      className="inline-flex items-center justify-center rounded-full font-body font-medium shrink-0 select-none"
      style={{ width: size, height: size, backgroundColor: bg, color: fg, fontSize: size * 0.38 }}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  )
}
