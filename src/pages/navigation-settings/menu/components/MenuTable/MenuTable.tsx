import { SERVICES_CONFIG } from '@shared/api/Config'
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { ButtonAdd, ButtonDeleteRow, ButtonEditRow, Buttons } from '@shared/ui/buttons'
import { EditTable } from '@shared/ui/tables/ECTable2/EditTable/EditTable'
import { IEditTableFilterSettings } from '@shared/ui/tables/ECTable2/EditTable/types'
import { FC, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IMenuConstructor, MNEMO } from '../utils'
import { Space, Upload, message } from 'antd'
import { ECTooltip } from '@shared/ui/tooltips'
import { EditOutlined, DeleteOutlined, DownloadOutlined, UploadOutlined } from '@ant-design/icons'
import CustomPreloader from '@shared/ui/preloader/CustomPreloader'
import { readJsonFile } from '@containers/vtemplates/VtemplateFormContainer/services'
import { useConfigStore } from '@shared/stores/config'
import { getURL } from '@shared/utils/nav'
import { CONFIG_MNEMOS } from '@shared/types/config'

const columns: IEditTableFilterSettings[] = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Название',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Мнемоника',
        dataIndex: 'mnemo',
        key: 'mnemo',
    },
    {
        title: 'Тип',
        dataIndex: 'type',
        key: 'type',
    },
    {
        title: 'Действия',
        dataIndex: 'actions',
        key: 'actions',
        width: '20%',
    },
]

const MenuTable: FC = () => {
    const [isLoadingTable, setIsLoadingTable] = useState<boolean>(true)
    const [menuConstructors, setMenuConstructors] = useState<IMenuConstructor[]>([])
    const [rows, setRows] = useState<any[]>([])
    const findConfig = useConfigStore((st) => st.getConfigByMnemo)
    const navigate = useNavigate()
    const loadMenuConstructors = () => {
        SERVICES_CONFIG.Models.getConfigByMnemo(MNEMO).then((resp) => {
            setMenuConstructors(resp?.data ? JSON.parse(resp.data.value) : [])
            setIsLoadingTable(false)

            if (!resp?.success) {
                message.error(resp?.message ?? 'Неизвестная ошибка получения конфига').then()
            }
        })
    }
    const deleteButtonHandler = async (menuId: number) => {
        const localMenuConstructors = [...menuConstructors]
        const filteredArray = localMenuConstructors.filter((item) => item.id !== menuId)

        const resp = await SERVICES_CONFIG.Models.patchConfigByMnemo(MNEMO, {
            mnemo: CONFIG_MNEMOS.FRONT_MENU,
            value: JSON.stringify(filteredArray),
        })

        if (resp.success) {
            if (resp.data) {
                setMenuConstructors(filteredArray)
                message.success('Удаление прошло успешно')
            }
        }
    }

    const downloadBlob = (content, filename, contentType) => {
        const blob = new Blob([content], { type: contentType })
        const url = URL.createObjectURL(blob)

        const pom = document.createElement('a')

        pom.href = url
        pom.setAttribute('download', filename)
        pom.click()
    }

    const updateMenuConstructors = async (newArray: any[]) => {
        const checkConfig = findConfig('front_menu')

        const resp = checkConfig
            ? await SERVICES_CONFIG.Models.patchConfigByMnemo(MNEMO, {
                mnemo: CONFIG_MNEMOS.FRONT_MENU,
                value: JSON.stringify(newArray),
            })
            : await SERVICES_CONFIG.Models.postConfig({
                mnemo: CONFIG_MNEMOS.FRONT_MENU,
                value: JSON.stringify(newArray),
            })

        if (resp.success) {
            if (resp.data) {
                setMenuConstructors(newArray)
                message.success('Меню успешно загружено')
            }
        }
    }

    useEffect(() => {
        loadMenuConstructors()
    }, [])

    useEffect(() => {
        const localRows = menuConstructors?.map((menu) => {
            return {
                id: menu.id,
                key: menu.id,
                name: menu.name,
                mnemo: menu.mnemo,
                type: menu.type,
                actions: (
                    <Space>
                        <ECTooltip title="Редактирование">
                            <ButtonEditRow
                                onClick={() => {
                                    // navigate(`/${ROUTES.MENU_CONSTRUCTOR}/${ROUTES_COMMON.UPDATE}/${menu?.id}`)
                                    navigate(getURL(
                                        `${ROUTES.NAVIGATION}/${ROUTES.MENU}/${ROUTES_COMMON.UPDATE}/${menu?.id}`,
                                        'manager'
                                    ))
                                }}
                                type="link"
                                icon={<EditOutlined />}
                            />
                        </ECTooltip>
                        <ECTooltip title="Удаление">
                            <ButtonDeleteRow
                                onClick={() => {
                                    deleteButtonHandler(menu.id)
                                }}
                                withConfirm
                                type="link"
                                icon={<DeleteOutlined />}
                            />
                        </ECTooltip>
                    </Space>
                ),
            }
        })

        setRows(localRows)
    }, [menuConstructors])

    //*Функция экспорта файла 

    const downLoadButtonHandler = () => {
        const content = {
            mnemo: CONFIG_MNEMOS.FRONT_MENU,
            value: menuConstructors
        }

        downloadBlob(JSON.stringify(content), 'menu.json', 'json')
    }

    return (
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <>
            {isLoadingTable ? (
                <CustomPreloader style={{ textAlign: 'center', width: '100%' }} size="large" />
            ) : (
                <EditTable
                    rows={rows?.sort((a, b) => a.id - b.id)}
                    columns={columns}
                    buttons={{
                        left: [
                            <ButtonAdd
                                key="button-add-class"
                                shape="circle"
                                text={false}
                                onClick={() => {
                                    // navigate(`/${ROUTES.MENU_CONSTRUCTOR}/${ROUTES_COMMON.CREATE}`)
                                    navigate(getURL(
                                        `${ROUTES.NAVIGATION}/${ROUTES.MENU}/${ROUTES_COMMON.CREATE}`,
                                        'manager'
                                    ))}}
                            />,
                            <ECTooltip key="button-download" title="Экспортировать меню">
                                <Buttons.BaseButton
                                    size="large"
                                    icon={<DownloadOutlined  />}
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
                                    
                                    if (parseFile.mnemo == CONFIG_MNEMOS.FRONT_MENU) {
                                        updateMenuConstructors(parseFile?.value ?? [])
                                    }
                                    else {
                                        message.error('Ошибка при импорте меню. Неверно указана мнемоника')
                                    }

                                    return false
                                }}
                                showUploadList={false}
                            >
                                <ECTooltip key="button-download" title="Импортировать меню">
                                    <Buttons.BaseButton
                                        size="large"
                                        icon={<UploadOutlined />}
                                        shape="circle"
                                        key="button-download"
                                    />
                                </ECTooltip>
                            </Upload>,
                        ],
                    }}
                />
            )}
        </>
    )
}

export default MenuTable