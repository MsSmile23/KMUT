import { Button, Col,Row, Space } from "antd"
import { FC, useRef, useState, } from "react"
import { AllCommunityModule, ModuleRegistry, themeAlpine, themeBalham, themeQuartz } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { ECTooltip } from "@shared/ui/tooltips";
import { ArrowsAltOutlined, ShrinkOutlined } from "@ant-design/icons";
import { EditedColumnModal } from "@shared/ui/tables/ECTable2/EditTable/EditedColumnModal";
import { EditTablePagination } from "@shared/ui/tables/ECTable2/EditTable/EditTablePagination";
import MarkoTestButtonDownload from "../MarkoTestButtonDownload";
import { classGridOptions } from "./MarkoTestClassData/MarkoTestClassData";
import MarkoTestThemeSelection from "./MarkoTestThemeSelection";
import { IMarkoTestTableServer } from "../IMarkoTest";
import { markoTestPagination } from "../MarkoTestData";
ModuleRegistry.registerModules([AllCommunityModule ]);


const MarkoTestTableServer: FC<IMarkoTestTableServer> = ({ ButtonAction, tableRow, colDefs, tableStyle, server, pagination}) => {

    const themes = [
        { id: "Quartz", theme: themeQuartz, },
        { id: "Balham", theme: themeBalham, },
        { id: "Alpine", theme: themeAlpine, },
    ];
    const [theme, setBaseTheme] = useState(themes[0]);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [paginStatus, setPaginStatus] = useState(true)
    const [sort, setSort] = useState('-id')
    const [loading, setLoading] = useState(false)
    const gridRef = useRef();


    const onGridReady = async (params) => {

        setLoading(true)
        const payload = {
            page: currentPage,
            per_page: pageSize,
        };
        try {
            const response = await server.request(payload);
            tableRow = response;        
            params.successCallback(tableRow);
            setLoading(false)
        } 
        catch (error) {
            console.error('Error fetching data:', error);
            params.failCallback();
            setLoading(false)
        }
    };


    const serverUpdate = async (page, pgsize, sortData) => {
        setLoading(true)
        const payload = {
            page: page,
            per_page: pgsize,
            sort: sortData,
};
        try {
            const response = await server.request(payload);
            setLoading(false)
            return tableRow = response;        
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false)
        }
        setLoading(false)
    }
    
    const onSortChanged = async (event) => {
        const sortedColumns = event?.columns.slice(-1)[0]
        if( sortedColumns.sort === 'asc') {
            setSort(`-${sortedColumns.colId}`)
        } else if (sortedColumns.sort === 'desc' ) {
            setSort(sortedColumns.colId)
        }
        serverUpdate(currentPage, pageSize, sort)
    };

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
                        {ButtonAction && 
                            <ButtonAction/>          
                        }     
                         Выбор темы:{" "}
                         <MarkoTestThemeSelection options={themes} value={theme} setValue={setBaseTheme} />
                </Space>
                </Col>
                <Col>
                 <Space>
                    {paginStatus && (
                        <EditTablePagination
                            total={pagination ? pagination : tableRow.length}
                            initialPage={currentPage}
                            pageSize={{
                                default: pageSize,
                                values: markoTestPagination,
                            }}
                            onChange={(page, size ) => {
                                setPageSize(size)
                                setCurrentPage(page)
                                serverUpdate(page, size, sort)
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
                onGridReady={onGridReady}
                gridOptions={classGridOptions}
                rowData={tableRow}
                ref={gridRef}
                columnDefs={colDefs}
                pagination={paginStatus}
                paginationPageSize={pageSize}
                paginationPageSizeSelector={markoTestPagination}
                suppressPaginationPanel={true}
                theme={theme.theme}
                rowSelection={'multiple'}
                onSortChanged={onSortChanged}
                loading={loading}
            />
        </div>
    )
}


export default MarkoTestTableServer