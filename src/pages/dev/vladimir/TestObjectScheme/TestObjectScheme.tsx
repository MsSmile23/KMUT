import { useClassesStore, selectClasses } from '@shared/stores/classes';
import { selectObject, useObjectsStore } from '@shared/stores/objects'
import { selectRelations, useRelationsStore } from '@shared/stores/relations';
import { findChildsByBaseClasses } from '@shared/utils/classes';
import { findChildObjectsWithPaths } from '@shared/utils/objects';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { FC } from 'react';
import networkgraph from 'highcharts/modules/networkgraph'
networkgraph(Highcharts);

export const TestObjectScheme: FC = () => {
    const getObj = useObjectsStore(selectObject)
    const forum = getObj(11081)
    const relations = useRelationsStore(selectRelations)
    const classes = useClassesStore(selectClasses)?.map(cls => cls.id)
    const childClassIds = findChildsByBaseClasses({
        relations,
        classIds: [10107],
        package_area: 'SUBJECT',
    }) as number[]
    const visibleClasses = []
    const intermediateClasses = []
    const [height, width] = [3000, 5000]
    const childrenObjectsOfTrackedObject = findChildObjectsWithPaths({
        childClassIds,
        targetClassIds: classes,
        currentObj: forum,
        visibleClasses,
        intermediateClasses,
        onlyUnique: false,
        id: 1
    }).objectsWithPath
    console.log('childrenObjectsOfTrackedObject', childrenObjectsOfTrackedObject)
    const childrenPairs = childrenObjectsOfTrackedObject
        .reduce((acc, child) => {
            if (child.paths.allArr.length > 1) {
                
                child.paths.allArr.forEach((item, idx) => {
                    if (idx < child.paths.allArr.length - 1) {
                        const from = item
                        const to = child.paths.allArr[idx + 1]
                        const name = from.id + '->' + to.id
                        if (!acc[name]) {
                            acc[name] = {
                                node: {
                                    id: from.id,
                                    name: from.name
                                },
                                from: from.id,
                                to: to.id,
                            }
                        }
                    } else {
                        const from = child.paths.allArr[idx - 1]
                        const to = item
                        const name = from.id + '->' + to.id
                        if (!acc[name]) {
                            acc[name] = {
                                node: {
                                    id: from.id,
                                    name: from.name
                                },
                                from: from.id,
                                to: to.id,
                            }
                        }
                    }
                })
            } else {
                const from = child.paths.allArr[0]
                const to = child.paths.allArr[0]
                const name = from.id + '->' + to.id
                if (!acc[name]) {
                    acc[name] = {
                        node: {
                            id: from.id,
                            name: from.name
                        },
                        from: from.id,
                        to: to.id,
                    }
                }
            }

            return acc
        }, {})
        // .reduce((acc, child) => {
        //     const pairs = child.paths.allArr.reduce((accChild, item, idx) => {
        //         if (idx < child.paths.allArr.length - 1) {
        //             accChild.push([item, child.paths.allArr[idx + 1]])
        //         }
                
        //         return accChild
        //     }, [])
        //     acc.concat(pairs)

        //     return [...acc, ...pairs]
        // }, [])
    
    const chartOptions: Highcharts.Options = {
        chart: {
            type: 'networkgraph',
            plotBorderWidth: 0,
            height: height,
            width: width,
        },
        title: {
            text: '',
        },
        subtitle: {
            text: ''
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            networkgraph: {
                layoutAlgorithm: {
                    enableSimulation: false,
                },
                keys: ['from', 'to'],
            },
        },
        series: [{
            type: 'networkgraph',
            draggable: false,
            dataLabels: {
                enabled: true,
            },
            nodes: Object.values(childrenPairs).map(it => it?.node),
            data: Object.values(childrenPairs).map(it => ({ from: it.from, to: it.to })), 
        }]
    }

    // console.log('children', childrenObjectsOfTrackedObject.map(child => child.paths.allArr))
    // console.log('childrenPairs', childrenPairs)
    return (
        <div style={{ height: height, width: width, overflow: 'auto' }}>
            Test
            <HighchartsReact
                highcharts={Highcharts}
                options={chartOptions}
                style={{ height: height, width: width, overflow: 'auto' }}
            />
        </div>
    )
}