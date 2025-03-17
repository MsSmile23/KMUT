import { Button, TooltipProps } from 'antd';
import { CSSProperties, FC } from 'react';
import * as Icons from '@ant-design/icons'
import { ECTooltip } from '@shared/ui/tooltips';
import { BaseButtonProps } from 'antd/es/button/button';

type TTooltipProps = Omit<TooltipProps, 'title'> & {
    title?: React.ReactNode
}

interface IECButtonDownloadProps {
    tooltip?: TTooltipProps
    button?: BaseButtonProps
    icon?: string
    format?: string
    disableClick?: boolean
    buttonStyle?: CSSProperties
    onClick?: () => void;
}

export const ECButtonDownload: FC<IECButtonDownloadProps> = ({
    tooltip,
    button,
    icon,
    disableClick,
    onClick,
    format = 'txt',
    buttonStyle
}) => {

    return (
        <ECTooltip title="Скачать" {...tooltip}>
            <Button
                type="default"
                shape="circle"
                style={{ ...buttonStyle }}
                icon={null}
                onClick={() => onClick()}
            >
                <div style={{ position: 'relative' }}>
                    <Icons.ExportOutlined />
                </div>
            </Button>
        </ECTooltip>
    )
}

export default ECButtonDownload