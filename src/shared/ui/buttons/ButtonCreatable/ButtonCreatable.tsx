import { FC } from 'react'
import { IButton } from '@shared/ui/buttons/types'
import { ButtonAdd } from '..'
import { ECTooltip } from '@shared/ui/tooltips'
import { Button } from 'antd'
import { SettingOutlined } from '@ant-design/icons'
import { useCreatableCheck } from '@shared/hooks/useCreatableCheck'
import { licensetooltipNames } from '@shared/hooks/useButtonCheckUtil/utilCreatable'

interface IAccountButtonAdd extends IButton {
    buttonType?: 'usual' | 'link'
    entity: string
    buttonAdd: boolean
}

export const ButtonCreatable: FC<IAccountButtonAdd> = ({ buttonAdd, entity, ...arg }) => {
    
    const isCreatable =  useCreatableCheck ({ entity })

    return buttonAdd ? (
         
        <ButtonAdd
            {...arg}
            disabled={!isCreatable.creatable || arg?.disabled}
            tooltipText={isCreatable.customTooltip ? isCreatable.customTooltip : arg?.tooltipText}
        />
    )
        : 
        (
            <ECTooltip
                title={isCreatable.customTooltip ? isCreatable.customTooltip : arg?.tooltipText ||
                    `Импортировать ${licensetooltipNames[entity][2]}`} 
            >
                <div>
                    <Button
                        icon={<SettingOutlined />}
                        {...arg}
                        disabled={!isCreatable.creatable || arg?.disabled}
                    >
                    </Button>
                </div>
            </ECTooltip>
        )
}