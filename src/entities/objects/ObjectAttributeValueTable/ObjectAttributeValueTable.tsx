import { FC, useEffect, useState } from 'react';
import { IObjectAttribute } from '@shared/types/objects';
import { useApi2 } from '@shared/hooks/useApi2';
import {
    getAttributeHistoryById
} from '@shared/api/AttributeHistory/Models/getAttributeHistoryById/getAttributeHistoryById';
import { ITableColumns } from '@shared/types/antd';
import { getDateTimeSql } from '@shared/utils/datetime';
import { SimpleTable } from '@shared/ui/tables';
import { IAttributeHistorySerieData } from '@shared/types/attribute-history';

const ObjectAttributeValueTable: FC<{
    height: number, 
    objectAttribute: IObjectAttribute,
    limit?: number
}> = ({ height = 400, objectAttribute, limit }) => {
    const limitPayload = limit ? { limit } : {}

    const attrHistory = useApi2(getAttributeHistoryById, {
        state: null,
        onmount: false,
        payload: {
            id: objectAttribute.id,
            ...limitPayload
        }
    })
    

    const [compState, setCompState] = useState<{
        attrTables: {
            key: any,
            name: string,
            columns: ITableColumns,
            rows: any[]
        }[]
    }>({
        attrTables: []
    })

    const getAttrHistory = async () => {
        return attrHistory?.data?.series?.map( (serie, index) => {
            const headers = serie.params?.view?.headers ?? []

            headers.unshift('Время')
            let rows = []
            const columns: ITableColumns = headers.map(
                (header, index) => ({ key: index, dataIndex: index, title: header, width: index == 0 ? 150 : null }))
            
            const attrTable = {
                key: index,
                name: serie.name,
                columns: columns,
                rows: [],
            }

            if (serie?.data) {
                const serieData = serie?.data as IAttributeHistorySerieData['jsonb']

                rows = serieData
                    .sort((a, b) => b[0] - a[0])
                    .map((row, index) => {
                        const newRow: any = { key: index }

                        for (const col of columns) {
                            newRow[col.dataIndex] = (col.dataIndex == 0)
                                ? getDateTimeSql(row[0])
                                : row[1]?.[col.dataIndex - 1]?.value ?? '-'
                        }

                        return newRow
                    })
            }

            return { ...attrTable, rows: rows ?? [] }
        }) ?? []
    }

    useEffect(() => {
        if (objectAttribute?.attribute.history_to_db) {
            attrHistory.request({ id: objectAttribute?.id, ...limitPayload }).then()

            return
        }

        //Значение статического атрибута с постобработкой для неисторических значений

    }, [])

    useEffect(() => {
        if (objectAttribute?.attribute.history_to_db) {
            getAttrHistory().then( attrTables => {
                setCompState(prevState => { return { ...prevState, attrTables } })
            })
        }
    }, [attrHistory.data])

    const isRender = (objectAttribute?.attribute.history_to_db && !attrHistory.loading)
        || !objectAttribute?.attribute.history_to_db

    return (
        <div>
            {isRender && compState?.attrTables?.map(attrTable =>
                <SimpleTable
                    key={attrTable.key}
                    columns={attrTable.columns}
                    rows={attrTable.rows}
                    scroll={{ y: height }}
                    pagination={{
                        hideOnSinglePage: true,
                        showSizeChanger: false,
                        size: 'small',
                        position: ['bottomRight'],
                        pageSize: 10
                    }}
                    //rowKey={(record) => record?.[2]?.props?.title ?? Math.random()}
                    //rowKey={(record) => record?.[record.length - 1]}
                />
            )}
        </div>
    )
}

export default ObjectAttributeValueTable;