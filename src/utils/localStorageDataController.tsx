/* eslint-disable @typescript-eslint/no-explicit-any */
export const getLocalStorageData = (itemName: any) => {
    let localStorageValue: any = localStorage.getItem(itemName)

    if (localStorageValue !== null || undefined) {
        localStorageValue = JSON.parse(localStorageValue)
    }
    
    return localStorageValue !== null || undefined ? localStorageValue : []
}

export const setLocalStorageData = (itemName: any, value: any) => {
    if (value !== undefined) {
        localStorage.setItem(itemName, JSON.stringify(value))
    }
}