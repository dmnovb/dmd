import { cn } from '@/lib/utils'

type PhotoSlotProps = {
  alt: string
  image?: string
  hint: string
  className?: string
}

/** Real photo if one exists; otherwise a grey frame with the file path. */
export function PhotoSlot({ alt, image, hint, className }: PhotoSlotProps) {
  if (image) {
    return (
      <img
        src={image}
        alt={alt}
        loading="lazy"
        className={cn('size-full object-cover', className)}
      />
    )
  }

  return (
    <div
      className={cn(
        'flex size-full items-center justify-center bg-muted text-center',
        className,
      )}
    >
      <p className="px-4 font-mono text-xs text-muted-foreground">{hint}</p>
    </div>
  )
}
