import { FC, useEffect, useMemo, useState, } from "react"
import { ECTable2 } from "@shared/ui/tables/ECTable2/ECTable2";
import { GridOptions, themeAlpine } from 'ag-grid-community';
import styles from './avaria.module.css'
import { generalStore } from "@shared/stores/general";
import { useTheme } from "@shared/hooks/useTheme";
import { useAccountStore, selectAccount } from "@shared/stores/accounts";
import { createColorForTheme } from "@shared/utils/Theme/theme.utils";
import { postMassFails } from "@shared/api/Voshod/Models/postMassFails/postMassFails";
import { IMassFailsRegion } from "@shared/types/voshod-filters";
import { selectObjectByIndex, useObjectsStore } from "@shared/stores/objects";
import { useApi2 } from "@shared/hooks/useApi2";

const colDefs = [
    {
        key: 'number',
        field: "number",
        headerName: '№',
        filter: false,
        flex: 1
    },
    {
        key: 'region',
        field: "region",
        headerName: 'Регионы',
        filter: false,
        flex: 2
    },
    {
        key: 'forbidden',
        field: "forbidden",
        headerName: 'Недоступно объектов',
        filter: false,
        flex: 2
    },
    {
        key: 'timeStart',
        field: "timeStart",
        headerName: 'Время начала',
        filter: false,
        flex: 2
    },
    {
        key: 'localTimeStart',
        field: "localTimeStart",
        headerName: 'Местное время начала',
        filter: false,
        flex: 2
    },
];


const MarkoAvaria: FC = () => {
    const getobjectByIndex = useObjectsStore(selectObjectByIndex);

    const regionFails = useApi2(
        (payload: object) => postMassFails({ ...payload, filters: [] }),
        { onmount: false }
    )

    const rowPerPage = 5;

    const rowData = useMemo(() => {
        const regionsRowDaa = regionFails?.data || [];

        const regionsRowData = regionsRowDaa.map((region, index) => {
            const regionObject = getobjectByIndex('id', region.region_id);

            return {
                key: region.id.toString(),
                number: index + 1,
                region: regionObject?.name || '',
                forbidden: region.objectsNotAvailable,
                timeStart: region.localTimeStart,
                localTimeStart: region.localTimeStart,
            }
        });

        return regionsRowData;
    }, [regionFails]);

    const interfaceView = generalStore(st => st.interfaceView)
    const isShowcase = interfaceView === 'showcase'
    const theme = useTheme()
    const accountData = useAccountStore(selectAccount)
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode
    const textColor = isShowcase
        ? createColorForTheme(theme?.widget?.textColor, theme?.colors, themeMode)
        : 'black'

    // const rowData = [
    //     {
    //         key: '1',
    //         number: 1,
    //         region: 'Москва',
    //         forbidden: 5,
    //         timeStart: '2023-10-01 08:00',
    //         localTimeStart: '2023-10-01 11:00',
    //     },
    //     {
    //         key: '2',
    //         number: 2,
    //         region: 'Санкт-Петербург',
    //         forbidden: 3,
    //         timeStart: '2023-10-01 08:00',
    //         localTimeStart: '2023-10-01 11:00',
    //     },
    //     {
    //         key: '3',
    //         number: 3,
    //         region: 'Новосибирск',
    //         forbidden: 0,
    //         timeStart: '2023-10-01 08:00',
    //         localTimeStart: '2023-10-01 11:00',
    //     },
    //     {
    //         key: '4',
    //         number: 4,
    //         region: 'Екатеринбург',
    //         forbidden: 2,
    //         timeStart: '2023-10-01 08:00',
    //         localTimeStart: '2023-10-01 11:00',
    //     },
    //     {
    //         key: '5',
    //         number: 5,
    //         region: 'Казань',
    //         forbidden: 1,
    //         timeStart: '2023-10-01 08:00',
    //         localTimeStart: '2023-10-01 11:00',
    //     },
    //     {
    //         key: '6',
    //         number: 6,
    //         region: 'Нижний Новгород',
    //         forbidden: 4,
    //         timeStart: '2023-10-01 08:00',
    //         localTimeStart: '2023-10-01 11:00',
    //     },
    //     {
    //         key: '7',
    //         number: 7,
    //         region: 'Челябинск',
    //         forbidden: 6,
    //         timeStart: '2023-10-01 08:00',
    //         localTimeStart: '2023-10-01 11:00',
    //     },
    //     {
    //         key: '8',
    //         number: 8,
    //         region: 'Ростов-на-Дону',
    //         forbidden: 0,
    //         timeStart: '2023-10-01 08:00',
    //         localTimeStart: '2023-10-01 11:00',
    //     },
    //     {
    //         key: '9',
    //         number: 9,
    //         region: 'Уфа',
    //         forbidden: 2,
    //         timeStart: '2023-10-01 08:00',
    //         localTimeStart: '2023-10-01 11:00',
    //     },
    //     {
    //         key: '10',
    //         number: 10,
    //         region: 'Волгоград',
    //         forbidden: 3,
    //         timeStart: '2023-10-01 08:00',
    //         localTimeStart: '2023-10-01 11:00',
    //     },
    // ]

    const gridOptions: GridOptions = {
        theme: themeAlpine,
        rowClassRules: {
            'custom-row': 'true', // Применяем класс ко всем строкам
        },
    }

    // const tableRowData = useMemo(() => {
    //     return classes.map((item: IClass) => {
    //         const visibility = VISIBILITY[item.visibility]
    //         const pack = packages.data.find((pack) => pack.id === item.package_id)
    //         const stereotype = stereotypes.data.find(({ id }) => item.class_stereotype_id === id)

    //         return {
    //             id: item?.id,
    //             key: `${item.id}`
    //             name: item.name,
    //             codename: item.codename,
    //             visibility: visibility,
    //             package: pack?.name,
    //             stereotype: stereotype?.name || '---',
    //             multiplicity: item.multiplicity_left + ' - ' + (item.multiplicity_right ?? '*'),
    //             abstract: item.is_abstract ? '✔' : '',
    //             actions: ( 
    //                 <MarkoTestClassActionCell item={item}/>
    //             )
    //         }
    //     })
    // }, [classes, packages.data, stereotypes.data])

    return (
        <>
            <h2
                style={{
                    fontWeight: 400,
                    fontSize: '1.5rem',
                    color: textColor,
                    marginBottom: 0
                }}
            >
                Массовые аварии "онлайн"
            </h2>

            <ECTable2
                tableId={'avariaTable'}
                tableCSS={{ width: "100%", height: "330px" }}
                columns={colDefs}
                classes={styles.avaria}
                agTable={true}
                switchGrid={false}
                showHeader={false}
                rows={rowData}
                paginAdditional={{
                    suppress: false,
                }}
                gridOptions={gridOptions}
                // header={'Массовые аварии "онлайн"'}
                headerCSS={{ border: 'none', margin: '0', padding: '0' }}
                emptyText={`На данный момент нет активных массовых аварий`}
                getExportRowStyle={() => {
                    return {
                        borderBottom: '1px solid #ffffff22'
                    }
                }}
                loading={regionFails.loading}
                server={{
                    request: async ({ filterValue, ...meta }) => {
                        const payload = {
                            ...meta,
                        }

                        return regionFails.request(payload)
                    },
                }}
                paginator={{
                    page: Number(regionFails.pagination.currentPage || 1),
                    pageSize: rowPerPage,
                    total: Number(regionFails.pagination.total),
                    enablePageSelector: true,
                }}
            />
        </>
    )
}


export default MarkoAvaria