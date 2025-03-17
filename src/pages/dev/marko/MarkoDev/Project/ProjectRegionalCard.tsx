import { FC, memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { ECTable2 } from "@shared/ui/tables/ECTable2/ECTable2";
import styles from './card.module.css'
import { Button, Col, Input, message, Row, Space } from "antd";
import Title from "antd/lib/typography/Title";
import { GridOptions, themeAlpine } from 'ag-grid-community';
import { DefaultModal2 } from "@shared/ui/modals";
import { useGetObjects } from "@shared/hooks/useGetObjects";
import { generalStore } from "@shared/stores/general";
import { useTheme } from "@shared/hooks/useTheme";
import { selectAccount, useAccountStore } from "@shared/stores/accounts";
import { createColorForTheme } from "@shared/utils/Theme/theme.utils";
import ProjectRegionalObjectCard from "./ProjectRegionalObjectCard";
import UpArrow from "@shared/ui/icons/UpArrow";
import { EditTable } from "@shared/ui/tables/ECTable2/EditTable/EditTable";


interface IRegion {
    id: number
    name: string
    status: {
        color: string
    }
    statusCount: {
        connected: number
        notAvailable: number
        repair: number
    }
    dost: number
}

interface IRegionalCard {
    row: {
        id: number
        name: string
        shortName: string
        status?: {
            color?: string
            label?: string
            mneno?: string
        }
        statusCount: {
            connected: number
            notAvailable: number
            repair: number
        }
        dost: number
        municipalities: IRegion[]

    }
    closeModal?: () => void
}

const colDefs = [
    {
        key: 'id',
        dataIndex: "id",
        title: '№',
        filter: false,
        width: 70
        
    },
    {
        key: 'name',
        dataIndex: "name",
        title: 'Муниципалитет',
        width: 210
    },
    {
        key: 'statusCount',
        dataIndex: "statusCount",
        title: 'Подключено/Недоступно/Ремонт',
        width: 280
    },
    {
        key: 'dost',
        dataIndex: "dost",
        title: 'Доступность',
       width: 100
    },
];

const ProjectRegionalCard: FC<IRegionalCard> = ({ row, closeModal }) => {

    // const incidents = useApi2(
    //             (payload?: any) => getIncidents((payload || {})),
    //             { onmount: false } ,
    //     )

    // Пример сервака, куда мы будем делать запрос  

    const interfaceView = generalStore((st) => st.interfaceView)
    const isShowcase = interfaceView === 'showcase'
    const theme = useTheme()
    const accountData = useAccountStore(selectAccount)
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode
    const backgroundColor = useMemo(() => {
        return createColorForTheme(theme?.widget?.background, theme?.colors, themeMode) || 'white'
    }, [theme, themeMode]);
    const backgroundColor2 = useMemo(() => {
        return createColorForTheme(theme?.backgroundColor, theme?.colors, themeMode) || 'white'
    }, [theme, themeMode]);
    const textColor = useMemo(() => createColorForTheme(theme?.widget?.textColor, theme?.colors, themeMode),
        [theme, themeMode]);

    const [searchText, setSearchText] = useState('');
    const [allData, setAllData] = useState([])
    const [dataRow, setDataRow] = useState([])
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)



 useEffect(() => {
     const data = row?.municipalities?.map((item: IRegion) => {
         return {
             id: item?.id,
             key: `${item.id}`,
             name: item?.name,
             statusCount: `${item?.statusCount?.connected}/${item?.statusCount?.notAvailable}/${item?.statusCount?.repair}`,
             status: item?.status,
             dost: `${item?.dost}%`,
         }
     })
     setDataRow(data)
     setAllData(data)
 }, [row])

    const getRowStyle = (params) => {
        const statusColor = `${params?.data?.status?.color}`;
        return {
            backgroundColor: statusColor,
        };
    };

    const gridOptions: GridOptions = {
        theme: themeAlpine.withParams({
            wrapperBorder: false, // Убирает внешнюю границу вокруг всей таблицы  
            headerRowBorder: false, // Убирает горизонтальные границы в заголовке  
            rowBorder: false, // Убирает горизонтальные границы между строками  
            columnBorder: false, // Убирает вертикальные границы между колонками
            headerBackgroundColor: 'black',
            headerTextColor: 'white',

        }),
        defaultColDef: {
            autoHeight: true,
            wrapText: true,
            cellStyle: { wordBreak: 'normal', lineHeight: 'unset' },
            filter: true
        },
        domLayout: 'autoHeight',
    }

    const filteredData = (text, row) => {
        const data = row.filter(item =>
            item.name.toLowerCase().includes(text.toLowerCase())
        );
        if (data.length === 0) {
            message.error('Ничего не найдено')
        }
        setDataRow(data)
    }

    const onRowClicked = (event) => {
        setIsModalVisible(true)
    };

    const modalStyles = useMemo(
        () => `
        .ant-modal-content {
            background-color: ${backgroundColor} !important;
            padding: 0 !important;
        }
        .ant-modal {
            padding: 0 !important;
        }
        .ag-body {
            background-color: ${backgroundColor} !important;
        }
        .ant-table-measure-row{
            display: none !important
            }
            .ant-table-thead {
            background: rgb(32, 32, 32) !important
            }

            .ant-table-cell ant-table-column-has-sorters {
             background: rgb(32, 32, 32) !important
            }
             tr th {
              background: rgb(32, 32, 32) !important
             }

             .ant-table-cell {
             padding: 6px !important}

             .ant-table-column-title span {
             font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  font-weight: 500;
  font-size: 0.875rem;
  padding-top: 6px;
  padding-bottom: 6px;
}

 .ant-table-content {
 overflow: initial !important}
             
    `,
        [backgroundColor]
    )


    const rowClassName = (record) => {
        return `row-${record.key}`;
      };

      useEffect(() => {
        dataRow.forEach((record) => {
          const row = document.querySelector(`.row-${record.key}`);
          if (row) {
            row.style.backgroundColor = record.status?.color;
            row.style.color =  '#000000',
            row.style.cursor = 'pointer'
            row.style.fontFamily = '"Roboto", "Helvetica", "Arial", sans-serif;'
          }
        });
      }, [dataRow]);
    // const tableHeight = Math.min(allData.length * 50 + 100, 500);
    // const tableFilterHeight = Math.min(dataRow.length * 50 + 100, 200)

    
    return (
        <>
            <Row
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%',
                    alignItems: 'center',
                    padding: 20,
                }}
            >
                <span
                    style={{
                        color: 'white',
                        fontSize: '1.25rem',
                        fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                        fontWeight: 500,
                        letterSpacing: '0.0075em',
                    }}
                >
                    {row?.name}
                </span>
                <div style={{ height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Input
                    
                        className={styles.antInput}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{
                            width: 223,
                            height: 40,
                            borderTopLeftRadius: 4,
                            borderBottomRightRadius: 0,
                            borderTopRightRadius: 0,
                            borderBottomLeftRadius: 4,
                            backgroundColor: 'transparent',
                            borderColor: 'rgb(144, 202, 249)',
                        }}
                        allowClear
                    ></Input>
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
                            borderBottomRightRadius: 4,
                        }}
                    >
                        Искать
                    </Button>
                </div>
            </Row>

            {/* // <Card style={{ ...headerCSS, background: defaultTableHeaderStyle.background }}> */}
            <Title style={{ color: textColor, fontSize: 30, margin: 0, fontWeight: 500, textAlign: 'center' }}>
                {`Всего объектов: ${row?.statusCount?.connected} Доступность: ${row?.dost} %`}
            </Title>

            <Title
                level={5}
                style={{
                    opacity: '0.4',
                    display: 'flex',
                    justifyContent: 'space-around',
                    color: textColor,
                    margin: '0',
                    fontSize: '1.5rem',
                    fontWeight: 400,
                }}
            >
                {`Недоступно: ${row?.statusCount?.notAvailable}`}
            </Title>

            {/* // </Card> */}
            <div className={'regionCardTable'} style={{padding: '0 20px'}}>
                <EditTable
                    customHeight={680}
                    rowClassName={rowClassName}
                    // rowStyle={(record) => ({ backgroundColor: record.status?.color })}
                    rowSelection={null}
                    hideDownloadButton
                    hideSettingsButton
                    hidePaginationHeader
                    tableId={`regionTable_${row?.id}`}
                    rows={dataRow}
                    columns={colDefs}
                    className="region-table"
                    // pagination={{ position: ['bottomRight'], pageSize: 10  }}
                    // scroll={{ x: 2000 }}

                    paginator={{ page: 1, pageSize: 1000, enablePageSelector: false }}
                />
            </div>

            {/* <ECTable2
                columns={colDefs}
                tableId={'regionalCard'}
                agTable={false}
                switchGrid={false}
                showHeader={false}
                rows={dataRow.length !== 0 ? dataRow : allData}
                gridOptions={gridOptions}
                useTheme={false}
                tableCSS={{ height: '400px', padding: 20 }}
                agGridCSS={{ height: '300px', overflow: 'auto', }}
                onRowClicked={onRowClicked}
                header={`Всего объектов: ${row?.statusCount?.connected} Доступность: ${row?.dost} %`}
                headerCSS={{ display: 'flex', justifyContent: 'space-around', border: 'none', margin: '0', padding: '0',}}
                additionalInfo={`Недоступно:${row?.statusCount?.notAvailable}`}
                paginAdditional={{ status: false }}
                classes={styles.gridCard}
                getExportRowStyle={getRowStyle}
            /> */}
            <style>{modalStyles}</style>
            <DefaultModal2
                closeIcon={null}
                title=""
                open={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false)
                }}
                destroyOnClose
                footer={
                    <div
                        style={{
                            backgroundColor: backgroundColor2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            height: 50,
                            color: textColor,
                        }}
                    >
                        <div style={{ marginLeft: 20, display: 'flex', alignItems: 'center' }}>
                            <UpArrow style={{ height: 14, width: 20 }} fill={'red'} />
                            <span>- требует расширения канала</span>
                        </div>
                        <div>
                            <Button
                                style={{
                                    color: 'rgb(144, 202, 249)',
                                    backgroundColor: backgroundColor2,
                                    border: 'none',
                                    fontSize: '16px',
                                }}
                                onClick={() => setIsModalVisible(false)}
                            >
                                Назад
                            </Button>
                            <Button
                                style={{
                                    color: 'rgb(144, 202, 249)',
                                    backgroundColor: backgroundColor2,
                                    border: 'none',
                                    fontSize: '16px',
                                }}
                                onClick={() => {
                                    setIsModalVisible(false)
                                    closeModal()
                                }}
                            >
                                Закрыть
                            </Button>
                        </div>
                    </div>
                }
                width="60vw"
                height={650}
                style={{
                    backgroundColor: backgroundColor,
                    marginTop: -50,
                }}
                contentStyles={{
                    marginTop: 40,
                }}
            >
                <style>{modalStyles}</style>
                <ProjectRegionalObjectCard />
            </DefaultModal2>
        </>
    )
}


export default memo(ProjectRegionalCard)