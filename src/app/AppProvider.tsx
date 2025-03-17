import {
    AccessProvider,
    InterfaceProvider,
    IntitalLoadProvider,
    PrevLocationProvider,
    // LicenseProvider,
    PreloadProvider
} from '@app/providers'
import { CurrentInterfaceView } from './interfaceViews/CurrentInterfaceView'

export const AppProvider = () => {
    return (
        <PrevLocationProvider>
            <IntitalLoadProvider>
                <AccessProvider>
                    <PreloadProvider>
                        <InterfaceProvider>
                            <CurrentInterfaceView />
                        </InterfaceProvider>
                    </PreloadProvider>
                </AccessProvider>
            </IntitalLoadProvider>
        </PrevLocationProvider>
    )
}