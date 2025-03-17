/* eslint-disable max-len */
import { InfoCircleOutlined } from '@ant-design/icons'
import { ClassesCascader } from '@entities/classes/ClassesCascader/ClassesCascader'
import { SERVICES_PACKAGES } from '@shared/api/Packages'
import { selectClasses, useClassesStore } from '@shared/stores/classes'
import { selectConfig, useConfigStore } from '@shared/stores/config'
import { DefaultModal2 } from '@shared/ui/modals'
import { ECColorfulText } from '@shared/ui/text/ECColorfulText/ECColorfulText'
import { ECTooltip } from '@shared/ui/tooltips'
import { jsonParseAsObject } from '@shared/utils/common'
import { Button, Collapse, Form, Select, Switch } from 'antd'
import { Col, Row } from 'antd/lib'
import { useEffect, useMemo, useState } from 'react'

enum CollapseKeys {
    managerObjects = 'managerObjects',
    showcaseObjects = 'showcaseObjects',
    constructorObjects = 'constructorObjects'
}

const showcasePopover = 'Данная настройка служит для ограничения загрузки объектов и их атрибутов для витрины набором пакетов и классов. Значения По умолчанию означают что будут загружены Все классы из пакета Предметная область.'
const managerPopover = 'Данная настройка служит для ограничения загрузки объектов и их атрибутов для витрины набором пакетов и классов. Значения По умолчанию означают что будут загружены Все классы из пакета Предметная область. Селектор Основных классов служит для ручного выделения классов основных объектов менеджера в отдельный блок'

const SystemSettingForm = ({ form }) => {

    const classes = useClassesStore(selectClasses)
    const [packageOptions, setPackagesOptions] = useState([])
    const [settingsPanels, setSettingsPanels] = useState({
        showcaseObjects: [],
        managerObjects: [],
        constructorObjects: []
    })
    const [openModal, setOpenModal] = useState(false)
    const [selectedLog, setSelectedLog] = useState(null);

    const close = () => {
        setOpenModal(false)
        setSelectedLog(null)
    }
    const open = () => setOpenModal(true)


    const getConfig = useConfigStore(st => st.getConfigByMnemo)
    const config = jsonParseAsObject(getConfig('front_settings')?.value)

    const selectedManagerPackages = Form.useWatch(['system', 'managerObjects', 'packages'], form)
    const selectedShowcasePackages = Form.useWatch(['system', 'showcaseObjects', 'packages'], form)

    const generateClassesOptions = (classes) => {
        return [
            {
                value: 'default',
                label: 'По умолчанию'
            },
            ...classes.map(cls => ({
                value: cls.id,
                label: cls.name
            })),
        ]
    }

    const managerClassesOptions = useMemo(() => {
        const cls = selectedManagerPackages?.includes('default')
            ? classes
            : classes.filter(cls => selectedManagerPackages?.includes(cls.package_id))

        return generateClassesOptions(cls)
    }, [classes, selectedManagerPackages])

    const showcaseClassesOptions = useMemo(() => {
        const cls = selectedShowcasePackages?.includes('default')
            ? classes.filter(cls => [1].includes(cls.package_id))
            : classes.filter(cls => selectedShowcasePackages?.includes(cls.package_id))

        return generateClassesOptions(cls)
    }, [classes, selectedShowcasePackages])

    const mainClassesOptions = useMemo(() => {
        const cls = classes.filter(cls => cls.package_id === 1)

        return generateClassesOptions(cls)
    }, [classes])

    const onChangeCollapseHeader = (key, value: string[] | string) => {
        setSettingsPanels((prevState) => ({
            ...prevState,
            [key]: value,
        }))
    }
    const switchHandler = (value: boolean) => {
        const finalValue = value ? ['1'] : []

        const updatedState = Object.fromEntries(
            Object.entries(settingsPanels).map(([key]) => [key, finalValue])
        )

        setSettingsPanels(updatedState)
    }

    useEffect(() => {
        const getPackages = async () => {
            const response = await SERVICES_PACKAGES.Models.getPackages()
            const options = [
                {
                    value: 'default',
                    label: 'По умолчанию'
                },
                ...response.data?.map((item) => ({
                    value: item.id,
                    label: item.name,
                })) || []
            ]

            setPackagesOptions(options)
        }

        getPackages()
    }, [])


    // console.log(form.getFieldValue(['system', 'showcaseObjects', 'classes']))

    //TODO Сделать 

    return (
        <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                Открыть все <Switch onChange={(e) => { switchHandler(e) }} />
                <Button onClick={open}>Логи изменений</Button>

            </div>
            <Collapse
                activeKey={settingsPanels.showcaseObjects}
                onChange={(e) => { onChangeCollapseHeader(CollapseKeys.showcaseObjects, e) }}
                defaultActiveKey={[]}
                style={{ marginBottom: '10px', marginTop: '20px' }}
                items={[
                    {
                        key: '1',
                        // label: 'Объекты витрины',
                        label: (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <span>Объекты витрины</span>
                                <ECTooltip
                                    title={showcasePopover}
                                >
                                    <InfoCircleOutlined />
                                </ECTooltip>
                            </div>
                        ),
                        children: (
                            <>
                                <Row>
                                    <Form.Item
                                        label="Фильтр пакетов"
                                        // name="showcaseObjectsPackages"
                                        name={['system', 'showcaseObjects', 'packages']}
                                        labelCol={{ span: 8, offset: 0 }}
                                        initialValue={['default']}
                                    >
                                        <Select
                                            allowClear
                                            mode="multiple"
                                            maxTagCount="responsive"
                                            style={{ width: 250 }}
                                            options={packageOptions}
                                            onChange={(values) => {
                                                if (values.some(el => el !== 'default')) {
                                                    form.setFieldValue(['system', 'showcaseObjects', 'packages'], values.filter(el => el !== 'default'))

                                                    return
                                                }

                                                if (values.length < 1) {
                                                    form.setFieldValue(['system', 'showcaseObjects', 'packages'], ['default'])

                                                    return
                                                }
                                            }}
                                        // onChange={(e) => setSelectedShowcasePackages(e)}
                                        />
                                    </Form.Item>
                                </Row>
                                <Row>
                                    <Form.Item
                                        label="Фильтр классов"
                                        labelCol={{ span: 8, offset: 0 }}
                                        name={['system', 'showcaseObjects', 'classes']}
                                        initialValue={['default']}
                                    // style={{ width: 400 }}
                                    >
                                        <Select
                                            allowClear
                                            mode="multiple"
                                            maxTagCount="responsive"
                                            style={{ width: 250 }}
                                            options={showcaseClassesOptions}
                                            filterOption={(input, option) =>
                                                option.label.toLowerCase().includes(input.toLowerCase())}
                                            onChange={(values) => {
                                                if (values.some(el => el !== 'default')) {
                                                    form.setFieldValue(['system', 'showcaseObjects', 'classes'], values.filter(el => el !== 'default'))
                                                }

                                                if (values.length < 1) {
                                                    form.setFieldValue(['system', 'showcaseObjects', 'classes'], ['default'])

                                                }
                                            }}
                                        />
                                        {/* <ClassesCascader classPackages={selectedShowcasePackages} /> */}
                                    </Form.Item>

                                </Row>
                            </>

                        ),
                    },
                ]}
            />
            <Collapse
                activeKey={settingsPanels.managerObjects}
                onChange={(e) => { onChangeCollapseHeader(CollapseKeys.managerObjects, e) }}
                defaultActiveKey={[]}
                style={{ marginBottom: '10px', marginTop: '20px' }}
                items={[
                    {
                        key: '1',
                        label: (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <span>Объекты менеджера</span>
                                <ECTooltip
                                    title={managerPopover}
                                >
                                    <InfoCircleOutlined />
                                </ECTooltip>
                            </div>
                        ),
                        children: (
                            <>
                                <Row>
                                    <Form.Item
                                        label="Фильтр пакетов"
                                        // name="managerObjectsPackages"
                                        name={['system', 'managerObjects', 'packages']}
                                        labelCol={{ span: 8, offset: 0 }}
                                        initialValue={['default']}
                                    >
                                        <Select
                                            allowClear
                                            mode="multiple"
                                            maxTagCount="responsive"
                                            style={{ width: 250 }}
                                            options={packageOptions}
                                            onChange={(values) => {

                                                console.log('values', values)

                                                if (values.some(el => el !== 'default')) {
                                                    form.setFieldValue(['system', 'managerObjects', 'packages'], values.filter(el => el !== 'default'))

                                                    return
                                                }

                                                if (values.length < 1) {
                                                    form.setFieldValue(['system', 'managerObjects', 'packages'], ['default'])

                                                    return
                                                }
                                            }}
                                        />
                                    </Form.Item>
                                </Row>
                                <Row>
                                    <Form.Item
                                        label="Фильтр классов"
                                        labelCol={{ span: 8, offset: 0 }}
                                        // name="managerObjectsClasses"
                                        name={['system', 'managerObjects', 'classes']}
                                        initialValue={['default']}
                                    // style={{ width: 400 }}
                                    >
                                        <Select
                                            allowClear
                                            mode="multiple"
                                            maxTagCount="responsive"
                                            style={{ width: 250 }}
                                            options={managerClassesOptions}
                                            filterOption={(input, option) =>
                                                option.label.toLowerCase().includes(input.toLowerCase())}
                                            onChange={(values) => {
                                                if (values.some(el => el !== 'default')) {
                                                    form.setFieldValue(['system', 'managerObjects', 'classes'], values.filter(el => el !== 'default'))

                                                    return
                                                }

                                                if (values.length < 1) {
                                                    form.setFieldValue(['system', 'managerObjects', 'classes'], ['default'])

                                                    return
                                                }
                                            }}
                                        />
                                        {/* <ClassesCascader classPackages={selectedManagerPackages} /> */}

                                    </Form.Item>
                                </Row>
                                <Row>
                                    <Form.Item
                                        label="Основные классы"
                                        labelCol={{ span: 8, offset: 0 }}
                                        name={['system', 'managerObjects', 'mainClasses']}
                                        initialValue={['default']}
                                    // style={{ width: 400 }}
                                    >
                                        <Select
                                            allowClear
                                            mode="multiple"
                                            maxTagCount="responsive"
                                            style={{ width: 250 }}
                                            options={mainClassesOptions}
                                            filterOption={(input, option) =>
                                                option.label.toLowerCase().includes(input.toLowerCase())}
                                            onChange={(values) => {
                                                if (values.some(el => el !== 'default')) {
                                                    form.setFieldValue(['system', 'managerObjects', 'mainClasses'], values.filter(el => el !== 'default'))

                                                    return
                                                }

                                                if (values.length < 1) {
                                                    form.setFieldValue(['system', 'managerObjects', 'mainClasses'], ['default'])

                                                    return
                                                }
                                            }}
                                        />
                                        {/* <ClassesCascader classPackages={[1]} /> */}
                                    </Form.Item>
                                </Row>
                            </>
                        ),
                    },
                ]}
            />
            <Collapse
                activeKey={settingsPanels.constructorObjects}
                onChange={(e) => { onChangeCollapseHeader(CollapseKeys.constructorObjects, e) }}
                defaultActiveKey={[]}
                style={{ marginBottom: '10px', marginTop: '20px' }}
                items={[
                    {
                        key: '1',
                        label: (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <span>Объекты конструктора</span>
                            </div>
                        ),
                        children: (
                            <>
                                <Row>
                                    <Form.Item
                                        label="Загружать объекты для конструктора"
                                        // name="managerObjectsPackages"
                                        name={['system', 'constructorObjects', 'getObjectsForConstructor']}
                                        labelCol={{ span: 21, offset: 0 }}
                                        initialValue="true"
                                        valuePropName="checked"
                                    >
                                        <Switch />
                                    </Form.Item>
                                </Row>
                                <Row>
                                    <Form.Item
                                        label="Фильтр пакетов"
                                        name={['system', 'constructorObjects', 'packages']}
                                        labelCol={{ span: 8, offset: 0 }}
                                        initialValue={['default']}
                                    >
                                        <Select
                                            allowClear
                                            mode="multiple"
                                            maxTagCount="responsive"
                                            style={{ width: 250 }}
                                            options={packageOptions}
                                            onChange={(values) => {
                                                if (values.some(el => el !== 'default')) {
                                                    form.setFieldValue(['system', 'constructorObjects', 'packages'], values.filter(el => el !== 'default'))

                                                    return
                                                }

                                                if (values.length < 1) {
                                                    form.setFieldValue(['system', 'constructorObjects', 'packages'], ['default'])

                                                    return
                                                }
                                            }}
                                        />
                                    </Form.Item>
                                </Row>
                                <Row>
                                    <Form.Item
                                        label="Фильтр классов"
                                        labelCol={{ span: 8, offset: 0 }}
                                        name={['system', 'constructorObjects', 'classes']}
                                        initialValue={['default']}
                                    >
                                        <Select
                                            allowClear
                                            mode="multiple"
                                            maxTagCount="responsive"
                                            style={{ width: 250 }}
                                            options={managerClassesOptions}
                                            filterOption={(input, option) =>
                                                option.label.toLowerCase().includes(input.toLowerCase())}
                                            onChange={(values) => {
                                                if (values.some(el => el !== 'default')) {
                                                    form.setFieldValue(['system', 'constructorObjects', 'classes'], values.filter(el => el !== 'default'))

                                                    return
                                                }

                                                if (values.length < 1) {
                                                    form.setFieldValue(['system', 'constructorObjects', 'classes'], ['default'])

                                                    return
                                                }
                                            }}
                                        />
                                        {/* <ClassesCascader classPackages={selectedManagerPackages} /> */}

                                    </Form.Item>
                                </Row>
                            </>

                        ),
                    },
                ]}
            />
            <DefaultModal2
                open={openModal}
                onCancel={close}
                showFooterButtons={false}
                tooltipText="Лог изменений настроек 'Система'"
                height="90vh"
                width="90vw"
                centered
            >
                <Select
                    style={{ width: '200px', marginBottom: '20px' }}
                    placeholder="Выберите дату"
                    onChange={(value) => {
                        const log = config?.systemLogs.find(log => log.timestamp === value);

                        setSelectedLog(log);
                    }}
                    options={config?.systemLogs?.map((log) => ({
                        value: log.timestamp,
                        label: new Date(log.timestamp).toLocaleString(),
                    }
                    ))}
                />

                {selectedLog && (
                    <div>
                        <p><strong>Пользователь:</strong> {selectedLog.user.login}</p>
                        <div style={{ overflowY: 'auto', height: 740, overflowX: 'hidden' }}>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <h3>Старые значения</h3>
                                    {/* <ReactJson src={selectedLog.oldValues} collapsed={1} /> */}
                                    <ECColorfulText content={selectedLog.oldValues} backgroundColor="black" textColor="white" format="json" />
                                </Col>
                                <Col span={12}>
                                    <h3>Новые значения</h3>
                                    <ECColorfulText content={selectedLog.newValues} backgroundColor="black" textColor="white" format="json" />
                                    {/* <ReactJson src={selectedLog.newValues} collapsed={1} /> */}
                                </Col>
                            </Row>
                        </div>
                    </div>
                )}
            </DefaultModal2>
        </>
    )
}

export default SystemSettingForm