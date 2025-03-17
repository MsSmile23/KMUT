import { Col, Form, Input, Row, Space, Typography } from 'antd'
import { TableProps } from 'antd/lib/table'
import { Buttons } from '@shared/ui/buttons'
import React, { useEffect, useState } from 'react'
import { manageClassOperatorOptions, operationsColumnsRulesClassTable, rulesClassesTableProps } from
    '@entities/state/statesData/rulesClassTableData'
import CustomRuleClassSimpleTable from './CustomRuleClassSimpleTable'
import { IClass } from '@shared/types/classes'
import { useClassesStore } from '@shared/stores/classes'
import { selectAttributes, useAttributesStore } from '@shared/stores/attributes'
import { Forms } from '@shared/ui/forms'
import { MY_ATTRIBUTE, 
    getClassesOptions,
    getStateOptionsForClass,
    getStateOptionsForClassAttribute,
    getStateOptionsForIm
} from './utilsRuleClassTable'
import { IStateMachine } from '@shared/types/state-machines'
import { selectRelations, useRelationsStore } from '@shared/stores/relations'
import { IGroupsInterface } from '@entities/groups/CommonGroupsComponent/CommonGroupsComponent'
import AttributesSelect from '@entities/attributes/AttributesSelect/AttributesSelect'

interface IToolbar {
    right?: React.ReactNode
    left?: React.ReactNode
}

type RulesClass = {
    class_id: number | string | null;
    attribute_id: number;
    operator: string;
    state_ids: number[];
    min: number;
   };

interface IRuleClassTable extends TableProps<any> {
    toolbar?: IToolbar
    rows?: any[],
    rowSelection?: any
    ellipsysWidth?: number | string
    rule_group_id?: number | null
    rule_group_pseudo_id?: number
    class_ids: IClass['id'][],
    ///*Временное any
    value?: any[]
     ///*Временное any
    onChange?: (value) => void,
    stateMachines?: IStateMachine[]
     group: IGroupsInterface,
     pseudoId: number,
     setPseudoId: React.Dispatch<React.SetStateAction<number>>
     stateId?: number
     disabledForm?: boolean


}



const RuleClassTable: React.FC<IRuleClassTable> = ({
    onChange,
    value,
    class_ids,
    stateMachines,
    group,
    pseudoId,
    setPseudoId,
    stateId,
    disabledForm
}) => {
    const relations = useRelationsStore(selectRelations)
    const [form] = Form.useForm();
    const [classesRules, setClassesRules] = useState([])

    const options = [{ value: 'count', label: 'Количество объектов' },
        { value: 'percentage', label: 'Процент объектов' }]

    const { store } = useClassesStore()

    const attributes = useAttributesStore(selectAttributes)

    // const classesIm = useMemo(() => {
    //     return store.data
    //         .filter((el) => class_ids.includes(el.id))

    // }, [store.data, class_ids]);


    const getConnectedClasses = () => {
        const connectedClasses: number[] = []
        
        relations.filter(rel => class_ids.includes(rel.left_class_id) 
        || class_ids.includes(rel.right_class_id)).forEach(rel => {
            if (class_ids.includes(rel.left_class_id)) {
                connectedClasses.push(rel.right_class_id)
            }
            else {
                connectedClasses.push(rel.left_class_id)
            }
        })
        const set = new Set(connectedClasses)

        return Array.from(set)

    }



    // const childrenClasses = findChildsByBaseClasses({ classIds: class_ids, relations: relations, 
    //     relationTypes: ['aggregation', 'composition', 'association',] })
   


    const [classesOptions, setClassesOptions] = useState(getClassesOptions(getConnectedClasses(), store))


    const combinedRules = value


    const rulesClassesData = React.useMemo(() => {
        return combinedRules?.map((obj, index) => ({
            [`class_id-${obj?.pseudo_id}`]: obj.class_id == null ? MY_ATTRIBUTE : obj.class_id,
            [`attribute_id-${obj?.pseudo_id}`]: obj.attribute_id,
            [`operator-${obj?.pseudo_id}`]: obj.operator,
            [`state_ids-${obj?.pseudo_id}`]: obj.state_ids,
            [`min-${obj?.pseudo_id}`]: obj.min,
            pseudo_id: obj.pseudo_id,
            rule_group_pseudo_id: obj.rule_group_pseudo_id
        })) ?? [];
    }, []);


    useEffect(() => {

        setClassesRules([...rulesClassesData])

    }, []);

    const handleAddRow = () => {      
        const localRules = [...classesRules]

        localRules.push({
            rule_group_pseudo_id: group.pseudo_id,
            rule_group_id: group.id,
            pseudo_id: pseudoId + 1, 
            ['class_id']: null,
            ['attribute_id']: null,
            ['operator']: 0,
            ['state_ids']: [],
            ['min']: 1,
            count_type: 'count',
            count: 1

        })
        setPseudoId(pseudoId + 1)


        setClassesRules(localRules)

        form.setFieldsValue({
            [`operator-${pseudoId + 1}`]: 1,
            [`min-${pseudoId + 1}`]: 1,
            [`class_id-${pseudoId + 1}`]: MY_ATTRIBUTE,
            [`attribute_id-${pseudoId + 1}`]: null,
            [`count-${pseudoId + 1}`]: 1,
            [`count_type-${pseudoId + 1}`]: 'count'

        })

    }


    const handleDeleteRow = (item: any) => {
        const filteredArray = classesRules.filter(rl => rl.pseudo_id !== item.pseudo_id)

        setClassesRules(filteredArray)
        onChange(convertData(filteredArray))
    }



    const tableRowDts = () => {

        return classesRules?.map((item) => {
            const itemClassValue = form.getFieldValue('class_id-' + item.pseudo_id) 
            const itemAttrValue = form.getFieldValue('attribute_id-' + item.pseudo_id) 


            const stateOptions = () => {
                switch (true) {
                    case itemClassValue !== MY_ATTRIBUTE :
                        return getStateOptionsForClass(itemClassValue, stateMachines)
                    case itemClassValue === MY_ATTRIBUTE && (itemAttrValue  === null ||  itemAttrValue  === undefined ):
                        return getStateOptionsForIm(class_ids, stateMachines)
                    case itemClassValue === MY_ATTRIBUTE && itemAttrValue  !== null:
                        return  getStateOptionsForClassAttribute(
                            itemAttrValue,
                            stateMachines,
                            class_ids
                        )
                    default: return []
                }
            }
        


            return {

                key: `key_row_${item.pseudo_id}`,
                rule_group_pseudo_id: item.rule_group_pseudo_id,
                pseudo_id: item?.pseudo_id,
                class_id: (
                    <Col
                        span = {24} key={item.key}
                        style={{ margin: 5 }}
                    >
                        <Form.Item
                            label= " "
                            labelCol={{ span: 2 }}
                            labelAlign="left"
                            style={{  margin: 0, padding: 0 }}
                            name={`class_id-${item.pseudo_id}`}
                            rules={rulesClassesTableProps.rules.rules}
                        >
                            <Forms.Select
                                disabled={disabledForm}
                                placeholder="Выберете значение"
                                options={classesOptions}
                            />
                        </Form.Item>
                    </Col>
                ),

                attribute_id: (
                    <Col
                        span = {24} key={item.key}
                        style={{ margin: 5 }}
                    >{itemClassValue == MY_ATTRIBUTE  ?  
                            <Form.Item
                                label= " "
                                labelCol={{ span: 2 }}
                                labelAlign="left"
                                style={{ margin: 0, padding: 0 }}
                                name={`attribute_id-${item.pseudo_id}`}
                                rules={[{ required: itemClassValue == MY_ATTRIBUTE
                                    ? true : false, message: 'Обязательно' }]}
                            >

                                <AttributesSelect
                                    placeholder={itemClassValue == MY_ATTRIBUTE ? 'Выберите атрибут' : ''}
                                    disabled={(itemClassValue == MY_ATTRIBUTE ? false : true || disabledForm)}
                                    multiType={false}
                                    filters={{ class_ids: class_ids }}
                                    optionsFilterType="interSelect"
                    
                                />
                            </Form.Item> :
                            <Row>
                                <Col span={12}>
                                    <Form.Item
                                        label= " "
                                        labelCol={{ span: 4 }}
                                        labelAlign="left"
                                        style={{ margin: 0, padding: 0 }}
                                        name={`count-${item.pseudo_id}`}
                                    
                                    >
                             
                                        <Input type="number" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label= " "
                                        labelCol={{ span: 2 }}
                                        labelAlign="left"
                                        style={{ margin: 0, padding: 0 }}
                                        name={`count_type-${item.pseudo_id}`}
                                   
                                    >
                                        <Forms.Select
                                            placeholder="Выберете значение"
                                            options={options}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>}
                      
                    </Col>
                ),
                operator: (
                    <Col
                        span = {24} key={item.key}
                        style={{ margin: 5 }}
                    >
                        <Form.Item
                            label= " "
                            labelCol={{ span: 2 }}
                            labelAlign="left"
                            style={{ margin: 0, padding: 0 }}
                            name={`operator-${item.pseudo_id}`}
                            rules={rulesClassesTableProps.rules.rules}
                        >
                            <Forms.Select
                                placeholder="Выберете значение"
                                options={manageClassOperatorOptions}
                            />
                        </Form.Item>
                    </Col>
                ),

                state_ids: (
                    <Col
                        span = {24} key={item.key}
                        style={{ margin: 5 }}
                    >
                        <Form.Item
                            label= " "
                            labelCol={{ span: 2 }}
                            labelAlign="left"
                            style={{ margin: 0, padding: 0 }}
                            name={`state_ids-${item.pseudo_id}`}
                            rules={rulesClassesTableProps.rules.rules}
                        >
                            <Forms.Select
                                disabled={disabledForm}
                                mode="multiple"
                                placeholder="Выберете значение"
                                options={stateOptions()}
                            />
                        </Form.Item>
                    </Col>
                ),

                min: (
                    <Row align="middle">
                        <Col span={12}>
                            <Form.Item
                                label= " "
                                labelCol={{ span: 4 }}
                                labelAlign="left"
                                style={{ margin: 0 }}
                                name={`min-${item.pseudo_id}`}
                                rules={rulesClassesTableProps.rules.rules}
                      
                            >
                                <Input
                                    min={0}
                                    style={{ margin: 0 }}
                                    disabled={false}
                                    placeholder="Введите значение"
                                    type="number"
                                />
                            </Form.Item>
                        </Col>
                        <Col
                            span={12}
                            style={{ textAlign: 'center' }}
                        >
                            <Typography>{rulesClassesTableProps.min.label}</Typography>
                        </Col>
                    </Row>

                ),
                delete: (
                    <Col >
                        <Space >
                            {!disabledForm &&
                            
                            <Buttons.ButtonDeleteRow onClick={() => handleDeleteRow(item)} />}
                         
                        </Space>
                    </Col>
                ),
            }
        }) ?? []
    }

    useEffect(() => {
        if (value !== undefined) {
            value.forEach(item => {
                form.setFieldsValue({
                    [`attribute_id-${item?.pseudo_id}`]: item.attribute_id,
                    [`operator-${item?.pseudo_id}`]: item.operator == false ? 0 : 1,
                    [`min-${item?.pseudo_id}`]: item.min,
                    [`state_ids-${item.pseudo_id}`]: item.state_ids,
                    [`class_id-${item.pseudo_id}`]: item.class_id == null ? MY_ATTRIBUTE : item.class_id,
                    [`state_ids-${item.pseudo_id}`]: item.state_ids,
                    [`count-${item.pseudo_id}`]: item?.count,
                    [`count_type-${item.pseudo_id}`]: item.count_type
                })
            })

        }
    }, [stateId])




    const convertData = (array?: any[]) => {

        const localArray = array ?? classesRules
        const dataForForm = form.getFieldsValue()

        const finalData: any[] = localArray?.map((item) => {
            const ruleEntityType = dataForForm[`class_id-${item.pseudo_id}`] == MY_ATTRIBUTE && 
            dataForForm[`attribute_id-${item.pseudo_id}`] !== undefined ? 'attribute' : 'class'

            
            return {

                id: item?.id,
                rule_group_pseudo_id: item?.rule_group_pseudo_id,
                min: Number(dataForForm[`min-${item.pseudo_id}`]),
                operator: dataForForm[`operator-${item.pseudo_id}`] == 1 ? true : false,
                state_ids: dataForForm[`state_ids-${item.pseudo_id}`] ?? [],
                attribute_id: dataForForm[`attribute_id-${item.pseudo_id}`],
                class_id: dataForForm[`class_id-${item.pseudo_id}`] == MY_ATTRIBUTE ? null :
                    dataForForm[`class_id-${item.pseudo_id}`],
                pseudo_id: item?.pseudo_id,
                entity_type: ruleEntityType,
                count: dataForForm[`count-${item.pseudo_id}`],
                count_type: dataForForm[`count_type-${item.pseudo_id}`]


            }
        })

        
        return (finalData)
    }

    
    return (
        <Form
            form={form}
            id="class-form"
            labelCol={{ xs: 12 }}
            colon={false}
            requiredMark={true}
            labelAlign="left"
            onValuesChange={() => {
                onChange(convertData())
            }}

        >
            <CustomRuleClassSimpleTable
                showHeader={false}
                pagination={false}
                columns={operationsColumnsRulesClassTable}
                rows={tableRowDts()}
                footer={() => (
                    <Col xs={24} style={{ display: 'flex' }}>
                        <Buttons.ButtonAdd
                            disabled={disabledForm}
                            size="small"
                            shape="circle"
                            text={false}
                            tooltipText="Добавить"
                            onClick={handleAddRow}
                        />
                    </Col>

                )}
            />
        </Form>
    )
}
const StatesRulesClassForm:  React.FC<IRuleClassTable> = React.memo(RuleClassTable)

export default StatesRulesClassForm