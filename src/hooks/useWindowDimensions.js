/**
 * Hook for getting window width
 */

import { useState, useEffect } from 'react';

const useWindowDimensions = () => {
  const [windowWidth, setWindowWidth] = useState(getWindowWidth());

  /**
   * Adds resize listener
   */
  useEffect(() => {
    const handleResize = () => {
        setWindowWidth(getWindowWidth())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return { windowWidth }
}

//#region
/**
 * Gets window width from window object
 * @returns {number} Inner width of window
 */
const getWindowWidth = () => {
    return window.innerWidth
}
//#endregion

export default useWindowDimensions