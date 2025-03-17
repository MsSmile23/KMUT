import { FC, useEffect, useState } from 'react'
import { Select } from '@shared/ui/forms'
import { selectAttributes, useAttributesStore } from '@shared/stores/attributes'
import { SERVICES_ATTRIBUTE_STEREOTYPES } from '@shared/api/AttributeStereotypes'

interface IattributesBindSelect {
    value?: any
    onChange?: any
}

const AttributesBindSelect: FC<IattributesBindSelect> = ({
    value,
    onChange,
}) => {
    const attributesStore = useAttributesStore(selectAttributes).map((attr) => ({ label: attr.name, value: attr.id }))
    const [attributesWithNameStereotype, setAttributesWithNameStereotype] = useState([])

    useEffect(() => {
        const getStereotypes = async () => {
            const attrStereotypes = await SERVICES_ATTRIBUTE_STEREOTYPES.Models.getAttributeStereotypes({ all: true })
            const attributesWithNameStereotype = attrStereotypes.data
                .map((attr) => ({ label: attr.name, value: attr.id }))

            setAttributesWithNameStereotype(attributesWithNameStereotype)
        }

        getStereotypes()
    }, [])

    const handleSelectChange = (selectedValue: any, type: string) => {
        let newSlectedValue

        if (type === 'attribute_id' && selectedValue !== undefined) {
            newSlectedValue = {
                attribute_id: selectedValue,
            }
        } else if (type === 'stereotype_id' && selectedValue !== undefined) {
            newSlectedValue = {
                stereotype_id: selectedValue,
            }
        } else if (selectedValue === undefined) {
            newSlectedValue = selectedValue
        }

        onChange( newSlectedValue )
    };

    return (
        <div
            style={{
                width: 400, 
                padding: 10,
                maxHeight: 100,
                border: '1px solid #bfbfbf', 
                borderRadius: 5,
                display: 'flex', 
                gap: 10, 
                justifyContent: 'space-between', 
                alignItems: 'start',
            }}
        >
            <div>
                <p style={{ margin: 0 }}>attribute_id</p>
                <Select 
                    style={{ width: 160 }}
                    options={attributesStore}
                    placeholder="Выберите атрибут"
                    value={value?.contour?.attribute_id}
                    onChange={(value) => handleSelectChange(value, 'attribute_id')}
                />
            </div>
            <p>или</p>
            <div>
                <p style={{ margin: 0 }}>stereotype_id</p>
                <Select
                    style={{ width: 160 }}
                    options={attributesWithNameStereotype}
                    placeholder="Выберите стереотип"
                    value={value?.contour?.stereotype_id}
                    onChange={(value) => handleSelectChange(value, 'stereotype_id')}
                />
            </div>
        </div>
    )
}

export default AttributesBindSelect