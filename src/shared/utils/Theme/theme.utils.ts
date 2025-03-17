import { ILocalTheme, ITheme } from '@app/themes/types'
import { merge } from 'lodash'


export const getPaddings = (theme: ITheme, paddingMnemo: keyof Omit<ILocalTheme['paddings'], 'basePadding'>) => {
    if (theme?.paddings?.[paddingMnemo]?.isActive) {
        return theme?.paddings?.[paddingMnemo]?.value
    }

    return theme?.paddings?.basePadding
}

export const createColorForTheme = (mnemo: string, colors: any[], themeMode: 'light' | 'dark') => {
    const colorItem = colors?.find((color) => color?.mnemo === mnemo)

    const color = colorItem?.colors.find((color) => color?.mnemo == themeMode)?.color

    return color
}

/**
 * Мутирует объект дефолтной темы, полностью заменяя настройки компонентов из common на local
 *
 * Например,
 * common.components.buttons.showcase и local.components.buttons.showcase будут объединены, а
 * common.components.buttons.showcase.Table будет полностью заменен на local.components.buttons.showcase.Table,
 *
 * @param common - мутируемый объект с дефолтными настройками темы
 * @param local - объект с применяемыми настройками
 * @returns объект
 */
export const mergeTheme = (commonProp: Record<string, any>, localProp: Record<string, any>) => {
    if (commonProp && localProp) {
        const local = { ...localProp }
        const common = { ...commonProp }

        const merged = merge(common, local)

        Object.entries(local).forEach(([ componentsKey, componentsObject]) => {
            if (typeof componentsObject === 'object' && componentsKey === 'components') {
                Object.entries(componentsObject).forEach(([ entityKey, entityObject ]) => {
                    if (typeof entityObject === 'object') {
                        Object.entries(entityObject).forEach(([ ifaceKey, ifaceObject ]) => {
                            if (typeof ifaceObject === 'object') {
                                Object.entries(ifaceObject).forEach(([ componentKey, component ]) => {
                                    if (merged?.[componentsKey]?.[entityKey]?.[ifaceKey]?.[componentKey]) {
                                        merged[componentsKey][entityKey][ifaceKey][componentKey] = component
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })


        return merged
    }
}