import { forumThemeConfig } from "@app/themes/forumTheme/forumThemeConfig"
import { ObjectLinkedObjectsRackView } from "@entities/objects/ObjectLinkedObjectsRackView/ObjectLinkedObjectsRackView"
import { Button, Divider } from "antd"
import { FC, useState } from "react"

export const Racks: FC = () => {
    const data = {
        multi: 10176,
        single: 10554
    }

    const [ rackType, setRackType ] = useState<any>('single')

    return (
        <div style={{ padding: 12, height: '100%' }}>
            <Button onClick={() => setRackType((rt) => rt === 'multi' ? 'single' : 'multi')}>{rackType}</Button>
            <Divider />
            <ObjectLinkedObjectsRackView 
                type={rackType}
                object={data[rackType]} 
                childClassIds={[10055]} 
                targetClassIds={[10058]}        
                visibleClassIds={[10056]}
                deviceUnitRelationIds={forumThemeConfig.classesGroups.relationIds}
                attributesBind={{
                    unitOrder: 10089,
                    rackSize: 10071
                }} 
                unitRackRelationId={10037}
                unitPlacementClassId={10097}
            />
        </div>
    )
}