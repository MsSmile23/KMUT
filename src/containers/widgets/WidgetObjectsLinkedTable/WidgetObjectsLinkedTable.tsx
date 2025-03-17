import { FC, useEffect, useState } from 'react'
import { IWidgetObjectsLinkedTableSettings } from './types'
import { useObjectsStore } from '@shared/stores/objects'
import { useRelationsStore } from '@shared/stores/relations'
import { ObjectsLinkedTable } from '@entities/objects/ObjectsLinkedTable/ObjectsLinkedTable'
import { widgetPropsAdapters } from '@shared/ui/charts/highcharts/widgetPropsAdapters'
import { useTheme } from '@shared/hooks/useTheme'
import { DEFAULT_TABLE_ROW_COUNT } from '@shared/config/table.config'

/**
 * Виджет таблицы связанного оборудования
 * 
 * @param scrollX - ширина таблицы (по умолчанию 2000)
 * @param parentObject - родительский объект (может быть id)
 * @param settings.widget.targetClasses.ids - массив целевых классов
 * @param settings.widget.targetClasses.attributeIds - массив атрибутов целевых классов
 * @param settings.widget.statusColumn - название столбца состояния оборудования
 * @param settings.widget.childClassesIds - массив дочерних классов
 * @param settings.widget.relationIds - массив отношений (по умолчанию выбраны все)
 * @param settings.widget.tableRowCount - количество строк на одной странице таблицы
 */



const WidgetObjectsLinkedTable: FC<IWidgetObjectsLinkedTableSettings> = ({
    settings: { widget, vtemplate: { objectId } }, parentObject, scrollX
}) => {
    const findObject = useObjectsStore((st) => st.getByIndex)
    const mainObject = findObject('id', objectId) ?? (typeof parentObject === 'number'
        ? findObject('id', parentObject)
        : parentObject
    )

    const theme = useTheme()

    const getRowPerPage = () => {
        if (widget?.tableRowCount) {
            return widget?.tableRowCount
        }

        if (theme?.table?.tableRowCount) {
            return theme?.table?.tableRowCount
        }
        
        return DEFAULT_TABLE_ROW_COUNT
    }

    const paginator = {
        page: 1,
        pageSize: getRowPerPage(),
        enablePageSelector: true
    }


    const relationIds = useRelationsStore((st) => !widget?.relationIds
        ? st.store.data.map((rel) => rel.id)
        : (widget.relationIds.length === 0 ? st.store.data.map((rel) => rel.id) : widget.relationIds)
    )

    const parentClassesFull = widget?.parentClasses?.map((pcl) => ({ ...pcl, showObjectProps: ['name'] }))
    //*Массив датаиндексов для скрытия/показов определенных колонок
    const [dataIndexArray, setDataIndexArray] = useState<string[]>(undefined)

    useEffect(() => {
        if (widget.chosenDataIndex) {
            const array = widget.chosenDataIndex.split(',')

            setDataIndexArray(array)
        }
    }, [widget.chosenDataIndex])

    return (
        <ObjectsLinkedTable
            parentObject={mainObject}
            parentObjectId={mainObject?.id}
            parentClasses={parentClassesFull}
            relationIds={relationIds}
            childClsIds={widget?.childClassesIds}
            targetClasses={widget?.targetClasses}
            statusColumn={widget?.statusColumn}
            classColumn={widget?.classColumn}
            columnsOrder={widget?.columnsOrder}
            //scroll={{ x: scrollX || 2000 }}
            chosenColumns={dataIndexArray}
            hideChosenColumns={widget.hideChosenColumns}
            tableId={widget?.tableId ?? widget?.widgetId}
            paginator={paginator}
        />
    )
}

export default WidgetObjectsLinkedTable