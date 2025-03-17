import { FC, useEffect, useMemo, useState } from 'react'
import { useObjectsStore } from '@shared/stores/objects'
import { ECTabs } from '@shared/ui/tabs'
import { Buttons } from '@shared/ui/buttons'
import { Col, Form, Modal, Row } from 'antd'
import { DefaultModal2 } from '@shared/ui/modals'
import { v4 as uuidv4 } from 'uuid'
import { Forms } from '@shared/ui/forms'
import { SERVICES_CONFIG } from '@shared/api/Config'
import { CONFIG_MNEMOS } from '@shared/types/config'
import { responseErrorHandler } from '@shared/utils/common'
import { getDiscoveredObjects } from '@shared/api/Objects/Models/getDiscoveredObjects/getDiscoveredObjects'
import { useApi2 } from '@shared/hooks/useApi2'
import ObjectCardModal from '@features/objects/ObjectCardModal/ObjectCardModal'
import { DevicesTable } from '@containers/discovery/DiscoveryTableContainer/DiscoveryTable/DiscoveryTable'
import { useTheme } from '@shared/hooks/useTheme'
import { useAccountStore, selectAccount } from '@shared/stores/accounts'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'

interface IDiscoveryTable {
    hiddenStereotype?: string
    widgetId?: string
}

export const DiscoveryTableContainer: FC<IDiscoveryTable> = ({ hiddenStereotype, widgetId }) => {
    const MNEMO = 'discovery2'

    const [activeTab, setActiveTab] = useState('visible-device')
    const [deviceChanged, setDeviceChanged] = useState(false)

    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
    const [isModalVisibleObject, setIsModalVisibleObject] = useState<boolean>(false)

    const updateObjects = useObjectsStore((st) => st.updateData)
    const [chosenObjectId, setChosenObjectId] = useState<number>(null)

    const [discoveryConfig, setDiscoveryConfig] = useState<any | null>(null)
    const [inputItems, setInputItems] = useState<any[]>([])
    const [form] = Form.useForm()

    const theme = useTheme()
    const accountData = useAccountStore(selectAccount)
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode

    const tabLabelColor = useMemo(() => {
        return createColorForTheme(theme?.textColor, theme?.colors, themeMode) || '#000000'
    }, [theme, themeMode])

    const { data: discoveredObjects, loading } = useApi2(() => getDiscoveredObjects({ per_page: 1000000 }))
    // const discoveredObjects = data ?? []

    const handleCancelModal = () => {
        setIsModalVisible(false)
    }
    const handleClose = () => {
        setChosenObjectId(null)
        setIsModalVisibleObject(false)
    }

    useEffect(() => {
        SERVICES_CONFIG.Models.getConfigByMnemo(CONFIG_MNEMOS.DISCOVERY).then((resp) => {
            if (resp?.data?.value !== undefined) {
                const inputs = JSON?.parse(resp?.data?.value)
                const localInputItems = []

                const arrayOfStrings = inputs?.network?.split(', ')

                setDiscoveryConfig(inputs)
                setInputItems(localInputItems)

                arrayOfStrings?.forEach((item) => {
                    const id = uuidv4()

                    localInputItems.push(id)
                    form.setFieldsValue({
                        [id]: item,
                    })
                })
            }
        })
    }, [])

    useEffect(() => {
        updateObjects()
    }, [deviceChanged])

    const addInputFieldButtonHandler = () => {
        setInputItems((prev) => [...prev, uuidv4()])
    }

    const deleteFieldButtonHandler = (key: string) => {
        setInputItems((prev) => prev.filter((item) => item !== key))
    }
    const onClickRow = (id) => {
        setIsModalVisibleObject(true)
        setChosenObjectId(id)
    }
    const handleSubmitButton = async () => {
        const values = form.getFieldsValue()

        const networks = Object.values(values).map((value) => value)

        const payload: any = discoveryConfig ? discoveryConfig : {}

        const networksString = networks.join(', ')

        payload.network = networksString

        const resp = discoveryConfig
            ? await SERVICES_CONFIG.Models.patchConfigByMnemo(MNEMO, {
                mnemo: CONFIG_MNEMOS.DISCOVERY,
                value: JSON.stringify(payload),
            })
            : await SERVICES_CONFIG.Models.postConfig({
                mnemo: CONFIG_MNEMOS.DISCOVERY,
                value: JSON.stringify(payload),
            })

        if (resp.success) {
            Modal.success({
                content: 'Настройки сохранены',
            })
        } else {
            responseErrorHandler({
                response: resp,
                modal: Modal,
                errorText: 'Ошибка сохранения настроек',
            })
        }

        setIsModalVisible(false)
    }

    return (
        <>
            <ObjectCardModal
                objectId={chosenObjectId}
                modal={{
                    title: 'Просмотр объекта',
                    open: isModalVisibleObject,
                    onCancel: handleClose,
                    height: '80%',
                }}
            />
            {/* <ECTooltip title="Настройки">
                <BaseButton
                    size="middle"
                    shape="circle"
                    // style={{ backgroundColor: color, color: '#ffffff' }}
                    type="primary"
                    onClick={() => {
                        setIsModalVisible(true)
                    }}
                    icon={<ToolOutlined />}
                />
            </ECTooltip> */}
            <DefaultModal2
                showFooterButtons={false}
                title="Подсети"
                onCancel={handleCancelModal}
                open={isModalVisible}
                width="40%"
            >
                <Form name="form" labelCol={{ span: 8 }} autoComplete="off" form={form}>
                    {inputItems.map((item) => {
                        return (
                            <Row key={item} align="middle" gutter={8} style={{ marginBottom: '5px' }}>
                                <Col span={8}>
                                    <Form.Item name={item} style={{ margin: 0 }}>
                                        <Forms.Input placeholder="Введите значение" />
                                    </Form.Item>
                                </Col>
                                <Col>
                                    {' '}
                                    <Buttons.ButtonDeleteRow
                                        onClick={() => {
                                            deleteFieldButtonHandler(item)
                                        }}
                                    />
                                </Col>
                            </Row>
                        )
                    })}
                </Form>
                <Col>
                    <Buttons.ButtonAddRow style={{ marginBottom: '20px' }} onClick={addInputFieldButtonHandler} />
                </Col>

                <Buttons.ButtonAdd
                    onClick={handleSubmitButton}
                    color="rgb(92, 184, 92)"
                    customText="Сохранить"
                    icon={null}
                />
            </DefaultModal2>

            <ECTabs
                activeKey={activeTab}
                onChange={setActiveTab}
                items={[
                    {
                        key: 'visible-device',
                        label: <span style={{ color: tabLabelColor ?? '#000000' }}>Обнаруженные устройства</span>,
                        children: (
                            <DevicesTable
                                tableId={widgetId ? `${widgetId}_discovery-visible-device` : 'discovery-visible-device'}
                                changeActiveKey={() => setActiveTab('visible-device')}
                                onChange={setDeviceChanged}
                                loading={loading}
                                discoveredObjects={discoveredObjects.filter((obj) => !obj?.discoveryMatchedObjects)}
                                hiddenStereoType={hiddenStereotype}
                                settingsButtonOnclick={() => setIsModalVisible(true)}
                                onClickRow={onClickRow}
                            />
                        ),
                    },

                    {
                        key: 'monitoring-devices',
                        label: <span style={{ color: tabLabelColor ?? '#000000' }}>На мониторинге</span>,
                        children: (
                            <DevicesTable
                                tableId={widgetId ? `${widgetId}_discovery-matched-device` : 'discovery-matched-device'}
                                matchedObjects
                                changeActiveKey={() => setActiveTab('monitoring-devices')}
                                onChange={setDeviceChanged}
                                loading={loading}
                                discoveredObjects={discoveredObjects.filter(
                                    (obj) => obj?.discoveryMatchedObjects !== undefined
                                )}
                                hiddenStereoType={hiddenStereotype}
                                settingsButtonOnclick={() => setIsModalVisible(true)}
                                onClickRow={onClickRow}
                            />
                        ),
                    },
                    {
                        key: 'hidden-devices',
                        label: <span style={{ color: tabLabelColor ?? '#000000' }}>Скрытые устройства</span>,
                        children: (
                            <DevicesTable
                                tableId={widgetId ? `${widgetId}_discovery-hidden-device` : 'discovery-hidden-device'}
                                onlyHidden
                                changeActiveKey={() => setActiveTab('hidden-devices')}
                                onChange={setDeviceChanged}
                                loading={loading}
                                discoveredObjects={discoveredObjects.filter((obj) => !obj?.discoveryMatchedObjects)}
                                hiddenStereoType={hiddenStereotype}
                                settingsButtonOnclick={() => setIsModalVisible(true)}
                                onClickRow={onClickRow}
                            />
                        ),
                    },
                ]}
            />
        </>
    )
}