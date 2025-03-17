import { useConfigStore } from '@shared/stores/config'
import { useObjectsStore } from '@shared/stores/objects'
import { useVTemplatesStore } from '@shared/stores/vtemplates'
import { CONFIG_MNEMOS } from '@shared/types/config'
import { jsonParseAsObject } from '@shared/utils/common'
import { useLocation, useParams } from 'react-router-dom'
import { TPage } from '@shared/types/common';
import cyprTheme from '@app/themes/cyprTheme/cyprTheme'

export const useGetDynamicVtemplate = () => {
    const params = useParams()
    const location = useLocation()
    // const store = useConfigStore((state) => state.store.data)
    
    /* 
        Если хук сработал по обычному роуту, то берем путь из location
        пример - <Route path={`${ROUTES_COMMON.LIST}`} element={<IncidentsList />}></Route>

        Если же он сработал на динамические компоненты роута типа таких:
            <Route path=":controller" element={<Show />} />
            <Route path=":controller/:method" element={<Show />} />
            <Route path=":controller/:method/:id" element={<Show />} /> 
        То собираем путь из params
    */
    const parsedParamsPath = params && Object.keys(params)?.length > 0
        ? Object.entries(params).reduce((acc, [key, value]) => {
            const valueNan = isNaN(Number(value))

            if (key && valueNan) {
                acc = acc + `/${value}`
            }

            return acc
        }, '')
        : location.pathname + location.search
    const findConfig = useConfigStore((state) => state.getConfigByMnemo)
    const config = findConfig(CONFIG_MNEMOS.FRONT_PAGES)
    const getVtemplate = useVTemplatesStore(st => st.getByIndex)
    const getObject = useObjectsStore(st => st.getByIndex)

    // console.log('store', store)
    // console.log('config', config)
    const frontPagesConfig: TPage[] = config
        ? jsonParseAsObject(config?.value)
        : []

    //Добавляем хардкодные страницы из темы
    const frontPages: TPage[] = [...frontPagesConfig, ...(cyprTheme && cyprTheme.pages || [])]
    // console.log('frontPages', frontPages)

    // const isDynamicIdx = -1 // тест, когда не найдена настройка страницы
    const isDynamicIdx = frontPages?.findIndex((page) => page?.url == parsedParamsPath)


    const object = params?.id && getObject('id', Number(params?.id))
    const page = isDynamicIdx > -1 && frontPages[isDynamicIdx]

    // console.log('page', page)

    const vtemplate = page && getVtemplate('id', page?.vtemplate_id)
    // const vtemplate = page && getVtemplate('id', 11111) // тест, когда макет не найден


    return {
        vtemplate,
        object,
        isDynamicIdx,
        page
    }
}