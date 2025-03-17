/* eslint-disable max-len */
import ObjectAdvancedTableWidget, { IObjectAdvancedTableWidget } from '@containers/objects/ObjectAdvancedTableWidget/ObjectAdvancedTableWidget'
import { useAttributesStore } from '@shared/stores/attributes'
import { useClassesStore } from '@shared/stores/classes'
import { IAttribute } from '@shared/types/attributes'
import { ECLoader } from '@shared/ui/loadings'
import { isHistoryAttr } from '@shared/utils/attributes'
import { uniqBy } from 'lodash'
import { FC, useLayoutEffect, useMemo, useState } from 'react'

interface IObjectAdvancedLinkedClassesTableProps extends Omit<IObjectAdvancedTableWidget, 'classesIds' | 'columns'> {
    parentClasses: IObjectAdvancedTableWidget['parentClasses']
    targetClasses: Partial<{
        ids: number[]
        attributeIds: number[]
        filterByAttributes: (attribute: IAttribute) => boolean
    }>
    statusColumn?: string
    classColumn?: string
    parentObjectId: number
    columnsOrder?: string[]
    relationIds?: number[]
    showHistoryAttributes?: { show: boolean, aggr?: 'current' }
    hiddenColumns?: { classes?: number[], attributes?: number[] }
    chosenColumns?: string[]
    hideChosenColumns?: boolean
    tableId?: string,
    paginator?: any
}

/**
 * Обертка таблицы вывода объектов с атрибутами для обогащения ее данными связанных классов
 * 
 * @param targetClasses.ids - целевые классы, для вывода в виде строчек таблицы
 * @param targetClasses.attributeIds - атрибуты для вывода целевых классов, если undefined - выводим все
 * @param targetClasses.filterByAttributes - колбек для фильтрования объектов по атрибутам
 * @param statusColumnEnabled - столбец состояния оборудования
 * @param parentClasses - массив с ключами родительских атрибутов для отображения в таблице и ключами для фильтрации этих атрибутов 
 * 
 * @param classesIds - Классы объекты которых надо отобразить
 * @param parentObject - Родительский объект
 * @param childClassIds - Классы вспомогательные, которые отображать не надо
 * @param columnsOrder - массив порядка отображения столбцов (числа отвечают за колонки с атрибутами)
 * 
 * @param relationsIds - массив для отображения столбцов с релейшенами
 * 
 * @param hiddenColumns - массив id атрибутов, которые требуется скрыть
 * @param chosenColumns - ключи колонок, которые необходимо выводить
 * @hideChosenColumns - маркер, который определяет, показывать или скрывать выбранные колонки
 * 
 */
export const ObjectsLinkedTable: FC<Partial<IObjectAdvancedLinkedClassesTableProps>> = ({
    targetClasses = { ids: [] },
    parentClasses = [],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    statusColumn = '',
    classColumn = '',
    childClsIds,
    compact = true,
    pagination = false,
    actions,
    columnsOrder = [],
    relationIds = [],
    showHistoryAttributes = { show: true },
    hiddenColumns = { classes: [], attributes: [] },
    chosenColumns,
    hideChosenColumns = false,
    tableId,
    paginator,
    ...props
}) => {

    const [loading, setLoading] = useState<boolean>(true)
    // находим классы указанный target classes ids
    const targetClassesFullInfo = useClassesStore((st) => st.store.data.filter(({ id }) => {
        return (targetClasses.ids || []).includes(id)
    }))

    // находим дополнительные ключи атрибутов (на основании родительских классов)
    const parentsAttributes = useClassesStore((st) => parentClasses.map((parentCls) => {
        return st.store.data.find((cls) => cls.id === parentCls.id)?.attributes.filter((attr) => {
            return parentCls?.attributeIds ? parentCls.attributeIds.includes(attr.id) : true
        })
    })).flat().map((el) => el?.id)

    const parentColumns = [];

    parentClasses.forEach( pCls => {
        pCls?.showObjectProps?.forEach( objProp => {
            parentColumns.push(`parent_${objProp}_${pCls.id}`)
        })
    })

    const historyDbColumns = useAttributesStore((st) => showHistoryAttributes.show
        ? st.store.data.filter((attr) => {
            return attr.classes.map(({ id }) => id).find((id) => [
                ...targetClasses.ids,
                ...parentClasses.map(({ id }) => id)
            ].includes(id)) && isHistoryAttr(attr)
        }).map((attr) => `historyDb_${attr.id}`)
        : []
    )
    
    // ищем атрибуты, которые будут отображаются в столбцах
    let targetClassesColumnAttributes = uniqBy(targetClassesFullInfo.map((cls) => cls.attributes).flat(), 'id')

    if (targetClasses?.filterByAttributes) {
        targetClassesColumnAttributes = targetClassesColumnAttributes.filter(targetClasses.filterByAttributes)
    }

    const targetClassesColumnAttributeIds = targetClassesColumnAttributes
        .filter((attr) => targetClasses?.attributeIds ? targetClasses.attributeIds.includes(attr.id) : true)
        .map(({ id }) => id)

    const columns = [
        'id', 
        'object__name',
        ...(statusColumn ? ['status__column'] : []),
        ...(classColumn ? ['class__column'] : []),
        ...targetClassesColumnAttributeIds,
        ...parentColumns,
        ...parentsAttributes,
        ...historyDbColumns,
    ]

    const orderedColumns2 = useMemo(() => columnsOrder.map((prefixId) => {
        const id = prefixId.match(/(\d+)/)?.[0]

        // смотрим префиксы для targetClassesColumnAttributeIds
        if (prefixId.includes('target_attr') && id) {
            return Number(id)
        }

        // смотрим префиксы для parentColumns
        if (prefixId.includes('parent_class') && id) {
            return parentColumns.find((col) => col.includes(id))
        }

        return prefixId
    }), [columnsOrder, parentColumns])

    const allColumns = orderedColumns2.concat(...columns.filter((col) => !orderedColumns2.includes(col)))

    const orderedColumns = columnsOrder?.length > 0 ? allColumns : columns


    useLayoutEffect(() => {
        setTimeout(() => setLoading(false), 100)
    }, [])

    return (
        <>
            {loading && <ECLoader size="large" /> }

            {!loading &&     
                <ObjectAdvancedTableWidget
                    relationIds={relationIds} 
                    parentClasses={parentClasses} 
                    columns={orderedColumns}
                    classesIds={targetClasses.ids}
                    childClsIds={childClsIds}
                    compact={compact}
                    pagination={pagination}
                    actions={actions}
                    statusColumn={statusColumn}
                    classColumn={classColumn}
                    enableShowObjectModal
                    hiddenColumns={hiddenColumns}
                    chosenColumns={chosenColumns}
                    hideChosenColumns={hideChosenColumns}
                    tableId={tableId}
                    paginator={paginator}
                    {...props}
                />}

        </>
    )
}