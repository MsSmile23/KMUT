import { DownloadOutlined } from '@ant-design/icons'
import { Buttons } from '@shared/ui/buttons'
import { FC, useEffect, useMemo } from 'react'
import { downLoadButtonHandler } from '../utils/utils'
import { useConfigStore } from '@shared/stores/config'
import { CONFIG_MNEMOS } from '@shared/types/config'

import { IHelp } from '../types/types'
import { jsonParseAsObject } from '@shared/utils/common'
import { TPage } from '@shared/types/common'

interface IHelpsShowProps {
    pageVtemplateId?: number | string,
}

const HelpsShow: FC<IHelpsShowProps> = (props) => {

    const { pageVtemplateId } = props

    const findConfig = useConfigStore((state) => state.getConfigByMnemo)
    const configFrontPages = findConfig(CONFIG_MNEMOS.FRONT_PAGES)
    const configHelps = findConfig(CONFIG_MNEMOS.PAGE_HELP)
    const frontPages = (configFrontPages?.value) ? jsonParseAsObject(configFrontPages?.value) as TPage[] : [] 
    const pageHelps = (configHelps?.value) ? jsonParseAsObject(configHelps?.value) as IHelp[] : [] 

    const currentPageHelp = useMemo(() => {
        let page = pageVtemplateId ? pageHelps?.find((help) => help?.pageVtemplateId === `${pageVtemplateId}`)
            : null

        if (!page) {
            // Ищем страницы с привязанной справкой
            const pagesWithHelps = frontPages?.filter((frontPage) => pageHelps
                .some(pageHelp => pageHelp.pageVtemplateId === frontPage?.id))
            // Получаем текущую страницу по url
            const pageFromPath = pagesWithHelps.find(page => location.pathname.includes(`${page.url}`))

            page = pageHelps?.find((help) => help?.pageVtemplateId === pageFromPath?.id)
        }

        return page
    }, [pageHelps, frontPages, pageVtemplateId, location.pathname])

    // Если нет текстового описания, но есть файл, то сразу скачиваем его
    useEffect(() => {
        if (!currentPageHelp?.description && currentPageHelp?.mediaFileId) {
            downLoadButtonHandler(currentPageHelp.mediaFileId, currentPageHelp.name)
        }
    }, [currentPageHelp])

    return currentPageHelp?.description ? (
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 20 }}>
            <span>{currentPageHelp?.description}</span>
            {currentPageHelp?.mediaFileId && 
            <Buttons.BaseButton
                size="middle"
                icon={<DownloadOutlined />}
                onClick={() => downLoadButtonHandler(currentPageHelp?.mediaFileId, currentPageHelp?.name)}
            />}
        </div> 
    ) : 'Справка отсутствует'
}

export default HelpsShow