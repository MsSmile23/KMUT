/* eslint-disable max-len */
import { FC, PropsWithChildren, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@shared/config/paths'
import { generalStore } from '@shared/stores/general'
import InterfaceView from '@pages/auth/interfaceview'
import { getInterfaceRoute, getURL } from '@shared/utils/nav'
import { useAccountStore } from '@shared/stores/accounts'

export const InterfaceProvider: FC<PropsWithChildren> = ({ children }) => {
    const navigate = useNavigate()
    const { interfaceView, previousLocation } = generalStore((state) => ({
        interfaceView: state.interfaceView,
        previousLocation: state.previousLocation
    }))
    const userData = useAccountStore(state => state.store.data.user)

    useEffect(() => {
        if (interfaceView === '') {
            return navigate(`/${ROUTES.AUTH}/${ROUTES.INTERFACEVIEWS}`)
        }
    }, [])

    useEffect(() => {
        if (interfaceView !== '' && userData?.role?.interfaces.includes(interfaceView)) {
        // if (interfaceView !== '' && permissionedInterfaces.includes(interfaceView)) {

            /* const path = previousLocation 
                ? previousLocation 
                : getURL('', interfaceView)
                // : ROUTES.MAIN */

            // console.log('path', path)

            // return navigate(path)
            return navigate(getInterfaceRoute(interfaceView))
        } else {
            navigate(`/${ROUTES.AUTH}/${ROUTES.INTERFACEVIEWS}`)
        }
    }, [
        interfaceView,
        userData?.role?.interfaces
    ])

    if (interfaceView === '') {
        return <InterfaceView />
    } else {
        return <div>{children}</div>
    }

}