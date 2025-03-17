import { useEffect, useState } from 'react';

export const useWindowResize = (debounceTime = 250) => {
    const [dimensions, setDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    useEffect(() => {
        let timeoutId;

        const updateWindowDimensions = () => {
            if (!timeoutId) {
                timeoutId = setTimeout(() => {
                    setDimensions({
                        width: window.innerWidth,
                        height: window.innerHeight,
                    });
                    clearTimeout(timeoutId);
                }, debounceTime);
            }
        };

        window.addEventListener('resize', updateWindowDimensions);

        return () => {
            window.removeEventListener('resize', updateWindowDimensions);
            clearTimeout(timeoutId);
        };

    }, [debounceTime]);

    return dimensions;
};