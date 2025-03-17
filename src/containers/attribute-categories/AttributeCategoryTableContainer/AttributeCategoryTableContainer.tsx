import { FC } from 'react'
import { SimpleTable } from '@shared/ui/tables'
import AttributeCategoriesAddButton
    from '@features/attribute-categories/AttributeCategoriesAddButton/AttributeCategoriesAddButton'
import { useNavigate } from 'react-router-dom'
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { Space } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { ButtonDeleteRow, ButtonEditRow } from '@shared/ui/buttons';
import { ECTooltip } from '@shared/ui/tooltips/ECTooltip'
import { useAttributeCategoryStore2 } from '@shared/stores/attributeCategories'
import { getURL } from '@shared/utils/nav'
import { SERVICES_ATTRIBUTE_CATEGORIES } from '@shared/api/AttributeCategories'
import modal from 'antd/es/modal'
import { responseErrorHandler } from '@shared/utils/common'

interface ITableRows {
    name: string
    id: number
    actions?: React.ReactNode
}
const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
    },
    {
        title: 'Название',
        dataIndex: 'name',
    },
    {
        title: 'Действия',
        dataIndex: 'actions',
        key: 'actions',
        width: '20%',
    },
]
const AttributeCategoryTableContainer: FC = () => {
    const navigate = useNavigate()

    //TODO:: Исправить проблему разной типизации строк таблицы и категорий атрибутов

    const categories = useAttributeCategoryStore2((st) => st.store.data)

    const forceUpdate = useAttributeCategoryStore2((st) => st.forceUpdate)

    const deleteButtonHandler = (id) => {
        SERVICES_ATTRIBUTE_CATEGORIES.Models.deleteAttributeCategoryById(id).then( response => {
            if (response?.success) {
                forceUpdate()
            }
            else {
                responseErrorHandler({
                    response,
                    modal,
                    errorText: 'Ошибка при удалении категории атрибута'
                })
            }
        })
    }

    //TODO:: таблицу перенести на уровень entities, кнопки на features
    return (
        <SimpleTable
            columns={columns}
            rows={categories.map(({ id, name }) => ({
                id,
                name,
                key: 1000 + id,
                actions: (
                    <Space>
                        <ECTooltip title="Редактирование">
                            <ButtonEditRow
                                onClick={() => {
                                    navigate(
                                        getURL(
                                            `${ROUTES.ATTRIBUTE_CATEGORIES}/${ROUTES_COMMON.UPDATE}/${id}`,
                                            'constructor'
                                        )
                                    )
                                    // navigate(
                                    //     `/${ROUTES.ATTRIBUTE_CATEGORIES}/${ROUTES_COMMON.UPDATE}/${id}`
                                    // )
                                }}
                                type="link"
                                icon={<EditOutlined />}
                            />
                        </ECTooltip>
                        <ECTooltip title="Удаление">
                            {' '}
                            <ButtonDeleteRow
                                type="link"
                                withConfirm
                                icon={<DeleteOutlined />}
                                onClick={() => deleteButtonHandler(id)}
                            />{' '}
                        </ECTooltip>
                    </Space>
                ),
            }))}
            toolbar={{
                left: (
                    <AttributeCategoriesAddButton
                        onClick={() => {
                            navigate(getURL(`${ROUTES.ATTRIBUTE_CATEGORIES}/${ROUTES_COMMON.CREATE}`, 'constructor'))
                            // navigate(
                            //     `/${ROUTES.ATTRIBUTE_CATEGORIES}/${ROUTES_COMMON.CREATE}`
                            // )
                        }}
                    />
                ),
                right: null,
            }}
        />
    )
}

export default AttributeCategoryTableContainer