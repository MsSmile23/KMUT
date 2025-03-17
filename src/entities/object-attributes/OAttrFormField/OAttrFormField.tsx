import { FC, useEffect, useState } from 'react'
import * as Icons from '@ant-design/icons/lib/icons/'
import { Forms, ScheduleMini, TextArea } from '@shared/ui/forms'
import { IECIconView, ECIconView } from '@shared/ui/ECUIKit/common/ECIconView/ECIconView'
import { Typography } from 'antd'
import { IAttribute } from '@shared/types/attributes'
import { ECUploadFile } from '@shared/ui/ECUIKit/forms'
import SelectionsRulesInput from '@shared/ui/forms/SelectionsRulesInput/SelectionsRulesInput'
import { ECInputPassword } from '@shared/ui/forms/ECInputPassword/ECInputPassword'
import CodeEditor from '@shared/ui/CodeEditor/CodeEditor'
import OAttrFormFieldSelect from './OAttrFormFieldSelect/OAttrFormFieldSelect'
import AgentMetricsInput from '@shared/ui/ECUIKit/forms/AgentMetricsInput/AgentMetricsInput'
import WebAppAttribute from '@entities/attributes/WebAppAttribute/WebAppAttribute'
import OAGeoJSON from '../OAGeoJSON/OAGeoJSON'

const { Text } = Typography

interface MyInputProps {
    /*     attribute: IAttribute
    dataTypes: IDataType[] */
    dataType: string
    value?: any
    checked?: any
    onChange?: any
    style?: any
    disabled?: boolean
    viewTypeId?: number | undefined
    attribute?: IAttribute
    addonAfter?: any
    form?: any
    objectId?: number
    formItemName?: string
    viewType?: string
    jsonTypeValue?: boolean
    setValidation?: React.Dispatch<any>
}

const OAttrFormField: FC<MyInputProps> = ({
    form,
    objectId,
    // value,
    // onChange,
    dataType,
    viewTypeId,
    attribute,
    formItemName,
    viewType,
    jsonTypeValue,
    setValidation,
    ...props
}) => {
    const icons = Object.keys(Icons) as IECIconView['icon'][]
    const [iconsArray, setIconsArray] = useState<any[]>([])

    useEffect(() => {
        const dataForIconsSelect = icons.map((icon) => {
            return {
                value: icon,
                label: (
                    <>
                        {' '}
                        <ECIconView icon={icon} /> <Text>{icon} </Text>
                    </>
                ),
            }
        })

        setIconsArray(dataForIconsSelect)
    }, [])

    const fieldProps = { ...props }

    if (attribute?.unit) {
        fieldProps.addonAfter = attribute.unit
    }

    const createInput = () => {
        if (attribute?.data_type?.mnemo === 'uploaded_image') {
            return (
                <ECUploadFile
                    setFieldValue={form.setFieldValue}
                    fieldName={formItemName}
                    mediaFileId={form.getFieldValue(formItemName)}
                    getFieldValue={form.getFieldValue}
                />
            )
        }

        switch (true) {
            case dataType == 'integer':
                return <Forms.Input type="number" placeholder="Введите число" {...fieldProps} />
            case dataType == 'double':
                return <Forms.Input step="0.1" type="number" placeholder="Введите дробное число" {...fieldProps} />
            //TODO:: перейти на мнемонику viewType!!!
            case dataType == 'string' && (viewType == 'icon' || viewTypeId == 17):
                return (
                    <Forms.Select
                        placeholder="Выберите иконку субъекта"
                        customData={{
                            data: iconsArray,
                            convert: {
                                valueField: 'value',
                                optionFilterProp: 'value',
                                optionLabelProp: 'label',
                            },
                        }}
                        {...fieldProps}
                    />
                )
            case dataType == 'string' && attribute?.params?.select?.enable:
                return (
                    <OAttrFormFieldSelect
                        placeholder="Выберите значение"
                        options={attribute.params.select.options}
                        {...fieldProps}
                    />
                )
            case dataType == 'string' && attribute?.data_type?.mnemo == 'multistring':
                return (
                    <TextArea
                        autoSize={{ minRows: 3 }}
                        style={{ marginTop: '10px' }}
                        placeholder="Введите текст"
                        {...fieldProps}
                    />
                )
            case dataType == 'string' && attribute?.data_type?.mnemo == 'password':
                return (
                    <ECInputPassword
                        {...fieldProps}
                        // dataFromBack={newFieldProps.value}
                    />
                )
            case dataType == 'string' && attribute?.data_type?.mnemo == 'multistring_inline':
                return <TextArea autoSize={{ minRows: 1, maxRows: 1 }} placeholder="Введите текст" {...fieldProps} />
            case dataType == 'string' && attribute?.params?.syntax !== undefined && attribute?.params?.syntax !== '':
                return (
                    <CodeEditor
                        mnemonic={attribute?.params?.syntax}
                        editable={true}
                        placeholder="Введите значение"
                        {...fieldProps}
                    />
                )
            case dataType == 'string':
                return <Forms.Input type="text" placeholder="Введите текст" {...fieldProps} />
            case dataType == 'boolean':
                return <Forms.CheckBox {...fieldProps} />
            case dataType == 'jsonb' && attribute?.data_type?.mnemo == 'wam_processing_rules':
                return <SelectionsRulesInput {...fieldProps} />
            case dataType == 'jsonb' && attribute?.data_type?.mnemo == 'schedule':
                return (
                    <ScheduleMini
                        formItemName={formItemName}
                        attribute={attribute}
                        form={form}
                        id={objectId}
                        jsonTypeValue={jsonTypeValue}
                        {...fieldProps}
                        // dataFromBack={newFieldProps.value}
                    />
                )
            case dataType == 'jsonb' && attribute?.data_type?.mnemo === 'kmut_get_metric':
                return (
                    <AgentMetricsInput
                        setValidation={setValidation} 
                        data={attribute?.data_type?.params} 
                        {...fieldProps}
                    />
                )

            case dataType == 'jsonb' && attribute?.data_type?.mnemo === 'wam_params':
                return <WebAppAttribute {...fieldProps} />

            case dataType == 'jsonb' && attribute?.data_type?.mnemo === 'geo_json':
                return <OAGeoJSON value={props.value} onChange={props.onChange} />
            default:
                return <Forms.Input type="text" placeholder="Введите текст" {...fieldProps} />
        }
    }
    //const FieldComponent: React.ReactNode = createInput()

    return createInput()
}

export default OAttrFormField