import { FC } from 'react';
import ObjectRacksContainer from '@containers/objects/ObjectRacksContainer/ObjectRacksContainer';
import { IObject } from '@shared/types/objects';
import { forumThemeConfig } from '@app/themes/forumTheme/forumThemeConfig';

interface IObjectPage {
    object: IObject
}

const ForumObjectRacks: FC<IObjectPage> = ({ object }) => {
    return (
        <ObjectRacksContainer
            object={object}
            targetClassIds={[...forumThemeConfig.classesGroups.racks]}
            childClassIds={[
                ...forumThemeConfig.classesGroups.floors,
                ...forumThemeConfig.classesGroups.rooms,
            ]}
            unit = {{
                rackRelationId: 10037,
                orderAttributeId: 10089
            }}
            deviceUnit = {{
                relationIds: forumThemeConfig.classesGroups.relationIds,
                sizeAttributeId: 10180,
                unitPlacements: forumThemeConfig.classesGroups.unitPlacements
            }}
            attributeIds={{
                maxPower: [10112, 10088],
                currentPower: [10107, 10088],
                temperature: [10111, 10088],
                humidity: [10113, 10088],
            }}
            rackSizeId={10071}
        />
    );
};

export default ForumObjectRacks;