import { Col, Form, Space } from 'antd'
import { TableProps } from 'antd/lib/table'
import { Buttons } from '@shared/ui/buttons'
import React, { useEffect, useState } from 'react'
import CustomRuleAttributeSimpleTable from './CustomRuleAttributeSimpleTable'
import {
    operationsColumnsRulesAttributeTable,
    rulesAttributeTableProps,
} from '@entities/state/statesData/rulesAttributeTableData'
import { IGroupsInterface } from '@entities/groups/CommonGroupsComponent/CommonGroupsComponent'
import { IDataType } from '@shared/types/data-types'

interface IToolbar {
    right?: React.ReactNode
    left?: React.ReactNode
}

interface ISimpleTable extends TableProps<any> {
    toolbar?: IToolbar
    rows?: any[]
    rowSelection?: any
    ellipsysWidth?: number | string
    rule_group_id?: number | null
    rule_group_pseudo_id?: number
    attribute_id?: number
    value: any[]
    onChange: (value) => void
    chosenDataType: IDataType
    pseudoId: number
    setPseudoId: React.Dispatch<React.SetStateAction<number>>
    group: IGroupsInterface
    stateId?: number
    disabledForm?: boolean
}

const RuleAttributeTable: React.FC<ISimpleTable> = ({
    onChange,
    value,
    chosenDataType,
    pseudoId,
    setPseudoId,
    group,
    stateId,
    disabledForm
}) => {

 
    const [form] = Form.useForm()
    const [attributesRules, setAttributesRules] = useState<any[]>([])
    const rulesData = React.useMemo(() => {

        return (
            value?.map((obj, index) => ({
                [`operator-${obj?.pseudo_id}`]: obj.operator,
                [`right_operand-${obj?.pseudo_id}`]: chosenDataType.mnemo == 'boolean'
                    ? Number(obj.right_operand) 
                    : obj.right_operand,


                [`depth_type-${obj?.pseudo_id}`]: obj.depth_type,
                [`depth_value-${obj?.pseudo_id}`]: obj.depth_value,
            })) ?? []
        )
    }, [])

    useEffect(() => {
        setAttributesRules(value)
        form.setFieldValue([rulesAttributeTableProps.rules.name], rulesData)
    }, [])

    const [dataForTable, setDataForTable] = useState<any[]>([])

    const handleAddRow = () => {
        const localRules = [...attributesRules]

        localRules.push({
            rule_group_pseudo_id: group.pseudo_id,
            rule_group_id: group.id,
            pseudo_id: pseudoId + 1,
            operator: chosenDataType.mnemo == 'boolean' ? '==' : null,
            right_operand: null,
            depth_type: 'dot',
            depth_value: 1,
            id: null,
        })

        setPseudoId(pseudoId + 1)

        setAttributesRules(localRules)
        form.setFieldsValue({
            [`depth_type-${pseudoId + 1}`]: 'dot',
            [`depth_value-${pseudoId + 1}`]: 1,
            [`operator-${pseudoId + 1}`]: chosenDataType.mnemo == 'boolean' ? '==' : null,
        })
    }

    const handleDeleteRow = (item: any) => {
        const filteredArray = attributesRules.filter((rl) => rl.pseudo_id !== item.pseudo_id)

        setAttributesRules(filteredArray)
        onChange(convertData(filteredArray))
    }

    const tableRowDts = () => {
        return (
            attributesRules?.map((item) => {
                const keys = Object.keys(item)

                return {
                    key: item.pseudo_id,
                    pseudo_id: item.pseudo_id,
                    operator: item?.operator,
                    right_operand: chosenDataType.mnemo == 'boolean'
                        ? Number(item.right_operand) 
                        : item.right_operand,
                    depth_type: item?.depth_type,
                    depth_value: item?.depth_value,
                    indexKey: Number(keys[1].split('-')?.[1]),
                    rule_group_pseudo_id: item?.rule_group_pseudo_id,
                    rule_group_id: item?.rule_group_id,
                    delete: (
                        <Col>
                            <Space>
                                {!disabledForm &&    
                                    <Buttons.ButtonDeleteRow
                                        disabled={disabledForm}
                                        onClick={() => handleDeleteRow(item)}
                                    />}
                                
                            </Space>
                        </Col>
                    ),
                }
            }) ?? []
        )
    }

    useEffect(() => {
        setDataForTable(tableRowDts())
    }, [attributesRules])

    const convertData = (array?: any[]) => {
        const localArray = array ?? attributesRules
        const dataForForm = form.getFieldsValue()

        const finalData: any[] = localArray?.map((item) => {
            return {
                id: item?.id,
                rule_group_pseudo_id: item?.rule_group_pseudo_id,
                pseudo_id: item?.pseudo_id,
                operator:
                // chosenDataType.mnemo == 'boolean'
                //     ? dataForForm[`operator-${item.pseudo_id}`] == 1
                //         ? false
                //         : true
                //     : 
                        dataForForm[`operator-${item.pseudo_id}`],
                right_operand: dataForForm[`right_operand-${item.pseudo_id}`] ?? null,
                depth_type: dataForForm[`depth_type-${item.pseudo_id}`],
                depth_value: dataForForm[`depth_value-${item.pseudo_id}`],
            }
        })

        return finalData
    }

    return (
        <Form
            form={form}
            id="attributes-form"
            labelCol={{ xs: 12 }}
            colon={false}
            requiredMark={true}
            labelAlign="left"
            onValuesChange={() => {
                onChange(convertData())
            }}
        >
            {dataForTable.length > 0 && (
                <CustomRuleAttributeSimpleTable
                    disabledForm={disabledForm}
                    showHeader={false}
                    stateId={stateId}
                    form={form}
                    chosenDataType={chosenDataType}
                    pagination={false}
                    columns={operationsColumnsRulesAttributeTable}
                    rows={dataForTable}
                    footer={() => (
                        <Col xs={24} style={{ display: 'flex', padding: 0 }}>
                            <Buttons.ButtonAdd
                                size="small"
                                shape="circle"
                                text={false}
                                tooltipText="Добавить"
                                onClick={handleAddRow}
                                disabled={disabledForm}
                            />
                        </Col>
                    )}
                />
            )}
        </Form>
    )
}
const StatesRulesAttrForm: React.FC<ISimpleTable> = React.memo(RuleAttributeTable)

export default StatesRulesAttrForm