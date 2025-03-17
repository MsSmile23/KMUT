import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'

export interface IMapStore {
    localeName: string
    zoom: number | undefined
    setZoom: (value: IMapStore['zoom']) => void
    mapCenter: [number, number] | undefined
    setMapCenter: (value: IMapStore['mapCenter']) => void
}

export const useMapStore = create<IMapStore>()(
    devtools(
        persist(
            (set) => ({
                localeName: 'Данные карты',
                zoom: undefined,
                setZoom: (value) => set({ zoom: value }),
                mapCenter: undefined,
                setMapCenter: (value) => set({ mapCenter: value }),
            }),
            { name: 'mapStore' }
        )
    )
)