import { FC } from 'react'
import { IDiscoveredObject } from '@shared/api/Objects/Models/getDiscoveredObjects/getDiscoveredObjects'
import { useNavigate } from 'react-router-dom'
import { selectAttributeByIndex, useAttributesStore } from '@shared/stores/attributes'
import { generalStore, IInterfaceView } from '@shared/stores/general'
import { compareOAWithValue, findObjectAttributeByStereotype } from '@shared/utils/objectAttributes'
import { message, Space } from 'antd'
import { ECTooltip } from '@shared/ui/tooltips'
import { BaseButton } from '@shared/ui/buttons'
import { EditOutlined, EyeInvisibleOutlined, EyeOutlined, ToolOutlined } from '@ant-design/icons'
import { getURL } from '@shared/utils/nav'
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { ModalAddActive } from '@containers/discovery/DiscoveryTableContainer/ModalAddActive'
import { patchObjectAttribute } from '@shared/api/Objects/Models/patchObjectAttribute/patchObjectAttribute'
import { EditTable } from '@shared/ui/tables/ECTable2/EditTable/EditTable'

const DeviceButton: FC<{ forHidden?: boolean; onClick?: () => Promise<void> }> = ({ forHidden = false, onClick }) => {
    return (
        <ECTooltip title={forHidden ? 'Вернуть в обнаруженные' : 'Скрыть'}>
            <BaseButton
                shape="circle"
                icon={forHidden ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                onClick={onClick}
                size="small"
            />
        </ECTooltip>
    )
}

export const DevicesTable: FC<{
    tableId: string
    onlyHidden?: boolean
    changeActiveKey: () => void
    loading?: boolean
    onChange: React.Dispatch<React.SetStateAction<boolean>>
    hiddenStereoType?: string
    discoveredObjects?: IDiscoveredObject[]
    matchedObjects?: boolean
    settingsButtonOnclick?: () => void
    onClickRow?: (id: number) => void
}> = ({
    tableId,
    onlyHidden = false,
    changeActiveKey,
    loading,
    onChange,
    hiddenStereoType,
    discoveredObjects,
    matchedObjects = false,
    settingsButtonOnclick,
    onClickRow
}) => {
    // const objectsLoading = useObjectsStore((st) => st.store.state === StoreStates.LOADING)
    const navigate = useNavigate()
    const getAttrByIndex = useAttributesStore(selectAttributeByIndex)
    const interfaceView = generalStore((st) => st.interfaceView)
    const objects = discoveredObjects.filter((obj) => {
        const hidden = findObjectAttributeByStereotype(hiddenStereoType ?? 'hide_discovery', obj.object_attributes)

        const hiddenValue = compareOAWithValue(hidden, true)

        return onlyHidden ? hiddenValue : !hiddenValue
    })

    objects.forEach((obj) => {
        obj.object_attributes.forEach((oa) => {
            oa.attribute = getAttrByIndex('id', oa.attribute_id)
        })
    })

    // const updateClasses = useClassesStore((st) => st.fetchData)
    // const updateObjects = useObjectsStore((st) => st.fetchData)

    // useEffect(() => {
    //     //updateClasses()
    //     //updateObjects()
    // }, [])

    const rows = objects.sort((a, b) => a.id - b.id)
        .map(({ object_attributes, id, discoveryMatchedObjects, class_id }) => ({
            id,
            key: `obj-disc-${id}`,
            ...(
                [
                    'MAC_address',
                    //'user_MAC_address',
                    'vendor',
                    'iface_ip',
                    'date_of_discovery',
                    'last_seen_date'
                ] as const
            ).reduce((hash, key) => {
                let value = findObjectAttributeByStereotype(key, object_attributes)?.attribute_value

                if (key == 'MAC_address') {
                    value = value ?? 'Разные Lan сети'
                }

                return {
                    ...hash,
                    [key]: value,
                }
            }, {}),
            add: (
                <Space>
                    <ECTooltip title="Страница обнаруженного устройства" key="look">
                        <BaseButton
                            type="primary"
                            shape="circle"
                            size="small"
                            icon={<EyeOutlined />}
                            onClick={() => {
                                // navigate(getURL(`${ROUTES.OBJECTS}/show/${id}`, 'showcase'))
                                onClickRow(id)

                            }}
                        />
                    </ECTooltip>
                    {matchedObjects ? (
                        <ECTooltip title="Редактирование" key="edit">
                            <BaseButton
                                shape="circle"
                                icon={<EditOutlined />}
                                size="small"
                                onClick={() => {
                                    navigate(
                                        getURL(
                                            `${ROUTES.OBJECTS}/${ROUTES_COMMON.UPDATE}/${id}?class_id=${class_id}`,
                                            interfaceView as Exclude<IInterfaceView, ''>
                                            // interfaceView === 'showcase' ? 'showcase' : 'manager'
                                        )
                                    )
                                }}
                            />
                        </ECTooltip>

                    ) : (
                        <>
                            <ModalAddActive objectId={id} />
                            <DeviceButton
                                onClick={async () => {
                                    const id = findObjectAttributeByStereotype(
                                        hiddenStereoType ?? 'hide_discovery',
                                        object_attributes
                                    )?.id

                                    // todo: почему не работает try / catch ?
                                    const response = await patchObjectAttribute(id, onlyHidden ? '0' : '1')

                                    if (response?.success) {
                                        changeActiveKey?.()
                                        onChange((b) => !b)
                                    } else {
                                        message.error(
                                            onlyHidden
                                                ? 'Ошибка добавления в обнаруженные устройства'
                                                : 'Ошибка скрытия устройства'
                                        )
                                    }
                                }}
                                forHidden={onlyHidden}
                            />
                        </>
                    )}
                </Space>
            ),

            discoveredMatchedObjects: matchedObjects && (
                <Space>

                    {discoveryMatchedObjects.map((item) => {
                        return (
                            <>
                                <ECTooltip title="Страница объекта на мониторинге" key="look">
                                    <BaseButton
                                        shape="circle"
                                        size="small"
                                        icon={<EyeOutlined />}
                                        onClick={() => {
                                            // navigate(getURL(`${ROUTES.OBJECTS}/show/${item.id}`, 'showcase'))
                                            onClickRow(item.id)
                                        }}
                                    />
                                </ECTooltip>
                                {item.name}
                            </>
                        )
                    })}
                </Space>
            ),
        }))
        .sort((a, b) => b.id - a.id)

    return (
        <EditTable
            // onRow={(record) => {
            //     return {
            //         onClick: () => {onClickRow(record?.id)},
            //     };
            // }}
            buttons={{
                right: [
                    <ECTooltip title="Настройки" key="settings">
                        <BaseButton shape="circle" icon={<ToolOutlined />} onClick={settingsButtonOnclick} />
                    </ECTooltip>,
                ],
            }}
            tableId={tableId}
            loading={loading}
            columns={[
                { key: 'add', title: 'Действия', align: 'center' as const, width: 300 },
                { key: 'id', title: 'ID' },

                matchedObjects && { key: 'discoveredMatchedObjects', title: 'Объект мониторинга' },
                { key: 'iface_ip', title: 'IP' },
                { key: 'MAC_address', title: 'MAC-адрес' },
                //{ key: 'user_MAC_address', title: 'MAC-адрес' },
                { key: 'vendor', title: 'Вендор' },
                { key: 'date_of_discovery', title: 'Дата обнаружения' },
                { key: 'last_seen_date', title: 'Дата последнего появления' },
            ].map((col) => ({ ...col, dataIndex: col.key }))}
            rows={rows}
            scroll={{ x: 2000 }}
        />
    )
}