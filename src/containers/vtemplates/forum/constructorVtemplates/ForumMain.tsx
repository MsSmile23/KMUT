import VtemplateView from '@containers/vtemplates/VtemplateFormContainer/components/VtemplateView'
import { useVTemplatesStore, selectVTemplates } from '@shared/stores/vtemplates'
import { FC, useLayoutEffect, useMemo, useState } from 'react'
import MainDefault from '../MainDefault'
import { selectConfig, selectGetConfigByMnemo, useConfigStore } from '@shared/stores/config'
import { CONFIG_MNEMOS } from '@shared/types/config'
import { dataVtemplateProps, paramsVtemplate } from '@shared/types/vtemplates'

const ForumMain: FC = () => {
    const vTemplates = useVTemplatesStore(selectVTemplates)
    const configData = useConfigStore(selectConfig)
    const getConfigByMnemo = useConfigStore(selectGetConfigByMnemo)
    //const [mainPage, setMainPage] = useState<dataVtemplateProps<paramsVtemplate>>(null)

    const mainPage = useMemo<dataVtemplateProps<paramsVtemplate>>(() => {
        const pages = getConfigByMnemo(CONFIG_MNEMOS.FRONT_PAGES)

        if (pages) {
            const localMainPage = JSON.parse(pages.value).find(page => page.url == '/')

            if (localMainPage) {
                return vTemplates.find(vt => vt.id == localMainPage.vtemplate_id)
            }
        }

        return null
    }, [configData])

    //*Ищем в конфиге страничку, которая отвечает за главную
    // useLayoutEffect(() => {
    //     const pages = getConfigByMnemo(CONFIG_MNEMOS.FRONT_PAGES)
    //
    //     if (pages) {
    //         const localMainPage = JSON.parse(pages.value).find(page => page.url == '/')
    //
    //         if (localMainPage) {
    //             setMainPage(vTemplates.find(vt => vt.id == localMainPage.vtemplate_id))
    //         }
    //     }
    //
    // }, [])

    return mainPage ? <VtemplateView vtemplate={mainPage} /> : <MainDefault />
}

export default ForumMain 