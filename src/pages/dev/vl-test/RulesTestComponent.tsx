import { manageRulesClassTableData } from '@entities/state/statesData/mock'
import StatesRulesAttrForm from '@entities/states/StatesRulesAttrForm/StatesRulesAttrForm'
import StatesRulesClassForm from '@entities/states/StatesRulesClassForm/StatesRulesClassForm'
import { Collapse, Form, Row } from 'antd'
import { useEffect, useState } from 'react'


export const RulesTestComponent = () => {

    const [form] = Form.useForm();
    const [rulesClassTableData, setRulesClassTableData] = useState(null)

    useEffect(() => {
        setRulesClassTableData(manageRulesClassTableData)
    }, [manageRulesClassTableData])


    // const changeHandler = (value) => {
    //     console.log('value', value)

    // }

    const class_ids = [1, 4, 5, 8, 11, 14, 16, 44, 19, 50, 96, 10001, 10002, 48, 46, 10003, 10004, 10005, 10006]


    return (
        <Form
            form={form}
            id="attributes-form"
            labelCol={{ xs: 12 }}
            colon={false}
            requiredMark={true}
            labelAlign="left"
            // initialValues={{ rules: attributesRules }}
            // onFieldsChange={(_, allFields) => {
            //     onChange(allFields);
            // }}
            onValuesChange={(changed, values) => {
                form.setFieldsValue(values)
                // console.log('changed', changed);
                // console.log('values', values);
            }}
        >

            <Collapse
                size="small"
                style={{ fontSize: '15px', textAlign: 'center' }}
                defaultActiveKey={['4']}
                items={[{
                    key: '4',
                    label: 'Управление правилами атрибутов',
                    children:
                        <Row gutter={[10, 0]}>

                            <StatesRulesAttrForm
                                rule_group_id={0}
                                pseudo_rule_group_id={0}
                                attribute_id={0} value={[]}
                                onChange={function(value: any): void {
                                    throw new Error('Function not implemented.')
                                }}
                            />

                        </Row>,
                }]}
            />
            <Collapse
                size="small"
                style={{ fontSize: '15px', textAlign: 'center' }}
                defaultActiveKey={['4']}
                items={[{
                    key: '4',
                    label: 'Управление правилами классов',
                    children:
                        <Row gutter={[10, 0]}>
                            {/* <StatesRulesClassForm
                                value={rulesClassTableData}
                                // rulesClassTableData={rulesClassTableData}
                                // onChange={(value: any) => {changeHandler(value)}}
                                class_ids={class_ids}
                            /> */}

                        </Row>,
                }]}
            />



        </Form>

    )
}