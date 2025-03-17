import { PlayCircleOutlined } from '@ant-design/icons'
import { postDefineDiscovery } from '@shared/api/Objects/Models/postDefineDiscovery/postDefineDiscovery'
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { useApi2 } from '@shared/hooks/useApi2'
import { useOpen } from '@shared/hooks/useOpen'
import { useClassesStore } from '@shared/stores/classes'
import { DefaultModal2 } from '@shared/ui/modals'
import { ECTooltip } from '@shared/ui/tooltips/ECTooltip'
import { getURL } from '@shared/utils/nav'
import { Button, Space, message, Select } from 'antd'
import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const ModalAddActive: FC<{ objectId: number }> = ({ objectId }) => {
    const modal = useOpen()
    const nav = useNavigate()

    const [ selectedClass, setSelectedClass ] = useState<number>()

    const discovery = useApi2(postDefineDiscovery, { onmount: 'item' })

    const classesOptions = useClassesStore((st) => st.store.data.map((cls) => {
        return ({ value: cls.id, label: cls.name })
    }))

    const changeClass = async () => {
        const response = await discovery.request({ object_id: objectId, class_id: selectedClass })

        if (response?.success && response?.data && response?.data?.class_id === selectedClass) {
            modal.close()
            message.success('Класс успешно изменен')
            nav(getURL(
                `${ROUTES.OBJECTS}/${ROUTES_COMMON.UPDATE}/${objectId}?class_id=${response.data.class_id}`,
                'manager'
            ))
            // nav(`/${ROUTES.OBJECTS}/${ROUTES_COMMON.UPDATE}/${objectId}?class_id=${response.data.class_id}`)
        }
    }

    return (
        <>
            <DefaultModal2 
                open={modal.isOpen}
                onCancel={modal.close}
                width={500}
                centered
                footer={(
                    <Space>
                        <Button onClick={changeClass}>Сохранить</Button>
                        <Button onClick={modal.close}>Закрыть</Button>
                    </Space>
                )}
            >
                <Select
                    allowClear
                    showSearch
                    options={classesOptions}
                    style={{ width: '100%' }}
                    placeholder="Выберите новый класс для объекта"
                    onChange={setSelectedClass}
                    value={selectedClass}
                    filterOption={(input: string, option?: { label: string; value: number }) => {
                        return (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }}
                />
            </DefaultModal2>
            <ECTooltip key="play" title="Добавить в активы">
                <Button shape="circle" icon={<PlayCircleOutlined />} size="small" onClick={modal.open} />
            </ECTooltip>
        </>
    )
}