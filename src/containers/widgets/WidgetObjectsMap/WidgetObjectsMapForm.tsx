import { FC, useEffect, useState } from 'react'
import { useForm } from 'antd/es/form/Form'
import { Button, Card, Col, Form, Input, Row, Space, Switch } from 'antd'
import { Select } from '@shared/ui/forms'
import { IObject } from '@shared/types/objects'
import { selectObjects, useObjectsStore } from '@shared/stores/objects'
import { selectClasses, useClassesStore } from '@shared/stores/classes';
import { IClass } from '@shared/types/classes'
import AttributesBindSelect from '@entities/attributes/AttributesBindSelect/AttributesBindSelect'
import { SortableList } from '@shared/ui/SortableList'
import { ECIconView } from '@shared/ui/ECUIKit/common/ECIconView/ECIconView'
import { initialTableRows, initialValues, representationOptions, viewTypeOptionsAfter, viewTypeOptionsBefore } from './data'
import { selectAttributes, useAttributesStore } from '@shared/stores/attributes'

export type stateFormType = {
    objects: IObject['id'][]
    mapCenter: [number, number],
    startZoom: number,
    fitToMarkers?: boolean,
    groups: {
        [key: number]: {
            order: number,
            attributesBind?: { 
                contour?: {
                    attribute_id?: number
                    stereotype_id?: number
                },
            }
            objectFilters?: {
                classIds: IClass['id'][]
            },
            representationType: 'points' | 'polygons' | 'pointsAndPolygons',
            isClustering?: boolean,
            clustersMaxZoom?: number,
            // сombinedMode?: boolean,
            zoomLevel?: number,
            viewTypeBeforeZoom?: 'pointsVeiw' | 'polygonsVeiw' |'clustersVeiw',
            viewTypeAfterZoom?:  'pointsVeiw' | 'polygonsVeiw', //|'clustersVeiw'
            coordinate?: { x: number, y: number }
        }
    }
    isTile?: boolean,
    fixedMap?: boolean,
    isLegend?: boolean
}

interface WidgetObjectMapForm {
    onChangeForm: <T>(data: T) => void
    settings: {
        vtemplate: {objectId: number},
        widget:  stateFormType,
    }
}

const WidgetObjectMapForm: FC<WidgetObjectMapForm> = (props) => {
    const { settings, onChangeForm } = props
    const [form] = useForm()
    const classes = useClassesStore(selectClasses)
    const initialGroupId = Date.now().toString();
    const [tableRows, setTableRows] = useState([])

    const attributesStore = useAttributesStore(selectAttributes).map((attr) => ({ label: attr.name, value: attr.id }))
    const initialValuesForm = {
        ...initialValues,
        groups: {
            [initialGroupId]: { ...initialTableRows, order: 0 }
        }
    }

    const [stateForm, setStateForm] = useState<stateFormType>({ ...initialValuesForm, ...settings?.widget })

    useEffect(() => {
        onChangeForm<stateFormType>(stateForm)
    }, [stateForm])

    useEffect(() => {
        const { groups } = settings.widget
        const initialRows = groups ? Object.entries(groups).map(([key, group]) => ({
            id: key,
            ...group
        })) : [{ ...initialTableRows, id: initialGroupId, order: 0 }]

        setTableRows(initialRows)

    }, [])

    useEffect(() => {
        form.setFieldsValue({ 
            ...settings?.widget,
            groups: Object.entries(settings?.widget.groups || {}).reduce((acc, [groupId, groupData]) => {
                acc[groupId] = {
                    ...groupData,
                    objectFilters: groupData.objectFilters?.classIds || []
                }

                return acc
            }, {})
        })
    }, [settings.widget])

    const onChangeFormHandler = (values, onChangeForm) => {
        const key = Object.keys(values)[0]

        if (key === 'mapCenter') {         
            return setStateForm((prev) => {
                return {
                    ...prev,
                    [key]: onChangeForm[key] !== '' 
                        ? onChangeForm[key].split(',').map(parseFloat) : undefined
                }
            })
        }

        if (key === 'startZoom') {
            return setStateForm((prev) => {
                return {
                    ...prev,
                    [key]: Number(onChangeForm[key])
                }
            })
        }

        if (key === 'groups') {
            const groupId = Object.keys(values.groups)[0]
            const groupValue = values.groups[groupId]
            const groupKey = Object.keys(groupValue)[0]

            return setStateForm((prev) => {
                const newGroups = { ...prev.groups }

                if (groupKey === 'representationType') {
                    newGroups[groupId] = {
                        ...newGroups[groupId],
                        attributesBind: undefined,
                        isClustering: false,
                        clustersMaxZoom: undefined,
                        zoomLevel: undefined,
                        viewTypeBeforeZoom: undefined,
                        viewTypeAfterZoom: undefined,
                        coordinates: undefined,
                        representationType: onChangeForm.groups[groupId][groupKey]
                    }
                } else if (groupKey === 'objectFilters') {
                    newGroups[groupId] = {
                        ...newGroups[groupId],
                        [groupKey]: {
                            mnemo: 'class_id', classIds: onChangeForm.groups[groupId][groupKey] ?? []
                        }
                    }
                } else if (groupKey === 'attributesBind') {
                    newGroups[groupId] = {
                        ...newGroups[groupId],
                        [groupKey]: {
                            contour: onChangeForm.groups[groupId][groupKey],
                        },
                    }
                } else {
                    newGroups[groupId] = {
                        ...newGroups[groupId],
                        [groupKey]: onChangeForm.groups[groupId][groupKey],
                    }
                }

                setTableRows((prevTableRows) => {
                    const updatedTableRows = prevTableRows.map((row) =>
                        row.id === groupId
                            ? { ...row, [groupKey]: newGroups[groupId][groupKey] }
                            : row
                    )

                    return updatedTableRows
                })

                return {
                    ...prev,
                    groups: newGroups,
                }
            })
        }

        if (key === 'attribute_id' || key === 'stereotype_id') {
            return stateForm
        }

        setStateForm((prev) => {
            return {
                ...prev,
                [key]: onChangeForm[key]
            }
        })
    }

    const addFilterGroup = () => {
        const newGroup = { ...initialTableRows, id: Date.now().toString() }

        updateTableRows([...tableRows, newGroup ])
    }

    const removeFilterGroup = (id: string) => {
        if (tableRows.length === 1) {

            updateTableRows([{ ...initialTableRows, id: id }])
        } else {
            const updatedItems = tableRows.filter((group) => group.id !== id)

            updateTableRows(updatedItems)
        }
    }

    const updateTableRows = (items) => {
        setTableRows(items.map( (item, index) => ({ ...item, order: index }) ))
    }

    useEffect(() => {
        setStateForm((prev) => {
            const updatedGroups = { ...prev.groups }

            tableRows.forEach((group) => {
                if (updatedGroups[group.id]) {
                    updatedGroups[group.id] = {
                        ...updatedGroups[group.id],
                        order: group.order,
                    };
                } else {
                    updatedGroups[group.id] = {
                        ...group,
                        order: group.order,
                    }
                }
            })
    
            Object.keys(updatedGroups).forEach((groupId) => {
                if (!tableRows.some((group) => group.id === groupId)) {
                    delete updatedGroups[groupId]
                }
            })

            return {
                ...prev,
                groups: updatedGroups
            }
        })
    }, [tableRows])

    return (
        <Form 
            form={form}
            layout="vertical"
            style={{ width: '100%' }}
            initialValues={initialValuesForm}
            onValuesChange={onChangeFormHandler}
        >
            <Card title="Общие настройки" type="inner" style={{ marginBottom: 20 }}>
                <Row gutter={20}>
                    <Col span={8}>
                        <Form.Item name="mapCenter" label="Центр карты">
                            <Input placeholder="Введите данные" />
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item name="startZoom" label="Начальный zoom">
                            <Input 
                                type="number" min={1} max={22} 
                                placeholder="Введите данные"                
                            />
                        </Form.Item>
                    </Col>
                    <Col>
                        <Form.Item 
                            name="fitToMarkers" 
                            label="Отображение всех объектов на карте" 
                            valuePropName="checked"
                        >
                            <Switch />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={20}>
                    <Col>
                        <Form.Item name="isTile" label="Показать слой карты" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                    </Col>
                    <Col>
                        <Form.Item name="fixedMap" label="Зафиксировать карту (блокировка)" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                    </Col>
                    <Col>
                        <Form.Item name="isLegend" label="Отобразить легенду" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                    </Col>
                </Row>  
            </Card>

            <Card title="Настройки вывода объектов" type="inner">
                <div>
                    <SortableList 
                        items={tableRows} 
                        onChange={newItems => updateTableRows(newItems)}
                        renderItem={(group) => (
                            <>
                                <div style={{ display: 'flex' }}>
                                    <SortableList.Item 
                                        id={group.id} 
                                        customItemStyle={{ padding: 5, width: '100%' }}
                                    >
                                        <Col 
                                            style={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                alignSelf: 'center',
                                                marginRight: 10,
                                            }} 
                                        >
                                            <SortableList.DragHandle
                                                customDragHandlerStyle={{
                                                    padding: '15px 10px',
                                                    alignSelf: 'center',
                                                    cursor: 'move', 
                                                    fill: 'transparent',
                                                }}
                                                svgStyle={{ height: 24, width: 20, fill: '#ccc' }}
                                            />
                                        </Col>
                                        <Row
                                            key={group.id}
                                            gutter={[20, 8]}
                                            style={{ display: 'flex', alignItems: 'flex-end', width: '100%' }}
                                        > 
                                            <Col span={4}>
                                                <Form.Item
                                                    name={['groups', group.id, 'objectFilters']}
                                                    label="Фильтр по классу"
                                                    labelAlign="left"
                                                >
                                                    {/* eslint-disable-next-line react/jsx-max-depth */}
                                                    <Select
                                                        customData={{
                                                            data: classes,
                                                            convert: { valueField: 'id', optionLabelProp: 'name' },
                                                        }}
                                                        mode="multiple"
                                                        placeholder="Выберите класс"
                                                        maxTagCount="responsive"
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={4}>
                                                <Form.Item
                                                    name={['groups', group.id, 'representationType']}
                                                    label="Тип отображения"
                                                    labelAlign="left"
                                                >
                                                    {/* eslint-disable-next-line react/jsx-max-depth */}
                                                    <Select
                                                        options={representationOptions}
                                                        placeholder="Выберите тип отображения"
                                                    />
                                                </Form.Item>
                                            </Col>
                                            {(stateForm.groups?.[group.id]?.representationType === 'points' ||
                                            stateForm.groups?.[group.id]?.representationType === 'pointsAndPolygons') 
                                            && (
                                                <>
                                                    <Col span={3}>
                                                        <Form.Item 
                                                            name={['groups', group.id, 'coordinates', 'x']}
                                                            label="Координата X" 
                                                        >
                                                            <Select
                                                                options={attributesStore}
                                                                placeholder="Выберите атрибут"
                                                            />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={3}>
                                                        <Form.Item 
                                                            name={['groups', group.id, 'coordinates', 'y']}
                                                            label="Координата Y" 
                                                        >
                                                            <Select
                                                                options={attributesStore}
                                                                placeholder="Выберите атрибут"
                                                            />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={3}>
                                                        <Form.Item 
                                                            name={['groups', group.id, 'isClustering']}
                                                            label="Кластеризация" 
                                                            valuePropName="checked" 
                                                        >
                                                            <Switch />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={4}>
                                                        <Form.Item 
                                                            name={['groups', group.id, 'clustersMaxZoom']}
                                                            label="Zoom кластеризации" 
                                                        >
                                                            <Input 
                                                                disabled={!settings
                                                                    ?.widget.groups?.[group.id]?.isClustering
                                                                || !stateForm.groups?.[group.id]?.isClustering}
                                                                type="number" min={1} max={22} 
                                                                placeholder="Введите данные"                
                                                            />
                                                        </Form.Item>
                                                    </Col>
                                                </>
                                            )}
                                            {(stateForm.groups?.[group.id]?.representationType === 'polygons' ||
                                            stateForm.groups?.[group.id]?.representationType === 'pointsAndPolygons') 
                                            && (
                                                <Col span={9}>
                                                    <Form.Item 
                                                        name={['groups', group.id, 'attributesBind']} 
                                                        label="Контур"
                                                    >
                                                        <AttributesBindSelect
                                                            onChange={onChangeFormHandler}
                                                            value={settings.widget
                                                                ?.groups?.[group.id]?.attributesBind?.contour}
                                                        />
                                                    </Form.Item>
                                                </Col>
                                            )}
                                            {stateForm.groups?.[group.id]?.representationType === 'pointsAndPolygons' 
                                            && (
                                                <>
                                                    <Col span={5}>
                                                        <Form.Item 
                                                            name={['groups', group.id, 'zoomLevel']} 
                                                            label="Уровень Zoom (переключение представлений)"
                                                        >
                                                            <Input 
                                                                type="number" min={1} max={22} 
                                                                placeholder="Введите данные"                
                                                            />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={5}>
                                                        <Form.Item 
                                                            name={['groups', group.id, 'viewTypeBeforeZoom']}
                                                            label="Представление до зума" 
                                                        >
                                                            <Select 
                                                                options={viewTypeOptionsBefore} 
                                                                placeholder="Выберите представление"
                                                            />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={5}>
                                                        <Form.Item 
                                                            name={['groups', group.id, 'viewTypeAfterZoom']} 
                                                            label="Представление после зума" 
                                                        >
                                                            <Select 
                                                                options={viewTypeOptionsAfter} 
                                                                placeholder="Выберите представление" 
                                                            />
                                                        </Form.Item>
                                                    </Col>
                                                </>
                                            )}
                                        </Row>
                                    </SortableList.Item>
                                    <Button
                                        size="small"
                                        onClick={() => removeFilterGroup(group.id)}
                                        style={{
                                            height: '100%',
                                            visibility: group.id === tableRows?.[0]?.id ? 'hidden' : 'visible'
                                        }}
                                    >
                                        <ECIconView icon="CloseOutlined" />
                                    </Button>
                                </div>
                                {group.id === tableRows?.at(-1)?.id &&
                                    <Button
                                        size="small"
                                        type="primary"
                                        onClick={addFilterGroup}
                                        style={{ height: '100%', width: '36px' }}
                                    >
                                        <ECIconView icon="PlusCircleOutlined" />
                                    </Button>}
                            </>
                        )}
                    />
                </div>
            </Card> 
        </Form>
    )
}

export default WidgetObjectMapForm