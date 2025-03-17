import { IThemes } from '@app/themes/types'
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { selectClasses, useClassesStore } from '@shared/stores/classes'
import { selectObjects, useObjectsStore } from '@shared/stores/objects'
import { ButtonAdd, ButtonCreatable, ButtonDeleteRow, ButtonEditRow } from '@shared/ui/buttons'
import { EditTable } from '@shared/ui/tables/ECTable2/EditTable/EditTable'
import { Card, Col, Row, Tabs, message } from 'antd'
import { Tab } from 'rc-tabs/lib/interface'
import { useNavigate } from 'react-router-dom'
import { IEditTableProps, TInputType } from '@shared/ui/tables/ECTable2/EditTable/types';
import { deleteObjectById } from '@shared/api/Objects/Models/deleteObjectById/deleteObjectById'
import { uniqBy } from 'lodash'
import { getURL } from '@shared/utils/nav'
import { useAccountStore } from '@shared/stores/accounts'
import ObjectButtonRowDelete from '@entities/objects/ObjectButtonRowDelete/ObjectButtonRowDelete'
import { getObjects } from '@shared/api/Objects/Models/getObjects/getObjects'
import { useApi2 } from '@shared/hooks/useApi2'

export const ManagerMain = () => {
    const classes = useClassesStore(selectClasses)
    // const objects = useObjectsStore(selectObjects)
    // const updateObjectStore = useObjectsStore((state) => state.updateData)
    const navigate = useNavigate()
    const checkPermissions = useAccountStore.getState().checkPermission

    const objects = useApi2(
        (payload?: any) => getObjects((payload || {})),
        { 
            onmount: false,
        },
    )

    const deleteObject = async (id: number) => {
        const response = await deleteObjectById(id);

        if (response.success && response.data.statusText === 'Deleted') {
            // После удаления обновляем данные
            objects.request();
        }

        return response;
    };

    const classesColumns: IEditTableProps['columns'] = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: '10%',
            fixed: 'right'
        },
        {
            title: 'Имя класса',
            dataIndex: 'name',
            key: 'name',
            width: '70%',
            fixed: 'right'
        },
        {
            title: 'Пакет',
            dataIndex: 'package',
            key: 'package',
            filterValueKey: 'packageFilterValue',
            width: '20%',
            fixed: 'right'
        }
    ]

    const objectsClassesOptions = uniqBy(objects.data.map((obj) => ({
        value: obj.class_id,
        label: obj?.class?.name
    })), 'value')

    //TODO Добавить ключи для серверной фильтрации помимо id
    const objectsColumns = [
        {
            key: 'actions',
            dataIndex: 'actions',
            title: 'Действия',
            width: '10%',
        },
        {
            key: 'id',
            dataIndex: 'id',
            title: 'ID',
            width: '10%',
            serverFilterValueKey: 'id'
        },

        {
            key: 'codename',
            dataIndex: 'codename',
            title: 'Код',
            width: '20%',
        },
        {
            key: 'className',
            dataIndex: 'className',
            title: 'Класс',
            width: '30%',
            filterType: 'select' as TInputType,
            filterSelectOptions: objectsClassesOptions,
            filterValueKey: 'className'
        },
        {
            key: 'name',
            dataIndex: 'name',
            title: 'Название',
            width: '30%'
        }
    ]

    const packages = {
        1: 'Предметная область',
        2: 'Измерительная система',
    }
    const classesRows = classes.map(cls => {
        return {
            key: 'class-' + cls.id,
            id: cls.id,
            name: cls.name,
            package: packages[cls.package_id],
        }
    })

    const objectsRows = objects?.data?.map(object => {
        return {
            key: 'object-' + object?.id,
            id: object?.id,
            name: object?.name,
            codename: object?.codename,
            className: object?.class?.name,
            actions: (
                <Row gutter={8}>
                    <Col>
                        <ButtonEditRow
                            onClick={() => {
                                navigate(getURL(
                                    // eslint-disable-next-line max-len
                                    `${ROUTES.OBJECTS}/${ROUTES_COMMON.UPDATE}/${object.id}?class_id=${object.class_id}`,
                                    'manager'
                                ))
                            }}
                        />
                    </Col>
                    <Col>
                        <ObjectButtonRowDelete
                            disablePopup={false}
                            withConfirm
                            onClick={async () => {
                                const response = await deleteObject(object.id);

                                return response;
                            }}
                        />
                    </Col>
                </Row>
            ),
        }
    })

    const tabItems: Tab[] = [
        {
            key: 'classes',
            label: 'Классы',
            children: (
                <Card>
                    <EditTable
                        tableId="classes-table"
                        key="classes-table"
                        columns={classesColumns}
                        rows={classesRows}
                        sortDirections={['descend', 'ascend']}
                        currentTheme={IThemes.DEFAULT}
                        onRow={(row, idx) => {
                            return {
                                onClick: () => {
                                    // console.log('row', row, idx)
                                    navigate(getURL(
                                        `${ROUTES.OBJECTS}/${ROUTES_COMMON.LIST}/?class_id=${row.id}`,
                                        'manager'
                                    ))
                                    // navigate(`/${ROUTES.OBJECTS}/${ROUTES_COMMON.LIST}/?class_id=${row.id}`)
                                },
                            }
                        }}
                        style={{
                            cursor: 'pointer',
                        }}
                        scroll={{ y: 600 }}
                    />
                </Card>
            )
        },
        checkPermissions(['get objects']) && {
            key: 'objects',
            label: 'Объекты',
            children: (
                <Card style={{ height: '100%', overflow: 'auto' }}>
                    <EditTable
                        initialPage={1}
                        tableId="objects-table"
                        key="objects-table"
                        columns={objectsColumns}
                        rows={objectsRows}
                        enablePagination={true}
                        paginator={{
                            page: Number(objects.pagination.currentPage || 1),
                            pageSize: 10,
                            total: Number(objects.pagination.total),
                            enablePageSelector: true,
                        }}
                        buttons={{
                            left: [

                                <ButtonCreatable
                                    key="button-add-class"
                                    shape="circle"
                                    entity="objects"
                                    buttonAdd={true}
                                    text={false}
                                    onClick={() => {
                                        navigate(getURL(
                                            `${ROUTES.OBJECTS}/${ROUTES_COMMON.CREATE}`,
                                            'manager'
                                        ))
                                    }}
                                />
                            ]
                        }}
                        currentTheme={IThemes.DEFAULT}
                        scroll={{ y: 600 }}
                        server={{
                            request: async ({ filterValue, ...meta }) => {
                                const payload = {
                                    ...meta,
                                }
                                
                                return objects.request(payload)
                            },
                            filter: async (config) => {
                                const payload = {
                                    ...config,
                                    per_page: config?.pageSize,
                                }
            
                                delete payload?.pageSize
                                delete payload?.value
    
            
                                return objects.request(payload)
                            }
                        }}
                    />
                </Card>
            )
        }
    ]

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                overflow: 'auto',
                height: '100%',
            }}
        >
            <Tabs
                items={tabItems}
                style={{
                    height: '100%',
                    // flex: 1,
                }}
            />
        </div>
    )
}