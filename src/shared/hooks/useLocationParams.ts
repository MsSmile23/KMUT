import { ROUTES, ROUTES_COMMON, ROUTES_SETTINGS } from '@shared/config/paths'
import { useLocation, Location } from 'react-router-dom'

type TLocationParams = {
    entity: ROUTES | null
    action: ROUTES_COMMON | ROUTES_SETTINGS | null
    idFromPath: number | null
    pathname: string[]
    search: string[]
    state: Location['state'] | null
}
    
export const useLocationParams = (): TLocationParams => {
    const { pathname, search, state } = useLocation()
    const pathnameArr = pathname.split('/')
    const searchArr = search.split('?')
    const [
        /* home */, 
        entity, 
        action, 
        objectIdFromPath 
    ]  = pathnameArr

    // Проверяем, если objectIdFromPath это не цифра, то присваиваем нуль, иначе берём его в качестве айди
    const pathObjectId = isNaN(Number(objectIdFromPath))  
        ? null
        : Number(objectIdFromPath)

    return { 
        entity: entity as TLocationParams['entity'],
        action: action as TLocationParams['action'],
        idFromPath: pathObjectId,
        pathname: pathnameArr, 
        search: searchArr, 
        state 
    } 
}