import Login from '@pages/auth/login'
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { selectAccount, useAccountStore } from '@shared/stores/accounts'
import { authStore } from '@shared/stores/auth'
import { useLicenseStore } from '@shared/stores/license'

//TODO УБРАТЬ ВЫЗЫВАЕТ РЕРЕНДЕР. Необходима альтернатива.
// Добавлена перезагрузка страницы при logout
// import { useCombineStores } from '@shared/stores/utils/useCombineStore'

import { FC, PropsWithChildren, useEffect } from 'react'
import {  useLocation, useNavigate } from 'react-router-dom'

export const AccessProvider: FC<PropsWithChildren> = ({ children }) => {
    const isAuth = authStore((state) => state.isAuth)

    const isActiveLicense = useLicenseStore((state) => state.isActiveLicense)
    const navigate = useNavigate()
    const accessInterfaces = useAccountStore(selectAccount)?.user?.role?.interfaces
    const location = useLocation()
    
    //*Обработка лицензии, в случае, если придёт ошибка кода 418
    useEffect(() => {
        if (!isActiveLicense) {
            if (accessInterfaces.includes('manager')) {
                navigate(`/${ROUTES.MANAGER}/${ROUTES.SYSTEM}/${ROUTES.LICENSE}/${ROUTES_COMMON.SHOW}`)
            } else {
                navigate(`/${ROUTES.LICENSE}/${ROUTES.ERROR}`)
            }
        }
    }, [location?.pathname, isActiveLicense])
    
    useEffect(() => {
        if (isAuth) {
            navigate(`/${ROUTES.AUTH}/${ROUTES.PRELOAD}`)
        } else {
            //TODO УБРАТЬ ВЫЗЫВАЕТ РЕРЕНДЕР. Необходима альтернатива.
            // Добавлена перезагрузка страницы при logout
            // stopLoopUpdate()
            navigate(`/${ROUTES.AUTH}/${ROUTES.LOGIN}`)
        }
    }, [isAuth])

    if (isAuth) {
        return <div>{children}</div>
    } else {
        return <Login />
    }
}