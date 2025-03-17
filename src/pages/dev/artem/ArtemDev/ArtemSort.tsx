import React, { ReactNode, useEffect, useState } from 'react';
import { SortableList } from '@shared/ui/SortableList';
import { Button, Form, InputNumber, Space } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

const ArtemSort = () => {
    const [ form ] = Form.useForm()
    const [items, setItems] = useState([])

    return (
        <div style={{ maxWidth: 400, margin: "30px auto" }}>
            <Form
                name={'test'}
                form={form}
                initialValues={[]}
            >
                    <Form.List name={'formList'}>
                        {(subFields, subOpt)  => (
                            <FormList subFields={subFields} subOpt={subOpt}/>
                        )}
                    </Form.List>
            </Form>
        </div>
    )
};

export default ArtemSort;



export const FormList:FC = ({subFields, subOpt}) => {
    const [items, setItems] = useState([])
    useEffect(() => {
        setItems(subFields.map((item, indx) => {
            return {id: indx, formRow: item}
        }))
    }, [subFields])

    return (
        <div style={{position: 'relative', width:'300px'}}>
            <SortableList<ReactNode>
                items={items}
                onChange={setItems}
                renderItem={({id, formRow}) => {
                    console.log('row', id, formRow.name)
                    return (
                        <SortableList.Item id={id}>
                            <Space>
                                <Form.Item name={[formRow.name,'name']} style={{marginBottom: '0px', width:'150px'}} label={"Тест"}>
                                    <InputNumber />
                                </Form.Item>
                                <Form.Item name={[formRow.name,'login']} style={{marginBottom: '0px', width:'150px'}} label={"Тест2"}>
                                    <InputNumber />
                                </Form.Item>
                                <Form.Item name={[formRow.name,'password']} style={{marginBottom: '0px', width:'150px'}} label={"Тест3"}>
                                    <InputNumber />
                                </Form.Item>
                                <CloseOutlined
                                    onClick={() => {
                                        subOpt.remove(subField.name);
                                    }}
                                />
                                <SortableList.DragHandle/>
                            </Space>
                        </SortableList.Item>
                    )
                }}
            />
            <Button type="dashed" onClick={() => subOpt.add()} block>
                + Add Sub Item
            </Button>
        </div>
    )
}
