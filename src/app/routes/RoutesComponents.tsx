import { useAccountStore } from '@shared/stores/accounts'
import { appRoutes } from './appRoutes'

export const RoutesComponents = () => {
    const accountData = useAccountStore(state => state.store.data.user.role?.interfaces)
    const AppRoutes = Object.entries(appRoutes).map(([interfaceView, routes], idx) => {


        return (
            <>{accountData}</>
        )
    })
    
    return (
        <>
            {AppRoutes}
        </>
    )
}