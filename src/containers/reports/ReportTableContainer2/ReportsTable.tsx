import { useApi2 } from '@shared/hooks/useApi2';
import { EditTable } from '@shared/ui/tables/ECTable2/EditTable/EditTable';
import { FC, useMemo, useState } from 'react';
import { BaseButton, ButtonAdd, ButtonDeleteRow } from '@shared/ui/buttons';
import { Col, Progress, Row, Space } from 'antd';
import { ButtonDownload } from '@shared/ui/buttons/ButtonDownload/ButtonDownload';
import { useObjectsStore } from '@shared/stores/objects';
import { DefaultModal2 } from '@shared/ui/modals';
import { useOpen } from '@shared/hooks/useOpen';
import { reportFormats } from '@entities/reports/ReportForm/data';
import { ButtonShowObject } from '@shared/ui/buttons/ButtonShowObject/ButtonShowObject';
import { ECUIKit } from '@shared/ui';
import { deleteReportById2 } from '@shared/api/Reports/Models/deleteReportById2/deleteReportById2';
import { getReports2 } from '@shared/api/Reports/Models/getReports2/getReports2';
import { downloadReportById2 } from '@shared/api/Reports/Models/downloadReportById2/downloadReportById2';
import { createdReportStatuses, reportColumns } from '../ReportTableContainer2/data';
import ReportForm2 from '@entities/reports/ReportForm2/ReportForm2';
import { getLocalTimeFromUTC } from '@shared/utils/datetime';

type TReportsTable = {
    tableHeight?: number | string
    initialPeriodicity?: 'one_time' | 'regular'
}


const ReportsTable: FC<TReportsTable> = ({ tableHeight, initialPeriodicity }) => {
    const [cellObjects, setCellObjects] = useState<number[]>([])
    // const [reportsData, setReportsData] = useState([])
    const modal = useOpen()

    const modalReportsVisible = useOpen()

    const reports = useApi2(
        // getReports2,
        (payload?: any) => getReports2((payload || {})),
        { onmount: false }
    )
    const objects = useObjectsStore(st => st.store.data)

    const deleteReport = async (id: number, reportName = '') => {
        const resp = await deleteReportById2(id)

        reports.request()

        return resp
    }

    const closeModal = () => {
        modal.close();
        setCellObjects([]);
    }

    // console.log('reports', reports)

    const rows = useMemo(() => reports?.data?.map((report) => {

        return {
            key: report.id + report.report_type.mnemo,
            id: report.id,
            report_type_id: report?.report_type?.name,
            authorReport: `${report?.author?.full_name && report?.author_name
                ? report?.author?.full_name + '\n' + '(' + report?.author_name + ')' : ''}`,
            createdAt: getLocalTimeFromUTC(report?.created_at),
            finishedAt: getLocalTimeFromUTC(report?.finished_at),
            dateCreation: getLocalTimeFromUTC(report?.start_datetime),
            endProcessing: getLocalTimeFromUTC(report?.end_datetime),
            objectsQuantity: (
                <BaseButton
                    type="text"
                    onClick={() => setCellObjects(report?.objects || [])}
                    style={{ cursor: 'pointer', background: 'transparent', color: 'inherit' }}
                >
                    {report?.objects?.length}
                </BaseButton>
            ),
            reportStatus: createdReportStatuses[report.status] ?? report?.status ?? '-',
            progress: (
                <Progress
                    style={{ marginBottom: 0, marginRight: 0 }}
                    percent={report?.progress_bar}
                    format={(percent) => `${percent}%`}
                />
            ),
            format: (
                <Space style={{ padding: 0, margin: 0, display: 'flex', flexWrap: 'wrap' }}>
                    {(report?.formats || [])?.map((item) => {
                        const format = reportFormats.find(
                            (report) => report?.name.toLowerCase() === item.toLowerCase()
                        )
                        // const preparing = status === 0
                        // const isError = status === 2
                        // const tooltipTitle = isError ? message : preparing ? 'Готовится' : 'Скачать'

                        return format ? (
                            <ButtonDownload
                                key={item}
                                format={format.ext}
                                button={{
                                    size: 'small',
                                    shape: 'default',
                                    children: format.name,
                                    // loading: preparing,
                                    // danger: isError,
                                }}
                                // tooltip={{ title: tooltipTitle }}
                                request={async () => {
                                    return downloadReportById2(report.id, format.name.toLocaleLowerCase())
                                }}
                                filename={{
                                    // eslint-disable-next-line max-len
                                    request: `Отчёт_[${report?.status ?? ''}]_${report?.report_type?.name}_${report?.id
                                    }`,
                                }}
                                icon={null}
                            // disableClick={isError}
                            />
                        ) : null
                    })}
                </Space>
            ),
            actions:
                <ButtonDeleteRow
                    withConfirm
                    onClick={async () => {
                        const resp = await deleteReport(report.id, report?.report_type?.name)

                        return resp
                    }}
                />,
        }
    }), [reports?.data])

    return (
        <>
            <DefaultModal2
                open={cellObjects.length > 0}
                onCancel={closeModal}
                title="Просмотр объектов"
                footer={null}
            >
                <Row gutter={[4, 4]}>
                    {objects.filter((obj) => cellObjects.includes(obj.id)).map((obj) => (
                        <Col key={`object-modal-${obj.id}`}>
                            <ButtonShowObject id={obj.id} style={{ width: '100%' }}>
                                {obj?.name}
                            </ButtonShowObject>
                        </Col>
                    ))}
                </Row>
            </DefaultModal2>

            <ECUIKit.common.ECModal
                width="max-content"
                height="max-content"
                onCancel={() => { modalReportsVisible.close() }} open={modalReportsVisible.isOpen}
                showFooterButtons={false}
                title="Создание нового отчёта"
            >
                <ReportForm2
                    closeModal={() => { modalReportsVisible.close() }}
                    initialPeriodicity={initialPeriodicity}
                    updateData={() => reports.request()}
                />
            </ECUIKit.common.ECModal>

            <style>{`
                div > .ant-table-cell {
                    padding: 3px !important;
                }
            `}
            </style>


            <EditTable
                paginator={{
                    page: Number(reports.pagination.currentPage || 1),
                    pageSize: 10,
                    total: Number(reports.pagination.total),
                    enablePageSelector: true,
                }}
                tableId="report-table"
                columns={reportColumns}
                rows={rows}
                loading={reports?.loading}
                scroll={{ y: Number(tableHeight) }}
                buttons={{
                    left: [
                        <ButtonAdd
                            style={{}}
                            type="default"
                            shape="circle"
                            text={false}
                            key="report-add"
                            size="middle"
                            onClick={() => modalReportsVisible.open()}
                        />
                    ]
                }}
                server={{
                    // autoUpdate: 65_000,
                    request: async ({ filterValue, ...meta }) => {
                        if (filterValue) {
                            return reports.request({ ...meta })
                        } else {
                            return reports.request(meta)
                        }
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

                        return reports.request(payload)
                    }
                }}
            />
        </>
    )
}

export default ReportsTable