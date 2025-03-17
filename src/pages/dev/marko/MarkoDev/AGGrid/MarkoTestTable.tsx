import { ButtonCreatable } from "@shared/ui/buttons"
import { Button, Col,Row, Space } from "antd"
import { FC, useMemo, useRef, useState, } from "react"
import { AllCommunityModule, ModuleRegistry, themeAlpine, themeBalham, themeQuartz } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useClassesStore } from "@shared/stores/classes";
import { useApi2 } from "@shared/hooks/useApi2";
import { getPackages } from "@shared/api/Packages/Models/getPackages/getPackages";
import { getClassStereotypes } from "@shared/api/ClassStereotypes/Models/getClassStereotypes/getClassStereotypes";
import { useNavigate } from "react-router-dom";
import { IClass } from "@shared/types/classes";
import { VISIBILITY } from "@shared/config/const";
import { ECTooltip } from "@shared/ui/tooltips";
import { getURL } from "@shared/utils/nav";
import { ROUTES, ROUTES_COMMON } from "@shared/config/paths";
import { ArrowsAltOutlined, ShrinkOutlined } from "@ant-design/icons";
import { EditedColumnModal } from "@shared/ui/tables/ECTable2/EditTable/EditedColumnModal";
import { EditTablePagination } from "@shared/ui/tables/ECTable2/EditTable/EditTablePagination";
import MarkoTestButtonDownload from "../MarkoTestButtonDownload";
import MarkoTestClassActionCell from "./MarkoTestClassData/MarkoTestClassActionCell";
import { classGridOptions } from "./MarkoTestClassData/MarkoTestClassData";
import MarkoTestThemeSelection from "./MarkoTestThemeSelection";
import { IMarkoTestTable } from "../IMarkoTest";
import { markoTestPagination } from "../MarkoTestData";
ModuleRegistry.registerModules([AllCommunityModule ]);


const MarkoTestTable: FC<IMarkoTestTable> = ({ ButtonAction, tableRow, colDefs, tableStyle}) => {

    const themes = [
        { id: "Quartz", theme: themeQuartz, },
        { id: "Balham", theme: themeBalham, },
        { id: "Alpine", theme: themeAlpine, },
    ];
    const [theme, setBaseTheme] = useState(themes[0]);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [paginStatus, setPaginStatus] = useState(false)
    const gridRef = useRef();

    const expandedRowData = tableRow.reduce((acc, item) => {
        for (let i = 0; i < 1000; i++) {
            acc.push(item);
        }
        return acc;
    }, []);

    return (
        <div style={tableStyle}>
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
                        <ButtonAction/>
                         Выбор темы:{" "}
                         <MarkoTestThemeSelection options={themes} value={theme} setValue={setBaseTheme} />
                </Space>
                </Col>
                <Col>
                 <Space>
                    {paginStatus && (
                        <EditTablePagination
                            total={tableRow.length}
                            initialPage={currentPage}
                            pageSize={{
                                default: pageSize,
                                values: markoTestPagination,
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
                        rows={tableRow}
                    />
                    <EditedColumnModal 
                        buttonStyle={{height: '35px', width: '35px'}}
                    />
                 </Space>
                </Col>
            </Row>
            <AgGridReact
                gridOptions={classGridOptions}
                rowData={expandedRowData}
                ref={gridRef}
                columnDefs={colDefs}
                pagination={paginStatus}
                paginationPageSize={pageSize}
                paginationPageSizeSelector={markoTestPagination}
                suppressPaginationPanel={true}
                theme={theme.theme}
                rowSelection={'multiple'}
                // domLayout="autoHeight" //Осторожно, это вырубает виртуализацию

                // rowBuffer={50}
                // debounceVerticalScrollbar={true}
                // suppressColumnVirtualisation={true}
                // suppressRowVirtualisation={true}
            />
        </div>
    )
}


export default MarkoTestTable