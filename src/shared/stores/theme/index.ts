import { IThemes } from '@app/themes/types'
import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export interface IThemeStore {
    localeName: string
    themeName: IThemes
    setThemeName: (value: IThemeStore['themeName']) => void
}

export const useThemeStore = create<IThemeStore>()(
    devtools(
        immer(
            persist(
                (set) => ({
                    localeName: 'Темы проектов',
                    themeName: IThemes.DEFAULT,
                    setThemeName: (value) => {
                        set((state) => {
                            state.themeName = value
                        }, false, 'theme/setThemeName')
                    },
                }),
                { name: 'themeStore' }
            )
        )
    )
)

export const selectThemeName = (state: IThemeStore) => state.themeName
export const selectSetThemeName = (state: IThemeStore) => state.setThemeName