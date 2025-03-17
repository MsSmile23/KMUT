import { useObjectsStore } from '@shared/stores/objects'
import { EditTable } from '@shared/ui/tables/ECTable2/EditTable/EditTable'
import { IEditTableFilterSettings, IEditTableProps } from '@shared/ui/tables/ECTable2/EditTable/types'
import { FC, useEffect, useMemo, useState } from 'react'
import { IObject } from '@shared/types/objects'
import { getSyslog } from '@shared/api/Syslog/Models/getSyslog/getSyslog'
import { useApi2 } from '@shared/hooks/useApi2'
import { ISyslog } from '@shared/types/states'



const columns: IEditTableProps['columns'] = [
    { key: 'id', title: 'ID', width: 70, serverFilterValueKey: 'id' },
    { key: 'msg', title: 'Сообщение', width: 300, serverFilterValueKey: 'msg' },
    { key: 'hostname', title: 'Hostname', serverFilterValueKey: 'hostname' },
    { key: 'fromhost', title: 'Hostname отправителя', serverFilterValueKey: 'fromhost' },
    { key: 'fromhostIp', title: 'IP отправителя', serverFilterValueKey: 'fromhostIp' },
    { key: 'programname', title: 'Имя процесса', serverFilterValueKey: 'programname' },
    //{ key: 'syslogfacility', title: 'ID службы' }, 
    { key: 'syslogfacilityText', title: 'Служба', serverFilterValueKey: 'syslogfacility_text' },
    //{ key: 'syslogseverity', title: 'Значение критичности' }, 
    { key: 'syslogseverityText', title: 'Критичность' },
    //{ key: 'pri', title: 'Значение приоритета' }, 
    { key: 'priText', title: 'Приоритет', serverFilterValueKey: 'pri_text' },
    { key: 'timegenerated', title: 'Время получения', serverFilterValueKey: 'timegenerated' },
    { key: 'appName', title: 'Имя приложения', serverFilterValueKey: 'app_name' },
    { key: 'syslogtag', title: 'Тэг', serverFilterValueKey: 'syslogtag' },
].map((col) => ({
    ...col,
    dataIndex: col.key,
    disableSort: col.key !== 'id',
    disableFilter: col?.serverFilterValueKey ? false : !col.key.includes('fromhost')
}))

interface ISystemLogTableProps {
    parentObject?: IObject | number
    ipAttributeId?: number,
    chosenColumns?: string[]
    hideChosenColumns?: boolean
}
/**
 * Таблица системного журнала
 * 
 * @param chosenColumns - ключи колонок, которые необходимо выводить
 * @hideChosenColumns - маркер, который определяет, показывать или скрывать выбранные колонки
 */
export const SystemLogTable: FC<ISystemLogTableProps> = ({
    parentObject,
    ipAttributeId,
    chosenColumns,
    hideChosenColumns = false }) => {
    const objectById = useObjectsStore((st) => st.store.data.find((el) => el.id === parentObject))
    const object = typeof parentObject === 'number' ? objectById : parentObject
    const ip = object?.object_attributes.find((obj) => obj.attribute_id === ipAttributeId)?.attribute_value
    const [filteredColumns, setFilteredColumns] = useState<IEditTableFilterSettings<any>[]>(columns)

    const syslog = useApi2<ISyslog[], any>(
        (payload?: any) => getSyslog(ip ? { ip } : (payload || {})),
        // обязательно отключать onmount запрос при серверной пагинации
        { onmount: false }
    )

    const rows = useMemo(() => syslog.data.map((el, i) => ({
        ...el,
        key: `syslog-el-${el?.id || i}`,
        fromhostIp: el?.fromhost_ip,
        syslogfacilityText: el?.syslogfacility_text,
        syslogseverityText: el?.syslogseverity_text,
        priText: el?.pri_text,
        appName: el?.app_name
    })), [syslog.data])

    useEffect(() => {
        if (chosenColumns) {
            const localFinalColumns = hideChosenColumns
                ? columns.filter(cl => chosenColumns.includes(cl.dataIndex) == false)
                : columns.filter(cl => chosenColumns.includes(cl.dataIndex))

            setFilteredColumns(localFinalColumns)
        }
    }, [chosenColumns])

    return (
        <EditTable
            // paginator = {{ page: 1, pageSize: 20, enablePageSelector: false }}
            columns={filteredColumns}
            tableId="system-log-table"
            rows={rows}
            scroll={{ x: 2000 }}
            loading={syslog.loading}
            paginator={{
                page: Number(syslog.pagination.currentPage || 1),
                pageSize: 20,
                total: Number(syslog.pagination.total),
                enablePageSelector: true,
            }}
            server={{
                request: async ({ filterValue, ...meta }) => {
                    if (filterValue) {
                        return syslog.request({ ...meta, ip: filterValue })
                    } else {
                        return syslog.request(meta)
                    }
                },
                filter: async (config) => {
                    const payload = {
                        ...config,
                        per_page: config?.pageSize,
                        ip: config?.value
                    }

                    delete payload?.pageSize
                    delete payload?.value

                    for (const param in payload) {
                        if (payload[param] === undefined) {
                            delete payload[param]
                        }
                    }

                    return syslog.request(payload)
                }
            }}
        />
    )
}