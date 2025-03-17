import { objectsStore, selectFindObject, selectObjects, useObjectsStore } from '@shared/stores/objects'
import { IObject } from '@shared/types/objects'
import { ButtonLook } from '@shared/ui/buttons'
import {
    findChildObjectsByBaseClasses,
    getObjectName2,
    findParentsByBaseClasses
} from '@shared/utils/objects'
import { getRelationProps } from '@shared/utils/relations'
import { Button, Col, TableProps } from 'antd'
import { FC, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { IClass } from '@shared/types/classes';
import { useStatesStore } from '@shared/stores/states'
import { useStateEntitiesStore } from '@shared/stores/state-entities'
import { StateLabel } from '@entities/states/StateLabels'
import { EditTable } from '@shared/ui/tables/ECTable2/EditTable/EditTable'
import { selectClasses, useClassesStore } from '@shared/stores/classes';
import { OAView } from '@entities/objects/OAView/OAView';
import { ILink } from '@shared/types/links'
import { uniqBy } from 'lodash'
import { ECTooltip } from '@shared/ui/tooltips'
import { useAttributesStore } from '@shared/stores/attributes'
import { convertAttributeValue } from '@shared/utils/attributes'
import { ButtonShowObject } from '@shared/ui/buttons/ButtonShowObject/ButtonShowObject'
import { getURL } from '@shared/utils/nav'
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { IEditTableFilterSettings } from '@shared/ui/tables/ECTable2/EditTable/types'
import { useGetObjects } from '@shared/hooks/useGetObjects'

export interface IObjectAdvancedTableWidget extends TableProps<any> {
    classesIds: IClass['id'][] //Классы объекты которых надо отобразить
    columns: any[]
    parentObject?: IObject, //Родительский объект
    childClsIds?: IClass['id'][] //Классы вспомогательные, которые отображать не надо
    relationIds?: number[]
    height?: number
    compact?: boolean
    actions?: boolean
    parentClasses: { id: number, showObjectProps?: string[], attributeIds?: number[] } []
    statusColumn?: string
    classColumn?: string
    tableId?: string
    enableShowObjectModal?: boolean
    hiddenColumns?: { classes?: number[], attributes?: number[] }
    chosenColumns?: string[]
    hideChosenColumns?: boolean
    paginator?: any
    
}
const ObjectAdvancedTableWidget: FC<IObjectAdvancedTableWidget> = ({
    classesIds = [],
    columns,
    childClsIds,
    parentObject,
    relationIds,
    height,
    compact = true,
    pagination = false,
    actions,
    parentClasses,
    statusColumn = '',
    classColumn = 'Класс',
    tableId = 'objects-advanced-table-widget',
    enableShowObjectModal,
    hiddenColumns = { classes: [], attributes: [] },
    chosenColumns,
    hideChosenColumns,
    paginator,
    ...props
}) => {
    const states = useStatesStore(st => st.store.data)
    const stateEntities = useStateEntitiesStore(st => st.store.data)

    const classes = useClassesStore(selectClasses)
    const findObject = useObjectsStore(selectFindObject)
    const findAttribute = useAttributesStore((st) => (id: number) => st.getByIndex('id', id))
    const objects = useGetObjects()
    const objectsIds = objects.map(({ id }) => id)
    const navigate = useNavigate()
    const [finalColumns, setFinalColumns] = useState<any[]>([])
    const [rows, setRows] = useState<any[]>([])
    const [filteredColumns, setFilteredColumns] =  useState<IEditTableFilterSettings<any>[]>([])

    const [clientHeight, setClientHeight] = useState(0)
    const ref = useRef(null)

    const tooltipContent = useRef<Record<string, IObject[]>>({})
    
    useLayoutEffect(() => {
        setClientHeight(ref.current.clientHeight)
    }, [])
    const createRows = () => {
        const rows: any = []

        const oidsFilter = (parentObject)
            ? findChildObjectsByBaseClasses({
                childClassIds: childClsIds,
                targetClassIds: classesIds,
                currentObj: parentObject,
            })
            : objectsIds

        const filteredObjects: IObject[] = objects.filter((obj) => {
            return  classesIds.includes(obj.class_id)
                    && (oidsFilter === undefined || oidsFilter.includes(obj.id))
        })
        const localColumns: any[] = []

        const addColumn = (dataIndex, title, options: Record<string, any> = {}) => {
            const isColumnExist = localColumns.find((col) => col.dataIndex === dataIndex) ? true : false
            const { valueIndex = null, ...restOptions } = options

            if (!isColumnExist) {
                const data: Record<string, any> = {
                    ...restOptions,
                    key: dataIndex,
                    dataIndex: dataIndex,
                    title: title,
                    order: localColumns.length
                }

                if (valueIndex) {
                    data.valueIndex = valueIndex
                }

                localColumns.push(data)
            }

            return
        }

        filteredObjects.forEach((obj) => {
            const row: any = {
                key: `key_${obj.id}`
            }

            if (columns.includes('id')) {
                row.id = obj.id
                addColumn('id', 'ID')
            }

            if (columns.includes('object__name')) {
                row.object__name = getObjectName2(obj)
                addColumn('object__name', 'Наименование')
            }

            if (columns.includes('status__column')) {
                const stateId = stateEntities?.objects?.find((se) => se.entity === obj.id)?.state
                const state = states.find(({ id }) => id === stateId)
                
                const title = state?.view_params?.name || 'Не определено'

                row.status__column = (
                    <StateLabel 
                        state={state} 
                        stateId={stateId} 
                        wrapperStyles={{ width: '100%', textAlign: 'center' }}
                        maxWidth
                    >
                        {title}
                    </StateLabel>
                )

                addColumn('status__column', statusColumn || 'Состояние', {
                    valueIndex: {
                        print: 'statusColumnPrint',
                        sort: 'statusColumnSort',
                        filter: 'statusColumnFilter'
                    }
                })

                row.statusColumnSort = title
                row.statusColumnFilter = title
                row.statusColumnPrint = title
            }

            if (columns.includes('class__column')) {
                row.class__column = obj?.class?.name
                addColumn('class__column', classColumn, {
                    filterType: 'select',
                    filterSelectOptions: uniqBy(filteredObjects.map((obj) => ({
                        value: obj.class_id,
                        label: obj?.class?.name
                    })), 'value'),
                    filterValueKey: 'className'
                })
            }

            obj.object_attributes?.forEach((attr) => {
                if (columns.includes(attr.attribute_id)) {
                    const dataIndex = `attr_${attr?.attribute_id}`

                    addColumn(dataIndex, attr.attribute.name)
                    row[dataIndex] = attr.attribute_value
                }

                const historyKey = `historyDb_${attr.attribute_id}`

                if (columns.includes(historyKey)) {
                    row[historyKey] = convertAttributeValue(attr.attribute, attr.attribute_value)
                }
            })

            //TODO:: вынести куда нибудь
            //Начало создания колонок родительских объектов
            const parentsObjects = findParentsByBaseClasses({
                object: obj,
                targetClasses: parentClasses.map(item => item.id),
                linkedClasses: classes.map(item => item.id),
                objects: objects
            })

            parentClasses.forEach( pCls => {
                const pObj = parentsObjects?.find(item => item?.class_id === pCls?.id)

                if (pObj) {
                    pCls?.showObjectProps?.forEach(objProp => {
                        const dataIndex = `parent_${objProp}_${pCls.id}`

                        addColumn(dataIndex, pObj.class.name)
                        row[dataIndex] = pObj.name
                    })

                    pCls?.attributeIds?.forEach(attrId => {
                        const objAttr = pObj.object_attributes.find(item => item.attribute_id === attrId)

                        if (objAttr) {
                            const dataIndex = `parent_attr_${attrId}_${pObj.class_id}`

                            addColumn(dataIndex, objAttr.attribute.name)
                            row[dataIndex] = <OAView objectAttribute={objAttr} />
                        }
                    })
                }
            })
            //Конец создания колонок родительских объектов

            const createCell = (link: ILink, side: 'left' | 'right') => {
                const key = `link_${link.relation_id}`

                if (relationIds.includes(link.relation_id)) {
                    const linkedObject = findObject(link?.[`${side}_object_id`])

                    if (row[key] == undefined) {
                        row[key] = 1

                        tooltipContent.current = {
                            ...tooltipContent.current,
                            [key]: [linkedObject]
                        }
                    } else {
                        row[key] += 1
                        
                        tooltipContent.current = {
                            ...tooltipContent.current,
                            [key]: [
                                ...(tooltipContent.current?.[key] || []),
                                linkedObject
                            ]
                        }
                    }

                    const title = getRelationProps(link.relation).name

                    localColumns.push({
                        title,
                        dataIndex: `link_${link.relation_id}`,
                        order: 2,
                        align: 'center',
                        render: (value: number) => {
                            return (
                                <ECTooltip
                                    hideByClick
                                    title={(
                                        <>
                                            {title}
                                            {tooltipContent.current?.[key]?.map((obj) => (
                                                <ButtonShowObject
                                                    key={`link-obj-${obj.id}`} 
                                                    id={obj.id} 
                                                    style={{ 
                                                        display: 'block', 
                                                        color: 'white', 
                                                        textDecoration: 'underline' 
                                                    }}
                                                    // eslint-disable-next-line max-len
                                                    to={getURL(`${ROUTES.OBJECTS}/${ROUTES_COMMON.SHOW}/${obj.id}`, 'showcase')}
                                                    type="link"
                                                >
                                                    {obj.name}
                                                </ButtonShowObject>
                                            ))}
                                        </>
                                    )}
                                    mouseEnterDelay={0.4}
                                >
                                    {value && (
                                        <Button 
                                            type="default" 
                                            style={{ width: 80 }}
                                            onClick={(ev) => ev.stopPropagation()}
                                        >
                                            {value} шт.
                                        </Button>
                                    )}
                                </ECTooltip>
                            )
                        }
                    })
                }
            }

            if (relationIds?.length > 0) {
                obj.links_where_left.forEach((leftLink) => {
                    createCell(leftLink, 'right')
                })

                obj.links_where_right.forEach((rightLink) => {
                    createCell(rightLink, 'left')                    
                })
            }

            if (actions == true) {
                row.actions =
                    <ButtonLook
                        onClick={() => {
                            navigate(getURL(
                                `${ROUTES.OBJECTS}/${ROUTES_COMMON.SHOW}/${obj.id}`, 
                                'showcase'
                            ))
                            // navigate(`/objects/show/${obj.id}`)
                        }}
                    />
            }
            rows.push(row)
        })

        const ids = localColumns.map(({ title }) => title)
        const filteredColumns = localColumns.filter(({ title }, index) => !ids.includes(title, index + 1))

        if (actions !== undefined) {
            filteredColumns.push({
                title: '',
                dataIndex: 'actions',
                order: 4,
                width: '10%'

            })
        }

        const historyDbColumns = columns.filter((col) => `${col}`.includes('history')).map((key) => {
            return {
                key,
                dataIndex: key,
                title: findAttribute(key.split('_')[1])?.name
            }
        })

        const cols = columns
            .map((mnemo) => filteredColumns.find((col) => {
                return col?.dataIndex === mnemo || col?.dataIndex?.includes(mnemo)
            }))
            .concat(...filteredColumns.filter((col) => col?.dataIndex.includes('link')))
            .concat(...historyDbColumns)
            .filter(Boolean)
            .filter((col) => {
                const isKey = (value: string | number) => col?.key?.includes(`${value}`)

                if (hiddenColumns?.classes && isKey('parent')) {
                    return !hiddenColumns?.classes?.some((id) => isKey(id))
                }

                if (hiddenColumns?.attributes && isKey('attr') || isKey('historyDb')) {
                    return !hiddenColumns?.attributes?.some((id) => isKey(id))
                }

                return true
            })

        setRows(rows)
        setFinalColumns(cols)
    }

    useEffect(() => {
        createRows()
    }, [objects, classesIds, relationIds, columns])


    useEffect(() => {
        if (chosenColumns) {
            const localFinalColumns = hideChosenColumns 
                ? finalColumns.filter(cl => chosenColumns.includes(cl.dataIndex) == false) 
                : finalColumns.filter(cl => chosenColumns.includes(cl.dataIndex))
            
            setFilteredColumns(localFinalColumns)
        }
        else {
            setFilteredColumns(finalColumns)
        }
    }, [chosenColumns, finalColumns])

    return (
        <Col
            ref={ref}
            span={24}
            style={
                height
                    ? {
                        padding: '5px',
                        height: `${height}px`,
                        overflowY: clientHeight > Number(height) ? 'scroll' : 'auto',
                        overflowX: clientHeight > Number(height) ? 'clip' : 'auto',
                        textAlign: 'center',
                    }
                    : { padding: '5px', textAlign: 'center', overflowY: 'auto' }
            }
        >
            <EditTable
                tableId={tableId}
                rows={rows}
                columns={filteredColumns.map((col) => ({ ...col, key: col?.dataIndex }))}
                size={compact ? 'small' : 'middle'}
                enableShowObjectModal={enableShowObjectModal}
                // pagination={{ position: ['bottomRight'], pageSize: 10  }}
                //scroll={{ x: 2000 }}
                paginator={paginator}
                // paginator={{ page: 1, pageSize: 10, enablePageSelector: false }}
                {...props}
            />
        </Col>
    )
}

export default ObjectAdvancedTableWidget