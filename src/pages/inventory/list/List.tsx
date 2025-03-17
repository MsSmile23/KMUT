import { forumThemeConfig } from '@app/themes/forumTheme/forumThemeConfig'
import { ObjectsLinkedTable } from '@entities/objects/ObjectsLinkedTable/ObjectsLinkedTable'
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { useTheme } from '@shared/hooks/useTheme'
import { useAccountStore, selectAccount } from '@shared/stores/accounts'
import { useClassesStore } from '@shared/stores/classes'
import { generalStore } from '@shared/stores/general'
import { PageHeader } from '@shared/ui/pageHeader'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'
import { Card } from 'antd'
import { FC } from 'react'

export const List: FC = () => {
    // const secondIds = [10117, 10178, 10003, 10085, 208, 10020, 211, 10002, 10088, 10024, 10102, 10096, 10103]

    const interfaceView = generalStore((st) => st.interfaceView)
    const isShowcase = interfaceView === 'showcase'
    const theme = useTheme()
    const accountData = useAccountStore(selectAccount)
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode
    const findClass = useClassesStore().getByIndex

    const zond = findClass('id', 10034)
    const ibp = findClass('id', 10036)

    const attrs =
        zond && ibp ? [...new Set([...zond.attributes.map((el) => el.id), ...ibp.attributes.map((el) => el.id)])] : []

    // console.log('attrs', attrs)

    const backgroundColor = isShowcase
        ? createColorForTheme(theme?.widget?.background, theme?.colors, themeMode)
        : 'white'

    return (
        <>
            <PageHeader
                title="Активы"
                routes={[
                    {
                        path: ROUTES.MAIN,
                        breadcrumbName: 'Главная',
                    },
                    {
                        path: `/${ROUTES.INVENTORY}/${ROUTES_COMMON.LIST}`,
                        breadcrumbName: 'Активы',
                    },
                ]}
            />
            <Card
                style={{
                    marginTop: '10px',
                    background: backgroundColor ?? 'transparent',
                    border: themeMode == 'dark' ? 'none' : '1px solid #f0f0f0',
                }}
            >
                <ObjectsLinkedTable
                    paginator={{ page: 1, pageSize: 30, enablePageSelector: false }}
                    tableId="forum-resources-devices-table"
                    parentObjectId={10176}
                    targetClasses={{
                        ids: theme?.themeConfig?.classesGroup.devices || forumThemeConfig?.classesGroups?.devices,
                        // attributeIds: secondIds,
                        //filterByAttributes: (a) => a.readonly && a.history_to_db
                    }}
                    relationIds={theme?.themeConfig?.relationsIds || []}
                    parentClasses={[
                        { id: 10011, showObjectProps: ['name'], attributeIds: [] }, // id Объекта ФНС
                        { id: 10097, showObjectProps: ['name'], attributeIds: [] },
                        { id: 10082, showObjectProps: ['name'], attributeIds: [] },
                        { id: 10058, showObjectProps: ['name'], attributeIds: [] },
                        { id: 10105, showObjectProps: ['name'], attributeIds: [] },
                        { id: 10056, showObjectProps: ['name'], attributeIds: [] },
                        { id: 10058, showObjectProps: ['name'], attributeIds: [] },
                        { id: 10055, showObjectProps: ['name'], attributeIds: [] },
                    ]}
                    statusColumn="Состояние оборудования"
                    classColumn="Тип оборудования"
                    scroll={{ x: 2000 }}
                    columnsOrder={[
                        'id',
                        'object__name',
                        'parent_class_10011', // Объект ФНС
                        'parent_class_10055', // Здание
                        'parent_class_10056', // Этаж
                        'parent_class_10105', // Помещение
                        'parent_class_10058', // Стоечно-коммутационное оборудование
                        'parent_class_10082', // Юнит
                        'parent_class_10097', // Вариант размещения в юните
                    ]}
                    showHistoryAttributes={{ show: true }}
                    hiddenColumns={{
                        classes: [
                            10056, // Этаж
                            10105, // Помещение
                            10058, // Стоечно-коммутационное оборудование
                            10082, // Юнит
                            10097, // Вариант размещения в юните
                        ],
                        attributes: [
                            208, // Серийный номер
                            211, // Версия ПО
                            10003, // Критичность
                            10102, // Код
                            10178, // Дата и время последней попытки синхр
                        ],
                    }}
                    chosenColumns={[
                        'id',
                        'object__name',
                        'parent_name_10055',
                        'parent_name_10011',
                        'status__column',
                        'class__column',
                        'attr_10020',
                        'attr_10024',
                        'attr_10096',
                        'historyDb_10119',
                        'historyDb_10138',
                        'historyDb_10139',
                        'historyDb_10144',
                        ...(theme?.themeConfig?.relationsIds?.map((id) => `link_${id}`) || []),
                        ...(attrs?.map((id) => `attr_${id}`) || []),
                    ]}
                />
            </Card>
        </>
    )
}