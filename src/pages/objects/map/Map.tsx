import { FC, useLayoutEffect } from 'react'
import ObjectsMap2 from '@entities/objects/ObjectsMap/ObjectsMap2'
import { objectsStore, selectObjects } from '@shared/stores/objects'
import { PageHeader } from '@shared/ui/pageHeader'
import { breadCrumbs } from '@pages/objects/map/prepare'
import { useTheme } from '@shared/hooks/useTheme'
import { useMapStore } from '@shared/stores/map'
import { useGetObjects } from '@shared/hooks/useGetObjects'


const Map: FC = () => {
    const theme = useTheme()
    const objects = useGetObjects().map((obj) => obj.id)
    const mapStore = useMapStore()

    useLayoutEffect(() => {
        if (theme.components.map.showcase) {
            const { startZoom, mapCenter } = theme.components.map.showcase

            !mapStore.mapCenter && mapStore.setMapCenter(mapCenter)
            !mapStore.zoom && mapStore.setZoom(startZoom)
        }
    })


    return (
        <>
            <PageHeader title="Карта объектов" routes={breadCrumbs} />

            {/* <Card
                ref={ref}
                key="map" style={{ marginTop: 20, height: '700px', width: '100%' }}
                

            > */}

            <div style={{ height: 'calc(100vh - 250px)', width: '100%', padding: '10px' }}>

                <ObjectsMap2
                    objects={objects}
                    startZoom={theme.components.map.showcase.startZoom}
                    mapCenter={theme.components.map.showcase.mapCenter}
                    attributesBind={theme.components.map.showcase.attributesBind}
                />

            </div>
            {/* </div> */}
            {/* </Card> */}

        </>
    )
}

export default Map