import { ButtonAdd, ButtonDeleteRow, ButtonEditRow, ButtonLook, Buttons } from '@shared/ui/buttons'
import { EditTable } from '@shared/ui/tables/ECTable2/EditTable/EditTable'
import { Col, Row, Upload, message } from 'antd'
import { FC, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { selectVTemplates, useVTemplatesStore } from '@shared/stores/vtemplates'
import { DefaultModal2 } from '@shared/ui/modals'
import VtemplateView from '@containers/vtemplates/VtemplateFormContainer/components/VtemplateView'
import { dataVtemplateProps, paramsVtemplate } from '@shared/types/vtemplates'
import { getURL } from '@shared/utils/nav'
import { CONFIG_MNEMOS } from '@shared/types/config'
import { ECTooltip } from '@shared/ui/tooltips'
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons'
import { SERVICES_CONFIG } from '@shared/api/Config'
import { useConfigStore } from '@shared/stores/config'
import { TPage } from '@shared/types/common'

interface IMenuItem {
    id: number
    name: string
    pseudoId: number
    parentPseudoId: number | null
    icon: string
    on: boolean
    page: number
    url: number | string
    target?: boolean
    stereotype?: string
}
interface IMenuConstructor {
    id: number
    name: string
    mnemo: string
    type: number
    active: boolean
    menu: IMenuItem[]
}

export const PagesManagerTable: FC = () => {
    const navigate = useNavigate()
    const findConfig = useConfigStore((st) => st.getConfigByMnemo)
    const vTemplates = useVTemplatesStore(selectVTemplates)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [dataPages, setDataPages] = useState<TPage[]>([])
    const [openModal, setOpenModal] = useState<boolean>(false)
    const [vtemplate, setVtemplate] = useState<dataVtemplateProps<paramsVtemplate>>()
    const [menu, setMenu] = useState<IMenuConstructor[]>([])
    
    const objectsColumns = [
        {
            key: 'name',
            dataIndex: 'name',
            title: 'Название',
            width: '25%',
        },
        {
            key: 'url',
            dataIndex: 'url',
            title: 'URL',
            width: '25%',
        },
        {
            key: 'vtemplate_id',
            dataIndex: 'vtemplate_id',
            title: 'Макет',
            width: '20%',

        },
        {
            key: 'actions',
            dataIndex: 'actions',
            title: 'Действия',
            width: '10%',
        },
    ]

    //Получаем данные из конфига, парсим, записываем
    useEffect(() => {
        SERVICES_CONFIG.Models.getConfigByMnemo(CONFIG_MNEMOS.FRONT_MENU).then((resp) => {
            if (resp.success) {
                if (resp.data) {
                    setMenu(JSON.parse(resp.data.value))
                }
            }
        })

        SERVICES_CONFIG.Models.getConfigByMnemo(CONFIG_MNEMOS.FRONT_PAGES).then((resp) => {
            if (resp.success) {
                if (resp.data) {
                    setDataPages(JSON.parse(resp.data.value))
                    setIsLoading(false)
                }
            }

            if (!resp?.success) {
                setIsLoading(false)
                message.error(resp?.message ?? 'Неизвестная ошибка получения конфига или конфиг не найден').then()
            }
        })
    }, [])

    //Формируем данные
    const rows = useMemo(() => dataPages?.map((page, i) => ({
        key: `${i}`,
        name: page.fullScreen ? `${page.name} (полный экран)` : page.name,
        url: page.url,
        // menu: string
        vtemplate_id: `${page.vtemplate_id} ${vTemplates
            .find((vTemplate) => vTemplate.id === page.vtemplate_id)?.name}`,
        actions: (
            <div style={{ display: 'flex', gap: 15 }}>
                <ButtonLook 
                    type="default"
                    onClick={() => handleOpen(page.vtemplate_id)} 
                />
                <ButtonEditRow 
                    type="primary"
                    onClick={() => {
                        navigate(getURL(
                            `${ROUTES.NAVIGATION}/${ROUTES.PAGES}/${ROUTES_COMMON.UPDATE}`,
                            'manager'
                        ), 
                        { state: { initialValues: page } }) 
                    }}
                />
                <ButtonDeleteRow 
                    type="primary" 
                    onClick={() => handleDelete(page)}
                />
            </div>
        ),

    })
    ), [dataPages])

    const downloadBlob = (content, filename, contentType) => {
        const blob = new Blob([content], { type: contentType })
        const url = URL.createObjectURL(blob)
        const pom = document.createElement('a')

        pom.href = url
        pom.setAttribute('download', filename)
        pom.click()
    }

    const readJsonFile = (file: Blob) =>
        new Promise((resolve, reject) => {
            const fileReader = new FileReader()

            fileReader.onload = event => {
                if (event.target) {
                    resolve(JSON.parse(event.target.result as string))
                }
            }
            fileReader.onerror = error => reject(error)
            fileReader.readAsText(file)
        })

    //Функция удаления
    const handleDelete = async (item: TPage) => {
        const newData = dataPages.filter((i) => i.id !== item.id)
        const resp = await SERVICES_CONFIG.Models.patchConfigByMnemo(CONFIG_MNEMOS.FRONT_PAGES, {
            mnemo: CONFIG_MNEMOS.FRONT_PAGES,
            value: JSON.stringify(newData),
        })

        if (resp.success) {
            if (resp.data) {
                setDataPages(newData)
                message.success('Удаление прошло успешно')
            }
        }
    }

    //Закрыть модалку
    const closeModal = () => {
        setOpenModal(false)
    }

    const handleOpen = (template: number) => {
        const currentVtemplate = vTemplates.find(temp => temp.id === template)

        setVtemplate(currentVtemplate)
        setOpenModal(true)
    }

    //Обновление при экспорте 
    const updatePageConstructors = async (newArray: any[]) => {
        const checkConfig = findConfig(CONFIG_MNEMOS.FRONT_PAGES)

        //Ищем в конфиге меню страницы с совпадающим URL и если названия страниц отличаются 
        // (в меню и экспортируемом файле страниц), то меняем на название из экспорта
        let isChangedName = false

        menu.forEach(menuItem => {
            menuItem.menu.forEach(item => {
                const matchingUrl = newArray.find(page => page.url == item.url) 

                if (matchingUrl ?? matchingUrl?.name !== item.page) {
                    item.page = matchingUrl?.name
                    isChangedName = true
                }
            })
  
        })

        // Отправляем запрос на бэкенд для сохранения изменений в меню
        if (isChangedName) {
            const resp = await SERVICES_CONFIG.Models.patchConfigByMnemo(CONFIG_MNEMOS.FRONT_MENU, {
                mnemo: CONFIG_MNEMOS.FRONT_MENU,
                value: JSON.stringify(menu),
            })

            if (resp.success) {
                if (resp.data) {
                    setMenu(menu)
                    message.success('Меню успешно обновлено')
                }
            } else {
                message.error('Ошибка обновления меню')
            }
        }

        // Отправляем запрос на бэкенд для сохранения изменений в страницах
        const resp = checkConfig
            ? await SERVICES_CONFIG.Models.patchConfigByMnemo(CONFIG_MNEMOS.FRONT_PAGES, {
                mnemo: CONFIG_MNEMOS.FRONT_PAGES,
                value: JSON.stringify(newArray),
            })
            : await SERVICES_CONFIG.Models.postConfig({
                mnemo: CONFIG_MNEMOS.FRONT_PAGES,
                value: JSON.stringify(newArray),
            })

        if (resp.success) {
            if (resp.data) {
                setDataPages(newArray)
                message.success('Страницы успешно загружены')
            }
        } else {
            message.error('Ошибка загрузки страницы')
        }
        
    }

    const downLoadButtonHandler = () => {
        const content = {
            mnemo: CONFIG_MNEMOS.FRONT_PAGES,
            value: dataPages
        }

        downloadBlob(JSON.stringify(content), 'pages.json', 'json')
    }

    return (
        <>
            <DefaultModal2
                open={openModal}
                onCancel={closeModal}
                showFooterButtons={false}
                tooltipText="Просмотр страницы"
                height="90vh"
                width="90vw"
                centered
            >
                <VtemplateView
                    vtemplate={vtemplate}
                    objectId={vtemplate?.params?.dataToolbar?.objectId}
                />
            </DefaultModal2>
  
            <Row gutter={[12, 12]}>
                <Col span={24}>
                    <EditTable 
                        loading={isLoading}
                        customHeight={600}
                        bordered={true}
                        tableId="pages-table"
                        key="pages-table"
                        columns={objectsColumns}
                        rows={rows}
                        hideSettingsButton={true}
                        sortDirections={['descend', 'ascend']}
                        style={{
                            cursor: 'pointer',
                        }}
                        buttons={{ 
                            left: [
                                <ButtonAdd
                                    key="button-add-class"
                                    shape="circle"
                                    text={false}
                                    onClick={() => {
                                        navigate(getURL(
                                            `${ROUTES.NAVIGATION}/${ROUTES.PAGES}/${ROUTES_COMMON.CREATE}`,
                                            'manager'
                                        ))
                                        // navigate(`/${ROUTES.PAGE_MENU_CONSTRUCTOR}/${ROUTES_COMMON.CREATE}`)
                                    }}
                                />,
                                <ECTooltip key="button-download" title="Экспортировать страницы">
                                    <Buttons.BaseButton
                                        size="large"
                                        icon={<DownloadOutlined />}
                                        shape="circle"
                                        onClick={downLoadButtonHandler}
                                    />
                                </ECTooltip>,

                                <Upload
                                    key="key"
                                    accept=".json"
                                    multiple={true}
                                    beforeUpload={async (file) => {
                                        const parseFile: any = await readJsonFile(file)

                                        if (parseFile.mnemo == CONFIG_MNEMOS.FRONT_PAGES) {
                                            updatePageConstructors(parseFile?.value ?? [])
                                        }
                                        else {
                                            message.error('Ошибка при импорте страниц. Неверно указана мнемоника')
                                        }

                                        return false
                                    }}
                                    showUploadList={false}
                                >
                                    <ECTooltip key="button-download" title="Загрузить страницы">
                                        <Buttons.BaseButton
                                            size="large"
                                            icon={<UploadOutlined />}
                                            shape="circle"
                                            key="button-download"
                                        />
                                    </ECTooltip>
                                </Upload>,
                            ]
                        }}
                        pagination={false}
                    />
                </Col>
            </Row>           
        </>
    )
}