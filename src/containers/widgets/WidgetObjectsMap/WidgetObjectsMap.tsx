import ObjectsMap2 from '@entities/objects/ObjectsMap/ObjectsMap2'
import { FC, useEffect, useMemo } from 'react'
import { TWidgetSettings } from '../widget-types'
import { stateFormType } from './WidgetObjectsMapForm' 
import { useMapStore } from '@shared/stores/map'
import { selectObjects, useObjectsStore } from '@shared/stores/objects'
import { useGetObjects } from '@shared/hooks/useGetObjects'

const WidgetObjectMap: FC<TWidgetSettings<stateFormType>> = (props) => {
    const { settings } = props
    const { widget, vtemplate } = settings
    const { setZoom, setMapCenter } = useMapStore()

    const objectsFromStore = useGetObjects().map((obj) => obj.id)


    const objects = useMemo(() => {
        return  vtemplate?.objectId ? [vtemplate?.objectId] : objectsFromStore
    }, [objectsFromStore]) 

    useEffect(() => {
        setMapCenter(widget?.mapCenter)
    }, [widget?.mapCenter])

    useEffect(() => {

        setZoom(widget?.startZoom)
    }, [widget?.startZoom])


    
    return (
        <ObjectsMap2 
            {...widget}
            objects={objects}
        />
    )
}

export default WidgetObjectMap