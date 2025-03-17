export const sortRows = (a: any, b: any, key: string) => {
    const ak = a[key]
    const bk = b[key]

    if (Number(ak) && Number(bk)) {
        return Number(ak) - Number(bk)
    } else {
        return `${ak}`.localeCompare(`${bk}`)
    }
}