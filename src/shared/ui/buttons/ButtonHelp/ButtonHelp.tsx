import { Button } from 'antd'
import { FC, ReactNode } from 'react'
import { QuestionOutlined } from '@ant-design/icons'
import { ECTooltip } from '@shared/ui/tooltips'
import { ECPopover } from '@shared/ui/ECUIKit/common'
import { IButtonRow } from '../types'

interface IHelpButton extends Omit<IButtonRow, 'tooltipText' | 'type' > {
    tooltipText: ReactNode | string,
    type?: 'tooltip' | 'popover'
}
export const ButtonHelp: FC<IHelpButton> = ({ tooltipText, type = 'tooltip', ...arg }) => {
    return (
        <>
            {type === 'tooltip' && (
                <ECTooltip title={tooltipText}>
                    <Button shape="circle" icon={<QuestionOutlined rev={undefined} />} {...arg} />
                </ECTooltip>)}
            {type === 'popover' && (
                <ECPopover
                    content={
                        <span
                            dangerouslySetInnerHTML={{
                                __html: tooltipText
                            }}
                        />
                    }
                >
                    <Button shape="circle" icon={<QuestionOutlined rev={undefined} />} {...arg} />
                </ECPopover>)}
        </>
    )
}