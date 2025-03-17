/* eslint-disable max-len */
/* eslint-disable react/jsx-max-depth */
import { IOAChartToolbarProps } from './types'
import { CalendarOutlined, CloseOutlined, SettingOutlined } from '@ant-design/icons'
import { useClassesStore } from '@shared/stores/classes'
import { BaseButton, Buttons } from '@shared/ui/buttons'
import { ECSelect, Input } from '@shared/ui/forms'
import { DefaultModal2 } from '@shared/ui/modals'
import { ECTooltip } from '@shared/ui/tooltips'
import { Form, DatePicker, Popover, Checkbox } from 'antd'
import { FC, useEffect, useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/ru'
import updateLocale from 'dayjs/plugin/updateLocale'
import locale from 'antd/es/locale/ru_RU'
import { useWatch } from 'antd/es/form/Form'
import { useTheme } from '@shared/hooks/useTheme'
import { selectAccount, useAccountStore } from '@shared/stores/accounts'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'
import { generalStore } from '@shared/stores/general'

const { RangePicker } = DatePicker

export const OAChartsLayoutToolbar: FC<IOAChartToolbarProps> = (props) => {
    const {
        multigraph,
        graph,
        classSettings,
        visibleLinkedClasses,
        showHierarchy,
        isGroupedByClass,
        commonSettings,
        resetActiveAds,
        setGridCount,
        setVisibleLinkedClasses,
        setOATreeSettings,
        setOATreeToolbarSettings,
        setCommonSettings,
        visualSettings,
    } = props ?? {}

    useEffect(() => {
        dayjs.extend(updateLocale)
        dayjs.updateLocale('ru', {
            weekStart: 1,
        })
    }, [])

    const [form] = Form.useForm()

    const isShowHierarchy = useWatch('showHierarchy', form)
    const initial: {
        multigraph: typeof multigraph
        graph: typeof graph
        linkedClasses: typeof visibleLinkedClasses
        showHierarchy?: boolean
        isGroupedByClass?: boolean
        dateInterval: [Dayjs, Dayjs]
        limit: typeof commonSettings.limit
    } = {
        multigraph: multigraph,
        graph: graph,
        linkedClasses: visibleLinkedClasses,
        dateInterval:
            commonSettings?.dateInterval && commonSettings?.dateInterval?.[0] && commonSettings?.dateInterval?.[1]
                ? [dayjs.unix(commonSettings?.dateInterval?.[0]), dayjs.unix(commonSettings?.dateInterval?.[1])]
                : [null, null],
        limit: commonSettings?.limit,
        showHierarchy: showHierarchy,
        isGroupedByClass: isGroupedByClass,
    }
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
    const [graphType, setGraphType] = useState<'multigraph' | 'graph'>(null)
    const getClassById = useClassesStore((st) => st.getClassById)
    // const [cols, setCols] = useState<number>(1)

    const theme = useTheme()
    const accountData = useAccountStore(selectAccount)
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode
    const interfaceView = generalStore((st) => st.interfaceView)
    const isShowcase = interfaceView === 'showcase'
    const color = isShowcase ? createColorForTheme(theme?.widget?.textColor, theme?.colors, themeMode) : '#000000'
    const background = isShowcase ? createColorForTheme(theme?.widget?.background, theme?.colors, themeMode) : '#ffffff'

    const handleCancelModal = () => {
        setIsModalVisible(false)
    }
    const submitButtonHandler = (type: 'multigraph' | 'graph', gridCount: number) => {
        // sweepFunction(graphType, cols)
        setGridCount(type, gridCount)
        handleCancelModal()
        // setCols(gridCount)
    }

    const handleFormChange = (v, vs) => {
        // console.log('v', v)

        if ('dateInterval' in v) {
            // console.log('start',
            //     dayjs(vs.dateInterval?.[0]).format('YYYY-MM-DD HH:mm:ss'),
            //     dayjs(vs.dateInterval?.[0]).unix())
            // console.log('end',
            //     dayjs(vs.dateInterval?.[1]).format('YYYY-MM-DD HH:mm:ss'),
            //     dayjs(vs.dateInterval?.[1]).unix(),)

            if (vs?.dateInterval && vs.dateInterval?.[0] && vs.dateInterval?.[1]) {
                setCommonSettings({
                    dateInterval: [dayjs(vs.dateInterval[0]).unix(), dayjs(vs.dateInterval[1]).unix()],
                })
            } else {
                setCommonSettings({
                    dateInterval: null,
                })
            }
        }
        // console.log('unix v', dayjs(v.dateInterval[0]).unix(), dayjs(v.dateInterval[1]).unix(),)
        // console.log('v', v)
        // console.log('vs', vs)

        return vs
    }

    const handleFormSubmit = (vs) => {
        setGridCount('graph', vs.graph.gridCount)
        setGridCount('multigraph', vs.multigraph.gridCount)

        // console.log('vs', vs)

        setCommonSettings({
            limit: Number(vs.limit),
        })

        setOATreeSettings({
            showHierarchy: vs.showHierarchy,
            isGroupedByClass: vs.isGroupedByClass,
        })
        setOATreeToolbarSettings({
            showHierarchy: vs.showHierarchy,
            isGroupedByClass: vs.isGroupedByClass,
        })
        vs?.linkedClasses?.length > 0 ? setVisibleLinkedClasses(vs.linkedClasses) : setVisibleLinkedClasses([])
        handleCancelModal()
    }

    const generateStyles = () => {
        return `

        .ant-popover-inner {
        background-color: ${background ?? '#ffffff'} !important;
                color: ${color ?? '#000000'} !important;
        }

        .ant-popover-title {
        color: ${color ?? '#000000'} !important;
        }
        `
    }

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'end',
                alignItems: 'center',
                // width: '100%',
                height: '52px',
                // height: '6%',
                padding: 10,
                gap: 10,
                backgroundColor: background ?? 'white',
                border: `${visualSettings?.layout?.borderWidth ?? 0}px solid ${
                    visualSettings?.layout?.borderColor ?? 'rgba(0, 0, 0, 0.1)'
                }`,
                boxShadow: `0 0 ${visualSettings?.layout?.boxShadowWidth ?? 2}px ${
                    visualSettings?.layout?.boxShadowColor ?? 'rgba(0, 0, 0, 0.1)'
                }`,
                borderRadius: `${visualSettings?.layout?.borderRadius ?? 8}px`,
            }}
        >
            {multigraph.activeOAIds.length > 0 && (
                <ECTooltip title="Очистить зону мультиграфиков">
                    <BaseButton
                        size="small"
                        shape="circle"
                        icon={<CloseOutlined />}
                        onClick={() => {
                            resetActiveAds('multigraph')
                        }}
                        style={{ color: color ?? '#000000', background: background ?? '#ffffff' }}
                    />
                </ECTooltip>
            )}
            {graph.activeOAIds.length > 0 && (
                <ECTooltip title="Очистить зону одиночных графиков">
                    <BaseButton
                        size="small"
                        shape="circle"
                        icon={<CloseOutlined />}
                        onClick={() => {
                            resetActiveAds('graph')
                        }}
                        style={{ color: color ?? '#000000', background: background ?? '#ffffff' }}
                    />
                </ECTooltip>
            )}
            <div>
                <style>{generateStyles()}</style>
                <Popover
                    content={
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                gap: 10,
                                background: background ?? '#ffffff',
                            }}
                        >
                            <Form
                                form={form}
                                layout="vertical"
                                initialValues={initial}
                                onValuesChange={handleFormChange}
                                // onFinish={(vs) => handleFormSubmit(vs)}
                            >
                                <Form.Item
                                    name="dateInterval"
                                    // label="Начальная и конечная даты"
                                    style={{
                                        // flex: 3,
                                        // width: '50%',
                                        margin: 0,
                                    }}
                                >
                                    <RangePicker
                                        allowClear
                                        locale={locale.DatePicker}
                                        showTime={{
                                            format: 'HH:mm:ss',
                                        }}
                                        format="DD.MM.YYYY HH:mm:ss"
                                    />
                                </Form.Item>
                            </Form>
                        </div>
                    }
                    title="Календарь"
                    trigger="click"
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        width: 150,
                        background: background ?? '#ffffff',
                    }}
                >
                    <ECTooltip title="Календарь">
                        <BaseButton
                            size="small"
                            shape="circle"
                            icon={<CalendarOutlined />}
                            style={{ color: color ?? '#000000', background: background ?? '#ffffff' }}
                        />
                    </ECTooltip>
                </Popover>
            </div>
            <ECTooltip title="Настройки">
                <BaseButton
                    size="small"
                    shape="circle"
                    icon={<SettingOutlined />}
                    onClick={() => {
                        setIsModalVisible(true)
                        // setGraphType('multigraph')
                    }}
                    style={{ color: color ?? '#000000', background: background ?? '#ffffff' }}
                />
            </ECTooltip>
            {/* <ECTooltip title="Задать развертку зоны одиночных графиков">
                <BaseButton
                    size="small"
                    shape="circle"
                    style={{ 
                        backgroundColor: '#000000', 
                        color: ' #ffffff' 

                    }}
                    type="primary"
                    icon={<NumberOutlined />}
                    onClick={() => {
                        setIsModalVisible(true)
                        setGraphType('graph')
                    }}
                />
            </ECTooltip> */}

            <DefaultModal2
                showFooterButtons={false}
                destroyOnClose
                open={isModalVisible}
                title="Форма настройки зоны графиков"
                onCancel={handleCancelModal}
                width="50%"
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    marginBottom: 0,
                }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={initial}
                    onValuesChange={handleFormChange}
                    onFinish={(vs) => handleFormSubmit(vs)}
                >
                    <div
                        style={{
                            display: 'flex',
                            // flexWrap: 'wrap',
                            flexDirection: 'column',
                            gap: 10,
                            marginBottom: '10px',
                        }}
                    >
                        <b style={{ color: color ?? '#000000' }}>Настройки графиков</b>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                border: '1px solid #d9d9d9',
                                // width: '50%',
                                gap: 10,
                                padding: 10,
                            }}
                        >
                            <Form.Item
                                name={['multigraph', 'gridCount']}
                                label="Мультиграфиков в ряду"
                                style={{
                                    // width: '50%',
                                    flex: 1,
                                    margin: 0,
                                }}
                            >
                                <Input type="number" min={1} step={1} />
                            </Form.Item>
                            <Form.Item
                                name={['graph', 'gridCount']}
                                label="Одиночных графиков в ряду"
                                style={{
                                    flex: 1,
                                    // width: '50%',
                                    margin: 0,
                                }}
                            >
                                <Input type="number" min={1} step={1} />
                            </Form.Item>
                            <Form.Item
                                name="limit"
                                label="Лимит запрашиваемых точек"
                                style={{
                                    flex: 1,
                                    // width: '50%',
                                    margin: 0,
                                }}
                            >
                                <Input type="number" min={0} step={1} />
                            </Form.Item>
                            {/* <Form.Item
                                name="dateInterval" 
                                label="Начальная и конечная даты"
                                style={{
                                    // flex: 3,
                                    // width: '50%',
                                    margin: 0
                                }}
                            >
                                <RangePicker 
                                    allowClear
                                    locale={locale.DatePicker}
                                    showTime={{
                                        format: 'HH:mm:ss'
                                    }}
                                    format="DD.MM.YYYY HH:mm:ss"
                                />
                            </Form.Item> */}
                        </div>
                        <b style={{ color: color ?? '#000000' }}>Настройки дерева</b>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                border: '1px solid #d9d9d9',
                                gap: 10,
                                padding: 10,
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    flex: 1,
                                    flexDirection: 'column',
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                    }}
                                >
                                    <Form.Item
                                        style={{
                                            margin: '0px 10px 0px 0px ',
                                            color: color ?? '#000000',
                                        }}
                                    >
                                        Отображение иерархии объектов
                                    </Form.Item>
                                    <Form.Item
                                        name="showHierarchy"
                                        // label="Отображение иерархии"
                                        style={{
                                            margin: 0,
                                        }}
                                        valuePropName="checked"
                                    >
                                        <Checkbox />
                                    </Form.Item>
                                </div>
                                {isShowHierarchy && (
                                    // {form.getFieldValue('showHierarchy') && (
                                    <Form.Item
                                        name="linkedClasses"
                                        // label="Отображение классов иерархии"
                                        style={{
                                            // flex: 1,
                                            maxWidth: '300px',
                                            // width: '40%',
                                            margin: 0,
                                        }}
                                    >
                                        <ECSelect
                                            mode="multiple"
                                            maxTagCount="responsive"
                                            allowClear
                                            placeholder="Отображаются все промежуточные"
                                            options={(classSettings?.classes ?? [])
                                                .reduce((res, group) => {
                                                    group.linking.forEach((clsId) => {
                                                        if (res.findIndex((el) => el.value === clsId) === -1) {
                                                            res.push({
                                                                value: clsId,
                                                                label: getClassById(clsId).name,
                                                            })
                                                        }
                                                    })

                                                    return res
                                                }, [])
                                                .sort((a, b) => a.label.localeCompare(b.label))}
                                        />
                                    </Form.Item>
                                )}
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    flex: 1,
                                    // border: '1px solid #d9d9d9',
                                    // padding: 10,
                                }}
                            >
                                <Form.Item
                                    style={{
                                        // flex: 1,
                                        // width: '200px',
                                        margin: '0px 10px 0px 0px ',
                                        color: color ?? '#000000',
                                    }}
                                >
                                    Группировка по классу
                                </Form.Item>
                                <Form.Item
                                    name="isGroupedByClass"
                                    // label="Группировка по классу"
                                    style={{
                                        // flex: 1,
                                        // width: '200px',
                                        // width: '40%',
                                        margin: 0,
                                    }}
                                    valuePropName="checked"
                                >
                                    <Checkbox />
                                </Form.Item>
                            </div>
                        </div>
                    </div>
                    <Form.Item style={{ marginBottom: 0 }}>
                        <Buttons.ButtonAdd
                            htmlType="submit"
                            color="rgb(92, 184, 92)"
                            customText="Сохранить"
                            icon={null}
                            // onClick={handleFormSubmit}
                        />
                    </Form.Item>
                </Form>
            </DefaultModal2>
        </div>
    )
}