import { ButtonAdd, ButtonDeleteRow, ButtonEditRow } from "@shared/ui/buttons"
import { Button, Col,Popconfirm,Row, Space } from "antd"
import { FC, useRef, useState, } from "react"
import { AllCommunityModule, ModuleRegistry, } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useNavigate } from "react-router-dom";
import { ECTooltip } from "@shared/ui/tooltips";
import { getURL } from "@shared/utils/nav";
import { ROUTES, ROUTES_COMMON } from "@shared/config/paths";
import { ArrowsAltOutlined, ShrinkOutlined } from "@ant-design/icons";
import { EditedColumnModal } from "@shared/ui/tables/ECTable2/EditTable/EditedColumnModal";
import { EditTablePagination } from "@shared/ui/tables/ECTable2/EditTable/EditTablePagination";
import MarkoTestButtonDownload from "../MarkoTestButtonDownload";
import { getClassFromClassesStore } from "@shared/utils/common";
import { getRelationsForClassForm } from "@shared/utils/classes";
import { useApi2 } from "@shared/hooks/useApi2";
import { getRelations } from "@shared/api/Relations/Models/getRelations/getRelations";
import { relationsPayload, relationsTranslation } from "@containers/relations/RelationTableContainer/relationsTableData";
import { deleteRelationById } from "@shared/api/Relations/Models/deleteRelationById/deleteRelationById";
import { useOpen } from "@shared/hooks/useOpen";
ModuleRegistry.registerModules([AllCommunityModule ]);


const MarkoTestRelationTable: FC<{
    isModal?: boolean
}> = ({
    isModal,
}) => {
  
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [paginStatus, setPaginStatus] = useState(false)
    const gridRef = useRef();

    const navigate = useNavigate()
    const [editedId, setEditedId] = useState(0)
    const modal = useOpen()

    const relations = useApi2(getRelations, {
            state: [],
            payload: relationsPayload
        })

    const relationsToRender = getRelationsForClassForm(relations?.data)

    const rows: any[] = [...relationsToRender].sort((a, b) => b.id - a.id)
            .map((relation, i) => {
                const lmplr = relation.left_multiplicity_right
                const rmplr = relation.right_multiplicity_right
    
                return {
                    id: relation.id,
                    key: `relation-${i}`,
                    relType: relationsTranslation?.[relation.relation_type],
                    relTypeFilterKey: relation.relation_type,
                    source: getClassFromClassesStore(relation.left_class_id)?.name,
                    sourceQual: relation.left_attribute?.name,
                    sourceMult: `${relation.left_multiplicity_left ?? '-'}
                      / ${[null, 0].includes(lmplr) ? '*' : lmplr ?? '-'}`,
                    aim: getClassFromClassesStore(relation.right_class_id)?.name,
                    aimQual: relation.right_attribute?.name,
                    aimMult: `${relation.right_multiplicity_left ?? '-'}
                      / ${[null, 0].includes(rmplr) ? '*' : rmplr ?? '-'}`,
                    relatClass: relation.assoc_class?.name,
                    stereoType: relation?.relation_stereotype?.name,
                    name: relation.name,
                    actions: relation,
                }
            })
            .map((el) => Object.fromEntries(Object.entries(el).map(([k, v]) => [k, v || '-'])))
            .sort()

    const defaultColDef = {
        filter: true,
        icons: {
            filter: `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="22px" height="22px" margin-top="2px" viewBox="0 0 32 32">
                <title>filter</title>
                <path d="M26 8.184c-0.066 2.658-4.058 5.154-6.742 7.974-0.168 0.196-0.252 0.424-0.258 0.682v3.66l-6 4.5c0-2.74 0.066-5.482-0.002-8.222-0.018-0.234-0.102-0.442-0.256-0.62-2.716-2.854-6.682-5.548-6.742-7.974v-2.184h20v2.184zM8 8c0 0.304 0.060 0.612 0.258 0.842 2.716 2.854 6.682 5.548 6.742 7.974v4.184l2-1.5v-2.684c0.066-2.658 4.058-5.154 6.742-7.974 0.198-0.23 0.258-0.538 0.258-0.842h-16z"></path>
                </svg>`,
          },
    };

    const ActionCellRenderer = ({relation}) => {
        return (
            <Space>
                    <ButtonEditRow
                        onClick={() => {
                            isModal == true 
                            ? setEditedId(relation.id) 
                            : navigate(getURL(
                             `${ROUTES.RELATIONS}/${ROUTES_COMMON.UPDATE}/${relation?.data.id}`, 
                                'constructor'
                            ))}}
                    />
                    <Popconfirm
                        title="Удаление"
                            description={`Удалить ${relation?.data.name}?`}
                            okText="Да"
                            cancelText="Нет"
                            onConfirm={() => {
                                deleteRelationById(`${relation?.data.id}`).then(() => {
                                    relations.request(relationsPayload).then()
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
                    relation={params}
                />
            ),
        },
        { 
            field: "id",
            headerName: 'ID',
        },
        { 
            field: "name",
            headerName: 'Название'
        },
        { 
            field: "relType",
            headerName: 'Тип' 
        },
        { 
            field: "source",
            headerName: 'Источник' 
        },
        { 
            field: "dataType",
            headerName: 'Тип данных' 
        },
        { 
            field: "sourceQual",
            headerName: 'Атрибут источника' 
        },
        { 
            field: "sourceMult",
            headerName: 'Кратность' 
        },
        { 
            field: "aim",
            headerName: 'Цель' 
        },
        { 
            field: "aimQual",
            headerName: 'Атрибут цели' 
        },
        { 
            field: "aimMult",
            headerName: 'Кратность цели' 
        },
        { 
            field: "relatClass",
            headerName: 'Класс связи' 
        },
        { 
            field: "stereoType",
            headerName: 'Стереотип связи' 
        },
      ]);


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
                        <ButtonAdd
                            key="button-edit-relation-table"
                            shape="circle"
                            text={false}
                            onClick={() => { 
                                isModal 
                                ? modal.open() 
                                : navigate(getURL(
                                `${ROUTES.RELATIONS}/${ROUTES_COMMON.CREATE}`, 
                                'constructor'
                                ))}}
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
                        filename={'Таблица связей'}
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
                columnDefs={colDefs}
                pagination={paginStatus}
                suppressPaginationPanel={true}
                defaultColDef={defaultColDef}
                rowSelection={'multiple'}
            />
        </div>
    )
}


export default MarkoTestRelationTable