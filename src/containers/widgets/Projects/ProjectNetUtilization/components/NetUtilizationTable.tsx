import { ECTable2 } from '@shared/ui/tables/ECTable2/ECTable2';
import './NetUtilizationTable.css';
import { useMemo, useState } from 'react';
import { DefaultModal2 } from '@shared/ui/modals';
import { useTheme } from '@shared/hooks/useTheme';
import { selectAccount, useAccountStore } from '@shared/stores/accounts';
import { createColorForTheme } from '@shared/utils/Theme/theme.utils';
import { Button } from 'antd/lib';

const cols = [
    {
        key: 'key',
        field: 'key',
        headerName: '№',
        filter: false,
        sortable: true,
        flex: 1
    },
    {
        key: 'st',
        field: 'st',
        headerName: 'Статус',
        filter: false,
        sortable: false,
        flex: 1,
        cellRenderer: ({ data }) => (
            <div
                style={{
                    background: '#98c667',
                    borderRadius: '100%',
                    height: 20,
                    width: 20,
                    marginTop: 10,
                }}
            />
        ),
    },
    {
        key: 'a',
        field: 'a',
        headerName: 'Cубъект РФ',
        filter: false,
        sortable: true,
        flex: 2,
    },
    {
        key: 'b',
        field: 'b',
        headerName: 'Номер по ГК',
        filter: false,
        sortable: true,
        flex: 2,
    },
    {
        key: 'c',
        field: 'c',
        headerName: 'Адрес',
        filter: false,
        sortable: true,
        flex: 4,
    },
    {
        key: 'd',
        field: 'd',
        headerName: 'Атрибуты',
        filter: false,
        sortable: false,
        flex: 2,
        cellRenderer: ({ data }) => (
            <div
                style={{
                    background: '#515151',
                    borderRadius: 7,
                    display: 'inline-block',
                    fontSize: 12,
                    marginRight: 10,
                    padding: '3px 15px',
                    height: 20,
                    lineHeight: '17px',
                }}
            >
                ЦОС
            </div>
        ),
    },
    {
        key: 'f',
        field: 'f',
        headerName: 'Скорость подключения Мбит/с',
        filter: false,
        sortable: true,
        flex: 2
    },
    {
        key: 'g',
        field: 'g',
        headerName: 'Максимальная загрузка (приём) Мбит/с',
        filter: false,
        sortable: true,
        flex: 2
    },
    {
        key: 'h',
        field: 'h',
        headerName: 'Максимальная загрузка (передача) Мбит/с',
        filter: false,
        sortable: true,
        flex: 2
    },
    {
        key: 'k',
        field: 'k',
        headerName: 'Средняя загрузка (приём) Мбит/с',
        filter: false,
        sortable: true,
        flex: 2
    },
    {
        key: 'l',
        field: 'l',
        headerName: 'Средняя загрузка (передача) Мбит/с',
        filter: false,
        sortable: true,
        flex: 2
    },
    {
        key: 'm',
        field: 'm',
        headerName: 'Объем полученной информации, Мбайт/с',
        filter: false,
        sortable: true,
        flex: 2
    },
    {
        key: 'n',
        field: 'n',
        headerName: 'Объем переданной информации, Мбайт/с',
        filter: false,
        sortable: true,
        flex: 2
    },
    {
        key: 'o',
        field: 'o',
        headerName: 'Загрузка канала % (прием)',
        filter: false,
        sortable: true,
        flex: 2
    },
    {
        key: 'p',
        field: 'p',
        headerName: 'Загрузка канала % (передача)',
        filter: false,
        sortable: true,
        flex: 2
    },
];

const rows = [
    {
        key: '1',
        a: 'Алтайский край',
        b: 19074,
        c: '658101, Алтайский край, Алейский р-н, с Большепанюшево, Садовая ул., д.2 к.Б',
        d: '-',
        e: 50,
        f: 50,
        g: 29.0626,
        h: 0.11,
        k: 1.7049,
        l: 0.67,
        m: 0.06,
        n: 24271.40,
        o: 2600.19,
        p: 1.33,
    },
    {
        key: '2',
        a: 'Алтайский край',
        b: 19077,
        c: 'Алтайский край, Алейский район, п. Совхозный, ул. Гагарина, 2',
        d: '-',
        e: 50,
        f: 50,
        g: 33.3823,
        h: 0.05,
        k: 0.8243,
        l: 0.28,
        m: 0.03,
        n: 10200.90,
        o: 1496.79,
        p: 0.55,
    },
    {
        key: '3',
        a: 'Алтайский край',
        b: 19079,
        c: 'Алтайский край, Алтайский район, с. Белое, ул. Центральная, 18 ЦОС',
        d: '-',
        e: 50,
        f: 50,
        g: 25.3363,
        h: 0.03,
        k: 1.2321,
        l: 0.26,
        m: 0.02,
        n: 9540.20,
        o: 1154.75,
        p: 0.51,
    },
    {
        key: '4',
        a: 'Алтайский край',
        b: 19080,
        c: 'Алтайский край, Алтайский район, с. Куяган, ул. Октябрьская, 4 ЦОС',
        d: '-',
        e: 50,
        f: 50,
        g: 60,
        h: 0.09,
        k: 2.862,
        l: 0.39,
        m: 0.05,
        n: 14206.60,
        o: 2167.98,
        p: 0.77,
    },
    {
        key: '5',
        a: 'Алтайский край',
        b: 19081,
        c: 'Алтайский край, Алтайский район, с. Куяча, ул. Школьная, 1 ЦОС',
        d: '-',
        e: 50,
        f: 50,
        g: 11.803,
        h: 0.08,
        k: 1.6809,
        l: 0.16,
        m: 0.04,
        n: 6272.44,
        o: 2053.29,
        p: 0.31,
    },
    {
        key: '6',
        a: 'Алтайский край',
        b: 19082,
        c: 'Алтайский край, Алтайский район, с. Нижнекаменка, ул. Кирова, 2 ЦОС',
        d: '-',
        e: 50,
        f: 50,
        g: 18.8891,
        h: 0.15,
        k: 2.7108,
        l: 0.41,
        m: 0.07,
        n: 15028.70,
        o: 3334.68,
        p: 0.81,
    },
    {
        key: '7',
        a: 'Алтайский край',
        b: 19083,
        c: 'Алтайский край, Алтайский район, с. Россоши, ул. Ленина, 20 А ЦОС',
        d: '-',
        e: 50,
        f: 50,
        g: 20.2936,
        h: 0.03,
        k: 0.7282,
        l: 0.08,
        m: 0.02,
        n: 3467.51,
        o: 1316.56,
        p: 0.17,
    },
    {
        key: '8',
        a: 'Алтайский край',
        b: 19084,
        c: 'Алтайский край, Алтайский район, с. Сараса, ул. Кузьмина, 51 ЦОС',
        d: '-',
        e: 50,
        f: 50,
        g: 16.3332,
        h: 0.12,
        k: 1.0337,
        l: 0.26,
        m: 0.06,
        n: 9996.35,
        o: 2698.30,
        p: 0.52,
    },
    {
        key: '9',
        a: 'Алтайский край',
        b: 19085,
        c: 'Алтайский край, Алтайский район, с. Старобелокуриха, ул. Советская, 105 ЦОС',
        d: '-',
        e: 50,
        f: 50,
        g: 24.8966,
        h: 0.21,
        k: 5.5178,
        l: 1.36,
        m: 0.10,
        n: 50412.70,
        o: 10597.30,
        p: 2.69,
    },
    {
        key: '10',
        a: 'Алтайский край',
        b: 19086,
        c: 'Алтайский край, Алтайский район, с. Тоурак, ул. Центральная, 8 ЦОС',
        d: '-',
        e: 50,
        f: 50,
        g: 18.381,
        h: 0.04,
        k: 0.4664,
        l: 0.06,
        m: 0.02,
        n: 3056.18,
        o: 1571.35,
        p: 0.12
    }
];


export const NetUtilizationTable = () => {

    const theme = useTheme()
    const accountData = useAccountStore(selectAccount)
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode
    const backgroundColor = createColorForTheme(theme?.widget?.background, theme?.colors, themeMode) || 'white'
    const backgroundColor2 = createColorForTheme(theme?.backgroundColor, theme?.colors, themeMode) || 'white'
    const color = createColorForTheme(theme?.widget?.textColor, theme?.colors, themeMode)
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)

    const generateStyle = () => {
        return `
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
        `
    }

    const modalStyle = useMemo(() => {
        return generateStyle();
    }, [backgroundColor]);

    return (
        <div className="netUtilizationTable">
            <ECTable2
                tableId="netUtilizationTable"
                tableCSS={{ width: '100%', height: '600px' }}
                columns={cols}
                // classes={styles.avaria}
                agTable={true}
                switchGrid={false}
                showHeader={false}
                rows={rows}
                // gridOptions={gridOptions}
                // header="как убрать"
                headerCSS={{ border: 'none', margin: '0', padding: '0' }}
                emptyText="На данный момент нет активных массовых аварий"
                // pagination={{
                //     current: 1,
                //     pageSize: 6,
                // }}
                // paginator={{
                //     page: 1,
                //     pageSize: 6,
                // }}
                getExportRowStyle={(params) => {
                    return {
                        borderBottom: '1px solid #ffffff22'
                    }
                }}
                gridOptions={{
                    headerHeight: 100,
                }}
                paginAdditional={{
                    suppress: false,
                }}
                onRowClicked={() => setIsModalVisible(true)}
            />
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
                            justifyContent: 'flex-end',
                            height: 50,
                        }}
                    >
                        <Button
                            style={{
                                color: 'rgb(144, 202, 249)',
                                backgroundColor: backgroundColor2,
                                border: 'none',
                                fontSize: '16px',
                            }}
                            onClick={() => setIsModalVisible(false)}
                        >
                            Закрыть
                        </Button>
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
                <style>{modalStyle}</style>
            </DefaultModal2>
        </div>
    )
}