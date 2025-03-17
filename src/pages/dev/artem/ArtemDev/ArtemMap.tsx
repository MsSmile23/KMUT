import React from 'react';
import ObjectsMap from '@entities/objects/ObjectsMap/oldVersion/ObjectsMap';
import { selectObjects, useObjectsStore } from '@shared/stores/objects';
import { useGetObjects } from '@shared/hooks/useGetObjects';

const ArtemMap: FC = () => {
    // const objects = useObjectsStore(selectObjects)
    const objectsStore = useGetObjects()
    const objectIds = objects.map(item => item.id)

    return (
        <ObjectsMap objectsIds={objectIds} />
    );
};

export default ArtemMap;