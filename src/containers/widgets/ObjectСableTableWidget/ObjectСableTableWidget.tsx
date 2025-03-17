import { FC } from 'react';
import { IObjectСableTableWidgetSettings } from './types';
import { useObjectsStore } from '@shared/stores/objects';
import { useCables, useCables2 } from '@shared/hooks/useCables';
import ObjectCableTable2 from '@entities/objects/ObjectCableTable/ObjectCableTable2';

/**
 * Виджет кабельного журнала. Подготавливает данные для работы с кабельным журналом и виджетом карта сети
 * 
 * @param columnsAttributesIds - id атрибутов, которые нужно отобразить как столбцы
 * @param upDownAttributeId - id атрибута, отвечающего за свойство uplink
 * @param attributeIdPortName - id атрибута, указывающего на название порта
 * @param objectsWithPath - массив объектов с информацией о родительских классах
 * @param cablesPortsDevices - массив объектов, каждый из которых включает в себя информацию 
 * о кабеле, портах АБ и устройствах
 * @param paintCablesByState - окрашивать ли кабель на карте сети в цвет их состояния
 * @param 
 */
const ObjectСableTableWidget: FC<IObjectСableTableWidgetSettings> = ({ settings }) => {
    const widget = settings?.widget
    const parentObject = useObjectsStore((st) => st.store.data.find((obj) => obj.id === settings?.vtemplate?.objectId))
    const { objectsWithPath, cablesPortsDevices } = useCables(parentObject, widget)


    // const DEVICES_CLASS_IDS = [
    //     10090, 10088, 10084, 10085, 10086
    // ]

    const { objectsWithPath1, linkedDevices } = useCables2({ parentObject: parentObject, 
        devicesClassIds: widget.devicesClasses,
        portClassesIds: widget.portClasses,
        cableClassesIds: widget.cableClasses,
        widget
    })

    return (
        <div style={{ overflowY: 'auto' }} >
            <ObjectCableTable2
                paintCablesByState={widget?.paintCablesByState}
                columnsAttributesIds={widget?.columnsAttributesIds}
                upDownAttributeId={widget?.upDownAttributeId}
                attributeIdPortName={widget?.attributeIdPortName}
                objectsWithPath={widget.cableClasses ? objectsWithPath : objectsWithPath1}
                cablesPortsDevices={linkedDevices?.length !== 0 ?  linkedDevices : cablesPortsDevices}
                parentObject={parentObject}
                portClasses={widget?.portClasses}
                devicesClasses={widget?.devicesClasses}
                {...widget}
            />
        </div>
    )
}

export default ObjectСableTableWidget