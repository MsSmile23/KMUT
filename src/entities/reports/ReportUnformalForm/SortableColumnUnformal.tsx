/* eslint-disable react/jsx-max-depth */
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Col, Dropdown, Row, Space, Typography } from 'antd';
import { IColumnReport, useUnformalStore } from './unformalFormStore';
import { ECTooltip } from '@shared/ui/tooltips';

interface ISortableColumn {
    column: IColumnReport
    columnIndex: number
    showRows?: boolean
}

// todo: разобраться с ошибками в неформальном отчете
// в данный момент он не импортируется в ReportUnformalForm2
// концепт: сортировка рядов для последующего отображения их в виде отсортированных столбцов

export const SortableColumnUnformal: React.FC<ISortableColumn> = ({ column, columnIndex, showRows = false }) => {
    const update = useUnformalStore((st) => st.update)
    const moveEnabled = useUnformalStore((st) => st.moveEnabled)
    const editedColumnIndex = useUnformalStore((st) => st.editedColumnIndex)
    const columns = useUnformalStore((st) => st.columns)
    const updateColumns = useUnformalStore((st) => st.updateColumns)
    const addColumn = useUnformalStore((st) => st.addColumn)

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: column.id, disabled: !moveEnabled });

    const styles = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={styles} {...attributes} {...listeners} >
            <Col key={`column-report-${column.id}`}>
                <Row justify="center">
                    <Dropdown
                        overlayStyle={{ minWidth: 175 }}
                        menu={{
                            items: [
                                { 
                                    key: 'edit', 
                                    label: 'Редактировать',
                                    onClick: () => {
                                        update({ editedColumnIndex: columnIndex })
                                    }, 
                                },
                                columns.length > 1 ? { 
                                    key: 'move', 
                                    label: moveEnabled ? 'Сохранить порядок' : 'Переместить',
                                    onClick: () => update({ moveEnabled: !moveEnabled }),
                                    disabled: editedColumnIndex !== undefined
                                } : null,
                                { 
                                    key: 'del', 
                                    label: 'Удалить',
                                    onClick: () => {
                                        updateColumns(columns.filter((_, i) => i !== columnIndex))
                                    },
                                    disabled: editedColumnIndex !== undefined
                                },
                                { 
                                    key: 'add-column', 
                                    label: 'Добавить столбец', 
                                    disabled: editedColumnIndex !== undefined,
                                    children: [
                                        { 
                                            key: 'add-left', 
                                            label: 'Слева',
                                            onClick: () => addColumn(columnIndex, 'left')
                                        },
                                        { 
                                            key: 'add-right', 
                                            label: 'Справа',
                                            onClick: () => addColumn(columnIndex, 'right'),
                                        }
                                    ]
                                },
                                { 
                                    key: 'sort', 
                                    label: 'Сортировать',
                                    disabled: editedColumnIndex !== undefined,
                                    children: [
                                        { key: 'sort-ascend', label: 'По возрастанию' },
                                        { key: 'sort-descend', label: 'По убыванию' },
                                    ]
                                }
                            ] 
                        }} 
                        trigger={['contextMenu']}
                    >
                        <Col className="header" xs={24}>
                            <ECTooltip
                                title={column.attributes || column.aggregation && (
                                    <Space direction="vertical">
                                        {column.attributes && `Атрибут: ${JSON.stringify(column.attributes)}`}
                                        {column.aggregation && `Агрегация: ${column.aggregation}`}
                                    </Space>
                                )}
                            >
                                <div
                                    className="unformal-column"
                                    style={{ 
                                        border: '1px solid rgba(0, 0, 0, 0.05)', 
                                        borderLeft: columnIndex === 0 ? '1px solid rgba(0, 0, 0, 0.05)' : 'none',
                                        borderTopLeftRadius: columnIndex === 0 ? 6 : 'none',
                                        borderBottomLeftRadius: columnIndex === 0 ? 6 : 'none',
                                        borderRight: 'none',
                                        background: editedColumnIndex === columnIndex 
                                            ? 'lightblue' 
                                            : 'rgba(0, 0, 0, 0.02)', 
                                        padding: 12,
                                        cursor: moveEnabled ? 'grab' : 'context-menu',
                                        userSelect: moveEnabled ? 'none' : undefined 
                                    }}
                                >
                                    {typeof column.header === 'string' ? (
                                        <Typography.Title 
                                            level={5} 
                                            style={{ 
                                                margin: 0,
                                                padding: 0, 
                                                display: 'flex', 
                                                justifyContent: 'center' 
                                            }}
                                        >
                                            {column.header}
                                        </Typography.Title>
                                    ) : (column.header)}
                                </div>
                            </ECTooltip>
                        </Col>
                    </Dropdown>
                    {showRows && (new Array(5).fill('-')).map((row: any, i: number) => {
                        return (
                            <Col 
                                key={`row-report-${i}`} 
                                xs={24}
                                style={{
                                    border: '1px solid rgba(0, 0, 0, 0.05)', 
                                    borderLeft: 'none',
                                    borderRight: 'none',
                                    // eslint-disable-next-line max-len
                                    borderBottom: i === 4
                                        ? '1px solid rgba(0, 0, 0, 0.05)' 
                                        : 'none',
                                    cursor: moveEnabled ? 'grab' : 'context-menu',
                                    userSelect: moveEnabled ? 'none' : undefined 
                                }}
                            >
                                <Row justify="center"><Col>{row}</Col></Row>
                            </Col>
                        )
                    })}
                </Row>
            </Col>
        </div>
    )
}