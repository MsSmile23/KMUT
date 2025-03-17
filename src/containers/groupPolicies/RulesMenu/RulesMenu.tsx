/* eslint-disable react/jsx-max-depth */
import { selectClassByIndex, selectClasses, useClassesStore } from '@shared/stores/classes'
import { ButtonDeleteRow, ButtonHelp, ButtonLook, ButtonSettings } from '@shared/ui/buttons'
import ECModal from '@shared/ui/ECUIKit/ECModal/ECModal'
import { Select } from '@shared/ui/forms'
import { Card, Col, Form, Menu, Row, Space } from 'antd'
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { createIcon, getClass } from '../GroupPoliciesFormContainer/utils'
import { IRuleItem, ITargetBlockItem, ModalType, textModalTitle } from '../types/types'
import './RulesMenuStyle.css'
import { useForm } from 'antd/es/form/Form'
import ButtonGroup from '@shared/ui/buttons/ButtonGroup/ButtonGroup'
import { EditTable } from '@shared/ui/tables/ECTable2/EditTable/EditTable'
import { columns, initialValues } from './data'
import { selectObjectByIndex, useObjectsStore } from '@shared/stores/objects'
import { IObject } from '@shared/types/objects'
import TablePreview from './TablePreview/TablePreview'
import { DownOutlined } from '@ant-design/icons'

interface RulesMenuProp {
    groupPolicyRules: ITargetBlockItem[],
    setGroupPolicyRules: React.Dispatch<React.SetStateAction<ITargetBlockItem[]>>,
    setChildrenKey: React.Dispatch<React.SetStateAction<number>>,
}

const RulesMenu: FC<RulesMenuProp> = (props) => {
    const { groupPolicyRules = [], setGroupPolicyRules, setChildrenKey } = props
    const [form] = useForm()
    const classes = useClassesStore(selectClasses)
    const getClassByIndex = useClassesStore(selectClassByIndex)
    const getObjectByIndex = useObjectsStore(selectObjectByIndex)

    const [ openModal, setOpenModal ] = useState<boolean>(false)
    const [ targetClassId, setTargetClassId ] = useState<number | string | undefined>(undefined)
    const [ filterClass, setFilterClass ] = useState<number | undefined>(undefined)
    const [ renderObjects, setRenderObjects ] = useState<IObject[]>([])
    const [ selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
    const [ selectedItemKey, setSelectedItemKey ] = useState<number | undefined>(undefined)
    const [ typeModal, setTypeModal ] = useState<ModalType>(ModalType.DEFAULT)
    const [ openKeys, setOpenKeys ] = useState<string[]>([])

    // Формирование списка классов
    const allOption = { label: 'Все', value: '*' }
    const classesOptions: { label: string, value: number | string }[] = classes
        ?.map(item => ({ label: item.name, value: item.id }))
        ?.sort((a, b) => a.label.localeCompare(b.label))
    const targetClassesOptions = [...classesOptions, allOption]
    const filterTargetClassesOptions = targetClassesOptions?.filter(item => !groupPolicyRules
        ?.some(groupPolicyRule => groupPolicyRule.target_class_id == item.value))

    const findSelectedItem = (rules: ITargetBlockItem[], key: number) => {
        return rules?.find(groupPolicyRule => groupPolicyRule.children
            ?.some(item => item.key === key))
            ?.children?.find(child => child.key === key);
    }
        
    const findSelectedRule = (rules: ITargetBlockItem[], key: number) => {
        return rules?.find(groupPolicyRule => groupPolicyRule.children
            ?.some(item => item.key === key));
    }

    const selectedItem: IRuleItem = useMemo(() => 
        findSelectedItem(groupPolicyRules, selectedItemKey), [groupPolicyRules, selectedItemKey])

    const selectedRule: ITargetBlockItem = useMemo(() => 
        findSelectedRule(groupPolicyRules, selectedItemKey), [groupPolicyRules, selectedItemKey])


    const rows = useMemo(() => renderObjects.map((obj, i) => ({
        key: `${i}`,
        id: obj?.id,
        name: obj?.name,
        code: obj?.codename
    })
    ), [renderObjects])

    // Ключи строк для отображения выбранных чекбоксов
    const selectedFilterKey = useMemo(() => {
        return rows.filter(row => selectedItem?.filter_objects
            ?.some(item => row?.id === item)).map(row => row.key)
    }, [rows, selectedItemKey, selectedItem])

    useEffect(() => {
        setSelectedRowKeys(selectedFilterKey)
    }, [selectedFilterKey])

    // Чекбоксы в таблице
    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys)
    }

    const rowSelection = {
        columnWidth: 50,
        selectedRowKeys,
        onSelect: (record, selected, selectedRows: typeof rows) => {
            form.setFieldValue('filter_objects', selectedRows.map((row) => row?.id))
        },
        onSelectAll: (selectedRows) => {
            if (selectedRows) {
                form.setFieldValue('filter_objects', renderObjects.map(({ id }) => id))
            } else {
                form.setFieldValue('filter_objects', [])
            }
        },
        onChange: onSelectChange,
    }

    // Клик по подпункту меню
    const handleSubItemClick = (subItem: IRuleItem, targetClass: number | string) => {
        setTargetClassId(targetClass)
        setFilterClass(subItem.filter_class_id)
        setSelectedItemKey(subItem.key)
    }

    // Добавление правила
    const addRule = (key: number) => {
        setChildrenKey(prevKey => {
            const newKey = prevKey + 1

            setGroupPolicyRules(prev => {
                return prev.map(item => {
                    if (item.key === key) {
                        return {
                            ...item,
                            children: [
                                ...item.children,
                                {
                                    key: newKey,
                                    label: item.label === 'Все' ? '' : item.label,
                                    filter_class_id: typeof item.target_class_id === 'string' ? null 
                                        : item.target_class_id,
                                    icon: item.icon,
                                    ...initialValues
                                }
                            ]
                        }
                    }

                    return item
                })
            })
            setFilterClass(typeof targetClassId === 'string' ? null : targetClassId)
            setSelectedItemKey(newKey)
            setOpenKeys(prev => [...prev, `${key}`])

            return newKey
        })
    }

    // Кнопка добавления правила
    const addRuleButton = (parentId: number) => ({
        key: `${parentId}-button`,
        label: (
            <ButtonSettings
                icon={false}
                type="primary" htmlType="submit"
                onClick={() => addRule(parentId)}
                style={{ width: '100%' }}
            >
                + Добавить Правило
            </ButtonSettings>
        ),
    })

    const onValuesChange = (value, onChangeForm) => {
        const key = Object.keys(value)[0]

        if ('all_filter_objects' in value && onChangeForm[key] === true) {
            form.setFieldValue('filter_objects', [])
            setSelectedRowKeys([])
        }

        if ('filter_class_id' in value) {
            setFilterClass(onChangeForm[key])
        }
    }

    // Сохранение настроек формы
    const handleSaveForm = () => {
        const fullClass = getClass(filterClass, getClassByIndex)
        const values = form.getFieldsValue()

        if (filterClass) {
            setGroupPolicyRules(prev => prev.map(item => ({
                ...item,
                children: item.children.map(subItem => {
                    if (subItem.key === selectedItemKey) {
                        return {
                            ...subItem,
                            label: fullClass.name,
                            icon: createIcon(fullClass.icon),
                            filter_class_id: fullClass.id,
                            ...values
                        }
                    }

                    return subItem
                })
            })))
        }
    }

    // Функция удаления блока или правила
    const handleDeleteItem = (blockKey?: number, ruleKey?: number) => {
        setGroupPolicyRules(prev => prev.map(item => {
            if (item.key === blockKey) {
                if (ruleKey) {
                    // Удаление конкретного правила из блока
                    const updatedChildren = item.children.filter(child => child.key !== ruleKey)

                    return updatedChildren.length === 0 ? null : { ...item, children: updatedChildren };
                }

                // Удаление целого блока
                return null
            }

            return item
        }).filter(item => item !== null))
        // Сброс значений
        setSelectedItemKey(undefined)
        setFilterClass(undefined)
        form.resetFields()
    }

    const handleDelete = () => {
        if (selectedItemKey) {
            if (selectedRule.children.length === 1) {
                handleDeleteItem(selectedRule.key)  // Удаляем целый блок
            } else {
                handleDeleteItem(selectedRule.key, selectedItemKey)  // Удаляем только правило
            }
        }
    }

    const loadAndResetFormFields = useCallback(() => {
        if (selectedItem) {
            setFilterClass(selectedItem.filter_class_id)
            form.setFieldsValue({
                filter_class_id: selectedItem.filter_class_id,
                path_classes: selectedItem.path_classes,
                filter_objects: selectedItem.filter_objects,
                path_direction_up: selectedItem.path_direction_up,
                except_path_classes: selectedItem.except_path_classes
            })
        }
    }, [selectedItemKey, selectedItem, groupPolicyRules])

    // Отменить изменения в форме
    const handleCancel = () => {
        loadAndResetFormFields() 
        setSelectedRowKeys(selectedFilterKey)
    }

    // Выбор target класса в модалке
    const handleChangeTargetClass = (value) => {
        setTargetClassId(value)
    }

    const handleCancelModal = () => {
        if (typeModal !== ModalType.TABLE_PREVIEW) {
            setTargetClassId(undefined)
        }
        setOpenModal(false)
    }

    // Создание блока с target классом
    const handleSubmitModal = () => {
        if (targetClassId) {
            const isClassExist = groupPolicyRules?.some((item) => item.target_class_id == targetClassId)
            const targetClass = getClass(targetClassId, getClassByIndex)

            if (!isClassExist) {
                setChildrenKey(prevKey => {
                    const groupPolicyRule: ITargetBlockItem = {
                        key: prevKey + 1,
                        label: targetClass?.name,
                        target_class_id: targetClass?.id,
                        icon: createIcon(targetClass?.icon),
                        children: [
                            {
                                key: prevKey + 2,
                                label: targetClass?.name === 'Все' ? '' : targetClass?.name,
                                filter_class_id: targetClass?.id === '*' ? null : targetClass?.id,
                                icon: createIcon(targetClass?.icon),
                                ...initialValues
                            }
                        ]
                    }

                    setGroupPolicyRules(prev => [...prev, groupPolicyRule])
                    setOpenKeys(prev => [...prev, `${prevKey + 1}`])
                    setFilterClass(targetClass?.id === '*' ? null : targetClass?.id),
                    setSelectedItemKey(prevKey + 2)

                    return prevKey + 2
                })
                setOpenModal(false)
            }
        }
    }

    const renderComponentModal = useMemo(() => {
        //Основные настройки
        if (typeModal === ModalType.CHANGE_TARGET_CLASS) {
            return (
                <div style={{ width: '100%' }}>
                    <Select 
                        options={filterTargetClassesOptions}
                        style={{ width: '100%' }} 
                        placeholder="Выберите целевой класс" 
                        onChange={handleChangeTargetClass}
                    />
                    <Space style={{ width: '100%', marginTop: 10, display: 'flex', justifyContent: 'center' }}>
                        <ButtonSettings
                            icon={false}
                            type="primary" htmlType="submit"
                            style={{ width: 145 }}
                            onClick={handleSubmitModal}
                            disabled={!targetClassId}
                        >
                            Применить
                        </ButtonSettings>
                        <ButtonSettings
                            icon={false}
                            type="primary"
                            style={{ backgroundColor: '#F5222D', width: 145 }}
                            onClick={handleCancelModal}
                        >
                            Отменить
                        </ButtonSettings>
                    </Space>
                </div>
            )
        }

        // Превью таблица выбранных объектов
        if (typeModal === ModalType.TABLE_PREVIEW) {
            return (
                <div style={{ height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>
                    <TablePreview 
                        targetClassId={selectedRule.target_class_id}
                        filterClassId={filterClass} 
                        filterObjectsIds={form.getFieldValue('filter_objects')} 
                    />
                </div>
            )
        }
    }, [typeModal, targetClassId, filterTargetClassesOptions, filterClass])

    // Список классов (target, filter) для отрисовки с кнопкой добавления filterClass
    const renderMenuItems = useMemo(() => {
        return groupPolicyRules?.map((item) => ({
            key: item.key,
            label: (
                <div 
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} 
                    className="main-menu-item" 
                >
                    <div style={{ display: 'flex', gap: 10 }}>
                        <DownOutlined className="custom-arrow" />
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            {item.icon}
                            {item.label}
                        </div>
                    </div>
                    <div onClick={(e) => { e.stopPropagation(), e.preventDefault() }} >
                        <ButtonDeleteRow withConfirm onClick={() => handleDeleteItem(item.key)} />
                    </div>
                </div>
            ),
            className: 'main-menu-item',
            children: [
                ...item.children.map(child => ({
                    key: child.key,
                    label: child.label,
                    icon: child.icon,
                    className: 'submenu-item',
                    onClick: () => handleSubItemClick(child, item.target_class_id)
                })),
                addRuleButton(item.key)
            ]
        }))
    }, [groupPolicyRules])

    // Обновляем значения в форме из groupPolicyRules при переключении между правилами
    useEffect(() => {
        loadAndResetFormFields()
    }, [selectedItemKey, groupPolicyRules])

    // Обновляем значения в таблице объектов при изменении filterClass
    useEffect(() => {
        if (filterClass) {
            form.setFieldValue('filter_class_id', filterClass)
            const objectsByClass = getObjectByIndex('class_id', filterClass)

            setRenderObjects(objectsByClass)
        }
    }, [filterClass])

    return (
        <Row style={{ height: '100%' }} gutter={20}>
            <Col 
                span={8} 
                style={{ 
                    height: 'min-content',
                    border: '1px solid #f0f0f0', 
                    borderRadius: 8, 
                    padding: 0, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'center' }} 
            >
                <Menu 
                    style={{ border: 'none', borderRadius: 8, height: 'min-content' }}
                    mode="inline"
                    items={renderMenuItems}
                    selectedKeys={[`${selectedItemKey}`]}
                    openKeys={openKeys}
                    onOpenChange={setOpenKeys}
                />
                <ButtonSettings
                    icon={false}
                    type="primary" htmlType="submit"
                    style={{ margin: 10, width: 'calc(100% - 20px)' }}
                    onClick={() => {setOpenModal(true), setTypeModal(ModalType.CHANGE_TARGET_CLASS)}}
                >
                    + Добавить целевой класс
                </ButtonSettings>
            </Col>
            {selectedItemKey &&
            <Col span={16} style={{ height: '100%' }} >
                <Card 
                    title={`Правило для отбора ${typeof selectedRule?.target_class_id === 'string' 
                        ? 'всех объектов' 
                        : `объектов класса ${getClassByIndex('id', selectedRule?.target_class_id)?.name}`}`} 
                    style={{ height: '100%' }}
                    type="inner"
                    bodyStyle={{ display: 'flex', flexDirection: 'column', gap: 20 }}
                    extra={
                        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }} >
                            {filterClass && 
                                <>
                                    <ButtonGroup 
                                        position="static"
                                        direction="row" 
                                        withConfirm 
                                        handleSave={handleSaveForm}
                                        handleCancel={handleCancel}
                                        handleDelete={handleDelete}
                                        top={16}
                                        right={92}
                                        gap={10}
                                        size="small"
                                    />
                                    <ButtonLook 
                                        size="small"
                                        onClick={() => {setOpenModal(true), setTypeModal(ModalType.TABLE_PREVIEW)}}
                                    />
                                </>}
                            <ButtonHelp
                                tooltipText=""
                                size="small"
                            />
                        </div>
                    }
                >
                    <Form
                        form={form}
                        layout="vertical"
                        initialValues={initialValues}
                        onValuesChange={onValuesChange}
                    >
                        <Row>
                            <Col span={24} >
                                <Form.Item name="filter_class_id" label="Фильтровать по объектам класса:" >
                                    <Select 
                                        options={classesOptions} 
                                        style={{ flex: 1, maxWidth: 400 }}
                                        placeholder="Выберите фильтр класс"
                                    />
                                </Form.Item>
                                <Row style={{ display: 'flex', justifyContent: 'space-between', gap: 20 }} >
                                    <Form.Item 
                                        name="path_classes" 
                                        label="Искать через классы:"
                                        style={{ flex: 1, maxWidth: 400 }}
                                    >
                                        <Select 
                                            options={classesOptions} 
                                            placeholder="Выберите связывающие классы"
                                            disabled={!filterClass}
                                            mode="multiple"
                                            maxTagCount="responsive"
                                        />
                                    </Form.Item>
                                    <Form.Item 
                                        name="path_direction_up" 
                                        label="Направление связей" 
                                        style={{ flex: 1, maxWidth: 160 }}
                                    >
                                        <Select 
                                            options={[
                                                { label: 'Вверх', value: 'true' },
                                                { label: 'Вниз', value: 'false' },
                                                // { label: 'Все', value: 'all' },
                                            ]} 
                                            placeholder="Выберите направление связей"
                                            disabled={!filterClass}
                                        />
                                    </Form.Item>
                                </Row>
                                <Form.Item
                                    name="except_path_classes"
                                    label="Не искать через классы:"
                                    style={{ flex: 1, maxWidth: 400 }}
                                >
                                    <Select
                                        options={classesOptions}
                                        placeholder="Выберите связывающие классы"
                                        disabled={!filterClass}
                                        mode="multiple"
                                        maxTagCount="responsive"
                                    />
                                </Form.Item>
                            </Col>
                            <Row style={{ width: '100%' }} >
                                <Col span={24} style={{ width: '100%' }}>
                                    {/* <Form.Item 
                                        name="all_filter_objects" 
                                        valuePropName="checked" 
                                        style={{ margin: 0, marginRight: 'auto' }}
                                    >
                                        <Checkbox>Все подходящие объекты</Checkbox>
                                    </Form.Item> */}
                                    {!form.getFieldValue('all_filter_objects') && 
                                    <Form.Item
                                        label={
                                            <div 
                                                style={{ 
                                                    width: '100%',
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    justifyContent: 'space-between' }}
                                            >
                                                <span>Выберите объекты</span>
                                                
                                            </div>
                                        }
                                        name="filter_objects"
                                    >
                                        <EditTable 
                                            style={{ width: '100%' }}
                                            columns={columns}
                                            hideSettingsButton={true}
                                            sortDirections={['descend', 'ascend']}
                                            bordered={true}
                                            tableId="filter_objects-table"
                                            key="filter_objects-table"
                                            rows={rows}
                                            scroll={{ x: 100, y: 300 }}
                                            rowSelection={rowSelection}
                                        />
                                    </Form.Item>}
                                </Col>
                            </Row>
                        </Row>
                    </Form>
                </Card>
            </Col>}
            <ECModal
                title={textModalTitle[typeModal]}
                showFooterButtons={false}
                open={openModal}
                onCancel={handleCancelModal}
                centered={typeModal === ModalType.TABLE_PREVIEW}
                width={`${typeModal === ModalType.TABLE_PREVIEW ? '80vw' : '350px'}`}
                height={`${typeModal === ModalType.TABLE_PREVIEW ? '80vh' : '70px'}`}
            >
                {renderComponentModal}
            </ECModal>
        </Row>
    )
}

export default RulesMenu