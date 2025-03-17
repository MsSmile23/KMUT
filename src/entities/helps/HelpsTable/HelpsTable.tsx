import { FC, useEffect, useMemo, useState } from 'react'
import { SERVICES_CONFIG } from '@shared/api/Config'
import { CONFIG_MNEMOS } from '@shared/types/config.ts'
import { Col, message, Row } from 'antd'
import { TPage } from '@shared/types/common.ts'
import { selectVTemplates, useVTemplatesStore } from '@shared/stores/vtemplates'
import { EditTable } from '@shared/ui/tables/ECTable2/EditTable/EditTable'
import { ButtonAdd, ButtonDeleteRow, ButtonEditRow, Buttons } from '@shared/ui/buttons'
import { getURL } from '@shared/utils/nav.ts'
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths.ts'
import { ECTooltip } from '@shared/ui/tooltips'
import { DownloadOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { IHelp } from '../types/types'
import { downLoadButtonHandler } from '../utils/utils'
import HelpsShow from '../HelpsShow/HelpsShow'
import { ECModal } from '@shared/ui/ECUIKit/ECModal/ECModal'

const objectsColumns = [
    {
        key: 'name',
        dataIndex: 'name',
        title: 'Название',
        width: '25%',
    },
    {
        key: 'pageVtemplateId',
        dataIndex: 'pageVtemplateId',
        title: 'Макет/страница',
        width: '25%',
    },
    {
        key: 'description',
        dataIndex: 'description',
        title: 'Описание',
        width: '20%',
    },
    {
        key: 'mediaFileId',
        dataIndex: 'mediaFileId',
        title: 'Файл справки',
        width: '20%',
    },
    {
        key: 'actions',
        dataIndex: 'actions',
        title: 'Действия',
        width: '10%',
    },
]

const HelpsTable: FC = () => {
    const vTemplates = useVTemplatesStore(selectVTemplates)
    const navigate = useNavigate()
    
    const [dataPagesHelp, setDataPagesHelp] = useState<IHelp[]>([])
    const [dataFrontPages, setDataFrontPages] = useState<TPage[]>([])
    const [pageVtemplateId, setPageVtemplateId] = useState<string | null>(null)

    const [openModal, setOpenModal] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(true)

    // Получаем данные из конфига
    useEffect(() => {
        Promise.all([
            SERVICES_CONFIG.Models.getConfigByMnemo(CONFIG_MNEMOS.FRONT_PAGES),
            SERVICES_CONFIG.Models.getConfigByMnemo(CONFIG_MNEMOS.PAGE_HELP)
        ]).then(([frontPagesResp, pageHelpResp]) => {
            if (frontPagesResp.success) {
                if (frontPagesResp.data) {
                    setDataFrontPages(JSON.parse(frontPagesResp.data.value));
                }
            } else {
                message.error(frontPagesResp?.message ?? 
                    'Неизвестная ошибка получения конфига страниц или конфиг не найден').then()
            }

            if (pageHelpResp.success) {
                if (pageHelpResp.data) {
                    setDataPagesHelp(JSON.parse(pageHelpResp.data.value))
                }
            } else {
                message.error(pageHelpResp?.message ?? 
                    'Неизвестная ошибка получения конфига справок или конфиг не найден').then()
            }
        }).catch(() => {
            setIsLoading(false)
            message.error('Неизвестная ошибка при получении конфигов')
        }).finally(() => setIsLoading(false))
    }, [])

    // Получаем имя макета или страницы по id
    const pageVtemplateName = (pageHelp: IHelp) => {
        if (!isNaN(+pageHelp.pageVtemplateId)) {
            return `${pageHelp.pageVtemplateId} ${vTemplates
                .find((vTemplate) => vTemplate.id === +pageHelp.pageVtemplateId)?.name}`
        } else {
            return `Страница ${dataFrontPages
                .find((frontPage) => frontPage.id === pageHelp.pageVtemplateId)?.name}`
        } 
    }

    // Открываем окно с описанием
    const handleDescriptionClick = (pageVtemplateId: string) => {
        setPageVtemplateId(pageVtemplateId)
        setOpenModal(true)
    }

    //Формируем данные
    const rows = useMemo(() => dataPagesHelp?.map((pageHelp, i) => ({
        key: `${i}`,
        name: pageHelp?.name,
        description: (
            <span 
                onClick={() => handleDescriptionClick(pageHelp?.pageVtemplateId)} 
                style={{ 
                    cursor: 'pointer',
                }}
            >
                <p style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', width: 180 }}>
                    {pageHelp?.description}
                </p>
            </span>
        ),
        mediaFileId: (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ECTooltip key="button-download" title="Скачать справку">
                    <Buttons.BaseButton
                        size="middle"
                        icon={<DownloadOutlined />}
                        onClick={() => downLoadButtonHandler(pageHelp?.mediaFileId, pageHelp?.name)}
                        disabled={!pageHelp?.mediaFileId}
                    />
                </ECTooltip>
            </div>
        ),
        pageVtemplateId: pageVtemplateName(pageHelp),
        actions: (
            <div style={{ display: 'flex', gap: 15 }}>
                <ButtonEditRow
                    type="primary"
                    onClick={() => {
                        navigate(getURL(
                            `${ROUTES.NAVIGATION}/${ROUTES.HELPS}/${ROUTES_COMMON.UPDATE}/${pageHelp?.id}`,
                            'manager'
                        ))
                    }}
                />
                <ButtonDeleteRow
                    type="primary"
                    onClick={() => handleDelete(pageHelp)}
                />
            </div>
        ),

    })
    ), [dataPagesHelp])

    //Функция удаления
    const handleDelete = async (item: IHelp) => {
        const newData = dataPagesHelp.filter((i) => i.id !== item.id)
        const resp = await SERVICES_CONFIG.Models.patchConfigByMnemo(CONFIG_MNEMOS.PAGE_HELP, {
            mnemo: CONFIG_MNEMOS.PAGE_HELP,
            value: JSON.stringify(newData),
        })

        if (resp.success) {
            if (resp.data) {
                setDataPagesHelp(newData)
                message.success('Удаление прошло успешно')
            }
        }
    }

    //Закрыть модалку
    const closeModal = () => {
        setOpenModal(false)
    }

    return (
        <>
            <ECModal
                open={openModal}
                onCancel={closeModal}
                showFooterButtons={false}
                tooltipText="Просмотр справки"
                width="60vw"
            >
                <HelpsShow pageVtemplateId={pageVtemplateId} />
            </ECModal>

            <Row gutter={[12, 12]}>
                <Col span={24}>
                    <EditTable
                        loading={isLoading}
                        customHeight={600}
                        bordered={true}
                        tableId="helps-table"
                        key="helps-table"
                        columns={objectsColumns}
                        rows={rows}
                        hideSettingsButton={true}
                        sortDirections={['descend', 'ascend']}
                        buttons={{
                            left: [
                                <ButtonAdd
                                    key="button-add-class"
                                    shape="circle"
                                    text={false}
                                    onClick={() => {
                                        navigate(getURL(
                                            `${ROUTES.NAVIGATION}/${ROUTES.HELPS}/${ROUTES_COMMON.CREATE}`,
                                            'manager'
                                        ))
                                    }}
                                />
                            ]
                        }}
                        pagination={false}
                    />
                </Col>
            </Row>
        </>
    )
}

export default HelpsTable