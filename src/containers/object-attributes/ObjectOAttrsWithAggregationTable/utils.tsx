import AttributeHistoryChartContainer from '@containers/objects/AttributeHistoryChartContainer'
// import { ObjectOAttrStateWithAggregation } from '../ObjectOAttrStateWithAggregation/ObjectOAttrStateWithAggregation'
// import { Row } from 'antd'
import { IOAWithAggregation, IObjectOAttrsWithAggregationTableProps } from './ObjectOAttrsWithAggregationTable'
import { IEditTableProps } from '@shared/ui/tables/ECTable2/EditTable/types'
import { getPriorityState, getStateViewParamsWithDefault } from '@shared/utils/states'
import { StateLabel } from '@entities/states'
// import { OAButtonInfo } from '@features/objects/OAButtonInfo/OAButtonInfo'
// import { Space } from 'antd'
// import { IAttr } from '@containers/attributes/ObjectOAttrsWithHistory/ObjectOAttrsWithHistory'
import { IObjectAttribute } from '@shared/types/objects'
import { LinkedObjectAttributesButton } from './LinkedObjectAttributesButton'

export const getRows = ({
    aggrValues, 
    aggregations, 
    columns,
    // period,
    oattributes,
}: {
    aggrValues: IOAWithAggregation, 
    aggregations: IObjectOAttrsWithAggregationTableProps['aggregations'], 
    columns: IEditTableProps['columns'],
    period: IObjectOAttrsWithAggregationTableProps['period']
    oattributes?: IObjectAttribute[],
    modalIsOpen?: boolean
    toggleModal?: () => void
}): IEditTableProps['rows'] => {
    const rows = Object.values(aggrValues).reduce((acc, value) => {
        // Проверяем есть ли единицы измерения
        const unit = value.aggr.unit !== null ? value.aggr.unit : ''
        const state = value.objAttr 
            ? getPriorityState('object_attributes', [value.objAttr]) 
            : null

        // Если помимо текущего переданы другие значения агрегации
        if (aggregations.filter(a => a !== 'current').length > 0)  {
            // Собираем столбцы с агрегированными значениями
            const cols = columns.reduce((newCols, col) => {
                switch (col.dataIndex) {
                    case 'currentId': {
                        newCols[col.dataIndex] = value.objAttr.id
                        break
                    }
                    case 'name': {
                        newCols[col.dataIndex] = value.objAttr.attribute.name
                        break
                    }
                    case 'status': {
                        newCols[col.dataIndex] = (
                            <StateLabel
                                state={state}
                                title={value.objAttr.attribute.name}
                                wrapperStyles={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    gap: 5,
                                    width: '100%',
                                    // ...customStyle
                                }}
                                maxWidth={true}
                            >
                                <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                    {getStateViewParamsWithDefault(state).name}
                                </span>
                            </StateLabel>
                        )
                        /* newCols[col.dataIndex] = (
                            <Row>
                                <ObjectOAttrStateWithAggregation 
                                    objectAttribute={value.objAttr}  
                                    aggrValues={value.aggr}
                                    value={{
                                        period: period
                                    }}
                                    maxWidth 
                                />
                            </Row>
                        ) */
                        break
                    }
                    case 'chart': {
                        newCols[col.dataIndex] = (
                            <div key={value.objAttr.id}>
                                <LinkedObjectAttributesButton oattributes={[value.objAttr]} />
                                <AttributeHistoryChartContainer 
                                    ids={[value.objAttr].map(it => ({
                                        id: it.id,
                                        oa: value.objAttr,
                                        sort_order: value.objAttr?.attribute?.sort_order,
                                        viewTypeId: value.objAttr.attribute.view_type_id,
                                        viewType: 'chart'
                                    }))} 
                                    singleChart={true}
                                />  
                            </div>
                        )
                        break
                    }
                    case 'linkedObject': {
                        newCols[col.dataIndex] = <LinkedObjectAttributesButton oattributes={oattributes} />
                        break
                    }
                    case 'statusName': {
                        newCols[col.dataIndex] = getStateViewParamsWithDefault(state).name
                        break
                    }
                    default: {
                        // Если нет агрегированного значения, то не ставим в конце единицу измерения
                        newCols[col.dataIndex] = value.aggr[col.dataIndex] !== 'Нет значения' 
                            ? `${value.aggr[col.dataIndex]} ${unit}`
                            : ''
                        break
                    }
                }
            
                return newCols
            }, {})

            acc.push({
                key: `row #${value.objAttr.id}`,
                id: value.objAttr.id,
                ...cols
            })
        // Если из агрегированных значений передано только текущее
        } else {
            acc.push({
                key: `row #${value.objAttr.id}`,
                id: value.objAttr.id,
                currentId: value.objAttr.id,
                name: value.objAttr.attribute.name,
                statusName: getStateViewParamsWithDefault(state).name,
                status: (
                    <StateLabel
                        state={state}
                        title={value.objAttr.attribute.name}
                        wrapperStyles={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            gap: 5,
                            width: '100%',
                            // ...customStyle
                        }}
                        maxWidth={true}
                    >
                        <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                            {getStateViewParamsWithDefault(state).name}
                        </span>
                    </StateLabel>
                ),
                /* status: (
                    <Row>
                        <ObjectOAttrStateWithAggregation 
                            objectAttribute={value.objAttr}
                            aggrValues={value.aggr}
                            value={{
                                period: period
                            }}
                            maxWidth
                            showOnlyState
                        />
                    </Row>
                ), */
                chart: (
                    <div
                        key={value.objAttr.id}
                    >
                        <AttributeHistoryChartContainer 
                            ids={[value.objAttr].map(it => ({
                                id: it.id,
                                oa: value.objAttr,
                                sort_order: value.objAttr?.attribute?.sort_order,
                                viewTypeId: value.objAttr.attribute.view_type_id,
                                viewType: 'chart'
                            }))} 
                            singleChart={true}
                        />  
                    </div>
                ),
                linkedObject: <LinkedObjectAttributesButton oattributes={[value.objAttr]} />,
                current: value.aggr.current === 'Нет значения' 
                    ? '' 
                    : `${value.aggr.current} ${unit}`,
                // current: value.objAttr.attribute_value,
                max: 'Нет значения',
                min: 'Нет значения',
                average: 'Нет значения',
            })
        }

        return acc
    }, [])

    return rows
}

const columnLabels = {
    currentId: 'id',
    name: 'Название',
    status: 'Статус',
    current: 'Текущее',
    max: 'Максимальное',
    min: 'Минимальное',
    average: 'Среднее',
    chart: 'График',
    linkedObject: 'Связанный объект',
}

// Формирование колонок таблицы с учётом пришедших сверху значений агрегации
type TMetricTableColumn = 
    'currentId' | 'objectName' | 'name' | 'status' | 'current' | 'max' | 'min' | 'average' | 'chart'
export const getColumns = (
    aggregations: IObjectOAttrsWithAggregationTableProps['aggregations'],
    availColumns: TMetricTableColumn[] = 
    ['currentId', 'objectName', 'name', 'status', 'current', 'max', 'min', 'average', 'chart']
) => {
    const columnsAll = [
        {
            title: columnLabels['currentId'],
            dataIndex: 'currentId',
            width: 50,
            key: 'currentId',
            visible: true,
        },
        {
            title: 'Объект',
            dataIndex: 'objectName',
            order: 20,
            width: 200,
            key: 'objectName',
            visible: true,
        },
        {
            title: 'Название',
            dataIndex: 'name',
            order: 30,
            width: 200,
            key: 'name',
            visible: true,
        },
        {
            title: columnLabels['status'],
            dataIndex: 'status',
            order: 40,
            width: 100,
            key: 'status',
            valueIndex: {
                print: 'statusName',
                sort: 'statusName',
                filter: 'statusName'
            },
            visible: true,
        },
        ...aggregations.map((aggr, idx) => {
            return {
                title: columnLabels[aggr],
                dataIndex: aggr,
                order: 3 + idx + 1,
                width: 170,
                key: aggr,
                visible: true,
            }
        }),
        {
            title: columnLabels['chart'],
            dataIndex: 'chart',
            order: 3 + aggregations.length + 1,
            width: 120,
            key: 'chart',
            visible: true,
        },
        {
            title: columnLabels.linkedObject,
            dataIndex: 'linkedObject',
            order: 3 + aggregations.length + 1,
            width: 120,
            key: 'linkedObject',
            visible: true,
        },
    ]

    const columns = columnsAll.filter(col => availColumns.includes(col.key as TMetricTableColumn))

    return columns.map( (column, index) => ({ ...column, order: index }))
}