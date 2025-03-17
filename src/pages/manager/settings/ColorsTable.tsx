import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { ButtonDeleteRow, ButtonEditRow, Buttons } from '@shared/ui/buttons'
import { Forms } from '@shared/ui/forms'
import { DefaultModal2 } from '@shared/ui/modals'
import ColorPicker from '@shared/ui/pickers/ColorPicker/ColorPicker'
import { Table } from '@shared/ui/tables'
import { ECTooltip } from '@shared/ui/tooltips'
import { Button, Col, Form, Row, Space } from 'antd'
import { ColumnType } from 'antd/es/table'
import { FC, useEffect, useState } from 'react'

interface IColorsTable {
    isSavingColors?: boolean
    onChange?: any
    value?: any
    form: any
}

const ColorsTable: FC<IColorsTable> = ({ isSavingColors, onChange, value, form }) => {
    const baseColorsScheme = [
        {
            name: 
            <>
                Основной
                <br />
                [primaryColor]
            </>,
            mnemo: 'primaryColor',
            label: 'Основной'
        },
        { name: 
        <>
            Дополнительный
            <br />
                    [secondaryColor]
        </>, mnemo: 'secondaryColor', label: 'Дополнительный' },
        {
            name: (
                <Button
                    onClick={() => {
                        setIsModalVisible(true)
                        setFormType('color')
                    }}
                >
                    +Цвет
                </Button>
            ),
            dataIndex: 'addScheme',
            mnemo: 'addScheme',
        },
    ]
    const baseColumns: ColumnType<any>[] = [
        {
            title: 'Цвет/Схема',
            dataIndex: 'schemeAndColor',
            key: 'schemeAndColor',
            width: '10%',
        },
        {
            title: (
                <>
                Светлая
                    {/* Основной
                    <br />
                    [primaryColor] */}
                </>
            ),
            dataIndex: 'light',
            key: 'Светлая',
            width: '10%',
        },
        {
            title: (
                <>
                Тёмная
                    {/* Дополнительный
                    <br />
                    [secondaryColor] */}
                </>
            ),
            dataIndex: 'dark',
            key: 'Тёмная',
            width: '10%',
        },
        {
            title: (
                <Button
                    onClick={() => {
                        setIsModalVisible(true)
                        setFormType('scheme')
                    }}
                >
                    +Схема
                </Button>
            ),
            dataIndex: 'addScheme',
            key: 'addScheme',
            width: '5%',
        },
        {
            title: '',
            dataIndex: 'actions',
        },
    ]
    const [rows, setRows] = useState<any[]>([])
    const [colorsScheme, setColorsScheme] = useState<any[]>(baseColorsScheme)
    const [columns, setColumns] = useState<any[]>(baseColumns)
    const [formType, setFormType] = useState<'color' | 'scheme'>(null)
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
    const [editableColumn, setEditableColumn] = useState<string>(null)
    const [finalColumns, setFinalColumns] = useState<any[]>([])
    const createColumnTitle = (title, mnemo) => {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    {title}
                    <br />[{mnemo}]
                </div>
                <Space direction="vertical">
                    <ECTooltip title="Редактирование">
                        <ButtonEditRow
                            onClick={() => {
                                editButtonHandler(mnemo)
                            }}
                            type="link"
                            icon={<EditOutlined />}
                        />
                    </ECTooltip>

                    <ButtonDeleteRow
                        onClick={() => {
                            deleteColumnHandler(mnemo)
                        }}
                        withConfirm
                        // style={{ color: '#FF0000' }}
                        type="link"
                        icon={<DeleteOutlined />}
                        popupTitle="Удалить колонку"
                    />
                </Space>
            </div>
        )
    }
    const handleCancelModal = () => {
        setIsModalVisible(false)

        clearForm()
    }

    const deleteRowButtonHandler = (mnemo) => {
        const localColorsScheme = [...columns]
        const filteredRows = localColorsScheme.filter((row) => row.dataIndex !== mnemo && row.dataIndex !== '')

        setColumns(filteredRows)
    }

    const clearForm = () => {
        form.setFieldsValue({
            cellName: null,
            cellMnemo: null,
        })
        setEditableColumn(null)
        setFormType(null)
    }

    useEffect(() => {
        const localColumns = [...columns]

        const localFinalColumns = localColumns.map((column) => {
            const title = column.created ? (
                <div>
                    {column.key}
                    <br />[{column.dataIndex}]
                    <Space direction="vertical">
                        <ButtonDeleteRow
                            onClick={() => {
                                deleteRowButtonHandler(column.dataIndex)
                            }}
                            withConfirm
                            // style={{ color: '#FF0000' }}
                            type="link"
                            icon={<DeleteOutlined />}
                            popupTitle="Удалить колонку"
                        />
                    </Space>
                </div>
            ) : (
                <div>
                    {column.key}
                    <br />[{column.mnemo}]
                </div>
            )

            return { title, ...column }
        })

        setFinalColumns(localFinalColumns)
    }, [columns])

    const deleteColumnHandler = (mnemo) => {
        const localColumns = [...colorsScheme]

        const filteredColumns = localColumns.filter((column) => column.mnemo !== mnemo)

        setColorsScheme(filteredColumns)
    }

    const convertColor = (color) => {
        const convertedColor = typeof color == 'string' ? color : color?.toHexString()

        return convertedColor
    }

    const editButtonHandler = (mnemo) => {
        const localColumns = [...colorsScheme]
        const column = [...localColumns].find((column) => column.mnemo === mnemo)

        form.setFieldsValue({
            cellName: column.name,
            cellMnemo: column.mnemo,
        })
        setFormType('color')
        setEditableColumn(mnemo)
        setIsModalVisible(true)
    }

    useEffect(() => {
        const testRows: any[] = []

        colorsScheme.forEach((item) => {
            const row: any = {}
            const localColumns = finalColumns.filter(
                (cl) => cl.dataIndex !== 'schemeAndColor' && cl.dataIndex !== 'actions' && cl.dataIndex !== 'addScheme'
            )

            row.key = item.mnemo
            row.label = item?.label || item?.name
            row.schemeAndColor =
                item.mnemo == 'primaryColor' || item.mnemo == 'secondaryColor' || item.mnemo == 'addScheme'
                    ? item.name
                    : createColumnTitle(item.name, item.mnemo)

            if (item.mnemo !== 'addScheme') {
                {
                    localColumns.forEach((cl) => {
                        row[cl.dataIndex] = (
                            <Form.Item name={`${cl.dataIndex}_${item.mnemo}`} style={{ margin: 0 }}>
                                <ColorPicker wideVersion />
                            </Form.Item>
                        )
                    })
                }
            }

            testRows.push(row)
        })
        setRows(testRows)
    }, [colorsScheme, finalColumns])

    useEffect(() => {
        if (value) {

   
            const localValue = [...value]

            if (localValue[0]?.colors.length > 2) {
                const localBaseColumns = [...columns]

                localValue[0]?.colors.slice(2).forEach((item) => {
                    localBaseColumns.splice(localBaseColumns?.length - 2, 0, {
                        created: true,
                        dataIndex: item?.mnemo,
                        key: item?.name,
                        width: '12%',
                    })
                })
                const uniqueObjectsByMnemo = [...new Set(localBaseColumns.map(obj => obj.dataIndex))]
                    .map(dataIndex => localBaseColumns.find(obj => obj.dataIndex === dataIndex));

                setColumns(uniqueObjectsByMnemo)
            }
            const localColorScheme = [...baseColorsScheme]

            localValue.slice(2).forEach((item) => {
                localColorScheme.splice(localColorScheme?.length - 1, 0, {
                    name: item?.name,
                    mnemo: item?.mnemo,
                    label: item?.label
                })

                setColorsScheme(localColorScheme)
            })
        
            localValue?.forEach((item) => {
                item?.colors?.forEach((color) => {
                    form.setFieldValue(
                        `${color?.mnemo}_${item?.mnemo}`, color?.color,
                    )
                })
            })
        }
    }, [])



    useEffect(() => {
        if (isSavingColors) {
            const localData: any[] = []

            const localColumns = finalColumns.filter(
                (cl) => cl.dataIndex !== 'schemeAndColor' && cl.dataIndex !== 'actions' && cl.dataIndex !== 'addScheme'
            )

            rows.filter(row => row.key !== 'addScheme').forEach((row) => {
                const element: any = {}

                element.name = row.label || row?.name
                element.mnemo = row.key
                const colors: any[] = []

                localColumns.forEach((item) => {
                    colors.push({
                        name: item.key,
                        mnemo: item.dataIndex,
                        color: convertColor(form.getFieldValue(`${item.dataIndex}_${row.key}`)),
                    })
                })
                element.colors = colors
                localData.push(element)
                
            })
            onChange(localData)
        }
    }, [isSavingColors])

    const buttonAddHandler = () => {
        const name = form.getFieldValue('cellName')
        const mnemo = form.getFieldValue('cellMnemo')

        if (formType == 'scheme') {
            const localColumns = [...columns]

            if (editableColumn) {
                localColumns.forEach((item) => {
                    if (item.dataIndex == editableColumn) {
                        (item.key = name), (item.dataIndex = mnemo)
                    }
                })
            } else {
                localColumns.splice(localColumns?.length - 2, 0, {
                    created: true,
                    dataIndex: mnemo,
                    key: name,
                    width: '10%',
                })
            }
            setColumns(localColumns)
        }

        if (formType == 'color') {
            const localColorsScheme = [...colorsScheme]

            if (editableColumn) {
                localColorsScheme.forEach((item) => {
                    if (item.mnemo == editableColumn) {
                        (item.name = name), (item.mnemo = mnemo), (item.label = name)
                    }
                })
            }
            else {
                localColorsScheme.splice(localColorsScheme?.length - 1, 0, {
                    name: name,
                    mnemo: mnemo,
                    label: name
                })
            }

            setColorsScheme(localColorsScheme)
        }
        setIsModalVisible(false)
        clearForm()
    }

    return (
        <>
            <DefaultModal2
                tooltipText="Настройка палитры"
                showFooterButtons={false}
                destroyOnClose
                onCancel={handleCancelModal}
                open={isModalVisible}
            >
                <Row gutter={8}>
                    <Col span={12}>
                        <Form.Item label="Название" name="cellName">
                            <Forms.Input placeholder="Название" />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item label="Мнемоника" name="cellMnemo">
                            <Forms.Input placeholder="Название" />
                        </Form.Item>
                    </Col> 
                </Row>
                <Buttons.ButtonAdd color="rgb(92, 184, 92)" icon={null} onClick={buttonAddHandler} />
            </DefaultModal2>{' '}
            <Col span={24}><Table scroll={{ x: 1000 }} rows={rows} columns={finalColumns} pagination={false} /></Col>
            
        </>
    )
}

export default ColorsTable