import { DownOutlined, UpOutlined } from '@ant-design/icons'
import { FC, memo } from 'react'
import { IStatus } from './ObjectsStatusList'

interface IStatusItemProps {
    status: IStatus
    mnemo: string
    toggleReason: (statusType: string) => void
    openReason: Record<any, boolean>
    statusType: string
    textColor: string
}

const StatusItem: FC<IStatusItemProps> = ({ status, mnemo, toggleReason, openReason, statusType, textColor }) => {
    const isDisconnected = mnemo === 'not_available'

    return (
        <>
            <span
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    cursor: isDisconnected ? 'pointer' : 'default',
                    color: textColor
                }}
                onClick={isDisconnected ? () => toggleReason(statusType) : undefined}
            >
                <div style={{ width: 24, height: 24, backgroundColor: status.color, borderRadius: 6 }} />
                <span>{status.label}:</span>
                <div>
                    <span>{status.value}</span>
                    {isDisconnected && (
                        <span style={{ fontSize: 12, marginLeft: 10 }}>
                            {openReason[statusType] ? <UpOutlined /> : <DownOutlined />}
                        </span>
                    )}
                </div>
            </span>
            {isDisconnected && openReason[statusType] && (
                <div style={{ display: 'flex', flexDirection: 'column', color: textColor }}>
                    {Object.values(status?.children)?.map((reason, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ width: 24, height: 24, backgroundColor: reason.color, borderRadius: 6 }} />
                            <span style={{ marginLeft: 5 }}>- {reason?.label}: {reason?.value}</span>
                        </div>
                    ))}
                </div>
            )}
        </>
    )
}

export default memo(StatusItem)