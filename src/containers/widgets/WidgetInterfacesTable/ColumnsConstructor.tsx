import { selectClasses, useClassesStore } from '@shared/stores/classes'
import { IAttribute } from '@shared/types/attributes'
import { SortableList } from '@shared/ui/SortableList'
import { Buttons } from '@shared/ui/buttons'
import { Forms } from '@shared/ui/forms'
import { DefaultModal2 } from '@shared/ui/modals'
import WrapperCard from '@shared/ui/wrappers/WrapperCard/WrapperCard'
import { Col, Form, FormInstance, Row } from 'antd'
import { FC, useEffect, useState } from 'react'

const TYPE_OPTIONS = [
    {
        label: 'Объект',
        value: 'object',
    },
    {
        label: 'Атрибут',
        value: 'attribute',
    },
]

const TYPE_VALUE_OPTIONS = [
    {
        label: 'Класс',
        value: 'class',
    },
    {
        label: 'Название',
        value: 'name',
    },
    // {
    //     label: 'Статус',
    //     value: 'status',
    // },
]

const REPRESENTATION_TYPE = [
    {
        label: 'Текст',
        value: 'usual',
    },
    // {
    //     label: 'Прогресс-бар',
    //     value: 'progressBar',
    // },
    {
        label: 'Иконка с текстом',
        value: 'iconAndText',
    },
]

interface IColumnsConstructor {
    form: FormInstance<any>
    value?: any[]
    onChange?: any
    targetClasses?: any
}

export interface IColumns {
    name: string
    type: 'object' | 'attribute'
    typeValue: 'class' | 'name' | 'status' | number
    representation?: 'usual' | 'iconAndText' | 'progressBar'
    id: number
}

const ColumnsConstructor: FC<IColumnsConstructor> = ({ form, value, onChange, targetClasses }) => {
    const [columns, setColumns] = useState<IColumns[]>([])
    const [chosenColumnId, setChosenColumnId] = useState<number | null>(null)
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
    const [chosenColumnType, setChosenColumnType] = useState<'object' | 'attribute'>(undefined)
    const [attributesOptions, setAttributesOptions] = useState<IAttribute[]>([])
    const [id, setId] = useState<number>(0)
    const classes = useClassesStore(selectClasses)

    useEffect(() => {
        if (targetClasses) {
            const chosenClasses = classes.filter((cl) => targetClasses.includes(cl.id))

            const attributeIds: number[] = []
            const localAttributesForOptions: IAttribute[] = []

            chosenClasses.forEach((item) => {
                item.attributes.forEach((attr) => {
                    if (attributeIds.includes(attr.id) == false) {
                        localAttributesForOptions.push(attr)
                    }
                })
            })
            setAttributesOptions(localAttributesForOptions)
        }
    }, [targetClasses])

    const clearForm = () => {
        form.setFieldsValue({
            columnItemName: null,
            columnItemType: null,
            columnItemValueType: null,
            columnItemRepresentation: null,
        })
    }

    const handleCancelModal = () => {
        setIsModalVisible(false)
        clearForm()
        setChosenColumnType(null)
        setChosenColumnId(null)
    }

    const handleSubmitButton = () => {
        const formData = form.getFieldsValue()

        const localMenuItems = [...columns]

        if (chosenColumnId) {
            localMenuItems.forEach((item) => {
                if (item.id == chosenColumnId) {
                    (item.name = formData.columnItemName),
                    (item.type = formData.columnItemType),
                    (item.typeValue = formData.columnItemValueType),
                    (item.representation = formData.columnItemRepresentation)
                }
            })
        } else {
            localMenuItems.push({
                name: formData.columnItemName,
                type: formData.columnItemType,
                typeValue: formData.columnItemValueType,
                representation: formData.columnItemRepresentation,
                id: id + 1,
            })
            setId(id + 1)
        }

        clearForm()
        setColumns(localMenuItems)
        setIsModalVisible(false)
        setChosenColumnType(null)
        setChosenColumnId(null)
    }

    useEffect(() => {
        onChange(columns)
    }, [columns])

    const handleDeleteButton = (id) => {
        const localColumns = [...columns]

        setColumns(localColumns.filter((column) => column.id !== id))
    }
    const handleEditButton = (item) => {
        form.setFieldsValue({
            columnItemName: item.name,
            columnItemType: item.type,
            columnItemValueType: item.typeValue,
            columnItemRepresentation: item.representation,
        })
        setChosenColumnType(item.type)
    }

    useEffect(() => {
        if (value) {
            let newPseudoId = id
            const localItems = value.map((item) => {
                newPseudoId += 1

                return {
                    ...item,
                }
            })

            setId(newPseudoId)

            setColumns(localItems)
        }
    }, [])

    return (
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <>
            {targetClasses?.length > 0 && (
                <>
                    <WrapperCard title="Конструктор колонок">
                        <Buttons.ButtonAddRow
                            size="large"
                            style={{ margin: '10px 20px' }}
                            onClick={() => {
                                setIsModalVisible(true)
                            }}
                        />
                        <div style={{ marginLeft: '20px', width: '80%' }} className="constructorWrapper">
                            <SortableList
                                items={columns}
                                onChange={setColumns}
                                renderItem={(item) => (
                                    // eslint-disable-next-line react/jsx-no-useless-fragment
                                    <>
                                        <SortableList.Item
                                            id={item.id}
                                            customItemStyle={{ padding: 0, borderRadius: '8px' }}
                                        >
                                            <Row align="middle" justify="space-between" style={{ width: '100%' }}>
                                                <Col span={12} style={{ marginLeft: '10px' }}>
                                                    {item.name}
                                                </Col>
                                                <Row gutter={4} justify="space-between">
                                                    <Col>
                                                        {' '}
                                                        <Buttons.ButtonEditRow
                                                            onClick={() => {
                                                                setChosenColumnId(item.id)
                                                                handleEditButton(item)
                                                                setIsModalVisible(true)
                                                            }}
                                                        />
                                                    </Col>

                                                    <Col>
                                                        {' '}
                                                        <Buttons.ButtonDeleteRow
                                                            onClick={() => {
                                                                handleDeleteButton(item.id)
                                                            }}
                                                        />
                                                    </Col>
                                                </Row>
                                            </Row>
                                            <SortableList.DragHandle
                                                customDragHandlerStyle={{
                                                    padding: '15px 10px',
                                                    alignSelf: 'baseline',
                                                    marginTop: '5px',
                                                }}
                                            />
                                        </SortableList.Item>
                                    </>
                                )}
                            />
                        </div>
                    </WrapperCard>
                    <DefaultModal2
                        showFooterButtons={false}
                        destroyOnClose
                        title={`${chosenColumnId ? 'Редактирование' : 'Создание'} колонки`}
                        onCancel={handleCancelModal}
                        open={isModalVisible}
                    >
                        <Row gutter={8}>
                            <Col span={12}>
                                <Form.Item label="Название" name="columnItemName">
                                    <Forms.Input placeholder="Название" />
                                </Form.Item>

                                <Form.Item label="Источник данных" name="columnItemType">
                                    <Forms.Select
                                        placeholder="Объект/аттрибут"
                                        options={TYPE_OPTIONS}
                                        onChange={(e) => {
                                            setChosenColumnType(e)
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Тип данных" name="columnItemValueType">
                                    {chosenColumnType == 'object' ? (
                                        <Forms.Select
                                            disabled={chosenColumnType == undefined}
                                            placeholder="Выберите источник данных"
                                            options={TYPE_VALUE_OPTIONS}
                                        />
                                    ) : (
                                        <Forms.Select
                                            disabled={chosenColumnType == undefined}
                                            placeholder="Выберите источник данных"
                                            customData={{
                                                data: attributesOptions,
                                                convert: {
                                                    valueField: 'id',
                                                    optionLabelProp: 'name',
                                                },
                                            }}
                                        />
                                    )}
                                </Form.Item>
                                <Form.Item label="Визуальное представление" name="columnItemRepresentation">
                                    <Forms.Select options={REPRESENTATION_TYPE} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Buttons.ButtonAdd
                            onClick={handleSubmitButton}
                            color="rgb(92, 184, 92)"
                            customText={`${chosenColumnId ? 'Редактировать' : 'Создать'} колонку`}
                            icon={null}
                        />
                    </DefaultModal2>
                </>
            )}
        </>
    )
}

export default ColumnsConstructor 