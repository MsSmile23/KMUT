import { useObjectsStore } from '@shared/stores/objects'
import { useStateEntitiesStore } from '@shared/stores/state-entities'
import { useStatesStore } from '@shared/stores/states'
import { findStateColor } from '@shared/utils/states'
import { Card, Col, Row, Space, Table } from 'antd'
import { FC, ReactNode } from 'react'
import { useOpen } from '@shared/hooks/useOpen'
import * as Icons from '@ant-design/icons'
import ObjectCardModal from '@features/objects/ObjectCardModal/ObjectCardModal'
import { useTheme } from '@shared/hooks/useTheme'
import { selectAccount, useAccountStore } from '@shared/stores/accounts'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'
import { generalStore } from '@shared/stores/general'

interface ILinkedObjectCardProps {
    id: number
    relationName?: string
    rows?: Array<{ name: string; value: string; key: string | number }>
    title?: string | ReactNode
    clickDisabled?: boolean
    showObjectId?: { enable?: boolean; title?: string }
}

export const LinkedObjectCard: FC<ILinkedObjectCardProps> = ({
    id,
    relationName,
    rows,
    title,
    clickDisabled,
    showObjectId,
}) => {
    const object = useObjectsStore((st) => st.store.data.find((obj) => obj.id === id))
    const stateId = useStateEntitiesStore((st) => st.store.data?.objects?.find((obj) => obj.entity === id)?.state)
    const state = useStatesStore((st) => st.store.data.find((state) => state.id === stateId))
    const modal = useOpen()

    const ClassIcon = Icons[object?.class?.icon]

    const finalRows = [
        ...(showObjectId?.enable ? [{ key: 'id', name: showObjectId?.title || 'ID объекта', value: object?.id }] : []),
        ...((rows as any[]) ||
            (object?.object_attributes || []).map((attr, i) => ({
                name: attr.attribute.name,
                value: attr.attribute_value,
                key: i,
            }))),
    ]
    const theme = useTheme()
    const accountData = useAccountStore(selectAccount)
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode

    const interfaceView = generalStore((st) => st.interfaceView)
    const isShowcase = interfaceView === 'showcase'

    const color = isShowcase ? createColorForTheme(theme?.textColor, theme?.colors, themeMode) || '#000000' : 'black'
    const background = isShowcase
        ? createColorForTheme(theme?.widget?.background, theme?.colors, themeMode) || '#ffffff'
        : '#ffffff'

    const generateRowClassName = () => {
        return `
            .custom-row {
                background-color: ${background} !important;
                color: ${color} !important;
            }
            .custom-row td {
                color: ${color} !important;
            }
        `
    }

    return (
        <>
            <ObjectCardModal objectId={id} modal={{ open: modal.isOpen, onCancel: modal.close }} />
            <Card
                style={{
                    outline: `2px solid ${findStateColor(state, 'border')}`,
                    cursor: clickDisabled ? 'default' : 'pointer',
                    background: background,
                }}
                headStyle={{
                    padding: '0 12px',
                    background: findStateColor(state, 'fill') ?? background,
                    color: findStateColor(state, 'textColor') ?? color,
                }}
                title={
                    <Row>
                        <Col xs={24}>{relationName}</Col>
                        <Col xs={24}>
                            <Space>
                                {object?.class?.icon ? <ClassIcon /> : null}
                                {title || object?.class?.name}
                            </Space>
                        </Col>
                    </Row>
                }
                bodyStyle={{ padding: 8 }}
                onClick={!clickDisabled && modal.open}
            >
                <div>
                    <style>{generateRowClassName()}</style>
                    <Table
                        rowClassName={() => 'custom-row'}
                        showHeader={false}
                        columns={[
                            { key: 'name', title: 'Атрибут' },
                            { key: 'value', title: 'Значение' },
                        ].map((col) => ({ ...col, dataIndex: col.key }))}
                        pagination={false}
                        dataSource={finalRows}
                    />
                </div>
            </Card>
        </>
    )
}