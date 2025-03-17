import { ECTooltip } from '@shared/ui/tooltips'
import { Button } from 'antd'
import { FC } from 'react'
import { IButtonRow } from '../types'

export const ButtonDownloadJSON: FC<IButtonRow> = ({ onClick }) => {
    return (
        <ECTooltip title="Скачать данные в формате JSON">
            <Button
                size="small"
                shape="circle"
                style={{
                    background: 'rgb(24, 144, 255)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '30px',
                    height: '30px',
                    color: '#ffffff',
                    fontSize: '10px',
                    borderRadius: '50%',
                }}
                type="primary"
                onClick={onClick}
                // icon={<EditOutlined />}
            >
           JSON
            </Button>
        </ECTooltip>
    )
}