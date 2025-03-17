import { selectAttributes, useAttributesStore } from '@shared/stores/attributes'
import { IDataType } from '@shared/types/data-types'
import { Select } from '@shared/ui/forms/Select/Select'
import { Col, Tag } from 'antd'
import { FC, useEffect, useState } from 'react'

type IUsual = {
    view?: 'usual'
    selectWidth?: number
}

type IAttractive = {
    view?: 'attractive'
    selectWidth: number
}

type IAttributesSelect = {
    multiType?: boolean
    filters: {
        class_ids: number[]
    }
    optionsFilterType?: 'interSelect' | 'union',
    value?: any
    onChange?: any
    disabled?: boolean;
    dataType?: IDataType
    placeholder?: string
} & (IUsual | IAttractive)


//TODO:: при изменении набора фильтров
// или типа фильтрации опций необходимо проверить текущее значение на вхождение в этот набор
// если в текущих выбранных атрибутах есть атрибуты которые не входят в этот набор их надо удалить

const AttributesSelect: FC<IAttributesSelect> = ({
    multiType = true,
    view = 'usual',
    filters = {
        class_ids: []
    },
    optionsFilterType = 'interSelect',
    value = undefined,
    onChange = undefined,
    dataType,
    placeholder = 'Выберите атрибуты',
    ...props
}) => {


    const [data, setData] = useState<{ value: number; label: string }[]>([])

    const attributes = useAttributesStore(selectAttributes)

    useEffect(() => {
        const localData: { value: number; label: string }[] = []

        const attrs =  dataType ? attributes.filter(attr => attr.data_type_id == dataType.id) : attributes

        attrs?.forEach((attr) => {

    

            if (optionsFilterType == 'interSelect') {
                if (
                    attr?.classes.filter((cl) => filters?.class_ids.includes(cl?.id))?.length ==
                    filters?.class_ids?.length
                ) {
                    localData.push({
                        value: attr.id,
                        label: dataType ? `${attr?.name}[${attr?.data_type?.name}]` : attr?.name,
                    })
                }

                return
            }

            if (optionsFilterType == 'union') {
                if (attr?.classes.filter((cl) => filters?.class_ids.includes(cl?.id))?.length > 0) {
                    localData.push({
                        value: attr.id,
                        label: dataType ? `${attr?.name}[${attr?.data_type?.name}]` : attr?.name,
                    })
                }

                return
            }
        })

        setData(localData)

    }, [attributes, filters?.class_ids, optionsFilterType])


    return (
        <Select
            placeholder= {placeholder}
            value={value}
            onChange={onChange}
            mode={multiType ? 'multiple' : undefined}
            data={data}
            tagRender={
                view == 'attractive'
                    ? (tag) => (
                        <Col
                            style={{
                                width: view == 'attractive' ? `${props?.selectWidth - 50}px` : '100%',
                                marginTop: '5px',
                            }}
                            span={24}
                        >
                            <Tag
                                {...tag}
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    whiteSpace: 'pre-wrap',
                                }}
                            >
                                <Col>{tag.label}</Col>
                            </Tag>
                        </Col>
                    )
                    : undefined
            }
            style={{ width: props?.selectWidth ? `${props?.selectWidth}px` : '100%' }}
            {...props}
        />
    )
}

export default AttributesSelect