import { UnitRackWidget } from '@containers/objects/UnitRackWidget/UnitRackWidget'
import { getLinks } from '@shared/api/Links/Models/getLinks/getLinks'
import { useApi2 } from '@shared/hooks/useApi2'
import { useOpen } from '@shared/hooks/useOpen'
import { useLinksStore } from '@shared/stores/links'
import { objectsStore } from '@shared/stores/objects'
import { useStateEntitiesStore } from '@shared/stores/state-entities'
import { useStatesStore } from '@shared/stores/states'
import { findChildObjectsByBaseClasses } from '@shared/utils/objects'
import { Button, Col, Input, Row, Slider } from 'antd'
import { FC, useEffect, useMemo, useState } from 'react'

export const RackFNS: FC = () => {
    const objectStore = objectsStore()
    const entities = useStateEntitiesStore()
    const states = useStatesStore()
    const object = objectStore.getObjectById(20016)
    // const links = useApi2(() => getLinks({ all: true }))

    useEffect(() => {
        objectStore.fetchData()
        entities.fetchData()
        states.fetchData()
        // links.fetchData()
        
        setTimeout(() => {
            state.close()
        }, 2000)
    }, [])
    

    const rackIds = useMemo(() => findChildObjectsByBaseClasses({
        childClassIds: [10058],
        targetClassIds: [10058],
        currentObj: object,
    }), [object])

    const racks = objectStore.store.data.filter((obj) => rackIds.includes(obj.id))

    //console.log('racks', racks)

    const [ w, setw ] = useState(1)
    const state = useOpen(true)

    return (
        <div style={{ padding: 12 }}>
            <div style={{ width: '50%' }}>
                <Input value={w} readOnly />
                <Slider value={w} onChange={setw} included={false} max={24} min={1} /> 
            </div>
            <div><Button onClick={state.toggle}>loading</Button></div>
            <Row>
                <Col span={w}>
                    <UnitRackWidget
                    //width={w}
                        loading={state.isOpen}
                        object={racks?.[0]}
                        unit = {{
                            rackRelationId: 20011,
                            orderAttributeId: 10084
                        }}
                        deviceUnit = {{
                            relationIds: [20024, 20025, 20026],
                            sizeAttributeId: undefined
                        }}
                        attributeIds={{
                            maxPower: [10112, 10088],
                            currentPower: [10107, 10088],
                            temperature: [10111, 10088],
                            humidity: [10113, 10088],
                        }}
                    />
                </Col>
            </Row>
        </div>
    )
}