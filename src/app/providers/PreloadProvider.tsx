import Preload from '@pages/auth/preload'
// import { ROUTES } from '@shared/config/paths'
import { generalStore } from '@shared/stores/general'
import { FC, PropsWithChildren, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'

export const PreloadProvider: FC<PropsWithChildren> = ({ children }) => {
    const [endPreload] = generalStore((state) => [
        state.endPreload
    ])
    // const navigate = useNavigate()
    
    // const checkEndPreload = () => {
    //     if (endPreload) {
    //         navigate(`/${ROUTES.AUTH}/${ROUTES.INTERFACEVIEWS}`)
    //     }
    // }

    // useEffect(() => {
    //     /* let time: ReturnType<typeof setTimeout>
        
    //     // setEndPreload(false)

    //     if (!endPreload) {
    //         time = setTimeout(() => {
    //             // setEndPreload(true)
    //             console.log('PreloadProvider endPreload', endPreload)
    //         }, 0);
    //     }

    //     return () => {
    //         setEndPreload(false)
    //         clearTimeout(time)
    //     } */

    //     checkEndPreload()
    // }, [])

    // useEffect(() => {
    //     checkEndPreload()
    //     /* if (endPreload) {
    //         navigate(`/${ROUTES.AUTH}/${ROUTES.INTERFACEVIEWS}`)
    //     } */
    // }, [endPreload])

    if (endPreload) {
        return <div>{children}</div>
    } else {
        return <Preload />
    }

    
}