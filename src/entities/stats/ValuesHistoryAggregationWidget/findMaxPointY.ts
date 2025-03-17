export const findMaxPointY = (series: { data: number[][] | number[] }[]) => {
    return Math.max(...series.map((serie) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return Math.max(...serie.data.map(([ _dt, y = 0 ]: any) => y) as any)
    }))
}