import { FC, useEffect, useMemo, useState } from 'react';
import { useObjectsStore } from '@shared/stores/objects';
import { selectStates, useStatesStore } from '@shared/stores/states';
import { selectStateEntities, useStateEntitiesStore } from '@shared/stores/state-entities';
import { useAttributesStore } from '@shared/stores/attributes';
import { StateLabel } from '@entities/states';
import {
    ObjectOAttrStateWithAggregation
} from '@containers/object-attributes/ObjectOAttrStateWithAggregation/ObjectOAttrStateWithAggregation';
import { EditTable } from '@shared/ui/tables/ECTable2/EditTable/EditTable';
import { IEditTableFilterSettings } from '@shared/ui/tables/ECTable2/EditTable/types';
import { IObjectAttribute } from '@shared/types/objects';
import { ECUtils } from '@shared/utils';
import { objectWithOAStatesData } from '@entities/objects/ObjectsWithOAStates/objectWithOAStatesData';

interface IObjectsWithOAStates {
    objectIds: number[]
    metricAttrIds: number[]
    height?: number,
}

const ObjectsWithOAStates: FC<IObjectsWithOAStates> = ({
    objectIds,
    metricAttrIds,
    height,
}) => {
    const states = useStatesStore(selectStates)
    const attributesStore = useAttributesStore()
    const objectStore = useObjectsStore()
    const stateEntitiesStore = useStateEntitiesStore()
    const stateEntities = useStateEntitiesStore(selectStateEntities)

    //Формируем колонки - две колонки объекта (название и статус) + колонки атрибутов
    const columns: IEditTableFilterSettings[] = useMemo( () => {
        return objectWithOAStatesData.columns.concat(
            //Проходим по атрибутам, формируем колонки
            metricAttrIds.map((attribute_id) => {
                const attribute = attributesStore.getByIndex('id', attribute_id)
                //Основной ключ для компоненты вывода в ячейке
                const stateKey = `a_${attribute_id}_state`
                //Ключ для значения под распечатку
                const nameValueKey = `a_${attribute_id}_state_name_value`
                //Ключ для значения под сортировку и фильтры
                const valueKey = `a_${attribute_id}_state_value`

                const width = 60 / metricAttrIds.length

                return ({
                    title: attribute?.name,
                    dataIndex: stateKey,
                    key: stateKey,
                    width: `${width}%`,
                    valueIndex: {
                        print: nameValueKey,
                        sort: valueKey,
                        filter: valueKey
                    },
                    disableFilter: false
                } as IEditTableFilterSettings)
            })

        )
    }, [metricAttrIds])

    const [compState, setCompState] = useState<{
        mapObjectOA: Record<IObject['id'], IObjectAttribute[]>
    }>({
        mapObjectOA: null,
    })

    const getFilteredOAs = async () => {
        const newMapObjectOA: typeof compState.mapObjectOA = {}
        let allOA: IObjectAttribute[] = []

        objectIds.map((id) => {
            newMapObjectOA[id] = [];
            const object = objectStore.getByIndex('id', id)

            allOA = allOA.concat( metricAttrIds.flatMap((attribute_id) => {
                return object.object_attributes
                    ?.filter((oa) => attribute_id === oa.attribute_id)
            }))
        })
        const filteredOA = await ECUtils.OA.getOAsForShow(allOA)

        return filteredOA.data.reduce((acc, item) => {
            acc[item.object_id].push(item)

            return acc
        }, { ...newMapObjectOA })
    }

    useEffect( () => {
        getFilteredOAs().then( (newMapObjectOA) => {
            setCompState( (prev) =>  ({
                ...prev,
                mapObjectOA: newMapObjectOA
            }))
        })
    }, [objectIds, metricAttrIds])

    //Формируем строчки таблицы - проверить что реагируют на изменения статусов
    const rows = useMemo( () => {
        return objectIds.map((id) => {
            const object = objectStore.getByIndex('id', id)
            const objectSE = stateEntities?.objects?.find(se => se.entity == object?.id)
            const objectState = states?.find(state => state.id === objectSE?.state)

            const row = {
                key: String( object.id),
                name: object.name,
                object_state:
                    <StateLabel
                        maxWidth
                        showStateName
                        state={objectState}
                        wrapperStyles={{ textAlign: 'center' }}
                    />,
                object_state_name: objectState?.name
            }

            //metricAttrIds.forEach((attribute_id) => {
            //const objectAttribute = object.object_attributes.find(oa => attribute_id === oa.attribute_id)
            //Стейты нужны для поля распечатки значений

            compState.mapObjectOA?.[id]?.forEach((objectAttribute) => {
                //Статусы нужны для поля в экспорте таблицы
                const stateEntity = stateEntitiesStore.getAttributeStateEntityById(objectAttribute.id)
                const state = states.find(state => state.id === stateEntity?.state)

                const attribute_id = objectAttribute.attribute_id
                //Основной ключ для вывода компоненты в ячейке
                const stateKey = `a_${attribute_id}_state`
                //Ключ для значения под сортировку и фильтры
                const valueKey = `a_${attribute_id}_state_value`
                //Ключ для значения под распечатку статус + значение + юнит
                const nameValueKey = `a_${attribute_id}_state_name_value`

                //Компонент для вывода в ячейке
                row[stateKey] =
                    <ObjectOAttrStateWithAggregation
                        objectAttribute={objectAttribute}
                        labelSettings={{
                            showName: false
                        }}
                        value={{
                            enabled: true,
                            aggregation: 'current',
                        }}
                        maxWidth={true}
                    />
                //Только значение для сортировки
                row[valueKey] = objectAttribute?.attribute_value
                //Статус + Значение для распечатки
                row[nameValueKey] =
                    `${state?.name} (${objectAttribute?.attribute_value} ${objectAttribute?.attribute?.unit ?? ''})`
            })

            return row
        })
    }, [compState.mapObjectOA, stateEntities, states])

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <EditTable
                tableId="table_ObjectsWithOAStates"
                columns={columns}
                rows={rows}
                rowSelection={undefined}
                paginator={null}
                pagination={false}
                customHeight={height}
            />
        </div>
    );
}

export default ObjectsWithOAStates