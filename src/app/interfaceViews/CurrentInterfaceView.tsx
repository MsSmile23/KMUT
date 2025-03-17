import { generalStore } from '@shared/stores/general'
import { Outlet } from 'react-router-dom'
import { ConstructorInterfaceView, ManagerInterfaceView, ShowcaseInterfaceView } from '@app/interfaceViews'
import { selectAccount, useAccountStore } from '@shared/stores/accounts'
import InterfaceView from '@pages/auth/interfaceview'
import { ObjectNotifications } from '@features/objects/ObjectNotifications/ObjectNotifications'
import { InterfacePreloader } from '@pages/auth/preload/InterfacePreloader'
const envNotif = import.meta.env.VITE_NOTIFICATIONS;

export const CurrentInterfaceView = () => {
    const [interfaceView] = generalStore((state) => [state.interfaceView])
    const accountData = useAccountStore(selectAccount)
    const interfaces = accountData?.user?.role?.interfaces ?? ['constructor', 'manager', 'showcase']
    // const renderInterfaceView = () => {
    //     switch (interfaceView) {
    //         case 'constructor':
    //             return (
    //                 interfaces?.includes('constructor') ?
    //                     <ConstructorInterfaceView>
    //                         <Outlet />
    //                     </ConstructorInterfaceView> :
    //                     <InterfaceView />
    //             )
    //         case 'manager':

    //             return (
    //                 interfaces?.includes('manager') ?
    //                 // <InterfacePreloader>

    //                     <ManagerInterfaceView>
    //                         <Outlet />
    //                     </ManagerInterfaceView>
    //                     // {/* </InterfacePreloader> */}

    //                     : <InterfaceView />
    //             )
    //         case 'showcase':
    //             return (
    //                 interfaces?.includes('showcase') ?
    //                     <ShowcaseInterfaceView>
    //                         <Outlet />
    //                     </ShowcaseInterfaceView> :
    //                     <InterfaceView />
    //             )
    //     }
    // }

    // todo: not for prod
    const disabledNotifications = localStorage.getItem('no-tifications') || (envNotif !== undefined && envNotif == 0)

    return (
        <>
            {interfaceView === 'constructor' && interfaces.includes('constructor') ? (
                <ConstructorInterfaceView>
                    <Outlet />
                </ConstructorInterfaceView>

            ) : interfaceView === 'manager' && interfaces.includes('manager') ? (
                <ManagerInterfaceView>
                    <Outlet />
                </ManagerInterfaceView>
            ) : interfaceView === 'showcase' && interfaces.includes('showcase') ? (
                <ShowcaseInterfaceView>
                    <Outlet />
                </ShowcaseInterfaceView>
            ) : (
                <InterfaceView />
            )}

            {disabledNotifications ? null : <ObjectNotifications />}
        </>
    )
}