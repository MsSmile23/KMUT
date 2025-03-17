import { FC, useEffect, useMemo, useState } from 'react'
import { Form, Input, message, Row } from 'antd'
import { Select } from '@shared/ui/forms'
import { selectVTemplates, useVTemplatesStore } from '@shared/stores/vtemplates'
import { TPage } from '@shared/types/common.ts'
import { SERVICES_CONFIG } from '@shared/api/Config'
import { CONFIG_MNEMOS } from '@shared/types/config.ts'
import ECTemplatedTextInput from '@shared/ui/ECUIKit/ECTemplatedText/ECTemplatedTextInput/ECTemplatedTextInput.tsx'
import { Buttons } from '@shared/ui/buttons'
import { v4 as uuidv4 } from 'uuid'
import { useApi2 } from '@shared/hooks/useApi2.ts'
import { getConfigByMnemo } from '@shared/api/Config/Models/getConfigByMnemo/getConfigByMnemo.ts'
import { postConfig } from '@shared/api/Config/Models/postConfig/postConfig.ts'
import { usePatchConfig } from '@containers/accounts/AccountsTableContainer/hooks.ts'
import { ECUploadFile } from '@shared/ui/ECUIKit/forms'
import { useLocation, useNavigate } from 'react-router-dom'
import { getMediaFilesById } from '@shared/api/MediaFiles/Models/getMediaFilesById/getMediaFilesById'
import CustomPreloader from '@shared/ui/preloader/CustomPreloader'
import { postMedia, responseHandler } from '../utils/utils'
import { IHelp } from '../types/types'

interface IFormValues {
    name: string
    description?: string
    pageVtemplateId: string | number
    uploadedFile: number
}

interface IHelpsFormProps {
    id?: number | string
    closeModal?: () => void
    pageVtemplateId?: string
}

const HelpsForm: FC<IHelpsFormProps> = ({ id, closeModal, pageVtemplateId }) => {
    const [form] = Form.useForm()
    const navigate = useNavigate()
    const location = useLocation()

    // const isOpenFromTable: boolean = location.state?.isOpenFromTable
    const vTemplates = useVTemplatesStore(selectVTemplates)

    const [dataPages, setDataPages] = useState<TPage[]>([])
    const [dataPagesHelp, setDataPagesHelp] = useState<IHelp[]>([])
    const [currentPageHelp, setCurrentPageHelp] = useState<IHelp>(undefined)
    const [isLoading, setIsLoading] = useState<boolean>(id ? true : false)
    const [mediaFileId, setMediaFileId] = useState<number>(null)
    const [vtemplateClasses, setVtemplateClasses] = useState<number[]>([])
    const [initialUploadedFile, setInitialUploadedFile] = useState<any>()

    const standartUserConfig = useApi2(() => getConfigByMnemo(CONFIG_MNEMOS.PAGE_HELP))
    const standartUserConfigCreating = useApi2(postConfig, { onmount: 'item' })
    const standartUserConfigUpdating = usePatchConfig(CONFIG_MNEMOS.PAGE_HELP)
    const isHelpsPath = location.pathname.includes('/helps/')

    const selectOptions = useMemo(() => {
        const isVtemplatesPath = location.pathname.includes('/vtemplates/') 
        const isPagesPath = location.pathname.includes('/pages/')

        // Создаем список макетов
        const vTemplatesList = vTemplates.map((item) => {
            return { label: `${item.name}`, value: item.id }
        })

        // Создаем список страниц
        const pagesList = dataPages?.map((page) => {
            return { label: `${page.name}`, value: page.id }
        })

        const pageHelpSelectData = [
            {
                label: <span>Макеты</span>,
                title: 'Макеты',
                options: vTemplatesList,
            },
            {
                label: <span>Страницы</span>,
                title: 'Страницы',
                options: pagesList,
            },
            {
                label: <span>Экраны МП</span>,
                title: 'Экраны МП',
                options: [],
            },
        ]

        switch (true) {
            case isVtemplatesPath:
                return [pageHelpSelectData[0]]
            case isPagesPath:
                return [pageHelpSelectData[1]]
            default:
                return pageHelpSelectData  
        }
    }, [vTemplates, dataPages, location?.pathname])

    // Получаем класс из макета, если выбран макет
    const handleSelectChange = (value: number | string) => {
        const selectedTemplate = typeof(value) === 'number' ? vTemplates?.find(template => template.id === value) 
            : undefined

        if (selectedTemplate) {
            setVtemplateClasses(selectedTemplate.params.dataToolbar.classes)
        } else {
            setVtemplateClasses([])
        }
    }

    const submitHandler = async (values: IFormValues) => {
        const data = standartUserConfig.data.value ? JSON.parse(standartUserConfig.data?.value) as IHelp[] : []

        //Проверяем есть ли привязка к выбранным макету/странице
        const isPageVtemplateExist = data.some(item => item.pageVtemplateId == values.pageVtemplateId
            && item.pageVtemplateId !== currentPageHelp.pageVtemplateId)

        if (isPageVtemplateExist) {

            return
        }

        let fileId: number

        if (values.uploadedFile && values.uploadedFile !== initialUploadedFile) {
            fileId = await postMedia(values.uploadedFile)

            setMediaFileId(fileId)
        }

        const newData: IHelp = {
            id: uuidv4(),
            name: values?.name,
            description: values?.description,
            pageVtemplateId: values?.pageVtemplateId.toString(),
            mediaFileId: fileId,
        }

        // Редактируем
        if (id) {
            const index = data.findIndex(item => item.id === id)

            if (index !== -1) {
                data[index] = newData
            }
            //или записываем новое значение
        } else {
            data.push(newData)
        }

        if (standartUserConfig?.data?.value) {
            const resp = await SERVICES_CONFIG.Models.patchConfigByMnemo(CONFIG_MNEMOS.PAGE_HELP, {
                mnemo: CONFIG_MNEMOS.PAGE_HELP,
                value: JSON.stringify(data),
            })

            responseHandler(
                resp, 
                'update', 
                navigate, 
                isHelpsPath,
                closeModal
            )
        } else {
            const resp = await SERVICES_CONFIG.Models.postConfig({
                mnemo: CONFIG_MNEMOS.PAGE_HELP,
                value: JSON.stringify(data),
            })

            responseHandler(
                resp, 
                'create', 
                navigate, 
                isHelpsPath,
                closeModal
            )
        }
    }

    // Получаем файл по id при редактировании
    useEffect(() => {
        if (mediaFileId) {
            getMediaFilesById({ id: mediaFileId }).then(file => {
                form.setFieldsValue({ uploadedFile: file })
                setInitialUploadedFile(file)
            })
        }
    }, [mediaFileId])

    // Получаем данные из конфига, парсим, записываем
    useEffect(() => {
        Promise.all([
            SERVICES_CONFIG.Models.getConfigByMnemo(CONFIG_MNEMOS.FRONT_PAGES),
            SERVICES_CONFIG.Models.getConfigByMnemo(CONFIG_MNEMOS.PAGE_HELP)
        ]).then(([frontPagesResp, pageHelpResp]) => {
            if (frontPagesResp.success) {
                if (frontPagesResp.data) {
                    setDataPages(JSON.parse(frontPagesResp.data.value));
                }
            } else {
                message.error(frontPagesResp?.message ?? 
                    'Неизвестная ошибка получения конфига страниц или конфиг не найден').then()
            }

            if (pageHelpResp.success) {
                if (pageHelpResp.data) {
                    setDataPagesHelp(JSON.parse(pageHelpResp.data.value));
                }
            } else {
                message.error(pageHelpResp?.message ?? 
                    'Неизвестная ошибка получения конфига справок или конфиг не найден').then()
            }
        })
    }, [])

    // Заполняем форму при редактировании
    useEffect(() => {
        if (id) {
            const data = dataPagesHelp?.find((item) => item.id == id)
            
            if (data) {
                form.setFieldsValue({
                    name: data.name,
                    description: data.description,
                    pageVtemplateId: isNaN(+data.pageVtemplateId) ? data.pageVtemplateId : +data.pageVtemplateId,
                    uploadedFile: data.mediaFileId,
                })
                setIsLoading(false)
                setMediaFileId(data.mediaFileId)
                setCurrentPageHelp(data)
            }
        }

        if (pageVtemplateId) {
            form.setFieldsValue({
                pageVtemplateId: isNaN(+pageVtemplateId) ? pageVtemplateId : +pageVtemplateId,
            })
        }
    }, [dataPagesHelp, pageVtemplateId])

    return isLoading ? (
        <CustomPreloader style={{ textAlign: 'center', width: '100%' }} size="large" />
    ) : (
        <Form
            form={form}
            style={{ maxWidth: 600 }}
            onFinish={submitHandler}
            layout="vertical"
        >
            <Form.Item label="Заголовок" name="name" rules={[{ required: true }]}>
                <Input placeholder="Введите заголовок" />
            </Form.Item>
            <Form.Item
                label="Описание"
                name="description"
            >
                <ECTemplatedTextInput classes={vtemplateClasses} object={null} />
            </Form.Item>
            <Form.Item 
                label="Макет или страница" 
                name="pageVtemplateId" 
                rules={[
                    { required: true, message: 'Пожалуйста, ввыберите значение из списка' },
                    { 
                        validator: async (_, value) => {
                            const data = standartUserConfig.data.value ? JSON.parse(standartUserConfig.data?.value) : []
                            const isPageVtemplateExist: boolean = data
                                .some(item => item.pageVtemplateId == value 
                                    && item.pageVtemplateId !== currentPageHelp?.pageVtemplateId)

                            if (!value || !isPageVtemplateExist) {
                                return Promise.resolve()
                            }

                            return Promise.reject('К даному макету/странице уже привзяна справка')
                        }
                    }
                ]}
            >
                <Select
                    options={selectOptions}
                    placeholder="Выберите значение"
                    onChange={handleSelectChange}
                />
            </Form.Item>
            
            <Form.Item
                label="Загрузка файла"
                name="uploadedFile"
            >
                <ECUploadFile
                    setFieldValue={form.setFieldValue}
                    fieldName="uploadedFile"
                    mediaFileId={form.getFieldValue('uploadedFile')}
                    getFieldValue={form.getFieldValue}
                />
            </Form.Item>
            <Row style={{ marginBottom: 15 }}>
                <Buttons.ButtonSubmit
                    customText="Сохранить"
                    loading={standartUserConfigCreating.loading || standartUserConfigUpdating.loading}
                    disabled={standartUserConfigCreating.loading || standartUserConfigUpdating.loading}
                />
            </Row>
        </Form>
    )
}

export default HelpsForm