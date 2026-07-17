import Ribbon from './Ribbon'

export default function PageHeading({ eyebrow, title, description }) {
  return (
    <div className="mb-8">
      {eyebrow && (
        <p className="font-body text-xs tracking-[0.2em] uppercase text-rose-600 mb-1">
          {eyebrow}
        </p>
      )}
      <h1 className="font-display text-3xl md:text-4xl text-espresso-900 font-medium">
        {title}
      </h1>
      <Ribbon />
      {description && (
        <p className="font-body text-espresso-500 mt-4 max-w-2xl leading-relaxed">
          {description}
        </p>
      )}
    </div>
  )
}
