/* eslint-disable react/jsx-max-depth */
import { useTheme } from '@shared/hooks/useTheme'
import { useAccountStore, selectAccount } from '@shared/stores/accounts'
import { ECSimpleFilters } from '@shared/ui/ECUIKit/filters/ECSimpleFilters/ECSimpleFilters'
import { ECTable } from '@shared/ui/tables/ECTable/ECTable'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'
import { Col, Pagination, PaginationProps, Row } from 'antd'
import { FC, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Typography } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { EditTable } from '@shared/ui/tables/ECTable2/EditTable/EditTable'
import SimpleReports from '../Projects/SimpleReports/SimpleReports'
import './WidgetUserActivity.css'
import { ButtonDownload } from '@shared/ui/buttons/ButtonDownload/ButtonDownload'

const { Title } = Typography;
const WidgetUserActivity = (props) => {
    const filterFields = useMemo(() => {
        return props?.settings?.widget?.fields || [];
    }, [props.settings]);


    const theme = useTheme()
    const accountData = useAccountStore(selectAccount)
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode
    const backgroundColor = createColorForTheme(theme?.widget?.background, theme?.colors, themeMode) || 'white'
    const backgroundColor2 = createColorForTheme(theme?.backgroundColor, theme?.colors, themeMode) || 'white'

    const color = createColorForTheme(theme?.widget?.textColor, theme?.colors, themeMode)
    const itemRender: PaginationProps['itemRender'] = (_, type, originalElement) => {
        if (type === 'prev') {
            return (
                <div
                    style={{
                        width: '32px',
                        height: '32px',
                        border: '1px solid rgba(255, 255, 255, 0.23)',
                        borderRadius: '4px',
                        color: color
                    }}
                >
                    <LeftOutlined />
                </div>
            )
        }

        if (type === 'next') {
            return (
                <div
                    style={{
                        width: '32px',
                        height: '32px',
                        border: '1px solid rgba(255, 255, 255, 0.23)',
                        borderRadius: '4px',
                        color: color
                    }}
                >
                    <RightOutlined />
                </div>
            )
        }

        return originalElement;
    };

    const generateObjects = () => {
        const users = [
            'Anna Lee',
            'John Doe',
            'Jane Smith',
            'Mike Johnson',
            'Emma Brown',
            'Chris Davis',
            'Laura Wilson',
            'Daniel Lee',
            'Olivia Garcia',
            'James Martinez',
        ]
        const actions = [
            'Редактирование профиля',
            'Вход в систему',
            'Выход из системы',
            'Смена пароля',
            'Обновление данных',
            'Просмотр отчёта',
            'Создание заявки',
            'Удаление записи',
            'Добавление комментария',
            'Загрузка файла',
        ]
        const regions = [
            'Ростовская область',
            'Московская область',
            'Ленинградская область',
            'Свердловская область',
            'Краснодарский край',
            'Республика Татарстан',
            'Челябинская область',
            'Новосибирская область',
            'Самарская область',
            'Республика Башкортостан',
        ]

        const result = []

        for (let i = 1; i <= 360; i++) {
            const randomUser = users[Math.floor(Math.random() * users.length)]
            const randomAction = actions[Math.floor(Math.random() * actions.length)]
            const randomRegion = regions[Math.floor(Math.random() * regions.length)]

            // Генерация случайной даты в пределах 2028 года
            const randomDate = new Date(
                2028,
                Math.floor(Math.random() * 12),
                Math.floor(Math.random() * 28) + 1,
                Math.floor(Math.random() * 24),
                Math.floor(Math.random() * 60),
                Math.floor(Math.random() * 60)
            ).toLocaleString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            })

            const newObject = {
                key: String(i),
                user: randomUser,
                actions: randomAction,
                date: randomDate,
                region: randomRegion,
            }

            result.push(newObject)
        }

        return result
    }

    // Генерация массива из 100 объектов
    const objectsArray = generateObjects();
    // Колонки таблицы
    const columns = [
        { title: 'Пользователь', dataIndex: 'user', key: 'user' },
        { title: 'Действие ', dataIndex: 'actions', key: 'actions' },
        { title: 'Дата и время', dataIndex: 'date', key: 'date' },
        { title: 'Регион', dataIndex: 'region', key: 'region' },
    ];

    // Состояние для пагинации
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5; // Количество строк на странице

    // Вычисление данных для текущей страницы
    const currentData = objectsArray.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    // Обработчик изменения страницы
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const [clientHeight, setClientHeight] = useState(0)
    const ref = useRef(null)



    useLayoutEffect(() => {
        setClientHeight(ref?.current?.clientHeight)
    }, [])



    return (
        <Col span={24}>
            <Row gutter={8}>
                <div style={{ width: 300, flexShrink: 0, padding: '0px 15px' }}>
                    <ECSimpleFilters
                        onApplyClick={v => console.log(v)}
                        mainClassId={10001}
                        fields={filterFields}
                    />
                </div>

                <Col span={18}>
                    <Title style={{ color: color, fontSize: 28, marginLeft: 70, marginBottom: 40 }}>
                        Активность пользователей
                    </Title>
                    <div
                        style={{
                            width: '100%',
                            minHeight: 800,
                            backgroundColor: backgroundColor2,
                            padding: '10%',
                            paddingTop: 110,
                            overflowY: 'auto',
                            height: 800,
                        }}
                        ref={ref}
                        className="activeUsersTable"
                    >
                        <div
                            style={{ width: '100%', 
                                display: 'flex', justifyContent: 'flex-end'
                            }}
                        >
                            <ButtonDownload
                                icon={null}
                                rows={objectsArray} 
                                columns={columns}
                                size="middle"
                                button={{ type: 'primary', shape: 'default', icon: null }}
                                buttonStyle={{ width: '150px' }}
                            >
                                <div
                                    style={{ 
                                        width: '150px',
                                        height: '36px',
                                        background: 'rgb(144, 202, 249)',
                                        borderRadius: 4,
                                        display: 'flex', 
                                        justifyContent: 'center', 
                                        alignItems: 'center',
                                        color: 'rgba(0, 0, 0, 0.87)',
                                        cursor: 'pointer', marginBottom: '20px' }}
                                >Скачать
                                </div>
                            </ButtonDownload>
                        </div>
                      
                        {/* <ECTable
                            dataSource={currentData}
                            columns={columns}
                            pagination={false} // Отключаем встроенную пагинацию
                        />

                        <Pagination
                            current={currentPage}
                            pageSize={pageSize}
                            total={dataSource.length}
                            onChange={handlePageChange}
                            style={{ marginTop: 16, textAlign: 'center' }}
                            itemRender={itemRender}
                            
                        /> */}

                        <EditTable
                            rowSelection= {null}
                            hideDownloadButton 
                            hideSettingsButton
                            tableId="activeUsersTable"
                            rows={objectsArray}
                            columns={columns}
                            size="middle"
                            className="userActivityTable"
                            // pagination={{ position: ['bottomRight'], pageSize: 10  }}
                            // scroll={{ x: 2000 }}
                            paginator={{ page: 1, pageSize: 50, enablePageSelector: true, total: objectsArray?.length }}
                            // paginator={{ page: 1, pageSize: 10, enablePageSelector: false }}

                        // paginator={null}
                        />
                    </div>
                </Col>
            </Row>
        </Col>
    )
}

export default WidgetUserActivity