// @/lib/landing/useGSAP.ts
let gsapPromise: Promise<void> | null = null

export const loadGSAP = (): Promise<void> => {
  if (gsapPromise) return gsapPromise
  gsapPromise = new Promise<void>((resolve) => {
    if (typeof window === 'undefined') { resolve(); return }
    if (window.gsap) { resolve(); return }
    const s1 = document.createElement('script')
    s1.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js'
    s1.onload = () => {
      const s2 = document.createElement('script')
      s2.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js'
      s2.onload = () => {
        window.gsap.registerPlugin(window.ScrollTrigger)
        resolve()
      }
      document.head.appendChild(s2)
    }
    document.head.appendChild(s1)
  })
  return gsapPromise
}