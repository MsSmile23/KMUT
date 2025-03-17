import { ECTable2 } from "@shared/ui/tables/ECTable2/ECTable2"
import { themeAlpine } from "ag-grid-community";
import { Button, Input, Row } from "antd/lib"
import { useState } from "react";
import styles from './card.module.css'

const colDefs = [
    {
        key: 'id',
        field: "id",
        headerName: '№',
        flex: 1,
        filter: false,
    },
    {
        key: 'available',
        field: "available",
        headerName: 'Доступен',
        flex: 1
    },
    {
        key: 'number',
        field: "number",
        headerName: 'Номер по ГК',
        flex: 1
    },
    {
        key: 'object_code',
        field: "object_code",
        headerName: 'Код объекта',
        flex: 1,
    },
    {
        key: 'adress',
        field: "adress",
        headerName: 'Адрес',
        flex: 2
    },
    {
        key: 'connection_type',
        field: "connection_type",
        headerName: 'Тип подключения',
        flex: 1
    },
    {
        key: 'speed',
        field: "speed",
        headerName: 'Скорость по тарифу',
        flex: 1
    },
    {
        key: 'atributes',
        field: "atributes",
        headerName: 'Атрибуты',
        flex: 1
    },
];

const gridOptions = {
    getRowStyle: (params) => {
        const statusColor = `${params?.data?.status?.color}`;
        return {
            backgroundColor: statusColor,
        };
    },
    theme: themeAlpine.withParams({
        wrapperBorder: false, // Убирает внешнюю границу вокруг всей таблицы  
        headerRowBorder: false, // Убирает горизонтальные границы в заголовке  
        rowBorder: false, // Убирает горизонтальные границы между строками  
        columnBorder: false, // Убирает вертикальные границы между колонками
        headerBackgroundColor: 'black',
        headerTextColor: 'white'
    }),
    defaultColDef: {
        autoHeight: true,
        wrapText: true,
        cellStyle: { wordBreak: 'normal', lineHeight: 'unset' },
        filter: true
    },
    domLayout: 'autoHeight',
}

const ProjectRegionalObjectCard = () => {

    const [searchText, setSearchText] = useState('')
    const [allData, setAllData] = useState([])
    const [dataRow, setDataRow] = useState([])

    const filteredData = (text, rows) => {
        const data = rows.filter(item =>
            item.name.toLowerCase().includes(text.toLowerCase())
        );
        setDataRow(data)
    }

    return (
        <>
            <Row style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: 30, padding: 20 }}>
                <span
                    style={{
                        color: 'white',
                        fontSize: '1.25rem',
                        fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                        fontWeight: 500,
                        letterSpacing: '0.0075em'
                    }}>
                    {/* {row?.name} */}
                    Какой-то текст
                </span>
                <div style={{ height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Input
                        className={styles.antInput}
                        onChange={e => setSearchText(e.target.value)}
                        style={{
                            width: 223,
                            height: 40,
                            borderTopLeftRadius: 4,
                            borderBottomRightRadius: 0,
                            borderTopRightRadius: 0,
                            borderBottomLeftRadius: 4,
                            backgroundColor: 'transparent',
                            borderColor: 'rgb(144, 202, 249)'
                        }}
                        allowClear
                    >
                    </Input>
                    <Button
                        onClick={() => filteredData(searchText, allData)}
                        style={{
                            borderRadius: 0,
                            backgroundColor: 'transparent',
                            color: 'rgb(144, 202, 249)',
                            borderColor: 'rgb(144, 202, 249)',
                            borderLeft: 'none',
                            height: 40,
                            boxSizing: 'border-box',
                            borderTopRightRadius: 4,
                            borderBottomRightRadius: 4
                        }}>
                        Искать
                    </Button>
                </div>
            </Row>
            <ECTable2
                columns={colDefs}
                tableId={'regionalCard'}
                agTable={true}
                switchGrid={false}
                showHeader={false}
                rows={dataRow.length !== 0 ? dataRow : allData}
                gridOptions={gridOptions}
                useTheme={false}
                tableCSS={{ height: '400px', padding: 20 }}
            // onRowClicked={onRowClicked}
            />
        </>
    )
}

export default ProjectRegionalObjectCard