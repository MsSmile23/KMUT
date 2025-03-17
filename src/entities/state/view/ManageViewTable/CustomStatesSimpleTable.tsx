import { Col, ColorPicker, Form, Row, Table, TableProps, Typography } from 'antd'
import styles from '../../SimpleTable.module.css'
import { Forms } from '@shared/ui/forms'
import { useEffect, useState } from 'react'
import * as Icons from '@ant-design/icons/lib/icons/'
import { IECIconView, ECIconView } from '@shared/ui/ECUIKit/common/ECIconView/ECIconView'
import { Color, ColorPickerProps } from 'antd/es/color-picker'
import { FormInstance } from 'antd/lib/form/Form'
import { statesOptions } from '@entities/state/statesData/statesFormData'
import { statesProps, statesPropsNames } from '@entities/state/statesData/statesTableData'
import { Buttons } from '@shared/ui/buttons'

interface IToolbar {
    right?: React.ReactNode
    left?: React.ReactNode
}
interface ISimpleTable extends TableProps<any> {
    toolbar?: IToolbar
    rows: any[],
    rowSelection?: any
    ellipsysWidth?: number | string
    form: FormInstance
    actualTypes?: any
    disableForm?: boolean
 }


/**
 * Обычная таблица с отключаемым тулбаром
 * @param rows - ряды таблицы
 * @param toolbar - настройки тулбара
 */

export const CustomStatesSimpleTable: React.FC<ISimpleTable> = ({
    rows, toolbar, rowSelection, form, disableForm, ...props
}) => {

    const { Text } = Typography
    const [colorHex, setColorHex] = useState<Color | string>('#FFFFFF');
    const [formatHex, setFormatHex] = useState<ColorPickerProps['format']>('hex');
    const [stateOptions, setStateOptions] = useState (statesOptions)
    const iconsList = Object.keys(Icons) as IECIconView['icon'][]
    const [iconsArray, setIconsArray] = useState<any[]>([])
    const [rowIdx, setRowIdx] = useState(null)
    const [selectedValues, setSelectedValues] = useState(undefined)


    const colors = [
        '#5cb85c',
        '#ffcc33',
        '#FFA500',
        '#990000',
        '#808080',
        '#7fafd7',
        '#428bca',
        '#8a00e6'
       
    ]

    
    useEffect(() => {

        if (rows && rows.length > 0 && !selectedValues) {
            const updatedValues = ['', '', '', ''];
            const statesTypesArray = rows.map(row => row.type);

            statesTypesArray?.forEach((type, index) => {
                updatedValues[index] = type;
            });

            setSelectedValues(updatedValues);

        }
    }, [rows]);


    useEffect(() => {

        const actualTypes: string[] = []

        props.actualTypes?.filter((item) =>
        {

            for (const key in item) {
                if (key.startsWith('type-')) {
                    actualTypes.push(item[key])
                }
            }

            return actualTypes;
        });


        if (actualTypes && selectedValues) {

            const updatedSelectedValues = [...selectedValues].map((value) => {
                if (!actualTypes?.includes(value)) {

                    return '';
                }

                return value;
            })

            setSelectedValues([...updatedSelectedValues])
        }

    }, [props.actualTypes]);


    useEffect(() => {
        const dataForIconsSelect: any[] = iconsList.map((icon) => {
            return {
                value: icon,
                label: (
                    <>
                        {' '}
                        <ECIconView icon={icon} />
                        {' '}
                        <Text>{icon} </Text>
                    </>
                ),
            }
        })

        setIconsArray(dataForIconsSelect)
    }, [])



    const handleSelectChange = (value: string, index: number) => {

        const newSelectedValues = [...selectedValues];

        newSelectedValues[index] = value;
        setSelectedValues(newSelectedValues);

        if ( value === 'icon') {
            setRowIdx(index)
        }

    }


    useEffect(() => {
        const updatedStateOptions = stateOptions?.map(option => {

            return (selectedValues?.includes(option.value)) ? { ...option, disabled: true }
                : { ...option, disabled: false }
        });

        setStateOptions(updatedStateOptions)


        if (selectedValues?.includes('icon')) {

            const currentState = form?.getFieldValue([statesProps.view_params.name])

            const iconIndex = currentState.findIndex(item => Object.values(item).includes('icon'));

            setRowIdx(iconIndex)
        }

    }, [selectedValues])





    const ellipsisRows = (rows || [])?.map((row, rowIndex) => {

        const fieldType = `${statesPropsNames.type.name}-${row.indexKey}`;
        const fieldValue = `${statesPropsNames.value.name}-${row.indexKey}`;

        const entries = Object.entries(row)?.map(([ col, value ]: [any, any]) => {

            if (col !== 'key' && col != 'indexKey' && (typeof value === 'string' || typeof value === 'number')) {
                const currentState = form?.getFieldValue([statesProps.view_params.name, rowIndex]) ?? {};
                const key = Object.keys(currentState)[0]
                const currentTypeValue = currentState[key]

                return col === 'type' ? [
                    col,
                    <Col
                        span = {12} key={col.key}
                        style={{ minWidth: '18vw', margin: 5 }}
                    >
                        <Form.Item
                            labelAlign="left"
                            name={[statesProps.view_params.name, rowIndex, fieldType]}
                            rules={statesProps.view_params.rules}
                            style={{ width: '10vw', margin: 0, padding: 0 }}
                        >
                            <Forms.Select
                                disabled={disableForm}
                                maxTagCount="responsive"
                                options={stateOptions}
                                placeholder="Выберете значение"
                                onChange={(value) => handleSelectChange(value, rowIndex)}
                            />
                        </Form.Item>
                    </Col>
                ] :
                    [
                        col,
                        <Col
                            span = {24} key={col.key}
                            style={{
                                margin: 0,
                                display: 'flex',
                                padding: 0,
                                // width: props.ellipsysWidth
                            }}
                        >
                            {selectedValues?.includes('icon') && rowIndex === rowIdx ?
                                <Col
                                    style={{
                                        margin: 0,
                                        padding: 0,
                                        display: currentTypeValue === '' ? 'none' : 'block'
                                    }}
                                >
                                    <Form.Item
                                        labelAlign="left"
                                        label="Иконка"
                                        name={[statesProps.view_params.name, rowIndex, fieldValue]}
                                        style={{ width: '12vw', margin: 0,  padding: 0 }}
                                        rules={statesProps.view_params.rules}
                                    >
                                        <Forms.IconSelect disabled={disableForm} placeholder="Выберите иконку" />
                                        {/* <Forms.Select
                                            placeholder="Выберите иконку класса"
                                            customData={{
                                                data: iconsArray?.slice(1, iconsArray.length) ?? [],
                                                convert: {
                                                    valueField: 'value',
                                                    optionFilterProp: 'value',
                                                    optionLabelProp: 'label',
                                                },
                                            }}
                                            dropdownRender={(menu) => (
                                                <div>
                                                    <div>Выберете иконку</div>
                                                    {menu}
                                                </div>
                                            )}
                                            defaultValue="Выберете иконку класса"
                                            // {...props}
                                        /> */}
                                    </Form.Item>
                                </Col>
                                :
                                <Col
                                    span={24}
                                    style={{
                                        margin: 0,
                                        padding: 0,
                                        display: currentTypeValue === '' ? 'none' : 'flex'
                                    }}
                                >
                                    <Form.Item
                                        labelAlign="left"
                                        style={{ width: '12vw', margin: 0,  padding: 0 }}
                                        label="Цвет"
                                        name={[statesProps.view_params.name, rowIndex, fieldValue]}
                                        rules={statesProps.view_params.rules}

                                    >
                                        <ColorPicker
                                            disabled={disableForm}
                                            format={formatHex}
                                            value={colorHex}
                                            onChange={setColorHex}
                                            onFormatChange={setFormatHex}

                                        />

                                    </Form.Item>
                                    {!disableForm &&   
                                        <Row align="middle" gutter={16} style={{ width: '100%' }}>
        
                                            <Col>   <Text>Базовые цвета</Text></Col>

                                            {colors.map((color, index) => {
                                                return (
                                                    <Col
                                                        span={2}
                                                        key={`color-${index}`}
                                                        style={{
                                                            width: '100%',
                                                            height: '32px',
                                                            borderRadius: '3px',
                                                            padding: '6px',
                                                            backgroundColor: '#ffffff',
                                                            cursor: 'pointer',
                                                        }}
                                                        onClick={() => {
                                                            form.setFieldValue([statesProps.view_params.name, 
                                                                rowIndex, fieldValue], 
                                                            color)
                                                        }}
                                                    >
                                                        <div
                                                            style={{ backgroundColor: color,
                                                                width: '24px',
                                                                height: '24px',
                                                                border: '1px solid grey',
                                                                borderRadius: '3px' }}
                                                        >
                                                        </div>
                                                        {/* <Buttons.ButtonAdd
                    color={color}
                    text={false}
                    icon={false}
                    size="small"
                    onClick={() => {
                        form.setFieldValue([statesProps.view_params.name, 
                            rowIndex, fieldValue], 
                        color)
                    }}
                /> */}
                                                    </Col>
                                                )
                                            })}

                                        </Row>}
                                  
                                    
                                </Col>}
                        </Col>

                    ]
            } else {
                return [ col, value ]
            }

        })

        return Object.fromEntries(entries)
    })

    return (
        <Row gutter={[0, 20]}>
            {toolbar && (
                <Col xs={24}>
                    <Row justify="space-between">
                        <Col>{toolbar.left}</Col>
                        <Col>{toolbar.right}</Col>
                    </Row>
                </Col>
            )}
            <Col xs={24}>

                <Table
                    rowClassName={styles?.narrow_table}
                    locale={{ emptyText: 'Нет данных' }}
                    dataSource={ellipsisRows}
                    rowSelection={rowSelection}
                    {...props}
                />

            </Col>
        </Row>
    )
}