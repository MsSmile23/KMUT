// import { menuItems } from "@configapp/menu"






// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const jsonParseAsObject = (data: any) => {
    try {
        if (typeof data === 'object') {return data}
        
        return JSON.parse(data)
    } catch {
        return {}
    
    }}

export const LSChangeController = (lsParam: string, value: any) => {
    localStorage.setItem(lsParam, value)
    window.dispatchEvent(new Event(`${lsParam}-storage`))
}