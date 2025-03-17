import ObjectCableMap from '@entities/objects/ObjectCableMap/ObjectCableMap'
import { FC } from 'react'
import { IWidgetObjectCableMapSettings } from './types'

const WidgetObjectCableMap: FC<IWidgetObjectCableMapSettings> = ({ settings }) => {

    return (
        <ObjectCableMap 
            parentObject={settings?.vtemplate?.objectId ?? settings?.widget?.parentObject}
            {...settings?.widget || {}}
            isInitialPositionMap={true}
        />
        // <ObjectCableMap
        //     parentObject={forumThemeConfig.mainObjectId}
        //     relationsPortDevice={forumThemeConfig.build.cableTable.relationsPortDevice}
        //     relationsCablePort={forumThemeConfig.build.cableTable.relationsCablePort}
        //     cableClasses={forumThemeConfig.build.cableTable.cableClasses}
        //     childClassesIds={[
        //         ...forumThemeConfig.classesGroups.buildings,
        //         ...forumThemeConfig.classesGroups.floors,
        //         ...forumThemeConfig.classesGroups.racks,
        //         ...forumThemeConfig.classesGroups.rooms,
        //         ...forumThemeConfig.classesGroups.units
        //     ]}
        //     targetClassesIds={[...forumThemeConfig.classesGroups.devices]}
        //     attributes={{
        //         id: 10186,
        //         value: true,
        //         method: 'both'
        //     }}
        //     isInitialPositionMap={true}
        //     mnemoMapCore="network_map_core"
        // />
    )
}

export default WidgetObjectCableMap