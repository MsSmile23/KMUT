import { commonTheme2 } from '../const'
import { ITheme, IThemeComponentMnemo } from '../types'

/**
 * Пример типизации по новой системе
 * Partial<ITheme говорит что в локальной теме необязательно переписывать все ключи из commonTheme
 * ITheme<'tables' - говорит что переписать предполагается только стили компонент таблиц
 * По умолчанию для типизации темизации (второй параметр в ITheme) компоненты используется Partial<IThemeComponent>,
 * поэтому передавать его не требуется
 */

const localTheme: Partial<ITheme<IThemeComponentMnemo.tables>> = {
    components: {
        tables: {
            constructor: {}
        }
    }
}

//Здесь должна быть функция глубокого мерджа объектов localTheme и commonTheme
// до уровня theme.components.[component].[каждый интерфейс]
export const devTheme = {
    ...commonTheme2, ...localTheme,
    components: { ...commonTheme2, ...localTheme }
} as unknown as ITheme