import { getReports } from '@shared/api/Reports/Models/getReports/getReports';
import { useApi2 } from '@shared/hooks/useApi2';
import { EditTable } from '@shared/ui/tables/ECTable2/EditTable/EditTable';
import { FC, useEffect, useMemo, useState } from 'react';
import { createdReportStatuses, reportColumns } from './data';
import { BaseButton, ButtonAdd, ButtonDeleteRow } from '@shared/ui/buttons';
import { Button, Col, Progress, Row, Space, message } from 'antd';
import { deleteReportById } from '@shared/api/Reports/Models/deleteReportById/deleteReportById';
import { ButtonDownload } from '@shared/ui/buttons/ButtonDownload/ButtonDownload';
import { useObjectsStore } from '@shared/stores/objects';
import { DefaultModal2 } from '@shared/ui/modals';
import { useOpen } from '@shared/hooks/useOpen';
import { useNavigate } from 'react-router-dom';
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths';
import { downloadReportById } from '@shared/api/Reports/Models/downloadReportById/downloadReportById';
import dayjs from 'dayjs';
import { reportFormats } from '@entities/reports/ReportForm/data';
import { ButtonShowObject } from '@shared/ui/buttons/ButtonShowObject/ButtonShowObject';
import { ECUIKit } from '@shared/ui';
import { ReportForm } from '@entities/reports/ReportForm/ReportForm';
import { getURL } from '@shared/utils/nav';

const formatTime = (dt: string | null) => {
    if (!dt) {
        return undefined
    }

    return dayjs(dt).format('YYYY-MM-DD HH:mm:ss')
}

type TReportFormFilters = {
    reportTypesAllowArray?: Array<number>,
    reportFormatsAllowArray?: Array<string>,
    linkedClassesForObjects?: Array<number>
}

type TPagination = {
    page: number,
    pageSize: number,
    enablePageSelector: boolean
}

type TTableOptions = {
    paginator?: TPagination
    height?: number
    authorOfReport?: string
}

type TReportsTable = {
    displayReportTableFormInModal?: boolean
    filters?: TReportFormFilters
    tableOptions?: TTableOptions
}


export const ReportsTableContainer: FC<TReportsTable> = ({ displayReportTableFormInModal, filters, tableOptions }) => {
    const [cellObjects, setCellObjects] = useState<number[]>([])
    const [reportsData, setReportsData] = useState([])

    const modal = useOpen()
    const nav = useNavigate()

    const modalReportsVisible = useOpen()

    const reports = useApi2(getReports, { onmount: false })
    const objects = useObjectsStore(st => st.store.data)

    useEffect(() => {
        const response = async () => {
            try {
                const res = await reports.request()

                setReportsData(res.data)
            } catch (error) {
                console.error(error)
            }
        }

        response()
        const intervalId = setInterval(() => {
            response()
        }, 65_000)

        return () => clearInterval(intervalId)
    }, [])

    const deleteReport = async (id: number, reportName = '') => {
        try {
            await deleteReportById(id)

            message.error(`Отчет ${reportName} (${id}) успешно удален`)

            reports.request()
        } catch {
            message.error(`Ошибка удаления отчета ${reportName} (${id})`)
        }
    }

    const closeModal = () => {
        modal.close();
        setCellObjects([]);
    }

    if (tableOptions && tableOptions?.authorOfReport && tableOptions?.authorOfReport !== 'none') {
        reportColumns.splice(2, 0, {
            title: 'Автор отчета',
            dataIndex: 'authorReport',
            key: 'authorReport',
        });
    }

    const rows = useMemo(() => reportsData.map((report) => {
        let authorReport

        switch (tableOptions?.authorOfReport) {
            case 'login':
                authorReport = report?.author_name || ''
                break
            case 'fio':
                authorReport = report?.author?.full_name || ''
                break
            case 'fio_login':
                authorReport = `${report?.author?.full_name && report?.author_name
                    ? report?.author?.full_name + '(' + report?.author_name + ')' : ''}`
                break
            default:
                authorReport = null
        }

        return {
            key: report.id + report.report_type.mnemo,
            id: report.id,
            nameReport: report?.report_type?.name,
            ...(authorReport && { authorReport }),
            createdAt: formatTime(report?.created_at),
            finishedAt: formatTime(report?.finished_at),
            dateCreation: report?.start_datetime,
            endProcessing: report?.end_datetime,
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
                    style={{ marginBottom: 0, marginRight: 0, paddingRight: 10 }}
                    percent={report?.progress_bar}
                    format={(percent) => `${percent}%`}
                />
            ),
            format: (
                <Space>
                    {(report?.ready_formats || [])?.map(({ mnemo = '', status = 2, message = '' }) => {
                        const format = reportFormats.find(
                            (report) => report?.name.toLowerCase() === mnemo.toLowerCase()
                        )
                        const preparing = status === 0
                        const isError = status === 2
                        const tooltipTitle = isError ? message : preparing ? 'Готовится' : 'Скачать'

                        return format ? (
                            <ButtonDownload
                                key={mnemo}
                                format={format.ext}
                                button={{
                                    size: 'small',
                                    shape: 'default',
                                    children: format.name,
                                    loading: preparing,
                                    danger: isError,
                                }}
                                tooltip={{ title: tooltipTitle }}
                                request={async () => {
                                    return downloadReportById(report.id, format.name.toLocaleLowerCase())
                                }}
                                filename={{
                                    // eslint-disable-next-line max-len
                                    request: `Отчёт_[${report?.status ?? ''}]_${report?.report_type?.name}_${
                                        report?.id
                                    }`,
                                }}
                                icon={null}
                                disableClick={isError}
                            />
                        ) : null
                    })}
                </Space>
            ),
            actions: <ButtonDeleteRow withConfirm onClick={() => deleteReport(report.id, report?.report_type?.name)} />,
        }
    }), [reportsData, tableOptions?.authorOfReport])

    return (
        <>
            <DefaultModal2
                open={cellObjects.length > 0}
                onCancel={closeModal}
                title="Просмотр объектов"
                footer={null}
            // может выезжать за экран при большом количестве объектов, но появляется два скролла
            // style={{ overflow: 'auto', height: 800 }}
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
                onCancel={() => { modalReportsVisible.close() }} open={modalReportsVisible.isOpen}
                showFooterButtons={false}
                title="Создание нового отчёта"
            >
                <ReportForm
                    modal filters={filters}
                    closeModal={() => {
                        reports.request()
                        modalReportsVisible.close()
                    }}

                />
            </ECUIKit.common.ECModal>

            <EditTable
                paginator={{ page: 1, pageSize: 30, enablePageSelector: false }}
                tableId="report-table"
                columns={reportColumns}
                rows={rows}
                loading={reports.loading}
                scroll={{ x: 2000 }}
                buttons={{
                    left: [
                        <ButtonAdd
                            style={{}}
                            type="default"
                            shape="circle"
                            text={false}
                            key="report-add"
                            size="middle"
                            onClick={() => {
                                displayReportTableFormInModal ?
                                    modalReportsVisible.open()
                                    :
                                    nav(getURL(
                                        `${ROUTES.REPORTS}/${ROUTES_COMMON.CREATE}`,
                                        'showcase'
                                    ))
                            }}
                        // onClick={() => nav(`/${ROUTES.REPORTS}/${ROUTES_COMMON.CREATE}`)} 
                        />
                    ]
                }}
                // server={{
                //     autoUpdate: 65_000,
                //     request: async ({ filterValue, ...meta }) => {
                //         if (filterValue) {
                //             return reports.request({ ...meta })
                //         } else {
                //             return reports.request(meta)
                //         }
                //     },
                //     filter: async (config) => {
                //         const payload = {
                //             ...config,
                //             per_page: config?.pageSize,
                //         }

                //         delete payload?.pageSize
                //         delete payload?.value

                //         for (const param in payload) {
                //             if (payload[param] === undefined) {
                //                 delete payload[param]
                //             }
                //         }

            //         return reports.request(payload)
            //     }
            // }}
            />
        </>
    )
}