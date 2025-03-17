import { Button, Dropdown, MenuProps } from 'antd'
import { availableIndicatorsList } from './utils'
import { FC } from 'react'
import { ECTooltip } from '@shared/ui/tooltips'
import { ECIconView } from '@shared/ui/ECUIKit/common/ECIconView/ECIconView'

interface IIndicatorDropdownProps {
    getFormValues: (form: any) => void
    currentIndicator: string | undefined
}

const dropdownItems: MenuProps['items'] = availableIndicatorsList.map((indicator) => {
    return {
        key: indicator.value,
        label: indicator.label
    }
})

export const IndicatorDropdown: FC<IIndicatorDropdownProps> = ({
    getFormValues, currentIndicator
}) => {    
    return (
        <Dropdown 
            menu={{
                items: dropdownItems,
                onClick: (info) => {
                    const indicator = info.key === currentIndicator 
                        ? undefined 
                        : info.key
                        
                    getFormValues(indicator)
                },
                selectedKeys: [currentIndicator]
            }}
            trigger={['click']}
        >
            <ECTooltip 
                placement="topLeft" 
                title="Индикаторы"
            >
                <Button
                    size="small"
                    shape="circle"
                    onClick={(e) => e.preventDefault()}
                >
                    <ECIconView 
                        icon="AreaChartOutlined"
                    />
                </Button>
            </ECTooltip>
        </Dropdown>
    )
}