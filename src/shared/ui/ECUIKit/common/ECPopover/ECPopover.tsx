import { FC } from 'react'
import { Popover, PopoverProps } from 'antd'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ECPopoverProps extends PopoverProps {}

export const ECPopover: FC<ECPopoverProps> = ({ ...props }) => {
    return <Popover {...props} />
}