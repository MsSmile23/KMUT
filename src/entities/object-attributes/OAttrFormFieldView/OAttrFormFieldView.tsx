import { FC } from 'react'
import { Forms, ScheduleMini } from '@shared/ui/forms'
import { IAttribute } from '@shared/types/attributes';
import { ECUploadFile } from '@shared/ui/ECUIKit/forms';

interface MyInputProps {
    dataType: string
    value?: any
    onChange?: any
    style?: any
    disabled?: boolean
    viewTypeId: number | undefined
    attribute?: IAttribute
    addonAfter?: any
    form?: any
    objectId?: number
}

const OAttrFormFieldView: FC<MyInputProps> = ({
    form,
    objectId,
    dataType,
    //viewTypeId,
    attribute,
    ...props
}) => {

    // if (attribute.data_type.mnemo === 'uploaded_image') {
    //     return <ECUploadFile setFieldValue={form.setFieldValue} fieldName={formItemName} />
    // }

    const fieldProps = { ...props }

    if (attribute?.unit) {
        fieldProps.addonAfter = attribute.unit
    }

    switch (true) {
        case attribute.params?.select?.enable:
            return (
                <Forms.Select
                    data = {attribute.params.select.options}
                    {...fieldProps}
                />)
        case dataType == 'integer':
            return (
                <Forms.Input
                    type="number"
                    {...fieldProps}
                />)
        case dataType == 'double':
            return (
                <Forms.Input
                    step="0.1"
                    type="number"
                    {...fieldProps}
                />)
        case dataType == 'string':
            return <Forms.Input type="text" {...fieldProps} />
        case dataType == 'boolean':
            return <Forms.CheckBox {...fieldProps} />
        case dataType == 'jsonb' && attribute.data_type.mnemo === 'schedule' : {
            const newFieldProps = { ...fieldProps }

            return (
                <ScheduleMini
                    form={form}
                    id={objectId}
                    {...newFieldProps}
                    dataFromBack={newFieldProps.value}
                />
            )
        }
        case dataType == 'jsonb':
            return <Forms.Input type="text" {...fieldProps} />
        default:
            return null
    }
}

export default OAttrFormFieldView