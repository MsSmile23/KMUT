import ObjectCardModal from '@features/objects/ObjectCardModal/ObjectCardModal';
import { useObjectsStore } from '@shared/stores/objects';
import { selectStateStereotypes, useStateStereotypesStore } from '@shared/stores/statesStereotypes';
import { HorizontalBarChart } from '@shared/ui/charts/highcharts/HorizontalBarChart/HorizontalBarChart';
import { findChildObjectsWithPaths } from '@shared/utils/objects';
import { getStateStereotypeFromEntity } from '@shared/utils/states';
import { Empty } from 'antd';
import { FC, useEffect, useState } from 'react';

export interface IObjectLinkedGroupedStatesProps {
    objectId: number
    classesIds: {
        parents: number[]
        nodes: number[],
        leafs: number[]
    }
    height?: number
    yAxisStep?: number
}

const clickLabel = (fn: (arg?: any) => void) => {
    return function() {
        const axis = this.xAxis[0] 
        const ticks = axis.ticks
        const points = this?.series?.[0]?.points ?? []

        points?.forEach((point: any, i: string | number) => {
            if (ticks?.[i]) {
                const label = ticks[i]?.label?.element
          
                label.onclick = () => {
                    fn(point?.index)
                }
            }
        
        })
    }
}

/**
 * Виджет - Здоровье сервисов
 * 
 * График горизонтальных баров стеком. Каждый бар отображает состояние Сервиса Здания и разделён на секции, 
 * каждая секции показывает кол-во оборудования в данном цветом статусе (state).
 * 
 * @param objectId - id объекта
 * @param classesIds.parents - массив id классов для фильтрации родительских классов (например, услуги здания)
 * @param classesIds.nodes - массив id родительских классов (например, сервисы здания)
 * @param classesIds.leafs - массив id дочерних классов (например, оборудование сервисов)
 * @returns 
 */
export const ObjectLinkedGroupedStates: FC<IObjectLinkedGroupedStatesProps> = ({
    objectId,
    classesIds,
    height,
    yAxisStep
}) => {
    const [ barIndex, setBarIndex ] = useState<number | undefined>(undefined)

    const object = useObjectsStore((st) => st.store.data.find((obj) => obj.id === objectId))

    const { objectsWithPath } = findChildObjectsWithPaths({
        currentObj: object,
        childClassIds: [...(classesIds?.parents || []), ...(classesIds?.nodes || [])],
        targetClassIds: [...(classesIds?.leafs || []), ...(classesIds?.nodes || [])],
        onlyUnique: false
    })

    const nodes = objectsWithPath.filter((obj) => classesIds?.nodes.includes(obj?.classId))

    const leafsByNodes = nodes.map((node) => ({
        ...node,
        leafs: objectsWithPath.filter((obj) => obj.paths.parentsStr.includes(`${node?.id}`))
    }))

    const stateStereoTypes = useStateStereotypesStore(selectStateStereotypes)
    const leafsByNodesWithStates = leafsByNodes.map((node) => {
        return {
            name: node?.name,
            leafsStates: node?.leafs?.map((leaf) => {
                return getStateStereotypeFromEntity(leaf.id, 'objects')
            }).filter(item => item !== undefined)
        }
    })

    const leafsStateIds = [...new Set(
        leafsByNodesWithStates.map((leaf) => leaf.leafsStates.map((state) => state?.id)).flat()
    ).values()]
    
    const colors = leafsStateIds.map((id) => {
        return {
            id,
            value: stateStereoTypes.find((st) => {
                return st.id === id
            })?.view_params?.params.find((p) => p.type === 'fill')?.value
        }
    }).filter(Boolean)

    const chartData = colors.map((color) => {
        const stateStereotype = stateStereoTypes.find((st) => st.id === color.id)
        const data = leafsByNodesWithStates.map((node) => {
            return node.leafsStates.filter((leafState) => leafState.id === stateStereotype.id).length
        })

        return { data, name: stateStereotype?.view_params?.name }
    })

    const [customOptions, setCustomOptions] = useState<Highcharts.Options>({
        colors: colors.map((color) => color.value),
        chart: {
            type: 'bar',
            height: height,
            zooming: {
                mouseWheel: {
                    enabled: false
                }
            },
            events: {
                load: function() {
                    clickLabel(setBarIndex).call(this)
                },
                render: function() {
                    clickLabel(setBarIndex).call(this)
                },
                redraw: function() {
                    clickLabel(setBarIndex).call(this)
                },
            }
        },
        xAxis: {
            endOnTick: true,
            categories: leafsByNodes.map((node) => node?.name),
            title: {
                text: ''
            },
            labels: {
                
            },
        },
    
        yAxis: {
            // tickInterval: 1,
            endOnTick: true,
            title: {
                text: ''
            }
        },
        plotOptions: {
            bar: {
                animation: false,
                pointWidth: 12,
                events: {
                    click: (ev) => setBarIndex(ev.point.index)
                },
                pointPadding: 0,
            }
        }
    })

    useEffect(() => {
        setCustomOptions(prev => ({
            ...prev,
            yAxis: {
                ...prev.yAxis,
                tickInterval: yAxisStep ?? 1
            }
        }))
    }, [
        yAxisStep
    ])

    return (
        <>
            <ObjectCardModal 
                objectId={leafsByNodes?.[barIndex]?.id} 
                modal={{ 
                    open: barIndex !== undefined, 
                    onCancel: () => setBarIndex(undefined),
                    title: leafsByNodes[barIndex]?.name
                }}
            />
            {chartData.length === 0 ? <Empty /> : (
                <HorizontalBarChart 
                    data={chartData as any[]}
                    customOptions={customOptions} 
                />
            )}
        </>
    )
}