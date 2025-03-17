import { ButtonCreatable, ButtonEditRow } from "@shared/ui/buttons"
import { FC, useMemo, useState, } from "react"
import { useClassesStore } from "@shared/stores/classes";
import { useApi2 } from "@shared/hooks/useApi2";
import { getPackages } from "@shared/api/Packages/Models/getPackages/getPackages";
import { getClassStereotypes } from "@shared/api/ClassStereotypes/Models/getClassStereotypes/getClassStereotypes";
import { useNavigate } from "react-router-dom";
import { IClass } from "@shared/types/classes";
import { VISIBILITY } from "@shared/config/const";
import { getURL } from "@shared/utils/nav";
import { ROUTES, ROUTES_COMMON } from "@shared/config/paths";
import MarkoTestClassActionCell from "./MarkoTestClassData/MarkoTestClassActionCell";
import MarkoTestTable from "./MarkoTestTable";
import MarkoTestTableUnited from "./MarkoTestTableUnited";
import ECAGTable from "@shared/ui/tables/ECTable2/ECANTTable/ECAGTable";
import { ECTable2 } from "@shared/ui/tables/ECTable2/ECTable2";
import ClassesDeleteButton from "@entities/classes/ClassesDeleteButton/ClassesDeleteButton";
import { Space } from "antd";
import { ECTooltip } from "@shared/ui/tooltips";
import { EditOutlined } from "@ant-design/icons";
import { SERVICES_CLASSES } from "@shared/api/Classes";


const MarkoTestClassesTable: FC = () => {
  
    const packages = useApi2(getPackages)
    const classes = useClassesStore((st) => [...st.store.data].sort((a, b) => b.id - a.id))
    const stereotypes = useApi2(getClassStereotypes)
    // const [shouldRenderActions, setShouldRenderActions] = useState(false);

    const navigate = useNavigate()

    const { forceUpdate } = useClassesStore.getState()
        
        const deleteButtonHandler = async (id: number) => {
            const resp = await SERVICES_CLASSES.Models.deleteClassById(String(id)).then(resp => {
                if (resp.success) {
                    forceUpdate()
                }
                
                return resp
            })
            
            return resp
        }

    const colDefs = [
        { 
            key: 'actions',
            field: "actions",
            checkboxSelection: true,
            headerName: 'Действия',
            headerCheckboxSelection: true,
            autoHeight: true, 
            cellRenderer: (params) => params.data.actions
        },
        { 
            key: 'id',
            field: "id",
            headerName: 'ID',
        },
        { 
            key: 'name',
            field: "name",
            headerName: 'Имя класса'
        },
        { 
            key: 'codename',
            field: "codename",
            headerName: 'Код' 
        },
        { 
            key: 'visibility',
            field: "visibility",
            headerName: 'Видимость' 
        },
        { 
            key: 'package',
            field: "package",
            headerName: 'Пакет' 
        },
        { 
            key: 'stereotype',
            field: "stereotype",
            headerName: 'Стереотип' 
        },
        { 
            key: 'multiplicity',
            field: "multiplicity",
            headerName: 'Кратность' 
        },
        { 
            key: 'abstract',
            field: "abstract",
            headerName: 'Абстрактный' 
        },
      ];
    
    const ButtonCreate = () => {
        return (
            <ButtonCreatable
                key="button-add-class"
                shape="circle"
                entity="classes"
                buttonAdd={true}
                text={false}
                onClick={() => {
                    navigate(getURL(
                        `${ROUTES.CLASSES}/${ROUTES_COMMON.CREATE}`,
                            'constructor'
                    ))
                }}
            />
        )
    }

    const tableRowData = useMemo(() => {
        return classes.map((item: IClass) => {
            const visibility = VISIBILITY[item.visibility]
            const pack = packages.data.find((pack) => pack.id === item.package_id)
            const stereotype = stereotypes.data.find(({ id }) => item.class_stereotype_id === id)

            return {
                id: item?.id,
                key: `${item.id}`,
                name: item.name,
                codename: item.codename,
                visibility: visibility,
                package: pack?.name,
                stereotype: stereotype?.name || '---',
                multiplicity: item.multiplicity_left + ' - ' + (item.multiplicity_right ?? '*'),
                abstract: item.is_abstract ? '✔' : '',
                actions: ( 
                    <Space>
                            <ButtonEditRow
                                onClick={() => {
                                    navigate(getURL(
                                    `${ROUTES.CLASSES}/${ROUTES_COMMON.UPDATE}/${item?.id || item?.data?.id}`,
                                    'constructor'
                                    ))
                                }}
                                type="link"
                                icon={<EditOutlined />}
                            />
                            <ClassesDeleteButton 
                                withConfirm
                                onClick={async () => {
                                    const response = await deleteButtonHandler(item?.id || item?.data?.id)

                                    return response
                                }}
                                disablePopup={true}
                            />
                        </Space>
                )
            }
        })
    }, [classes, packages.data, stereotypes.data])

    const expandedRowData = tableRowData.reduce((acc, item) => {
        for (let i = 0; i < 10; i++) {
            acc.push(item);
        }
        return acc;
    }, []);

    return (
        // <MarkoTestTableUnited
        //     ButtonAction={buttonCreate}
        //     tableRow={tableRowData}
        //     columns={colDefs}
        //     tableStyle={{ width: "100%", height: "50%"}}
        //     // setColDefs={setColDefs}
        //     tableId={'marko-test-classes'}
        // />
        // <ECAGTable
        //     buttons={{
        //         left: [
        //             <>
        //                 <ButtonCreate/>
        //             </>
        //         ]
        //     }}
        //     tableRow={tableRowData}
        //     columns={colDefs}
        //     tableCSS={{width: "100%", height: "50%"}}
        //     tableId={'marko-test-classes'}
        // />    
        <ECTable2 
            buttons={{
                left: [
                        <ButtonCreate/>
                ]
            }}
            tableId={'marko-test-classes'}
            tableCSS={{width: "100%", height: "100%"}}
            columns={colDefs}
            rows={tableRowData}
            agTable={true}
            switchGrid={false}
            // paginator={{page: 1, pageSize: 6}}
            changeAction={false}
            changeColumns={false}
            // paginAdditional={{suppress: false}}
            paginAdditional={{ suppress: false}}
        />
    )
}


export default MarkoTestClassesTable