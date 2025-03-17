import { ECTooltip } from '@shared/ui/tooltips'
import { Button } from 'antd'
import { FC } from 'react'
import { IButtonRow } from '../types'

export const ButtonDownloadCSV: FC<IButtonRow> = ({ onClick }) => {
    return (
        <ECTooltip title="Скачать данные в формате CSV">
            <Button
                size="small"
                shape="circle"
                style={{
                    background: '#007b00',
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
                CSV
            </Button>
        </ECTooltip>
    )
}