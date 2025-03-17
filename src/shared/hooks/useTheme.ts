import { themes } from '@app/themes/projectTheme'
import { IProjectSettings, ITheme } from '@app/themes/types'
import { selectAccount, useAccountStore } from '@shared/stores/accounts'
import { useConfigStore } from '@shared/stores/config'
import { selectThemeName, useThemeStore } from '@shared/stores/theme'
import { CONFIG_MNEMOS } from '@shared/types/config'
//import { mergeTheme } from '@shared/utils/theme'
import { merge } from 'lodash'
import { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { useTempModifications } from './hooksTempMod/useTempModifications'
import { mergeTheme } from '@shared/utils/Theme/theme.utils'


// const LIGHT_THEME = { background: '#ffffff', fontColor: '#000000' }

export const useTheme = () => {
    const currentTheme = useThemeStore(selectThemeName)
    const accountData = useAccountStore(selectAccount)
    const themeMode =  accountData?.user?.settings?.themeMode
    //*Добавляем настройки из формы темы
    const findConfig = useConfigStore((st) => st.getConfigByMnemo)
    const checkConfig = findConfig(CONFIG_MNEMOS.FRONT_SETTINGS)
    const tempModification = useTempModifications()

    const getTheme = useCallback(() => {
        let localThemeMode = themeMode
        //*Проверяем,светлая или тёмная тема, и замешиваем нужные нам цвета

        const theme = themes[currentTheme] ?? themes.default
        const localSettings = checkConfig ? mergeTheme(theme, JSON.parse(checkConfig?.value) ?? {}) : theme


        //*Если у нас выбрана цветовая схема, то подмешиваем ее
        if (checkConfig) {
            const settings = JSON.parse(checkConfig?.value)

            if (settings?.projectThemeMode) {
                if (settings.projectThemeMode !== 'default') {
                    localThemeMode = settings.projectThemeMode
                }
            }
        }

        Object.keys(localSettings).forEach((item) => {
            if (item == 'page' || item == 'layout') {
                const dark = {
                    background: localSettings?.dark?.background ?? '#272E3D',
                    fontColor: localSettings?.dark?.fontColor ?? '#ffffff',
                }

                const light = {
                    background: localSettings?.background ?? '#ffffff',
                    fontColor: '#000000',
                }

                Object.values(localSettings[item]).map((item2: any, key) => {
                    const settingsKey = Object.keys(localSettings[item])[key]
                    const localItem = { ...item2 }

                    const mergedObj = merge(localItem, localThemeMode == 'dark' ? dark : light)

                    localSettings[item][settingsKey] = mergedObj
                })
            }

            if (item == 'tempModifications') {
                // Object.values(localSettings[item]).forEach((_) => {
                //     localSettings[item] = { value: tempModification };
                // });
                // localSettings[item] = {
                //     ...localSettings[item],
                //     ...tempModification
                // };
                localSettings[item] = tempModification
            }
        })
        localSettings.themeMode = localThemeMode

        return localSettings as ITheme
    }, [themeMode, checkConfig?.value, tempModification])

    const [settingsForForm, setSettingsForForm] = useState<IProjectSettings>(
        //themes[currentTheme] ?? themes.default
        getTheme()
    )

    useEffect(() => {
        setSettingsForForm(getTheme())
    }, [themeMode, checkConfig?.value, tempModification])

    return settingsForForm as ITheme
    // return themes[IThemes.VPN]  as ITheme
}