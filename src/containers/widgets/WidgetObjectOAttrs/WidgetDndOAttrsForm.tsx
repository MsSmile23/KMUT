import { IAttribute } from '@shared/types/attributes'
import { SortableList } from '@shared/ui/SortableList'
import { FC, useEffect, useState } from 'react'


interface IWidgetDndOAttrsForm {
    chosenAttrs: number[]
    attrs: IAttribute[]
    value?: number[]
    onChange?: any
}
const WidgetDndOAttrsForm: FC<IWidgetDndOAttrsForm> = ({ chosenAttrs, attrs, value, onChange }) => {
    const [sortedAttrs, setSortedAttrs] = useState<IAttribute[]>([])

    useEffect(() => {

        if (value !== undefined) {
            const localSortedAttrs: IAttribute[] = value.map((attrId) => attrs.find((attr) => attr.id == attrId))

            setSortedAttrs(localSortedAttrs)
        } else {
            if (chosenAttrs.length == 0) {
                setSortedAttrs(attrs)
            } else {
                setSortedAttrs(attrs.filter((attr) => chosenAttrs.includes(attr.id)))
            }
        }
    }, [chosenAttrs])

    useEffect(() => {
        const valueIds: number[] = sortedAttrs.map((attr) => attr.id)

        onChange(valueIds)
    }, [sortedAttrs])

    return (
        <div style={{ maxWidth: 400 }}>
            <SortableList
                items={sortedAttrs}
                onChange={setSortedAttrs}
                renderItem={(item) => (
                    <SortableList.Item id={item.id}>
                        {item.name}
                        <SortableList.DragHandle />
                    </SortableList.Item>
                )}
            />
        </div>
    )
}

export default WidgetDndOAttrsForm