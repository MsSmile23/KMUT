import { FC, PropsWithChildren, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { ROUTES } from '@shared/config/paths'
import { /* IInterfaceView,  */generalStore } from '@shared/stores/general'
import { useLocationStore } from '@shared/stores/locations'
// import { ROUTE_ENTITY } from '@app/routes/paths'
// import { getURL } from '@shared/utils/nav'

export const PrevLocationProvider: FC<PropsWithChildren> = ({ children }) => {
    const location = useLocation()
    const prevPath = useRef<string[]>([])
    const locationStore = useLocationStore()
    const navigate = useNavigate()
    const [/* previousLocation, */ setPreviousLocation, setInterfaceView, interfaceView] = generalStore((state) => [
        // state.previousLocation,
        state.setPreviousLocation,
        state.setInterfaceView,
        state.interfaceView
    ])
    // const [prevInterface, setPrevInterface] = useState(undefined)

    const notSavedPaths = [
        // ROUTES.MAIN,
        `/${ROUTES.AUTH}/${ROUTES.INTERFACEVIEWS}`,
        `/${ROUTES.AUTH}/${ROUTES.PRELOAD}`,
        `/${ROUTES.AUTH}/${ROUTES.LOGIN}`
    ]

    const setPrev = (paths: typeof prevPath.current) => {
        let path = ''

        for (let i = paths.length - 1; i >= 0; i--) {
            if (notSavedPaths.includes(paths[i])) {
                continue
            } else {
                path = paths[i]
                break
            }
        }

        return path
    }


    const getPathInterface = (path: string) => {
        if (interfaceView !== '') {
            const interfacePathPart = path.split('/')
            /* const interfaceFromPath = interfacePathPart[1] !== '' 
                ? interfacePathPart[1] 
                : 'showcase' */

            
            if (interfacePathPart[1].includes('constructor')) {
                interfaceView !== 'constructor' && setInterfaceView('constructor')
                locationStore.setInterfacesRoute('constructor', path)
            } else if (interfacePathPart[1].includes('manager')) {
                interfaceView !== 'manager' && setInterfaceView('manager')
                locationStore.setInterfacesRoute('manager', path)
            } else {
                interfaceView !== 'showcase' && setInterfaceView('showcase')
                locationStore.setInterfacesRoute('showcase', path)
            }

            // interfaceView !== interfaceFromPath && setInterfaceView(interfaceFromPath as IInterfaceView)
            // locationStore.setInterfacesRoute(interfaceFromPath as IInterfaceView, path)

            // console.log(`path = [${path}]`)
            // console.log(`interfaceFromPath = [${interfaceFromPath}]`)
        }
    }

    useEffect(() => {
        const path = location.pathname + location?.search 
        const pathCondition = notSavedPaths.includes(path)
        
        if (!pathCondition) {
            setPreviousLocation(path)
            getPathInterface(path)
        }

        prevPath.current.push(path)
    }, [
        location?.pathname,
        location?.search
    ])
    
    /* useEffect(() => {
        getPathInterface(location.pathname + location?.search)
        prevPath.current.push(location.pathname + location?.search)
    }, [
        location.pathname,
        location?.search
    ]) */

    useEffect(() => {
        setPreviousLocation(setPrev(prevPath.current))
    }, [prevPath.current.length])

    //При смене интерфейса сохраняем роут предыдущего в стор и достаем роут открываемого
    /* useEffect(() => {
        if (interfaceView 
            && !setPrev(prevPath.current).includes(`${ROUTES.DEV}/`)) {
            locationStore.setInterfacesRoute(prevInterface, setPrev(prevPath.current))
            setPrevInterface(interfaceView)
            navigate(locationStore.getLastRoute(interfaceView))
        }

        if (prevPath.current[prevPath.current.length - 1] === '/') {
            locationStore.setInterfacesRoute(prevInterface, '/')
            setPrevInterface(interfaceView)
            navigate(locationStore.getLastRoute(interfaceView))
        }

    }, [interfaceView]) */

    useEffect(() => {
        navigate(location.pathname + location?.search)
    }, [])
    
    // при смене интерфейса обнулить предыдущий путь, за исключением ветки дев
    /* useEffect(() => {
        if (!previousLocation.includes(`${ROUTES.DEV}/`)) {
            setPreviousLocation(ROUTES.MAIN)
            // setPreviousLocation(getURL('', interfaceView !== '' ? interfaceView : 'showcase'))
        }
    }, [interfaceView]) */

    return <div>{children}</div>
}