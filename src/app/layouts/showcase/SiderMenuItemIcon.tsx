import { ECIconView, IECIconView } from '@shared/ui/ECUIKit/common/ECIconView/ECIconView'
import { Badge } from 'antd'
import { FC } from 'react'

export const SiderMenuItemIcon: FC<{
    icon: string
    isActive: boolean
    activeColor?: string
    inactiveColor?: string
    stateCount?: number
    stateCountColor?: string
}> = ({
    icon,
    isActive,
    activeColor,
    inactiveColor,
    stateCount,
}) => {

    return (
        <Badge
            count={stateCount}
            offset={[10, -5]}
            styles={{
                indicator: {
                    zIndex: 1000,
                }
            }}
            overflowCount={99}
        >
            <ECIconView
                icon={icon as IECIconView['icon']}
                style={{
                    fontSize: 24,
                    color: isActive 
                        ? activeColor
                        : inactiveColor,
                }}
            />
        </Badge>
    )
}