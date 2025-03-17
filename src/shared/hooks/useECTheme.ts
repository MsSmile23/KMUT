import { ADMIN_PRIMARY_COLOR } from '@shared/config/const'
import { useTheme } from '@shared/hooks/useTheme'
import { selectAccount, useAccountStore } from '@shared/stores/accounts'
import { useEffect, useState } from 'react'

//TODO: переписать в стор или в хук с наполнением результирующего стейта цветами
// в зависимости от изменения аккаунт и конфиг сторов
// в текущей реализации нет реакции на изменения цветовой схемы или конфига
export const useECTheme = () => {
    const theme = useTheme()
    const accountStore = useAccountStore(selectAccount)


    // const [themeData, setThemeData] = useState()
    //
    // useEffect(() => {
    //     // пройти по конфигу
    //     // проставить значения  с учётом  accountStore?.settings?.themeMode
    // }, [accountStore, theme])

    const getColorFromConfig = ({ element, section }: { element: string, section?: string}) => {
        //Получаем цветовую схему юзера - перенести заполнение реальных цветов в зависимости от неё в стейт
        const themeMode = accountStore?.settings?.themeMode ?? 'light'

        //Получаем цветовую схему
        const colorMnemo = (section) ? theme?.[section]?.[element] : theme?.[element]
        const color = theme?.colors
            //Ищем данные по цвету с такой мнемоникой
            ?.find(colorData => colorData.mnemo == colorMnemo)
            //Ищем конкретный цвет с учётом цветовой схемы
            ?.colors?.find(modeColor => modeColor.mnemo == themeMode)
            ?.color

        return color
    }
    
    return { theme, getColorFromConfig }
}