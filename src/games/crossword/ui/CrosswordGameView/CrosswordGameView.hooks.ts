import { useEffect } from 'react'

export function useSelectedCellInView() {
  useEffect(() => {
    const viewport = window.visualViewport
    if (!viewport) {
      return
    }
    function onResize() {
      document
        .querySelector('[aria-label="Board"] [aria-selected="true"]')
        ?.scrollIntoView({ block: 'nearest' })
    }
    viewport.addEventListener('resize', onResize)
    return () => viewport.removeEventListener('resize', onResize)
  }, [])
}
