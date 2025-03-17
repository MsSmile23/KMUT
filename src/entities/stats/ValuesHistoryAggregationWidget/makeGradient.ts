export const makeGradient = (color: string) => {
    return {                                
        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
        stops: [
            [0, color],
            [0.5, color],
            [1, '#FFFFFF']
        ] 
    }
}