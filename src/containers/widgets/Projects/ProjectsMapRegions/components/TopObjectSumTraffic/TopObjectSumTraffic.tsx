/* eslint-disable max-len */
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
        flex: 2
    },
    {
        key: 'address',
        field: 'address',
        headerName: 'Адрес объекта',
        filter: false,
        sortable: false,
        flex: 4
    },
    {
        key: 'name',
        field: 'name',
        headerName: 'Наименование объекта',
        filter: false,
        sortable: false,
        flex: 6
    },
    {
        key: 'traffic',
        field: 'traffic',
        headerName: 'Суммарный трафик, Тб',
        filter: false,
        sortable: false,
        flex: 2,
    },
];
const rows = [
    {
        key: '1',
        id: 1,
        region: 'Владимирская область',
        address: 'Владимирская область, г. Владимир, ул. Горького, 97',
        name: 'МУНИЦИПАЛЬНОЕ БЮДЖЕТНОЕ ОБЩЕОБРАЗОВАТЕЛЬНОЕ УЧРЕЖДЕНИЕ ГОРОДА ВЛАДИМИРА "ЛИЦЕЙ-ИНТЕРНАТ № 1"',
        traffic: 45.5,
    },
    {
        key: '2',
        id: 2,
        region: 'Свердловская область',
        address: '624330, ОБЛ СВЕРДЛОВСКАЯ, Г КРАСНОУРАЛЬСК, УЛ КИРОВА, 15',
        name: 'МУНИЦИПАЛЬНОЕ БЮДЖЕТНОЕ ОБЩЕОБРАЗОВАТЕЛЬНОЕ УЧРЕЖДЕНИЕ СРЕДНЯЯ ОБЩЕОБРАЗОВАТЕЛЬНАЯ ШКОЛА № 1',
        traffic: 19.0,
    },
    {
        key: '3',
        id: 3,
        region: 'Камчатский край',
        address: 'Камчатский край, г. Петропавловск-Камчатский, проезд Космический, 14',
        name: 'Муниципальное автономное Общеобразовательное учреждение "Гимназия № 39" Петропавловск-Камчатского Городского Округа',
        traffic: 16.1,
    },
    {
        key: '4',
        id: 4,
        region: 'Владимирская область',
        address: 'Владимирская область, г. Владимир, мкр. Коммунар, ул. Школьная, 1 А',
        name: 'МУНИЦИПАЛЬНОЕ БЮДЖЕТНОЕ ОБЩЕОБРАЗОВАТЕЛЬНОЕ УЧРЕЖДЕНИЕ Г.ВЛАДИМИРА "СРЕДНЯЯ ОБЩЕОБРАЗОВАТЕЛЬНАЯ ШКОЛА № 46"',
        traffic: 14.4,
    },
    {
        key: '5',
        id: 5,
        region: 'Краснодарский край',
        address: '352235, КРАЙ КРАСНОДАРСКИЙ, Р-Н НОВОКУБАНСКИЙ, СТ-ЦА ПРОЧНООКОПСКАЯ, УЛ ЧИЧЕРИНА, 44',
        name: 'ГОСУДАРСТВЕННОЕ БЮДЖЕТНОЕ ПРОФЕССИОНАЛЬНОЕ ОБРАЗОВАТЕЛЬНОЕ УЧРЕЖДЕНИЕ КРАСНОДАРСКОГО КРАЯ "НОВОКУБАНСКИЙ АГРАРНО-ПОЛИТЕХНИЧЕСКИЙ ТЕХНИКУМ"',
        traffic: 12.4,
    },
    {
        key: '6',
        id: 6,
        region: 'Ростовская область',
        address: 'Ростовская область, Целинский район, п. Новая Целина, ул. Макаренко, 2',
        name: 'Муниципальное бюджетное общеобразовательное учреждение Целинская средняя общеобразовательная школа №9',
        traffic: 12.0,
    },
    {
        key: '7',
        id: 7,
        region: 'Кировская область',
        address: 'Кировская область, Омутнинский район, поселок городского типа Восточный, ФКУ ИК-6 УФСИН',
        name: 'КИРОВСКОЕ ОБЛАСТНОЕ ГОСУДАРСТВЕННОЕ ОБЩЕОБРАЗОВАТЕЛЬНОЕ БЮДЖЕТНОЕ УЧРЕЖДЕНИЕ "ВЕЧЕРНЯЯ СРЕДНЯЯ ШКОЛА Г. КОТЕЛЬНИЧА"',
        traffic: 9.6,
    },
    {
        key: '8',
        id: 8,
        region: 'Кемеровская область - Кузбасс',
        address: '652050, Кемеровская область - Кузбасс, г. Юрга, улица Заводская, д. 18',
        name: 'Государственное профессиональное образовательное учреждение "Юргинский технологический колледж имени Павлючкова Геннадия Антоновича"',
        traffic: 9.5,
    },
    {
        key: '9',
        id: 9,
        region: 'Тамбовская область',
        address: '393733, ОБЛ ТАМБОВСКАЯ, Р-Н МИЧУРИНСКИЙ, С КРАСИВОЕ, УЛ КОММУНАЛЬНАЯ, 51',
        name: 'КРАСИВСКИЙ ФИЛИАЛ МУНИЦИПАЛЬНОГО БЮДЖЕТНОГО ОБЩЕОБРАЗОВАТЕЛЬНОГО УЧРЕЖДЕНИЯ КОЧЕТОВСКОЙ СРЕДНЕЙ ОБЩЕОБРАЗОВАТЕЛЬНОЙ ШКОЛЫ',
        traffic: 8.7,
    },
    {
        key: '10',
        id: 10,
        region: 'Ярославская область',
        address: 'Ярославская область, г. Ярославль, пр-кт Фрунзе, 75 А',
        name: 'Муниципальное общеобразовательное учреждение "Средняя школа № 89"',
        traffic: 8.4,
    },
    {
        key: '11',
        id: 11,
        region: 'Кемеровская область - Кузбасс',
        address: 'Кемеровская область-Кузбасс, г. Юрга, ул. Кирова, 6',
        name: 'Государственное профессиональное образовательное учреждение "Юргинский технологический колледж" имени Павлючкова Геннадия Антоновича',
        traffic: 7.9,
    },
    {
        key: '12',
        id: 12,
        region: 'Липецкая область',
        address: 'Липецкая область, г. Елец, ул. Гагарина, 20 А',
        name: 'Муниципальное бюджетное общеобразовательное учреждение "Средняя школа №24 города Ельца"',
        traffic: 7.3,
    },
    {
        key: '13',
        id: 13,
        region: 'Ростовская область',
        address: 'Ростовская область, Сальский район, с. Новый Егорлык, ул. Красная, 41',
        name: 'Муниципальное бюджетное общеобразовательное учреждение основная общеобразовательная школа № 54 с. Новый Егорлык имени Е.И. Игнатенко',
        traffic: 7.1,
    },
    {
        key: '14',
        id: 14,
        region: 'Московская область',
        address: 'Московская область, Королев городской округ, город Королев, микрорайон Юбилейный, улица Соколова, 3',
        name: 'МБОУ городского округа Королев Московской области Гимназия № 5',
        traffic: 7.1,
    },
    {
        key: '15',
        id: 15,
        region: 'Владимирская область',
        address: 'Владимирская область, г. Владимир, ул. Безыменского, 14 Б',
        name: 'МУНИЦИПАЛЬНОЕ БЮДЖЕТНОЕ ОБЩЕОБРАЗОВАТЕЛЬНОЕ УЧРЕЖДЕНИЕ Г.ВЛАДИМИРА "СРЕДНЯЯ ОБЩЕОБРАЗОВАТЕЛЬНАЯ ШКОЛА № 40"',
        traffic: 6.6,
    },
    {
        key: '16',
        id: 16,
        region: 'Московская область',
        address: '140412, ОБЛ МОСКОВСКАЯ, Г КОЛОМНА, Ш МАЛИНСКОЕ, 36',
        name: 'ГОСУДАРСТВЕННОЕ БЮДЖЕТНОЕ ПРОФЕССИОНАЛЬНОЕ ОБРАЗОВАТЕЛЬНОЕ УЧРЕЖДЕНИЕ МОСКОВСКОЙ ОБЛАСТИ "КОЛОМЕНСКИЙ АГРАРНЫЙ КОЛЛЕДЖ ИМЕНИ Н.Т. КОЗЛОВА"',
        traffic: 6.5,
    },
    {
        key: '17',
        id: 17,
        region: 'Ямало-Ненецкий автономный округ',
        address: 'Ямало-Ненецкий автономный округ, Ямальский район, с. Сеяха, ул. Школьная, 5',
        name: 'Муниципальное бюджетное общеобразовательное учреждение "Сеяхинская школа-интернат"',
        traffic: 5.9,
    },
    {
        key: '18',
        id: 18,
        region: 'Нижегородская область',
        address: '606653, НИЖЕГОРОДСКАЯ ОБЛАСТЬ, СЕМЕНОВ ГОРОД, ЧЕРНЫШЕВСКОГО УЛИЦА, 2',
        name: 'ГОСУДАРСТВЕННОЕ КАЗЕННОЕ ОБЩЕОБРАЗОВАТЕЛЬНОЕ УЧРЕЖДЕНИЕ "СЕМЕНОВСКАЯ ШКОЛА-ИНТЕРНАТ"',
        traffic: 5.8,
    },
    {
        key: '19',
        id: 19,
        region: 'Ханты-Мансийский автономный округ - Югра',
        address: 'Ханты-Мансийский автономный округ - Югра, г. Ханты-Мансийск, ул. Анны Коньковой, 8',
        name: 'муниципальное бюджетное общеобразовательное учреждение «Средняя общеобразовательная школа № 4»',
        traffic: 5.7,
    },
    {
        key: '20',
        id: 20,
        region: 'Камчатский край',
        address: '684033, Камчатский край, Елизовский район., Сосновка с., Центральная ул., д. 12',
        name: 'Краевое государственное профессиональное образовательное бюджетное учреждение «Камчатский сельскохозяйственный техникум»',
        traffic: 5.7,
    },
    {
        key: '21',
        id: 21,
        region: 'Сахалинская область',
        address: '694015, ОБЛ САХАЛИНСКАЯ, Р-Н КОРСАКОВСКИЙ, С ДАЧНОЕ, 151',
        name: 'МУНИЦИПАЛЬНОЕ АВТОНОМНОЕ ОБЩЕОБРАЗОВАТЕЛЬНОЕ УЧРЕЖДЕНИЕ "СРЕДНЯЯ ОБЩЕОБРАЗОВАТЕЛЬНАЯ ШКОЛА С.ДАЧНОЕ" КОРСАКОВСКОГО ГОРОДСКОГО ОКРУГА САХАЛИНСКОЙ ОБЛАСТИ',
        traffic: 5.6,
    },
    {
        key: '22',
        id: 22,
        region: 'Краснодарский край',
        address: '352430, Российская Федерация, Краснодарский край, Курганинский район, г. Курганинск, пер. Попова, 3',
        name: 'МУНИЦИПАЛЬНОЕ АВТОНОМНОЕ ОБЩЕОБРАЗОВАТЕЛЬНОЕ УЧРЕЖДЕНИЕ СРЕДНЯЯ ОБЩЕОБРАЗОВАТЕЛЬНАЯ ШКОЛА № 1 ИМЕНИ В.Г. СЕРОВА Г. КУРГАНИНСКА',
        traffic: 5.6,
    },
    {
        key: '23',
        id: 23,
        region: 'Московская область',
        address: 'Московская область, Лыткарино городской округ, город Лыткарино, микрорайон 5-й микрорайон, квартал 1-й, 21',
        name: 'МОУ Гимназия №7',
        traffic: 5.4,
    },
    {
        key: '24',
        id: 24,
        region: 'Воронежская область',
        address: 'Воронежская область, Бутурлиновский район, г. Бутурлиновка, ул. Дорожная, 71',
        name: 'Муниципальное бюджетное общеобразовательное учреждение Бутурлиновская средняя общеобразовательная школа Бутурлиновского муниципального района Воронежской области',
        traffic: 5.2,
    },
    {
        key: '25',
        id: 25,
        region: 'Ростовская область',
        address: 'Ростовская область, Матвеево-Курганский район, х. Большая Кирсановка, ул. Советская, 64а',
        name: 'Муниципальное бюджетное общеобразовательное учреждение Большекирсановская средняя общеобразовательная школа имени Героя Советского Союза Хайло Василия Александровича',
        traffic: 5.2,
    },
];

export const TopObjectSumTraffic = () => {
    return (
        <ECTable2
            rootClassName="alex"
            tableId="Top5Tables"
            // className="topTable"
            tableCSS={{
                height: 1200,
                width: '100%',
            }}
            // tableCSS={tableCSS}
            header="Топ объектов с максимальным суммарным трафиком"
            columns={cols}
            agTable={true}
            getExportRowStyle={(params) => {
                return {
                    borderBottom: '1px solid #ffffff22'
                }
            }}
            rows={rows}
            switchGrid={false}
            showHeader={false}
            // header={header}
            headerCSS={{ height: '80px', border: 'none' }}
            supressHorizScroll={true}
            paginAdditional={{ status: false }}
        // gridOptions={gridOptions}
        // onRowClicked={onRowClicked}
        />
    )
}