import { ButtonCreatable, ButtonDeleteRow, ButtonEditRow } from "@shared/ui/buttons"
import { Button, Col,Popconfirm,Row, Space, Modal } from "antd"
import { FC, useMemo, useRef, useState, } from "react"
import { AllCommunityModule, ModuleRegistry, } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useNavigate } from "react-router-dom";
import { ECTooltip } from "@shared/ui/tooltips";
import { getURL } from "@shared/utils/nav";
import { ROUTES, ROUTES_COMMON } from "@shared/config/paths";
import { ArrowsAltOutlined, ShrinkOutlined } from "@ant-design/icons";
import { EditedColumnModal } from "@shared/ui/tables/ECTable2/EditTable/EditedColumnModal";
import { EditTablePagination } from "@shared/ui/tables/ECTable2/EditTable/EditTablePagination";
import { useAttributesStore } from "@shared/stores/attributes";
import { useAttributeCategoryStore2 } from "@shared/stores/attributeCategories";
import { deleteAttributeById } from "@shared/api/Attribute/Models/deleteAttributeById/deleteAttributeById";
import { responseErrorHandler } from "@shared/utils/common";
import { visibilityTranslation } from "@containers/attributes/AttributesTableContainer/AttributesTableData";
import MarkoTestButtonDownload from "../MarkoTestButtonDownload";
ModuleRegistry.registerModules([AllCommunityModule ]);


const MarkoTestAttributeTable: FC = () => {
  
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [paginStatus, setPaginStatus] = useState(false)
    const gridRef = useRef();

    const navigate = useNavigate()

    const attributes = useAttributesStore((st) => st.store.data)
    const categories = useAttributeCategoryStore2((st) => st.store.data)
    const { forceUpdate: forceUpdateAttrsStore } = useAttributesStore.getState()

    const rows: any[] = useMemo(() => [...attributes].sort((a, b) => b.id - a.id).map((attr) => {
        return {
            key: `attr-row-${attr.id}`,
            id: attr.id,
            name: attr.name,
            visibility: visibilityTranslation[attr.visibility],
            multiplicity: `${attr.multiplicity_left ?? '-'} / ${attr.multiplicity_right || '*'}`,
            dataType: attr.data_type_id,
            initialValue: attr.initial_value || '---',
            attributeCategory: categories.find((cat) => attr.attribute_category_id === cat.id)?.name,
            categoryFilterValue: attr.attribute_category_id,
            historyToDb: attr.history_to_db ? '+' : '-',
            historyToDbFilterValue: attr.history_to_db,
            historyToCache: attr.history_to_cache ? '+' : '-',
            historyToCacheFilterValue: attr.history_to_cache,
            readonly: attr.readonly ? '+' : '-',
            readonlyFilterValue: attr.readonly,
            actions: attr,
        }
    }), [attributes] )

    const defaultColDef = {
        filter: true,
        icons: {
            filter: `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="22px" height="22px" margin-top="2px" viewBox="0 0 32 32">
                <title>filter</title>
                <path d="M26 8.184c-0.066 2.658-4.058 5.154-6.742 7.974-0.168 0.196-0.252 0.424-0.258 0.682v3.66l-6 4.5c0-2.74 0.066-5.482-0.002-8.222-0.018-0.234-0.102-0.442-0.256-0.62-2.716-2.854-6.682-5.548-6.742-7.974v-2.184h20v2.184zM8 8c0 0.304 0.060 0.612 0.258 0.842 2.716 2.854 6.682 5.548 6.742 7.974v4.184l2-1.5v-2.684c0.066-2.658 4.058-5.154 6.742-7.974 0.198-0.23 0.258-0.538 0.258-0.842h-16z"></path>
                </svg>`,
          },
    };

    const ActionCellRenderer = ({attr}) => {
        return (
            <Space>
                    <ButtonEditRow
                        onClick={() => {
                            navigate(getURL(
                                `${ROUTES.ATTRIBUTES}/${ROUTES_COMMON.UPDATE}/${attr?.data?.id}`, 
                                'constructor'
                            ))
                        }}
                    />
                <Popconfirm
                        title="Удаление"
                        description={`Удалить ${attr?.data.name}?`}
                        okText="Да"
                        cancelText="Нет"
                        onConfirm={() => {
                            deleteAttributeById(`${attr?.data.id}`).then((resp) => {

                                if (resp.success) {
                                    forceUpdateAttrsStore()

                                    Modal.success({
                                        title: '',
                                        content: 'Атрибут успешно удален',
                                    })
                                } else {
                                    responseErrorHandler({
                                        response: resp,
                                        modal: Modal,
                                        errorText: 'Ошибка удаления атрибута',
                                    })
                                }
                            })
                        }}
                    >
                        <ButtonDeleteRow />
                </Popconfirm>
            </Space>
        );
    };

    const [colDefs, setColDefs] : any[] = useState([
        { 
            field: "actions",
            checkboxSelection: true,
            headerName: 'Действия',
            headerCheckboxSelection: true,
            cellRenderer: (params) => (
                <ActionCellRenderer
                    attr={params}
                />
            ),
        },
        { 
            field: "id",
            headerName: 'ID',
        },
        { 
            field: "name",
            headerName: 'Идентификатор'
        },
        { 
            field: "visibility",
            headerName: 'Видимость' 
        },
        { 
            field: "multiplicity",
            headerName: 'Кратность' 
        },
        { 
            field: "dataType",
            headerName: 'Тип данных' 
        },
        { 
            field: "initialValue",
            headerName: 'Начальное значение' 
        },
        { 
            field: "ficked",
            headerName: 'Фиксированное значение' 
        },
        { 
            field: "category",
            headerName: 'Категория' 
        },
        { 
            field: "abstract",
            headerName: 'Абстрактный' 
        },
        { 
            field: "historyToDb",
            headerName: 'БД' 
        },
        { 
            field: "historyToCache",
            headerName: 'Кэш' 
        },
        { 
            field: "readonly",
            headerName: 'Только чтение' 
        },
        { 
            field: "typeofNumber",
            headerName: 'Единица измерения' 
        },
        { 
            field: "stereotype",
            headerName: 'Стереотип' 
        },
        { 
            field: "sort",
            headerName: 'Сортировка' 
        },
        { 
            field: "package",
            headerName: 'Пакет' 
        },
        { 
            field: "classes",
            headerName: 'Классы' 
        },
        { 
            field: "presentation",
            headerName: 'Представление' 
        },
        { 
            field: "icon",
            headerName: 'Иконка' 
        },
      ]);

      const gridOptions = {
              getRowStyle: (params) => {
                  const statusColor = `${params?.data?.status?.color} !important` ;
                  console.log(statusColor)
                  return { 
                      backgroundColor: 'red',
                   }; 
              },
            //   theme: themeAlpine.withParams({  
            //       wrapperBorder: false, // Убирает внешнюю границу вокруг всей таблицы  
            //       headerRowBorder: false, // Убирает горизонтальные границы в заголовке  
            //       rowBorder: false, // Убирает горизонтальные границы между строками  
            //       columnBorder: false, // Убирает вертикальные границы между колонками  
            //     })  
          }


    return (
        <div style={{ width: "100%", height: "30%", marginTop: '7%'}}>
            <Row style={{padding: '1%', display: 'flex', justifyContent: 'space-between', backgroundColor: 'lightblue', borderRadius: '10px 10px 0 0'}}>
                <Col>
                <Space> 
                    {paginStatus ? (
                        <ECTooltip title="Включить визуализацию">
                            <Button
                                shape="circle"
                                style={{ backgroundColor: '#188EFC', color: '#ffffff', width: '40px', height: '40px' }}
                                type="primary"
                                onClick={() => {setPaginStatus(!paginStatus)}}
                                icon={<ArrowsAltOutlined />}
                            />
                        </ECTooltip>
                    ): (
                        <ECTooltip title="Включить пагинацию">
                            <Button
                                shape="circle"
                                style={{ backgroundColor: '#188EFC', color: '#ffffff', width: '40px', height: '40px' }}
                                type="primary"
                                onClick={() => {setPaginStatus(!paginStatus)}}
                                icon={<ShrinkOutlined />}
                            />
                        </ECTooltip>
                    )}      
                        <ButtonCreatable 
                            key="button-add-attribute"
                            shape="circle"
                            text={false}
                            entity="attributes"
                            buttonAdd={true}
                            onClick={() => { 
                                navigate(getURL(
                                    `${ROUTES.ATTRIBUTES}/${ROUTES_COMMON.CREATE}`, 
                                    'constructor'
                                ))
                                // navigate(`/${ROUTES.ATTRIBUTES}/${ROUTES_COMMON.CREATE}`)
                            }}
                        />
                </Space>
                </Col>
                <Col>
                 <Space>
                    {paginStatus && (
                        <EditTablePagination
                            total={rows.length}
                            initialPage={currentPage}
                            pageSize={{
                                default: pageSize,
                                values: [10, 20, 30, 40, 50, 100, 500],
                            }}
                            onChange={(page, size ) => {
                                setPageSize(size)
                                setCurrentPage(page)
                            }}
                        />
                    )}
                    <MarkoTestButtonDownload 
                        buttonStyle={{height: '35px', width: '35px'}}
                        columns={colDefs}
                        rows={rows}
                        filename={'Таблица аттрибутов'}
                    />
                    <EditedColumnModal 
                        buttonStyle={{height: '35px', width: '35px'}}
                    />
                 </Space>
                </Col>
            </Row>
            <AgGridReact
                rowData={paginStatus ? rows.slice((currentPage - 1) * pageSize, currentPage * pageSize) : rows}
                ref={gridRef}
                gridOptions={gridOptions}
                columnDefs={colDefs}
                pagination={paginStatus}
                suppressPaginationPanel={true}
                defaultColDef={defaultColDef}
                rowSelection={'multiple'}
            />
        </div>
    )
}


export default MarkoTestAttributeTable