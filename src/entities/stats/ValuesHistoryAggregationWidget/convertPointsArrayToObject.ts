/**
 * Объект с таймстемпами, который будет сравниваться с таймстемпами каждой серии
 * @param array  - массив с точками 
 * @returns 
 */
export const convertPointsArrayToObject = (points: number[][]) => {
    return points.reduce((obj: Record<number, number>, item) => {
        const [ dt, y ] = item

        return { ...obj, [dt]: y }
    }, {}) 
}