import { Tooltip, TooltipProps } from 'antd';
import React, { FC } from 'react';
import { useOpen } from '@shared/hooks/useOpen';

type TECTooltipProps = Omit<TooltipProps, 'title'> & {
    hideByClick?: boolean
    title?: React.ReactNode
}

export const ECTooltip: FC<TECTooltipProps> = ({ 
    title, 
    hideByClick,
    ...props 
}) => {
    const tip = useOpen()

    return (
        <Tooltip 
            open={tip.isOpen}
            onOpenChange={tip.toggle}
            title={(
                <div
                    onClick={hideByClick ? tip.close : undefined}
                    onMouseEnter={hideByClick ? undefined : tip.close}
                >
                    {title}
                </div>
            )}
            {...props}
        >
            {props.children}
        </Tooltip>
    )
}