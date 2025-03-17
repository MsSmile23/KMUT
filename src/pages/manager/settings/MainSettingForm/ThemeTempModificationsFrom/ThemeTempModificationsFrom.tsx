/* eslint-disable react/jsx-max-depth */
/* eslint-disable max-len */
import { Buttons } from '@shared/ui/buttons'
import { Col, Form, Row, } from 'antd'
import dayjs from 'dayjs'
import { useEffect, useMemo, useState, } from 'react'
import './cssThemeTempModificationsFrom/holyday.scss'
import { ITempModificat } from '@shared/types/temp-modification'
import { useForm } from 'antd/lib/form/Form'
import ThemeTempModificationsFromItem from './ThemeTempModificationsFromItem/ThemeTempModificationsFromItem'


const ThemeTempModificationsFrom = ({ value, onChange, props }: {value?: any, onChange?: any, props?: ITempModificat[]} ) => {
    const [dataHoly, setDataHoly] = useState<ITempModificat[]>(props || [])
    const [form] = useForm()
    const timeData = useMemo(() => {
        const updateData =  dataHoly?.map((el) => ({
            ...el,
            beginning: dayjs(el.beginning),
            end: dayjs(el.end),
        }));

        return setDataHoly(updateData)
    }, [props])

    useEffect(() => {
        onChange(form.getFieldValue('pictureAfterSystemTitleList'))
    }, [])

    return (
        <Form 
            name="mainForm"
            form={form}
            onValuesChange={() => {
                onChange(form.getFieldValue('pictureAfterSystemTitleList'))
            }}
        >
            <Form.List name="pictureAfterSystemTitleList" initialValue={dataHoly} >
                {(fields, { add, remove }) => {

                    return (
                        <>   
                            <Row gutter={[8, 8]} style={{ marginBottom: '20px' }}>
                                <Col span={6}>
                                    <Buttons.ButtonAdd
                                        text={false}
                                        shape="circle"
                                        customText="Добавить новый праздник. Пожалуйста, не забудьте заполнить 
                                    все поля, иначе праздник не сохраниться" 
                                        onClick={() => {
                                            add();
                                        }}
                                    />
                                </Col>
                            </Row>
                            {fields.map((field) => (           
                                <div key={field.key}>
                                    <ThemeTempModificationsFromItem 
                                        field={field} form={form} onChange={onChange} 
                                        setDataHoly={setDataHoly} dataHoly={dataHoly} 
                                        remove={remove} 
                                    />
                                </div>
                            ))}
                        </>
                    );
                }}
            </Form.List>
        </Form>
    )
}

export default ThemeTempModificationsFrom