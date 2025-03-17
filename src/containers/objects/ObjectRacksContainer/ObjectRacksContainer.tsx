import { FC, useMemo, useState } from 'react';
import { IObject } from '@shared/types/objects';
import { findChildObjectsByBaseClasses } from '@shared/utils/objects';
import { selectObjects, useObjectsStore } from '@shared/stores/objects';
import { UnitRackWidget } from '@containers/objects/UnitRackWidget/UnitRackWidget';
import { IClass } from '@shared/types/classes';
import { IUnitRackWidgetProps } from '@containers/objects/UnitRackWidget/types';
import { useGetObjects } from '@shared/hooks/useGetObjects';

interface IObjectRacksContainer {
    object: IObject,
    childClassIds: IClass['id'][],
    targetClassIds: IClass['id'][],
    unitsDirection?: 'direct' | 'reverse'
}

//TODO:: перенести настройки в тему и в целом показ вкладки (настройка кастомных вкладок?)
const ObjectRacksContainer: FC<IObjectRacksContainer | Partial<IUnitRackWidgetProps>> = ({
    object,
    childClassIds,
    targetClassIds,
    deviceUnit,
    attributeIds,
    unit,
    rackSizeId,
    unitsDirection
}) => {
    // const objects = useObjectsStore(selectObjects)
    const objects = useGetObjects()
    
    const rackIds = useMemo(() => findChildObjectsByBaseClasses({
        childClassIds: childClassIds,
        targetClassIds: targetClassIds,
        currentObj: object,
    }), [object])

    const racks = objects.filter((obj) => rackIds.includes(obj.id))

    return (
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', boxSizing: 'border-box', }}>
            {racks.map( rack =>
                <div
                    key={rack.id}
                >     
                    <UnitRackWidget
                        object={rack}
                        unit = {unit}
                        deviceUnit = {deviceUnit}
                        attributeIds={attributeIds}
                        rackSizeId={rackSizeId}
                        unitsDirection={unitsDirection}
                    />
                </div>
            )}
        </div>
    );
};

export default ObjectRacksContainer;