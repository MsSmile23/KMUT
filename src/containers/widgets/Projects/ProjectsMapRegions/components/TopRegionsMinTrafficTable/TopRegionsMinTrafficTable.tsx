import { ECTable2 } from '@shared/ui/tables/ECTable2/ECTable2'

const cols = [
    {
        key: 'id',
        field: 'id',
        headerName: '№',
        filter: false,
        sortable: false,
        flex: 1
    },
    {
        key: 'region',
        field: 'region',
        headerName: 'Регион',
        filter: false,
        sortable: false,
        flex: 5
    },
    {
        key: 'traffic',
        field: 'traffic',
        headerName: 'Суммарный екфашс, ТБ',
        filter: false,
        sortable: false,
        flex: 4
    },
];

const rows = [
    {
        key: '1',
        id: 1,
        region: 'Республика Татарстан (Татарстан)',
        traffic: 542.9,
    },
    {
        key: '2',
        id: 2,
        region: 'Краснодарский край',
        traffic: 526.4,
    },
    {
        key: '3',
        id: 3,
        region: 'Нижегородская область',
        traffic: 514,
    },
    {
        key: '4',
        id: 4,
        region: 'Свердловская область',
        traffic: 409.8,
    },
    {
        key: '5',
        id: 5,
        region: 'Новосибирская область',
        traffic: 382.9,
    },
    {
        key: '6',
        id: 6,
        region: 'Челябинская область',
        traffic: 343.3,
    },
    {
        key: '7',
        id: 7,
        region: 'Пермский край',
        traffic: 339.5,
    },
    {
        key: '8',
        id: 8,
        region: 'Ростовская область',
        traffic: 325.9,
    },
    {
        key: '9',
        id: 9,
        region: 'Красноярский край',
        traffic: 322.3,
    },
    {
        key: '10',
        id: 10,
        region: 'Московская область',
        traffic: 288.3,
    },
];

export const TopRegionsMinTrafficTable = () => {
    return (
        <ECTable2
            rootClassName="alex"
            tableId="Top5Tables"
            className="topTable"
            header="Топ регионов с минимальным суммарным трафиком"
            columns={cols}
            agTable={true}
            rows={rows}
            switchGrid={false}
            showHeader={false}
            getExportRowStyle={(params) => {
                return {
                    borderBottom: '1px solid #ffffff22'
                }
            }}
            tableCSS={{
                height: 550,
                width: '100%',
            }}
            headerCSS={{ height: '80px', border: 'none' }}
            supressHorizScroll={true}
            paginAdditional={{ status: false }}
            // gridOptions={gridOptions}
            // onRowClicked={onRowClicked}
        />
    )
}