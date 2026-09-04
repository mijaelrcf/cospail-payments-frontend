import { useEffect, useRef } from 'react'

const SENT_KEY = 'cospail_pageview_sent'

/**
 * Envía un beacon de visita una sola vez por sesión (tab) al contador
 * diario del backend (POST /api/analytics/visits). Fire-and-forget:
 * nunca bloquea ni rompe la UI si falla.
 */
export function usePageviewBeacon() {
  const attempted = useRef(false)

  useEffect(() => {
    if (attempted.current) return
    attempted.current = true

    if (import.meta.env.VITE_ANALYTICS_ENABLED === 'false') return

    let alreadySent = false
    try {
      alreadySent = sessionStorage.getItem(SENT_KEY) === '1'
    } catch {
      alreadySent = false
    }
    if (alreadySent) return

    try {
      sessionStorage.setItem(SENT_KEY, '1')
    } catch {
      // sessionStorage no disponible: igual se intenta una vez por montaje
    }

    const base = import.meta.env.VITE_API_BASE_URL as string | undefined
    if (!base) return

    const url = `${base.replace(/\/$/, '')}/analytics/visits`

    try {
      if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
        const ok = navigator.sendBeacon(url)
        if (ok) return
      }
    } catch {
      // cae al fetch de respaldo
    }

    try {
      void fetch(url, { method: 'POST', keepalive: true }).catch(() => undefined)
    } catch {
      // ignorar: analítica nunca debe romper la app
    }
  }, [])
}
