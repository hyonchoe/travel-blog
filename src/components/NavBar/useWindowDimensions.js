import { useState, useEffect } from 'react';

const useWindowDimensions = () => {
  const [windowWidth, setWindowWidth] = useState(getWindowWidth());

  useEffect(() => {
    const handleResize = () => {
        setWindowWidth(getWindowWidth())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return { windowWidth }
}

const getWindowWidth = () => {
    return window.innerWidth
}

export default useWindowDimensions