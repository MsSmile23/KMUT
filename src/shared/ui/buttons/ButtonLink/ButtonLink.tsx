import { Button } from 'antd';
import { FC } from 'react';
import { LinkOutlined } from '@ant-design/icons';
import { IButton } from '@shared/ui/buttons/types'
import { ECTooltip } from '@shared/ui/tooltips';

export const ButtonLink: FC<IButton> = ({ onClick, tooltipText, color, ...arg  }) => {
    return (
        <ECTooltip title={tooltipText ? tooltipText : 'Привязать'}>
            <Button
                size="small"
                shape="circle"
                style={{ backgroundColor: arg?.disabled ? 'grey' : color ? color : '#188EFC', color: '#ffffff' }}
                type="primary"
                onClick={onClick}
                icon={<LinkOutlined />}
                {...arg}
            />
        </ECTooltip>
    )
}