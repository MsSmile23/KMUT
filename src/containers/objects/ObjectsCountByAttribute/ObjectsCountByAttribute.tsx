import { useGetObjects } from '@shared/hooks/useGetObjects'
import { objectsStore, selectObjects } from '@shared/stores/objects'
import { ECTableWithProgressBar } from '@shared/ui/ECUIKit/tables/ECTableWithProgressBar'
import { PieChartWrapper } from '@shared/ui/charts/highcharts/wrappers'

import { getObjectAttributeProps } from '@shared/utils/objects'
import { Col, } from 'antd'
import { FC, useEffect, useState } from 'react'

interface ISortField {
    sort: 'id' | 'count' | 'value'
    order: 'asc' | 'desc'
}
export interface IObjectsCountByAttribute {
    criteria: {
        mnemo: 'attribute' | 'relation' | 'class'
        value: any
    }
    filters?: {
        mnemo: 'class_id'
        value: any[] | number
    }
    sort?: ISortField
    viewType: 'progressBar' | 'pieChart'
    height?: string
    title?: string
}
const ObjectsCountByAttribute: FC<IObjectsCountByAttribute> = ({
    sort = { sort: 'count', order: 'desc' },
    filters,
    criteria,
    viewType,
    height,
    title,
}) => {
    const [dataForWidget, setDataForWidget] = useState<any[]>([])
    const objects = useGetObjects()
    
    useEffect(() => {
  
        if (filters.mnemo == 'class_id') {

            const filteredClasses = Array.isArray(filters.value) ? filters.value : [filters.value]
            const classObjects = objects.filter((obj) => filteredClasses.includes(obj.class_id))

            let data: any[] = []

            if (criteria.mnemo == 'attribute') {
                data = classObjects.reduce(function(result, currentObj) {
                    currentObj?.object_attributes.forEach((attr) => {
                        if (attr.attribute_id == criteria.value) {
                            const checker = result.find((item) => item.value == attr.attribute_value)

                            if (checker == undefined) {
                                result.push({ value: attr.attribute_value, count: 1, id: attr?.id })
                            } else {
                                const resultIndex = result.findIndex((x) => x.value == attr.attribute_value)

                                result[resultIndex].count = result[resultIndex].count + 1
                            }
                        }
                    })

                    return result
                }, [])
            }

            if (criteria.mnemo == 'relation') {
                data = classObjects.reduce(function(result, currentObj) {
                    currentObj?.links_where_left.forEach((link) => {
                        if (link.relation_id == criteria.value) {
                            const rightObject = objects.find((item) => item.id == link.right_object_id)

                            const checker = result.find((item) => item.id == rightObject.id)

                            const icon = rightObject.object_attributes.find(
                                (item) => item.attribute?.view_type_id == 17 && item.attribute?.data_type_id == 3
                            )?.attribute_value

                            if (checker == undefined) {
                                result.push({
                                    value: getObjectAttributeProps(rightObject).values,
                                    count: 1,
                                    id: rightObject?.id,
                                    icon: icon,
                                })
                            } else {
                                const resultIndex = result.findIndex((x) => x.id == rightObject.id)

                                result[resultIndex].count = result[resultIndex].count + 1
                            }
                        }
                    })

                    return result
                }, [])
            }

            if (criteria.mnemo == 'class') {
                const classes =
                        criteria.value?.length > 0
                            ? classObjects.filter((item) => criteria.value?.includes(item.class_id))
                            : classObjects

                data = classes.reduce(function(result, currentObj) {
                    const checker = result.find((item) => item.value == currentObj.class.name)

                    if (checker == undefined) {
                        result.push({
                            value: currentObj.class.name,
                            count: 1,
                            id: currentObj.id,
                            icon: currentObj.class.icon,
                        })
                    } else {
                        const resultIndex = result.findIndex((x) => x.value == currentObj.class.name)

                        result[resultIndex].count = result[resultIndex].count + 1
                    }

                    return result
                }, [])
            }
            let filteredData: any[] = []

            switch (sort.sort) {
                case 'id':
                    filteredData = data.sort(
                        (a, b) => (sort.order == 'desc' ? b.id : a.id) - (sort.order == 'desc' ? a.id : b.id)
                    )
                    break
                case 'count':
                    filteredData = data.sort(
                        (a, b) =>
                            (sort.order == 'desc' ? b.count : a.count) - (sort.order == 'desc' ? a.count : b.count)
                    )
                    break
                case 'value':
                    filteredData = data.sort(function(a, b) {
                        const first = sort.order == 'desc' ? a.value?.toLowerCase() : b.value?.toLowerCase()

                        const second = sort.order == 'desc' ? b.value?.toLowerCase() : a.value?.toLowerCase()

                        if (first < second) {
                            return -1
                        }

                        if (first > second) {
                            return 1
                        }
                    })
                    break
            }
            setDataForWidget(filteredData)
        }
    

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [criteria, filters])

    return (
        <Col span={24} style={{ textAlign: 'center' }}>
            {/* {title && (
                <Typography.Text strong style={{ textAlign: 'center', margin: '0 auto', marginBottom: '20px' }}>
                    {title}
                </Typography.Text>
            )} */}
            <Col /* style={{ marginTop: '25px' }} */>
                {viewType == 'progressBar' && <ECTableWithProgressBar data={dataForWidget} height={height} />}


                {viewType == 'pieChart' && (
                    <PieChartWrapper
                        data={dataForWidget}
                        title={title}
                        height={height}
                    />
                )}

            </Col>
        </Col>
    )
}

export default ObjectsCountByAttribute