import { ClassesCascader } from '@entities/classes/ClassesCascader/ClassesCascader'
import { selectObjects, useObjectsStore } from '@shared/stores/objects'
import { Input, Select } from '@shared/ui/forms'
import { FC, useEffect, useMemo, useState } from 'react'
import { Col, Form, Row, Space, Switch } from 'antd';
import { BaseButton, ButtonSettings } from '@shared/ui/buttons';
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths';
import { useNavigate, useParams } from 'react-router-dom';
import { TInitialDataSettingVTType } from '../../types/types';
import { maketTypesList, purposeList } from '../../data';
import { SERVICES_VTEMPLATES } from '@shared/api/vtemplates';
import { getURL } from '@shared/utils/nav';
import { useConfigStore } from '@shared/stores/config';
import { CONFIG_MNEMOS } from '@shared/types/config';
import { jsonParseAsObject } from '@shared/utils/common';
import { TPage } from '@shared/types/common';
import { IHelp } from '@entities/helps/types/types';
import ECModal from '@shared/ui/ECUIKit/ECModal/ECModal';
import HelpsForm from '@entities/helps/HelpsForm/HelpsForm';
import { useGetObjects } from '@shared/hooks/useGetObjects';
import { FilterOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { ECTooltip } from '@shared/ui/tooltips';
import { DefaultModal2 } from '@shared/ui/modals';
import { FilterForm } from '@features/objects/FilterForm/FilterForm';


interface ModalsSettingsProps {
    value: TInitialDataSettingVTType,
    save: (data: TInitialDataSettingVTType) => void
    saveFlag: boolean
    isMobile?: boolean
}

const ModalsSettings: FC<ModalsSettingsProps> = (props): JSX.Element => {

    const { save, value, saveFlag, isMobile = false } = props

    const idParams = useParams<{ id: string } | null>()
    const findConfig = useConfigStore((state) => state.getConfigByMnemo)
    const configFrontPages = findConfig(CONFIG_MNEMOS.FRONT_PAGES)
    const configHelps = findConfig(CONFIG_MNEMOS.PAGE_HELP)
    const frontPages = (configFrontPages?.value) ? jsonParseAsObject(configFrontPages?.value) as TPage[] : [] 
    const pageHelps = (configHelps?.value) ? jsonParseAsObject(configHelps?.value) as IHelp[] : [] 

    const navigate = useNavigate()
    const [form] = Form.useForm()
    // const objects = useObjectsStore(selectObjects)
    const objects = useGetObjects()
    const [vTemplatesData, setVTemplatesData] = useState([])
    const [classes, setClasses] = useState<number[]>(value.classes || [])
    const [purposeState, setPurposeState] = useState<number>(0)
    const [openModal, setOpenModal] = useState<boolean>(false)

    const [filters, setFilters] = useState<any[]>(undefined)
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)

    const [wideTemplate, setWildTemplate] = useState<boolean>(false)

    useEffect(() => {
        SERVICES_VTEMPLATES.Models.getVtemplates({ all: true })
            .then((res) => {
                setVTemplatesData(res.data)
            })
    }, [])

    const vTemplatesMnemo = useMemo(() => {
        return vTemplatesData
            .map(vTemplate => vTemplate?.params.dataToolbar?.mnemonic)
            .filter(vTemp => vTemp !== value?.mnemonic);
    }, [vTemplatesData])

    const purposeOptions = useMemo(() => {
        return isMobile 
            ? [purposeList[2], purposeList[3]]
            : [purposeList[0], purposeList[1]]
            
    }, [isMobile])

    useEffect(() => {
        form.setFieldsValue({
            name: value.name || '',
            maketType: value?.maketType || undefined,
            purpose: value?.purpose || undefined,
            classes: value?.classes || [],
            objectId: value?.objectId || undefined,
            mnemonic: value?.mnemonic || undefined,
            layotWidth: value?.layotWidth || undefined,
            layotHeight: value?.layotHeight || undefined,
            objectBindings: value?.objectBindings || [],
            pageBinding: value?.pageBinding?.name || undefined,
            wideTemplate: value?.wideTemplate || false,
            wideTemplateWidth: value?.wideTemplateWidth || undefined
        })
        setPurposeState(value?.purpose || 0)

        setWildTemplate(value?.wideTemplate ?? false)

        if (value?.filters) {
            setFilters(value?.filters)
        }
    }, [value])

    //Получаем список страниц
    const frontPagesList = useMemo(() => {
        return frontPages
            .map(page => {
                return { 
                    label: page.name, 
                    value: page.id
                }
            })
    }, [vTemplatesData])
    //Получаем объекты по классам
    const objectOptions = objects?.reduce((acc, obj) => {
        const isInArray = classes?.some(item => item === obj.class_id)

        if (isInArray) {
            acc.push({
                label: obj.name,
                value: obj.id
            })
        }

        return acc
    }, []) || []

    //При смене типа макета на Общий обнуляем значения из полей Объект для превью и Привзка к объектам
    useEffect(() => {
        if (objectOptions?.length === 0) {
            form.setFieldsValue({
                ...form,
                objectId: undefined,
                objectBindings: []
            })
        }
    }, [objectOptions?.length])

    // Получаем справку для текущего макета (если привязана)
    const currentPageHelp = pageHelps?.find((help) => help?.pageVtemplateId === idParams.id)

    const onFinish = (values: TInitialDataSettingVTType) => {
        let updatedValues = { ...values }   

        if (values?.pageBinding !== undefined) {
            const selectedPage = frontPages.find(page => page.id == String(values.pageBinding))

            if (selectedPage) {
                updatedValues = {
                    ...values,
                    pageBinding: selectedPage
                }
            }
        }

        if (filters) {
            updatedValues.filters = filters
        }
        save(updatedValues)
    };

    return (
        <>
            <DefaultModal2
                title="Настройки фильтрации"
                open={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false)
                }}
                onOk={() => {
                    setIsModalVisible(false)
                }}
                destroyOnClose
                width="70vw"
            >
                <FilterForm targetClassIds={classes} onChange={setFilters} filterOptions={filters} />
            </DefaultModal2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: '50%' }}>
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        classes: classes,
                    }}
                    onFinish={onFinish}
                    onValuesChange={(changedValues, _) => {
                        if ('classes' in changedValues) {
                            if (!changedValues?.classes?.length) {
                                form.setFieldsValue({
                                    ...form,
                                    objectId: undefined,
                                    objectBindings: [],
                                })
                            }
                            setClasses(changedValues['classes'])
                        }

                        if ('purpose' in changedValues) {
                            setPurposeState(changedValues['purpose'])

                            if (changedValues['purpose'] !== 2 && changedValues['purpose'] !== 4) {
                                setClasses([])
                                form.setFieldsValue({
                                    ...form,
                                    classes: [],
                                    pageBinding: value?.pageBinding?.name || undefined,
                                })
                            }

                            if (changedValues['purpose'] !== 1 && changedValues['purpose'] !== 3) {
                                form.setFieldsValue({
                                    ...form,
                                    pageBinding: undefined,
                                })
                            }
                        }
                    }}
                >
                    <Form.Item
                        name="name"
                        label="Название"
                        rules={[{ required: true, message: 'Поле обязательно для заполнения' }]}
                    >
                        <Input placeholder="Введите название" />
                    </Form.Item>

                    <Form.Item
                        name="maketType"
                        label="Тип Макета"
                        rules={[{ required: true, message: 'Поле обязательно для заполнения' }]}
                    >
                        <Select placeholder="Выберите тип Макета" options={maketTypesList} />
                    </Form.Item>

                    <Form.Item
                        name="purpose"
                        label="Назначение"
                        rules={[{ required: true, message: 'Поле обязательно для заполнения' }]}
                    >
                        <Select placeholder="Выберите назначение" options={purposeOptions} />
                    </Form.Item>

                    <Form.Item
                        name="mnemonic"
                        label="Мнемоника"
                        rules={[
                            {
                                validator: async (_, value) => {
                                    if (!value) {
                                        return Promise.resolve()
                                    }

                                    if (vTemplatesMnemo?.includes(value)) {
                                        return Promise.reject('Мнемоника уже существует')
                                    } else {
                                        return Promise.resolve()
                                    }
                                },
                            },
                        ]}
                    >
                        <Input placeholder="Введите мнемонику" type="text" />
                    </Form.Item>

                    {(purposeState === 2 || purposeState === 4) && (
                        <>
                            <Row align="bottom" gutter={8} justify="space-between" style={{ marginBottom: '24px' }}>
                                <Col span={21}>
                                    <Form.Item
                                        name="classes"
                                        label="Класс"
                                        rules={[
                                            {
                                                required: purposeState === 2 || purposeState === 4,
                                                message: 'Для макета объекта это обязательное поле',
                                            },
                                        ]}
                                        style={{ margin: 0 }}
                                    >
                                        <ClassesCascader
                                            value={classes}
                                            disabled={purposeState !== 2 && purposeState !== 4}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={3}>
                                    <ECTooltip title="Дополнительная фильтрация">
                                        <BaseButton
                                            icon={<FilterOutlined />}
                                            disabled={!(classes.length > 0)}
                                            onClick={() => {
                                                setIsModalVisible(true)
                                            }}
                                        />
                                    </ECTooltip>
                                </Col>
                            </Row>

                            <Form.Item name="objectBindings" label="Привязка к объектам">
                                <Select
                                    mode="multiple"
                                    options={objectOptions}
                                    disabled={!objectOptions.length}
                                    placeholder="Выберите объекты для привязки"
                                />
                            </Form.Item>

                            <Form.Item
                                name="objectId"
                                label="Объект для превью"
                                rules={[
                                    {
                                        required: purposeState === 2 || purposeState === 4,
                                        message: 'Для макета объекта это обязательное поле',
                                    },
                                ]}
                            >
                                <Select
                                    options={objectOptions}
                                    disabled={!objectOptions.length}
                                    placeholder="Выберите объект для превью"
                                />
                            </Form.Item>
                        </>
                    )}
                    {(purposeState === 1 || purposeState === 3) && (
                        <Form.Item name="pageBinding" label="Привязка к странице">
                            <Select options={frontPagesList} placeholder="Выберите страницу для привязки" />
                        </Form.Item>
                    )}

                    <Form.Item
                        valuePropName="checked"
                        name="wideTemplate"
                        label={
                            <>
                                Режим широкого макета
                                <ECTooltip
                                    title="В данном режиме макета добавится нижняя прокрутка.
                                 Необходимо выбрать фиксированную ширину макета"
                                >
                                    <QuestionCircleOutlined style={{ marginLeft: '10px' }} />
                                </ECTooltip>
                            </>
                        }
                    >
                        <Switch onChange={(e) => {setWildTemplate(e)}} />
                    </Form.Item>
                    {wideTemplate &&
                      <Form.Item name="wideTemplateWidth" label="Фиксированная ширина макета">
                          <Input placeholder="Введите ширину макета" type="number" />
                      </Form.Item>}
                    <div style={{ display: 'flex', gap: 10 }}>
                        <Space.Compact>
                            <Form.Item name="layotWidth" label="Ширина макета">
                                <Input placeholder="Введите ширину макета" type="number" />
                            </Form.Item>
                            <Form.Item name="layotHeight" label="Высота макета">
                                <Input placeholder="Введите высоту макета" type="number" />
                            </Form.Item>
                        </Space.Compact>

                        <ButtonSettings
                            icon={false}
                            style={{ marginTop: 30 }}
                            type="primary"
                            onClick={() => setOpenModal(true)}
                        >
                            Справка
                        </ButtonSettings>
                    </div>
                    <Form.Item>
                        <Space align="end" direction="horizontal">
                            <ButtonSettings icon={false} type="primary" htmlType="submit">
                                Применить
                            </ButtonSettings>
                            {saveFlag && (
                                <ButtonSettings
                                    icon={false}
                                    type="link"
                                    onClick={() => {
                                        navigate(getURL(`${ROUTES.VTEMPLATES}/${ROUTES_COMMON.LIST}`, 'constructor'))
                                    }}
                                >
                                    Выйти
                                </ButtonSettings>
                            )}
                        </Space>
                    </Form.Item>
                </Form>

                <ECModal
                    open={openModal}
                    onCancel={() => setOpenModal(false)}
                    showFooterButtons={false}
                    tooltipText="Справка"
                    height="60vh"
                    width="70vw"
                    centered
                >
                    <HelpsForm
                        id={currentPageHelp?.id}
                        closeModal={() => setOpenModal(false)}
                        pageVtemplateId={idParams.id}
                    />
                </ECModal>
            </div>
        </>
    )
}

export default ModalsSettings