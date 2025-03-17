import { FC, useEffect, useState } from 'react'
import { IManageBlock } from '../EffectsForm/EffectsForm'
import { Card, Col, Form, FormInstance, Row } from 'antd'
import { Forms } from '@shared/ui/forms'
import { actionTypesOptions, effectTypesOptions, incidentActionColumns, incidentTablesOptions, incidentUpdateOption, messagesActionColumns } from '../utils'
import { IClass } from '@shared/types/classes'
import { Buttons } from '@shared/ui/buttons'
import { IAttribute } from '@shared/types/attributes'
import EffectsAttrRow from '../EffectsAttrRow/EffectsAttrRow'
import { SERVICES_EFFECTS } from '@shared/api/Effects'
import { IAccount } from '@shared/types/accounts'


interface IManageEffectsBlock {
    block: IManageBlock
    classes: IClass[]
    manageBlocks: IManageBlock[]
    setManageBlocks: React.Dispatch<React.SetStateAction<IManageBlock[]>>
    chosenClasses: number[]
    form: FormInstance<any> 
    isSaveEffects: boolean
    stateId?: number
    setIsSaveEffects: any
    disableForm?: boolean,
    accounts: IAccount[]
    attributesEnable?: boolean
}

export interface IAttributeEffectRow {
    destination: IAttribute['id'] | string
    sourceType: 1 | 2 | 3 | 4
    sourceValue: string | number
    parentPseudoId: number
    attrKey: number,
    required?: boolean
    disabledSource?: boolean,
    disableMnemo?: boolean
    filter?: string
    disabled?: boolean
}
const ManageEffectsBlock: FC<IManageEffectsBlock> = ({
    block,
    classes,
    manageBlocks,
    setManageBlocks,
    chosenClasses,
    form,
    isSaveEffects,
    stateId,
    disableForm,
    accounts,
    attributesEnable
}) => {
    const [blockAttributes, setBlockAttributes] = useState<IAttributeEffectRow[]>([])
    const [chosenClassId, setChosenClassId] = useState<number>(null)
    const [chosenActionType, setChosenActionType] = useState<string>('')
    const [chosenTableType, setChosenTableType] = useState<'incidents'| 'messages'>(undefined)
    const [optionsForTables, setOptionsForTables] = useState<{value: string, label: string, disabled?: boolean}[]>
    (incidentTablesOptions)

    const deleteButtonHandler = () => {
        const localManageBlocks = [...manageBlocks]

        setManageBlocks(localManageBlocks.filter((item) => item.pseudoId !== block.pseudoId))

        if (block.id !== undefined && block.id !== null) {
            SERVICES_EFFECTS.Models.deleteEffect({ id: String(block.id), stateId: String(stateId) })
        }
    }

    const addAttributeHandler = () => {
        const localAttributes = [...blockAttributes]

        switch (chosenTableType) {
            case 'incidents': 
                if (chosenActionType == 'add_row') {
                    localAttributes.push({
                        destination: incidentActionColumns[incidentActionColumns.length - 1].value,
                        sourceType: null,
                        sourceValue: null,
                        parentPseudoId: block.pseudoId,
                        attrKey: blockAttributes.length + 1,
                    })
                    form.setFieldsValue({
                        [`destination-${block.pseudoId}-${blockAttributes.length}`]:
                        incidentActionColumns[incidentActionColumns.length - 1].value,
                
                    })
                }
                else {
                    localAttributes.push({
                        destination: null,
                        sourceType: null,
                        sourceValue: null,
                        parentPseudoId: block.pseudoId,
                        attrKey: blockAttributes.length + 1,
                    })
                    form.setFieldsValue({
                        [`destination-${block.pseudoId}-${blockAttributes.length}`]: null,
                        [`sourceType-${block.pseudoId}-${blockAttributes.length}`]: null,
                        [`sourceValue-${block.pseudoId}-${blockAttributes.length}`]: null
                    })
                }
                break
            case 'messages': 
                localAttributes.push({
                    destination: messagesActionColumns[messagesActionColumns.length - 1].value,
                    sourceType: null,
                    sourceValue: null,
                    parentPseudoId: block.pseudoId,
                    attrKey: blockAttributes.length + 1,
                })
                form.setFieldsValue({
                    [`destination-${block.pseudoId}-${blockAttributes.length}`]:
                    messagesActionColumns[messagesActionColumns.length - 1].value,
                })
                break
            default: 
                localAttributes.push({
                    destination: null,
                    sourceType: null,
                    sourceValue: null,
                    parentPseudoId: block.pseudoId,
                    attrKey: blockAttributes.length + 1,
                })
        }


        setBlockAttributes(localAttributes)
    }

    const createEffectsRows = (change?: {value: string, select: 'table' | 'actionType'}) => {

        let localChosenTableType: string = chosenTableType
        let localChosenActionType: string = chosenActionType

        if (change !== undefined) {
            change.select == 'table'
                ? localChosenTableType = change.value
                : localChosenActionType = change.value
        }
        const localAttributes: any[] = []

        if (localChosenTableType == 'incidents') {

            if (localChosenActionType == 'add_row') {
                incidentActionColumns.forEach((column, index) => {
                    if (column.required) {
                        localAttributes.push({
                            destination: column.value,
                            sourceType: column.source,
                            sourceValue: column.mnemo,
                            parentPseudoId: block.pseudoId,
                            attrKey: index + 1,
                            required: column.required,
                            disabledSource: column?.disabledSource,
                            disableMnemo: column?.disableMnemo,
                            filter: column.filter
                        })

                        form.setFieldsValue({
                            [`destination-${block.pseudoId}-${index}`]: column.value ?? null,
                            [`sourceType-${block.pseudoId}-${index}`]: column.source ?? null,
                            [`sourceValue-${block.pseudoId}-${index}`]: column.mnemo ?? undefined
                        })
                    }
                }

                )
            }

            else if (localChosenActionType == 'update_table') {
                incidentUpdateOption.forEach((column, index) => {
                    if (index == 0) {
                        if (column.required) {
                            localAttributes.push({
                                destination: column.value,
                                sourceType: column.source,
                                sourceValue: column.mnemo,
                                parentPseudoId: block.pseudoId,
                                attrKey: index + 1,
                                required: column.required,
                                disabledSource: column?.disabledSource,
                                disableMnemo: column?.disableMnemo,
                                disabled: column.disabled
                        
                            })

                            form.setFieldsValue({
                                [`destination-${block.pseudoId}-${index}`]: column.value ?? null,
                                [`sourceType-${block.pseudoId}-${index}`]: column.source ?? null,
                                [`sourceValue-${block.pseudoId}-${index}`]: column.mnemo ?? undefined
                            })
                        }
                    }
                }

                )
            }

        }

        if (localChosenTableType == 'messages') {

            if (localChosenActionType == 'add_row') {
                messagesActionColumns.forEach((column, index) => {
                    if (column.required) {
                        localAttributes.push({
                            destination: column.value,
                            sourceType: column.source,
                            sourceValue: null,
                            parentPseudoId: block.pseudoId,
                            attrKey: index + 1,
                            required: column.required,
                            disabledSource: column?.disabledSource,
                        })
                        form.setFieldsValue({
                            [`destination-${block.pseudoId}-${index}`]: column.value ?? null,
                            [`sourceType-${block.pseudoId}-${index}`]: column.source ?? null,
                            [`sourceValue-${block.pseudoId}-${index}`]: column.mnemo ?? null
                
                        })
                    }
                }

                )
            }

        }
        setBlockAttributes(localAttributes)
    }

    useEffect(() => {
   
        if ((block.id !== undefined || block.id !== null) && isSaveEffects == false) {
            form.setFieldsValue({
                [`objectClass-${block.pseudoId}`]: block.class_id,
                [`actionType-${block.pseudoId}`]: block.action_type,
                [`effectType-${block.pseudoId}`]: block.type,
                [`tableName-${block.pseudoId}`]: block.table_name
            })
            
            const attributes: IAttributeEffectRow[] = []

            if (block.values !== undefined) {
                block.values.forEach((attr, index) => {
                    attributes.push({
                        destination: attr.destination,
                        sourceType: attr.source.type,
                        sourceValue: attr.source.value,
                        parentPseudoId: block.pseudoId,
                        attrKey: blockAttributes.length + 1 + index,
                    })

                    form.setFieldsValue({
                        [`destination-${block.pseudoId}-${index}`]: attr.destination,
                        [`sourceType-${block.pseudoId}-${index}`]: attr.source.type,
                        [`sourceValue-${block.pseudoId}-${index}`]: attr.source.value
                    })
                })
                setBlockAttributes(attributes)
                setChosenClassId(block.class_id)
                setChosenActionType(block.action_type)
                setChosenTableType(block.table_name)
            }


        }
    }, [block])

    useEffect(() => {
        if (isSaveEffects == true) {

            const local = [...manageBlocks]
            const blockValue: any[] = []
            // const blockAttrsIds: number[] = []

            local.forEach(bl => {
                if (bl.pseudoId == block.pseudoId) {
                    const actionType =  form.getFieldValue(`actionType-${block.pseudoId}`)

       

                    if (actionType == 'create' || actionType == 'update' || actionType == 'delete') {
                        bl.class_id = form.getFieldValue(`objectClass-${block.pseudoId}`)
                    }
                    else {
                        bl.table_name = form.getFieldValue(`tableName-${block.pseudoId}`)

                    }

                    bl.action_type = form.getFieldValue(`actionType-${block.pseudoId}`)
                    bl.type = form.getFieldValue(`effectType-${block.pseudoId}`)

                    blockAttributes.forEach((attr) => {
                        blockValue.push({
                            destination: attr.destination,
                            source: {
                                type: attr.sourceType,
                                value: attr.sourceValue,
                            },
                        })
                        // blockAttrsIds.push(Number(attr.destination))
                    })
                    bl.values = blockValue
                    // bl.attribute_ids = blockAttrsIds

                }
            })
            
            setManageBlocks(local)
        }
    }, [isSaveEffects])

    useEffect(() => {
        if (block.id == undefined) {


            createEffectsRows()
        }
    }, [chosenTableType, chosenActionType])

    useEffect(() => {
        const options: {value: string, label: string, disabled?: boolean}[] = [...incidentTablesOptions]

        if (chosenActionType == 'update_table' || chosenActionType == 'add_row' ) {
            options[1].disabled = chosenActionType == 'update_table' ? true : false

            setOptionsForTables( attributesEnable ? options.filter(item => item.value !== 'incidents') : options)
        }
    }, [chosenActionType])

    const checkDisabledButton = () => {
        let disabled = false

        if (chosenTableType == 'incidents') {

            if (chosenActionType == 'add_row') {
                if (blockAttributes.length == 5) {
                    disabled = true
                }
            }
            else {
                if (blockAttributes.length == 3) {
                    disabled = true
                }
            }

        }

        if (chosenTableType == 'messages') {

            if (blockAttributes.length == 4) {
                disabled = true
            }

        }

        if (disableForm) {
            disabled = disableForm
        }
        
        return disabled
    }

    
    return (
        <Card
            style={{ marginBottom: '10px', borderWidth: '10px', textAlign: 'initial' }}
            bodyStyle={{ padding: '8px' }}
            headStyle={{ width: '100%', margin: '0', background: '#F0F0F0', padding: 0, borderRadius: 0 }}
            title={
                <Row
                    gutter={16}
                    style={{ backgroundColor: '#F0F0F0', marginBottom: '10px' }}
                    align="middle"
                >
                    <Col span={6}>
                        <Form.Item
                            labelCol = {{ span: 10 }}
                            style={{ margin: 0 }}
                            labelAlign="left"
                            label="Тип эффекта"
                            name={`effectType-${block.pseudoId}`}
                        >
                            <Forms.Select
                                disabled={disableForm}
                                data={effectTypesOptions}
                                searchable={false} 
                                allowClear={false}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            labelCol = {{ span: 8 }}
                            style={{ margin: 0 }}
                            labelAlign="left" 
                            label="Тип действия"
                            name={`actionType-${block.pseudoId}`}
                        >
                            <Forms.Select
                                disabled={disableForm}
                                data={actionTypesOptions}
                                searchable={false} 
                                allowClear={false} 
                                onChange={(e) => {
                                    setChosenActionType(e)

                                    if (block.id !== undefined) {
                                        createEffectsRows({ select: 'actionType', value: e })
                                    }
                                
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        {(chosenActionType !== 'add_row' &&
                        chosenActionType !== 'update_table') && 
                            <Form.Item
                                labelCol = {{ span: 8 }}
                                style={{ margin: 0 }}
                                labelAlign="left"
                                label="Класс объекта"
                                name={`objectClass-${block.pseudoId}`}
                            >
                                <Forms.Select
                                    disabled={disableForm}
                                    allowClear={false}
                                    customData={{
                                        data: classes.filter((cl) => cl.is_abstract == false),
                                        convert: { valueField: 'id', optionLabelProp: 'name' },  
                                    }}
                                    onChange={(e) => {
                                        setChosenClassId(e)
                                        
                                    }}
                                />
                            </Form.Item>}
                        {(chosenActionType == 'add_row' ||
                        chosenActionType == 'update_table') && 
                            <Form.Item
                                labelCol = {{ span: 10 }}
                                style={{ margin: 0 }}
                                labelAlign="left"
                                label="Название таблицы"
                                name={`tableName-${block.pseudoId}`}
                            >
                                <Forms.Select
                                    // disabled={block.id == undefined ? false : true || disableForm}
                                    onChange={(e) => {
                                        setChosenTableType(e)
                                    
                                        if (block.id !== undefined) {
                                            createEffectsRows({ select: 'table', value: e })
                                        }
                                    }}
                                    data={optionsForTables}
                                    searchable={false}
                                    allowClear={false}
                                />
                            </Form.Item>}
                        
                    </Col>
                    <Col span={6}>
                        <Row gutter={[8, 8]} justify="end">
                            <Col>
                                <Buttons.ButtonAdd
                                    color="green"
                                    size="small"
                                    shape="circle"
                                    text={false}
                                    tooltipText="Добавить атрибут"
                                    onClick={addAttributeHandler}
                                    disabled={checkDisabledButton()}
                                />
                            </Col>
                            <Col>
                                <Buttons.ButtonDeleteRules
                                    disabled={disableForm}
                                    tooltipText="Удалить все атрибуты"
                                    size="small"
                                    shape="circle"
                                    text={false}
                                    onClick={() => {
                                        setBlockAttributes([])
                                    }}
                                />
                            </Col>

                            <Col>
                                <Buttons.ButtonDelete
                                    disabled={disableForm}
                                    size="small"
                                    shape="circle"
                                    text={false}
                                    tooltipText="Удалить блок эффектов"
                                    onClick={deleteButtonHandler}
                                />
                            </Col>
                        </Row>
                    </Col>
                
                </Row>
                
            }
        >


            {/* {blockAttributes?.length > 0 && <Divider>Аттрибуты эффекта</Divider>} */}

            {blockAttributes.map((attr, index) => {
                return (
                    <Form.Item
                        style={{ margin: 0, padding: 0 }}
                        name={`attr-${block.pseudoId}-${index}`}
                        key={`attr-${block.pseudoId}-${index}`}
                    >
                        <EffectsAttrRow
                            accounts = {accounts}
                            chosenTableType={chosenTableType}
                            form={form}
                            attr={attr}
                            chosenClassId={chosenClassId}
                            index={index}
                            chosenClasses={chosenClasses}
                            blockAttributes={blockAttributes}
                            setBlockAttributes={setBlockAttributes}
                            disabledForm={disableForm}
                            chosenActionType={chosenActionType}
                        />
                    </Form.Item>
                )
            })}
        </Card>
    )
}

export default ManageEffectsBlock