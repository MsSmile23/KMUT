import { Button, Col, Row, Table } from 'antd'
import { FC, memo, useMemo, useState } from 'react'
import { IEditTableProps } from './EditTable/types'
import { IECAGTable } from './ECANTTable/ecag'
import ECAGTable from './ECANTTable/ECAGTable';
import { EditTable } from './EditTable/EditTable';
import { ShrinkOutlined } from '@ant-design/icons';
import { ECTooltip } from '@shared/ui/tooltips';
import ECAGHeaderTooltip from './ECANTTable/ECAGComponents/ECAGHeaderTooltip';

// Комментарии. Объединяющая таблица для использования двух разных таблиц, построенных 
// на antd (EditTable) и ag-grid (ECAGTable)
// Пропсы: 
// 1. rows - строки. 
// 2. колонны. - они меняются в зависимости от того, какую таблицу мы используем. 
// 3. buttons - отдельные кнопки, которые мы используем по бокам таблицы. Имеют свойства на left и right 
// 4. paginator - определение пагинатора и какой он должен быть. По дефолту, 
// у нас первая страница с шагом в 10 страниц. 
// Уточнение, у antd таблицы может быть дополнительное свойство enablePageSelector. 
// 5. tableId - определяет название таблицы. Важно при модификации таблицы, когда мы хотим скрыть какие-то столбцы. 
// 6. server - используется при серверных запросах. 
// 7. agTable - определяет, какую таблицу мы хотим использовать. В случае true (дефолтное значение) 
// в начале используется ECAGTable. False - EditTable
// 8. enableShowObjectModal - пропс для EditTable необходимый для открытия модульного окна. По дефолту true 
// 9. showHeader - Показывать ли шапку таблицы или нет. По дефолту, true 
// 10. currentTheme - пропс для передачи действующей темы. 
// 11. onChange - аналог стандартного onChange от Ant Design Table
// 12. hideSettingsButton - убрать ли кнопки настройки 
// 13. customHeight - настриваемая высота таблицы (трtбуется проверка работоспособности)
// 14. forcePagination - пропс для EditTable, отвечающий за пагинацию. 
// 15. switchGrid - пропс, определяющиющий появляение кнопки, 
// позволяющий переключаться между таблицами. По дефолту true 
// 16. initialPage - первоначальная страница 
// 17. autoUpdate - пропс для ECAGTable, определяющий необходимость обновления сервака. Необходим server
// 18. tableCSS - пропс для ECAGTable, который позволяет подключить дополнительные стили к таблице 
// 19. gridOptions - пропс для ECAGTable. Опции Грида являются первоначальной настройкой, которая позволяет 
// целый ряд показателей, начиная от того, какая иконка должна быть в сортировке и заканчивая другим. 
// За большими потробностями обращайтесь в техническую документацию: https://www.ag-grid.com/react-data-grid/grid-options/
// 20. header - пропс для ECAGTable, позволяющий передать нам кастомный заголовок
// 21. paginAdditional - пропс для ECAGTable, позволяющий передать нам дополнительные значения: 
// paginAdditional.button - определяет, показывать ли Button с переключением пагинации или нет 
// paginAdditional.status - определяет, включена ли пагинация или нет 
// 22. emptyText -  пропс для ECAGTable, позволяющий нам задать то, что мы хотим увидеть в пустом поле. 
// Так же мы можем это сделать через пропс gridOptions
// 23. additionalInfo  - пропс для ECAGTable, являющий подзаголовком
// 24. classes - пропс для ECAGTable, передающий класс. 
// 25. onRowClicked - пропс для ECAGTable, необходимый, если мы хотим сделать какое-то действие со строкой onClick 
// 26. headerCSS - пропс для ECAGTable, позволяющий задавать нам отдельный css для заголовка 
// 27. useTheme - пропс для ECAGTable, в котором мы можем выбрать, хотим ли мы использовать 
// темы из сервера, или создать свою. Уточнение, если мы передаем тему через gridOptions, 
// то данный пропс становится не актуальным. Тема в Гриде перезаписывается.  
// 28. supressHorizScroll - пропс для ECAGTable, определяющий отключение горизонтального скролла. 
// 29. changeAction - важное уточнеие. На текущий момент, пропсы, которые используется у нас в столбцах action, 
// формируют компоненты прямо в строках. Несмотря на то, что такой формат ag grid поддерживается, для него 
// нужно использовать  свойство cellRenderer. Не буду вдаваться в подробности, вот что важно - если у вас 
// всё отрисовывается на уровне строки, то он должен стоять false, если вы изначально делаете ag grid таблицу и у вас 
// всё отрисовывается в столбце (через передачу params), то делайте данный пропс true, иначе могут быть краши.  
// 30. changeColumns - дополнительный пропс, который отвечает на вопрос - а хотим ли мы менять колонки?
// 31 getExportRowStyle - дополнительный пропс для стилей AG GRID, через который мы можем пробрасывать стили, 
// если выключена тема. 


// Примечание. В оригинальной EditTable у нас есть динамический хедер, который отображает состояния сортировки. Я, 
// честно пытался его воспроизвести в ECAGTable но честно сказать, я понятие не имею, как это делать. Для этого, 
// скорее всего придется полностью переписывать весь headerCell через headerComponent, но в процессе написания 
// будет сразу уничтожаться весь функционал. В этом и проблема. Я понятие не имею, как оно работает под копотом. 
// Надо думать, смотреть и пробывать дальше.  

type CombinedTableProps = Omit<IEditTableProps, 'buttons' | 'paginator' | 'server' | 'columns' | 'rows'> &
    Omit<IECAGTable, 'buttons' | 'pagination' | 'server' | 'columns' | 'tableRow'> & {
        buttons?: IEditTableProps['buttons']; // Побеждает buttons из IEditTableProps
        rows?: Array<Record<string, any> & { key: string }>; // Объединенные rows и tableRow
        agTable?: boolean; // Новый параметр
        paginator?: IECAGTable['pagination'] | IEditTableProps['paginator'];
        columns: IEditTableProps['columns'] | IECAGTable['columns'];
        server?: IECAGTable['server'] | IECAGTable['server'];
        switchGrid?: boolean;
        changeAction?: boolean;
        changeColumns?: boolean
        onRowClicked?: any
    };

export const ECTable2: FC<CombinedTableProps> = memo(({
    rows = [],
    columns = [],
    buttons,
    paginator,
    tableId,
    server,
    agTable = true,
    enableShowObjectModal,
    showHeader,
    currentTheme,
    onChange,
    hideSettingsButton = false,
    customHeight,
    forcePagination = false,
    switchGrid = false,
    initialPage = 1,
    autoUpdate,
    tableCSS,
    gridOptions,
    header,
    paginAdditional,
    emptyText,
    additionalInfo,
    classes,
    onRowClicked,
    headerCSS,
    useTheme,
    supressHorizScroll,
    agGridCSS,
    changeAction = true,
    changeColumns = false,
    getExportRowStyle,
    ...props 
}) => {

    const [gridTable, setGridTable] = useState(agTable)
    
    const useColumnTransformer = useMemo(() => {
        return columns.map(column => {
            if (changeColumns) {

                if (gridTable) {
                    const { key, title, dataIndex, headerTooltip, headerName, filter, 
                        checkboxSelection, headerCheckboxSelection, sortable, cellRenderer, ...rest } = column;
    
                    if (dataIndex === 'actions') {
                        return {
                            ...rest,
                            key,
                            field: dataIndex || key,
                            headerName: title || headerName || key,
                            filter: filter || false,
                            checkboxSelection: checkboxSelection || true,
                            headerCheckboxSelection: headerCheckboxSelection || true,
                            cellRenderer: (params) => params.data.actions
                        };
                    } else {
                        return {
                            ...rest,
                            key,
                            field: dataIndex || key,
                            headerName: title || headerName || key,
                        };
                    }
                } else {
                    // Преобразование в формат Ant Design
                    const { key, field, title, headerName, ...rest } = column;
            
                    return {
                        ...rest,
                        key,
                        dataIndex: field || key,
                        title: headerName || title || key,
                    };
                }
            } else {
                return column
            }
        })

    }, [columns, gridTable])

    const defaultPaginator = useMemo(() => ({
        page: 1,
        pageSize: 10,
        ...paginator
    }), [paginator]);


    const modifiedTable = useMemo(() => {
        return rows.map((el) => {
            if (changeAction && changeColumns) {
                if (gridTable) {
                    return { ...el, actions: el.id };
                } else {
                    return el;
                }
            } else {
                return el
            }
        });
    }, [rows, gridTable]);


    const agGridProps = useMemo(() => ({
        tableCSS: tableCSS ? tableCSS : props.style,
        initialPage,
        autoUpdate,
        server,
        buttons,
        tableId,
        showHeader,
        paginAdditional,
        hideSettingsButton,
        gridOptions,
        currentTheme,
        header,
        headerCSS,
        onRowClicked,
        additionalInfo,
        emptyText,
        useTheme,
        classes,
        agGridCSS,
        supressHorizScroll,
        getExportRowStyle,
        ...props
    }), [tableCSS, initialPage, autoUpdate, server, buttons, currentTheme, showHeader, props]);

    const antdTableProps = useMemo(() => ({
        buttons,
        onChange,
        server,
        initialPage,
        customHeight,
        showHeader,
        forcePagination,
        enableShowObjectModal,
        tableId,
        hideSettingsButton,
        currentTheme,
        ...props
    }), [onChange, customHeight, forcePagination, enableShowObjectModal, 
        tableId, hideSettingsButton, currentTheme, props]);
   
    return (
        <> 
            {switchGrid && 
            <Row style={{ marginBottom: '20px', marginLeft: '15px' }}>
                <Col>
                    <ECTooltip title={`Переключить на таблицу ${gridTable ? 'ANTD' : 'AG GRID'}`}>
                        <Button
                            shape="circle"
                            style={{ backgroundColor: '#188EFC', color: '#ffffff', 
                                width: '40px', height: '40px' }}
                            type="primary"
                            onClick={() => {setGridTable(!gridTable)}}
                            icon={<ShrinkOutlined />}
                        />
                    </ECTooltip>
                </Col>
            </Row>}
            {gridTable ? (
                <ECAGTable 
                    tableRow={modifiedTable}
                    columns={useColumnTransformer}
                    pagination={defaultPaginator}
                    {...agGridProps}
                />
            ) : (
                <EditTable
                    rows={modifiedTable}
                    columns={useColumnTransformer}
                    pagination={defaultPaginator}
                    {...antdTableProps}
                />
            )}
        </>
    )
})