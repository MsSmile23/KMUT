import { useGetObjects } from '@shared/hooks/useGetObjects'
import { selectAttributes, selectAllAttributesByIndex, useAttributesStore, selectAttributeByIndex } from '@shared/stores/attributes'
import { selectObjects, useObjectsStore } from '@shared/stores/objects'
import { FC } from 'react'

export const AttributeStoreEnrichment: FC = () => {
    const attrs = useAttributesStore(selectAllAttributesByIndex)
    const getAttrByIndex = useAttributesStore(selectAttributeByIndex)
    // const objects = useObjectsStore(selectObjects)
    const objects = useGetObjects()

    console.log('objects', objects)
    // console.log('attr 208', getAttrByIndex('id', 208))
    // console.log('attrs', attrs)
    return (
        <ul>
            {
                Object.entries(attrs).map(([attrIndex, attrIdx]) => {
                return (
                    <li key={attrIndex}>
                        {attrIndex} - {attrIdx}
                    </li>
                )
            })}

        </ul>
    )
}