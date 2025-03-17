import { getNetflowSources } from '@shared/api/Netflow/Models/getNetflowSources/getNetflowSources'
import { useApi2 } from '@shared/hooks/useApi2'
import { EditTable } from '@shared/ui/tables/ECTable2/EditTable/EditTable'
import { netflowColumns } from './prepare'
import { useMemo } from 'react'
import { getLocalTimeFromUTC } from '@shared/utils/datetime'


const NetflowTableContainer = ({ rowPerPage = 20 }) => {

    const netflowSource = useApi2(
        (payload?: any) => getNetflowSources((payload || {})),
        { onmount: false },
    )

    const rows = useMemo(() => {
        return netflowSource?.data?.map((netflow) => {

            const src_codename = netflow?.src_object?.codename ? `[${netflow?.src_object?.codename}]` : ''
            const src_name = netflow?.src_object?.name || ''
            const dst_codename = netflow?.dst_object?.codename ? `[${netflow?.src_object?.codename}]` : ''
            const dst_name = netflow?.dst_object?.name || ''
            
            return {
                ...netflow,
                date: getLocalTimeFromUTC(netflow?.date),
                src_codename: src_codename + src_name,
                dst_codename: dst_codename + dst_name,
                key: `netflow-row-${netflow.id}`,
            }
        })
    }, [netflowSource?.data])

    return (
        <EditTable
            columns={netflowColumns}
            tableId="netflow-table"
            rows={rows}
            loading={netflowSource?.loading}
            forcePagination={true}
            scroll={{ x: 'max-content', y: 'max-content' }}
            paginator={{
                page: Number(netflowSource.pagination.currentPage || 1),
                pageSize: rowPerPage,
                total: Number(netflowSource.pagination.total),
                enablePageSelector: true,
            }}
            rowSelection={null}
            server={{
                request: async ({ filterValue, ...meta }) => {
                    const payload = {
                        ...meta,
                    }

                    return netflowSource.request(payload)
                },
                filter: async (config) => {
                    const payload = {
                        ...config,
                        per_page: config?.pageSize,
                    }

                    delete payload?.pageSize
                    delete payload?.value

                    for (const param in payload) {
                        if (payload[param] === undefined) {
                            delete payload[param]
                        }
                    }

                    return netflowSource.request(payload)
                }
            }}
        />
    )
}

export default NetflowTableContainer