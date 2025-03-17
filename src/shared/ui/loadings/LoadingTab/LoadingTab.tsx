import { Space, Spin } from 'antd'
import { FC } from 'react'

export const LoadingTab: FC<{ label?: string }> = ({ label = 'Загрузка' }) => {
    return (
        <Space>
            <Spin size="small" />
            <p style={{ margin: 0, padding: 0, transform: 'translateY(2px)' }}>
                {label}
            </p>
        </Space>
    )
}