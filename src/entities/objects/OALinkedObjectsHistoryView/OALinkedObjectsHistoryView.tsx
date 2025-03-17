import AttributeHistoryChartContainer from '@containers/objects/AttributeHistoryChartContainer';
import { IObject, IObjectAttribute } from '@shared/types/objects';
import { findLinkedObjects } from '@shared/utils/objects';
import { selectObjects, useObjectsStore } from '@shared/stores/objects';
import { IRelation } from '@shared/types/relations';
import { IAttribute } from '@shared/types/attributes';
import { FC } from 'react';
import { useGetObjects } from '@shared/hooks/useGetObjects';

interface OALinkedObjectsHistoryViewProps {
    title: string
    relationIds: IRelation['id'][],
    attributeId: IAttribute['id']
    objectId: IObject['id'],
}

const OALinkedObjectsHistoryView: FC<OALinkedObjectsHistoryViewProps> = ({
    title,
    objectId,
    relationIds,
    attributeId,
    ...props
}) => {
    // const objects = useObjectsStore(selectObjects)
    const objects = useGetObjects()

    const object = objects.find(item => item.id == objectId)

    const linkedObjects = findLinkedObjects({
        object,
        relationIds,
        objects
    })

    const oas: IObjectAttribute[] = []
    const oa_ids: IObjectAttribute['id'][] = []

    linkedObjects.forEach( (lo) => {

        lo.object_attributes.forEach( loa => {
            if (attributeId == loa.attribute_id)  {
                oas.push(loa)
                oa_ids.push(loa.id)
            }
        })

    })


    return (
        <AttributeHistoryChartContainer
            key={props.key ?? Math.random()}
            ids={oa_ids}
            category={title}
            customisation={{
                nameSerieRender: ({ oa_id, name }): string => {
                    const oa = oas.find(item => item.id == oa_id) ?? undefined
                    const object = oa ? linkedObjects.find(item => item.id == oa.object_id) : undefined

                    return object?.name ?? name
                }
            }}
        />
    );
};

export default OALinkedObjectsHistoryView