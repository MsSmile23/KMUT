import { FC } from 'react';
import { IObject } from '@shared/types/objects';
import { forumThemeConfig } from '@app/themes/forumTheme/forumThemeConfig';
import ObjectCableTable from '@entities/objects/ObjectCableTable/ObjectCableTable';

interface IObjectPage {
    object: IObject
}

const ForumObjectCables: FC<IObjectPage> = ({ object }) => {
    return (
        <ObjectCableTable
            parentObject={object}
            relationsPortDevice ={forumThemeConfig.build.cableTable.relationsPortDevice}
            relationsCablePort = {forumThemeConfig.build.cableTable.relationsCablePort}
            cableClasses = {forumThemeConfig.build.cableTable.cableClasses}
            childClsIds = {[
                ...forumThemeConfig.classesGroups.floors,
                ...forumThemeConfig.classesGroups.racks,
                ...forumThemeConfig.classesGroups.rooms,
                ...forumThemeConfig.classesGroups.units
            ]}
            targetClsIds = {[...forumThemeConfig.classesGroups.devices]}
        />
    );
};

export default ForumObjectCables;