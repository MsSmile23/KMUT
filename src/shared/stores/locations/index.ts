import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { IGeneralStore } from '../general'

export interface ILocationStore {
    interfaces: {
        constructor: string
        manager: string
        showcase: string
    },
    setInterfacesRoute: (interfaceName: Exclude<IGeneralStore['interfaceView'], ''>, route: string) => void
    getLastRoute: (interfaceName: IGeneralStore['interfaceView']) => string
}

export const useLocationStore = create<ILocationStore>()(
    devtools(
        immer(
            persist(
                (set, get) => ({
                    interfaces: {
                        constructor: '',
                        manager: '',
                        showcase: '',
                    },
                    localeName: 'Маршруты',
                    setInterfacesRoute: (interfaceName, route) => {
                        set((state) => {
                            if (state.interfaces[interfaceName] !== undefined) {
                                state.interfaces[interfaceName] = route;
                            }
                        });
                    },
                    getLastRoute: (interfaceName) => {
                        return get().interfaces[interfaceName]
                    },
                }),
                
                { name: 'locationStore' }
            )
        )
    )
)