import { useEffect, useMemo, useState } from 'react'
import { useDebounceCallback } from './useDebounce'

export const useWindowResizeCallback = (debounceTime = 250) => {
    const [dimensions, setDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    })

    const updateWindowDimensions = useDebounceCallback(() => {
        setDimensions({
            width: window.innerWidth,
            height: window.innerHeight,
        });
    // }
    }, 200);

    useEffect(() => {
        window.addEventListener('resize', updateWindowDimensions)

        return () => {
            window.removeEventListener('resize', updateWindowDimensions)
        }

    }, [debounceTime])

    return useMemo(() => dimensions, [dimensions])
};