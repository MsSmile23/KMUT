import { SortableList } from '@shared/ui/SortableList'
import { Button, Col, Form, Input, Row } from 'antd'
import { CSSProperties, FC, useEffect, useState } from 'react'
import { Select } from '../Select/Select'
import { failOptions, fieldNames, initialRuleItem, resetFields, ruleTypesOption } from './data'
import { ECIconView } from '@shared/ui/ECUIKit/common/ECIconView/ECIconView'
import { RuleTypes, TRuleItem } from './types'
import { useForm } from 'antd/es/form/Form'

interface ISelectionsRulesInputProps {
    value?: string
    onChange?: (value: string) => void
}


const itemStyle: CSSProperties = {
    marginBottom: '0px',
    flex: 1,
    width: '10%',
    height: '70px'
}

const SelectionsRulesInput: FC <ISelectionsRulesInputProps> = ({ value, onChange }) => {
    
    const [form] = useForm()
    const [ ruleItems, setRuleItems ] = useState<TRuleItem[]>([])

    // Добавление строки (правила)
    const addNewRuleItem = () => {
        const newItem: TRuleItem = { ...initialRuleItem, id: Date.now().toString() }

        updateRuleItems([...ruleItems, newItem])
    }

    // Обновление значений
    const handleInputChange = (_, allValues) => {
        const updatedItems = Object.keys(allValues.rules).map(id => {
            const item = allValues.rules[id]

            //Сбрасываем значения в полях при переключении типа
            if (item.ruleType !== ruleItems.find(rule => rule.id === id)?.ruleType) {
                const fieldsToReset = resetFields(item.ruleType)

                fieldsToReset.forEach(field => {
                    item[field] = undefined
                })

                form.setFieldsValue({ rules: { ...allValues.rules, [id]: item } })
            }
            
            return { ...item, id }
        })

        updateRuleItems(updatedItems)
    }

    // Удаление строки (правила)
    const handleRemoveItem = (id: string) => {
    
        const updatedItems = ruleItems.filter(item => item.id !== id)

        updateRuleItems(updatedItems)
        
    }

    // Получаем значения, если есть, парсим и заполняем форму
    useEffect(() => {
        if (value) {
            const parseValue: TRuleItem[] = typeof value === 'string' ? JSON.parse(value) : value
            const rulesObject = {}

            parseValue?.forEach(item => {
                rulesObject[item.id] = {
                    ...item,
                }
            })

            form.setFieldsValue({ rules: rulesObject })
            updateRuleItems(parseValue)
        }
    }, [])

    // Передаем значения наверх в JSON-строке
    useEffect(() => {
        const ruleItemsString = JSON.stringify(ruleItems)

        onChange(ruleItemsString)
    }, [ruleItems])

    const updateRuleItems = (items) => {
        setRuleItems(items.map( (item, index) => ({ ...item, order: index }) ))
    }

    
    return (
        <>
            { ruleItems?.length == 0 &&
                                    <Button
                                        size="small"
                                        type="primary"
                                        onClick={() => {
                                            setRuleItems([{ ...initialRuleItem, id: Date.now().toString() }])
                                        }}
                                        style={{
                                            width: '36px',
                                            marginBottom: '5px',
                                        }}
                                    >
                                        <ECIconView icon="PlusCircleOutlined" />
                                    </Button>}
            <Form 
                form={form} 
                layout="vertical" 
                initialValues={{ ...initialRuleItem, id: Date.now().toString() }}
                onValuesChange={handleInputChange}
                style={{ width: '100%' }}
            >
                <SortableList<TRuleItem>
                    items={ruleItems}
                    onChange={(items) => updateRuleItems(items)}
                    renderItem={(item) => (
                        <SortableList.Item
                            id={item.id}
                            customItemStyle={{ 
                                padding: 0, 
                                borderRadius: '8px',
                                paddingTop: 5,
                                paddingBottom: 0,
                                minWidth: 1050, 
                                width: '100%' 
                            }}
                        >
                            <Row
                                key={item.id}
                                wrap={false}
                                gutter={[8, 8]}
                                style={{
                                    display: 'flex',
                                    alignItems: 'flex-end',
                                    width: '100%',
                                }}
                            > 
                                <Col style={{ display: 'flex', alignItems: 'center', alignSelf: 'center' }}>
                                    <SortableList.DragHandle
                                        customDragHandlerStyle={{
                                            padding: '15px 10px',
                                            alignSelf: 'center',
                                            cursor: 'move', 
                                            fill: 'transparent',
                                        }}
                                        svgStyle={{
                                            height: 24,
                                            width: 20,
                                            fill: '#ccc'
                                        }}
                                    />
                                </Col>
                                <Col span={4} style={{ display: 'flex', alignItems: 'center' }}>
                                    <Form.Item
                                        name={['rules', item.id, fieldNames.varDest.name]}
                                        label={fieldNames.varDest.label}
                                        labelAlign="left"
                                        style={{ ...itemStyle }}
                                    >
                                        <Input type="text" />
                                    </Form.Item>
                                </Col>
                                <Col span={4} style={{ display: 'flex', alignItems: 'center' }}>
                                    <Form.Item 
                                        name={['rules', item.id, fieldNames.ruleType.name]} 
                                        label={fieldNames.ruleType.label}
                                        labelAlign="left"
                                        style={{ ...itemStyle, width: '20%' }}
                                    >
                                        <Select options={ruleTypesOption} />
                                    </Form.Item>
                                </Col>
                                {(item.ruleType === RuleTypes.PregMatch 
                                || item.ruleType === RuleTypes.PregReplace) && 
                                <Col span={6} style={{ display: 'flex', alignItems: 'center' }}>
                                    <Form.Item 
                                        name={['rules', item.id, fieldNames.regex.name]} 
                                        label={fieldNames.regex.label}
                                        labelAlign="left"
                                        style={{ ...itemStyle }}
                                    >
                                        <Input type="text" />
                                    </Form.Item>
                                </Col>}
                            
                                {item.ruleType === RuleTypes.JSONExtract &&
                                <Col span={6} style={{ display: 'flex', alignItems: 'center' }}>
                                    <Form.Item 
                                        name={['rules', item.id, fieldNames.searchKey.name]} 
                                        label={fieldNames.searchKey.label}
                                        labelAlign="left"
                                        style={{ ...itemStyle }}
                                    >
                                        <Input type="text" />
                                    </Form.Item>
                                </Col>}
                            
                                {(item.ruleType === RuleTypes.PregMatch 
                                    || item.ruleType === RuleTypes.PregReplace
                                    || item.ruleType === RuleTypes.JSONExtract) &&
                                    <Col span={4} style={{ display: 'flex', alignItems: 'center' }}>
                                        <Form.Item 
                                            name={['rules', item.id, fieldNames.varSource.name]}
                                            label={fieldNames.varSource.label}
                                            labelAlign="left"
                                            style={{ ...itemStyle }}
                                        >
                                            <Input type="text" />
                                        </Form.Item>
                                    </Col>}
                            
                                {(item.ruleType === RuleTypes.PregMatch 
                                    || item.ruleType === RuleTypes.JSONExtract) &&
                                    <Col span={4} style={{ display: 'flex', alignItems: 'center' }}>
                                        <Form.Item 
                                            name={['rules', item.id, fieldNames.behaviorOnFail.name]} 
                                            label={fieldNames.behaviorOnFail.label}
                                            labelAlign="left"
                                            style={{ ...itemStyle }}
                                        >
                                            <Select options={failOptions} />
                                        </Form.Item>
                                    </Col>}
                            
                                {item.ruleType === RuleTypes.Postprocessing &&
                                <Col span={14} style={{ display: 'flex', alignItems: 'center' }}>
                                    <Form.Item 
                                        name={['rules', item.id, fieldNames.postProcessingFormula.name]} 
                                        label={fieldNames.postProcessingFormula.label}
                                        labelAlign="left"
                                        style={{ ...itemStyle }}
                                    >
                                        <Input type="text" />
                                    </Form.Item>
                                </Col>}
                                {item.ruleType === RuleTypes.PregReplace &&
                                <Col span={4} style={{ display: 'flex', alignItems: 'center' }}>
                                    <Form.Item 
                                        name={['rules', item.id, fieldNames.replacementString.name]} 
                                        label={fieldNames.replacementString.label}
                                        labelAlign="left"
                                        style={{ ...itemStyle }}
                                    >
                                        <Input type="text" />
                                    </Form.Item>
                                </Col>}
                                <Col
                                    flex="auto"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'inherit',
                                        alignSelf: 'center',
                                        flexDirection: 'column',
                                        paddingRight: '10px'

                                    }}
                                >
                                    {item.order == ruleItems.length - 1 &&
                                    <Button
                                        size="small"
                                        type="primary"
                                        onClick={addNewRuleItem}
                                        style={{
                                            width: '36px',
                                            marginBottom: '5px',
                                        }}
                                    >
                                        <ECIconView icon="PlusCircleOutlined" />
                                    </Button>}
                                    <Button
                                        size="small"
                                        type="default"
                                        onClick={() => handleRemoveItem(item.id)}
                                        style={{
                                            justifyContent: 'center',
                                            width: '36px'
                                        }}
                                    >
                                        <ECIconView icon="CloseOutlined" />
                                    </Button>
                                </Col>
                            </Row>
                        </SortableList.Item>
                    )}
                />
            </Form>
    

        </>)
}

export default SelectionsRulesInput