import { deleteTaskById } from '@shared/api/Reports/Models/deleteTaskById/deleteTaskById'
import { getTasks } from '@shared/api/Reports/Models/getTasks/getTasks'
import { useApi2 } from '@shared/hooks/useApi2'
import { useOpen } from '@shared/hooks/useOpen'
import { useObjectsStore } from '@shared/stores/objects'
import { BaseButton, ButtonAdd, ButtonDeleteRow, ButtonEditRow } from '@shared/ui/buttons'
import { Col, Row, Space } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { createdReportStatuses } from '../ReportsTableContainer/data'
import { EditTable } from '@shared/ui/tables/ECTable2/EditTable/EditTable'
import { taskColumns } from './data'
import { DefaultModal2 } from '@shared/ui/modals'
import { ButtonShowObject } from '@shared/ui/buttons/ButtonShowObject/ButtonShowObject'
import { ECUIKit } from '@shared/ui'
import ReportForm2 from '@entities/reports/ReportForm2/ReportForm2'
import { getReportsMeta } from '@shared/api/Reports/Models/getReportsMeta/getReportsMeta'
import { getLocalTimeFromUTC } from '@shared/utils/datetime'

const TasksTable = ({ tableHeight, initialPeriodicity }) => {
    const [cellObjects, setCellObjects] = useState<number[]>([])
    // const [tasksData, setTasksData] = useState([])
    const [selectedTask, setSelectedTask] = useState(null)
    const [editMode, setEditMode] = useState(false); // Новое состояние для editMode

    const [meta, setMeta] = useState(null)
    const modal = useOpen()

    const modalReportsVisible = useOpen()

    const tasks = useApi2((payload?: any) => getTasks((payload || {})), { onmount: false })
    const objects = useObjectsStore(st => st.store.data)

    //* Режим редактирования
    const handleEditClick = (task) => {
        setSelectedTask(task);
        setEditMode(true);
        modalReportsVisible.open();
    };

    //* Режим создания
    const handleAddClick = () => {
        setSelectedTask(null);
        setEditMode(false);
        modalReportsVisible.open();
    };


    useEffect(() => {
        const fetchMeta = async () => {
            try {
                const metaResponse = await getReportsMeta()

                setMeta(metaResponse?.data)
            } catch (error) {
                console.error('Ошибка получения мета данных', error)
            }
        }

        fetchMeta()  // Вызов функции получения мета данных
    }, [])

    const deleteTask = async (id: number, taskName = '') => {
        const resp = await deleteTaskById(id)

        tasks.request()

        return resp
    }

    const closeModal = () => {
        modal.close();
        setCellObjects([]);
    }

    const rows = useMemo(() => tasks?.data?.map((task) => {

        if (!tasks?.data || !meta) { return [] }

        if (meta) {
            return {
                key: task?.id + task?.report_type?.mnemo,
                id: task.id,
                report_type_id: task?.report_type?.name,
                authorReport: `${task?.author?.full_name && task?.author_name
                    ? task?.author?.full_name + '\n' + '(' + task?.author_name + ')' : ''}`,
                createdAt: getLocalTimeFromUTC(task?.created_at),
                frequency: meta['frequency'][`${task?.frequency}`]?.label,
                constructionPeriod: task?.construction_period == 'current_time'
                    ? 'На текущий момент'
                    : meta['construction_periods'][`${task?.construction_period}`]?.label,
                frequencyStartedAt: task?.frequency_started_at,
                objectsQuantity: (
                    <BaseButton
                        type="text"
                        onClick={() => setCellObjects(task?.objects || [])}
                        style={{ cursor: 'pointer', background: 'transparent', color: 'inherit' }}
                    >
                        {task?.objects?.length}
                    </BaseButton>
                ),
                taskStatus: createdReportStatuses[task?.status] ?? task?.status ?? '-',
                format: task?.formats?.join(', '),
                actions: (
                    <Space>
                        <ButtonDeleteRow
                            withConfirm
                            onClick={async () => {
                                const resp = await deleteTask(task?.id, task?.report_type?.name)

                                return resp
                            }}
                        />
                        <ButtonEditRow
                            onClick={() => handleEditClick(task)}
                        />
                    </Space>
                )
            }
        }
    }), [tasks?.data, meta])

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
                width="max-content"
                height="max-content"
                onCancel={() => { modalReportsVisible.close() }} open={modalReportsVisible.isOpen}
                showFooterButtons={false}
                title={editMode 
                    ? 'Редактирование задания на построение отчёта' 
                    : 'Создание задания на построение отчёта'} 
            >
                <ReportForm2
                    closeModal={() => { modalReportsVisible.close() }}
                    task={selectedTask}
                    editMode={editMode}
                    initialPeriodicity={initialPeriodicity}
                    updateData={() => tasks.request()}
                    succesTitle={`Задание на генерацию отчёта успешно ${editMode ? 'обновлено' : 'создано'}`}
                />
            </ECUIKit.common.ECModal>

            <EditTable
                paginator={{
                    page: Number(tasks?.pagination?.currentPage || 1),
                    pageSize: 10,
                    total: Number(tasks?.pagination?.total),
                    enablePageSelector: true,
                }}
                tableId="report-table"
                columns={taskColumns}
                rows={rows}
                loading={tasks?.loading || false}
                scroll={{ x: tableHeight }}
                buttons={{
                    left: [
                        <ButtonAdd
                            style={{}}
                            type="default"
                            shape="circle"
                            text={false}
                            key="report-add"
                            size="middle"
                            onClick={handleAddClick}
                        />
                    ]
                }}
                server={{
                    // autoUpdate: 65_000,
                    request: async ({ filterValue, ...meta }) => {
                        if (filterValue) {
                            return tasks.request({ ...meta })
                        } else {
                            return tasks.request(meta)
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

                        return tasks.request(payload)
                    }
                }}
            />
        </>
    )
}

export default TasksTable