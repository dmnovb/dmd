export const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)'
export const EASE_IN_OUT = 'cubic-bezier(0.77, 0, 0.175, 1)'
export const PHOTO_OPEN_MS = 280
export const PHOTO_CLOSE_MS = 220
export const SCRIM_MS = 200
export const THUMB_RADIUS = '0.625rem'

export type PhotoRect = {
  left: number
  top: number
  width: number
  height: number
}

export function rectFromElement(el: Element): PhotoRect {
  const r = el.getBoundingClientRect()
  return { left: r.left, top: r.top, width: r.width, height: r.height }
}

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export const TRANSFORM_NONE = 'translate3d(0, 0, 0) scale(1)'

/** Largest rect for a given aspect that fits in the viewport. */
export function centeredRect(aspect: number): PhotoRect {
  const padding = window.matchMedia('(min-width: 640px)').matches ? 48 : 20
  const maxW = window.innerWidth - padding * 2
  const maxH = window.innerHeight - padding * 2
  const safeAspect = Number.isFinite(aspect) && aspect > 0 ? aspect : 4 / 3
  let width = maxW
  let height = width / safeAspect
  if (height > maxH) {
    height = maxH
    width = height * safeAspect
  }
  return {
    left: (window.innerWidth - width) / 2,
    top: (window.innerHeight - height) / 2,
    width,
    height,
  }
}

/** Maps a box laid out at `from` onto `to`. Origin top-left. */
export function mapBox(from: PhotoRect, to: PhotoRect) {
  if (from.width < 1 || to.width < 1) return TRANSFORM_NONE
  const scaleX = to.width / from.width
  const scaleY = from.height < 1 ? scaleX : to.height / from.height
  const tx = to.left - from.left
  const ty = to.top - from.top
  return `translate3d(${tx}px, ${ty}px, 0) scale(${scaleX}, ${scaleY})`
}
