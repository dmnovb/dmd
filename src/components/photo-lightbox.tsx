import { useEffect, useId, useLayoutEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

import { useLocale } from '@/i18n/locale'
import {
  PHOTO_CLOSE_MS,
  PHOTO_OPEN_MS,
  SCRIM_MS,
  THUMB_RADIUS,
  centeredRect,
  prefersReducedMotion,
  rectFromElement,
  type PhotoRect,
} from '@/lib/photo-transition'
import { cn } from '@/lib/utils'

type PhotoLightboxProps = {
  alt: string
  aspect: number | null
  index: number
  onIndexChange: (index: number) => void
  onOpenChange: (open: boolean) => void
  open: boolean
  origin: PhotoRect | null
  photos: string[]
  thumbId: string
}

export function PhotoLightbox({
  alt,
  aspect,
  index,
  onIndexChange,
  onOpenChange,
  open,
  origin,
  photos,
  thumbId,
}: PhotoLightboxProps) {
  const { t } = useLocale()
  const titleId = useId()
  const photo = photos[index]
  const hasSet = photos.length > 1
  const boxRef = useRef<HTMLDivElement>(null)
  const scrimRef = useRef<HTMLButtonElement>(null)
  const chromeRef = useRef<HTMLDivElement>(null)
  const leavingRef = useRef(false)
  const closeTimerRef = useRef(0)
  const frameRef = useRef(0)
  const closeRef = useRef<() => void>(() => {})

  useLayoutEffect(() => {
    if (!open || !origin) return

    const box = boxRef.current
    const scrim = scrimRef.current
    const chrome = chromeRef.current
    if (!box || !scrim || origin.width < 1) return

    leavingRef.current = false
    window.clearTimeout(closeTimerRef.current)
    cancelAnimationFrame(frameRef.current)

    const targetAspect =
      aspect && Number.isFinite(aspect) && aspect > 0
        ? aspect
        : origin.width / origin.height
    const dest = centeredRect(targetAspect)
    const reduce = prefersReducedMotion()

    box.style.transition = 'none'
    box.style.top = `${origin.top}px`
    box.style.left = `${origin.left}px`
    box.style.width = `${origin.width}px`
    box.style.height = `${origin.height}px`
    box.style.borderRadius = THUMB_RADIUS
    box.style.pointerEvents = 'none'
    scrim.style.transition = 'none'
    scrim.style.opacity = '0'
    scrim.style.pointerEvents = 'none'
    if (chrome) {
      chrome.style.transition = 'none'
      chrome.style.opacity = '0'
    }

    void box.offsetWidth

    if (reduce) {
      box.style.top = `${dest.top}px`
      box.style.left = `${dest.left}px`
      box.style.width = `${dest.width}px`
      box.style.height = `${dest.height}px`
      box.style.borderRadius = '0'
      box.style.pointerEvents = 'auto'
      scrim.style.opacity = '1'
      scrim.style.pointerEvents = 'auto'
      if (chrome) chrome.style.opacity = '1'
      return
    }

    frameRef.current = requestAnimationFrame(() => {
      box.style.transition = `top ${PHOTO_OPEN_MS}ms var(--ease-in-out), left ${PHOTO_OPEN_MS}ms var(--ease-in-out), width ${PHOTO_OPEN_MS}ms var(--ease-in-out), height ${PHOTO_OPEN_MS}ms var(--ease-in-out), border-radius ${PHOTO_OPEN_MS}ms var(--ease-in-out)`
      box.style.top = `${dest.top}px`
      box.style.left = `${dest.left}px`
      box.style.width = `${dest.width}px`
      box.style.height = `${dest.height}px`
      box.style.borderRadius = '0'
      scrim.style.transition = `opacity ${SCRIM_MS}ms var(--ease-out)`
      scrim.style.opacity = '1'
      if (chrome) {
        chrome.style.transition = `opacity ${SCRIM_MS}ms var(--ease-out)`
        chrome.style.opacity = '1'
      }
      closeTimerRef.current = window.setTimeout(() => {
        box.style.pointerEvents = 'auto'
        scrim.style.pointerEvents = 'auto'
      }, PHOTO_OPEN_MS)
    })

    return () => {
      cancelAnimationFrame(frameRef.current)
      window.clearTimeout(closeTimerRef.current)
    }
  }, [aspect, open, origin?.height, origin?.left, origin?.top, origin?.width])

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeRef.current()
        return
      }
      if (!hasSet) return
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        onIndexChange((index + 1) % photos.length)
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        onIndexChange((index - 1 + photos.length) % photos.length)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [hasSet, index, onIndexChange, open, photos.length])

  function close() {
    if (!open || leavingRef.current || !origin) return

    const box = boxRef.current
    const scrim = scrimRef.current
    const chrome = chromeRef.current

    if (prefersReducedMotion() || !box || origin.width < 1) {
      onOpenChange(false)
      return
    }

    leavingRef.current = true
    window.clearTimeout(closeTimerRef.current)

    // Always fly back to the thumb for the photo currently on screen —
    // not the one that originally opened the lightbox.
    const thumb = document.querySelector<HTMLElement>(
      `[data-project-photo="${thumbId}"]`,
    )
    const target = thumb ? rectFromElement(thumb) : origin
    if (thumb) thumb.style.visibility = 'hidden'

    box.style.pointerEvents = 'none'
    box.style.transition = `top ${PHOTO_CLOSE_MS}ms var(--ease-in-out), left ${PHOTO_CLOSE_MS}ms var(--ease-in-out), width ${PHOTO_CLOSE_MS}ms var(--ease-in-out), height ${PHOTO_CLOSE_MS}ms var(--ease-in-out), border-radius ${PHOTO_CLOSE_MS}ms var(--ease-in-out)`
    box.style.top = `${target.top}px`
    box.style.left = `${target.left}px`
    box.style.width = `${target.width}px`
    box.style.height = `${target.height}px`
    box.style.borderRadius = THUMB_RADIUS
    if (scrim) {
      scrim.style.transition = `opacity ${SCRIM_MS}ms var(--ease-out)`
      scrim.style.opacity = '0'
    }
    if (chrome) {
      chrome.style.transition = `opacity ${SCRIM_MS}ms var(--ease-out)`
      chrome.style.opacity = '0'
    }

    closeTimerRef.current = window.setTimeout(() => {
      if (thumb) thumb.style.visibility = ''
      onOpenChange(false)
    }, PHOTO_CLOSE_MS)
  }

  closeRef.current = close

  if (!open || !origin || !photo) return null

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-[60]"
    >
      <h2 id={titleId} className="sr-only">
        {alt}
      </h2>
      <button
        ref={scrimRef}
        type="button"
        aria-label={t.projects.lightbox.close}
        className="absolute inset-0 cursor-zoom-out border-0 bg-background/70"
        style={{ opacity: 0, pointerEvents: 'none' }}
        onClick={close}
      />
      <div
        ref={boxRef}
        className="overflow-hidden will-change-transform"
        style={{
          position: 'fixed',
          top: origin.top,
          left: origin.left,
          width: origin.width,
          height: origin.height,
          borderRadius: THUMB_RADIUS,
          pointerEvents: 'none',
          zIndex: 1,
        }}
      >
        <img
          alt={alt}
          src={photo}
          className="size-full object-cover select-none"
          draggable={false}
        />
      </div>
      <div
        ref={chromeRef}
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{ opacity: 0 }}
      >
        <button
          type="button"
          className={cn(
            'pointer-events-auto absolute top-4 right-4 cursor-pointer border-0 bg-transparent p-2 text-sm text-muted-foreground sm:top-6 sm:right-6',
            'hover:text-foreground',
            'focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none',
          )}
          onClick={close}
        >
          {t.projects.lightbox.close}
        </button>
        {hasSet ? (
          <div className="pointer-events-auto absolute inset-x-4 bottom-4 flex justify-between text-sm sm:inset-x-8 sm:bottom-6">
            <button
              type="button"
              className="cursor-pointer border-0 bg-transparent p-2 text-muted-foreground transition-colors hover:text-foreground focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
              onClick={() =>
                onIndexChange((index - 1 + photos.length) % photos.length)
              }
            >
              {t.projects.lightbox.previous}
            </button>
            <button
              type="button"
              className="cursor-pointer border-0 bg-transparent p-2 text-muted-foreground transition-colors hover:text-foreground focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
              onClick={() =>
                onIndexChange((index + 1) % photos.length)
              }
            >
              {t.projects.lightbox.next}
            </button>
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  )
}
