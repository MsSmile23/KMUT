import { useTheme } from '@shared/hooks/useTheme'
import { Select } from 'antd'
import { FC, useMemo } from 'react'

interface VtemplateDashboardFormProps {
    onChangeWidget: (mnemo: string) => void
    widgetMnemo: string
}

const VtemplateDashboardForm: FC<VtemplateDashboardFormProps> = (props) => {
    
    const { onChangeWidget, widgetMnemo } = props

    const listWidgets = useTheme()?.widgets

    const arrSelectWidgets = useMemo(() => {
        return listWidgets
            .filter((item) => item.mnemo !== 'object.ObjectAttributesAndChildStates')
            .map((item) => {
                return {
                    label: item.title,
                    value: item.mnemo
                }
            })
    }, [listWidgets])

    // console.log('theme', listWidgets)

    
    return (
        <div>
            <Select
                placeholder= "Выберите виджет"
                value={widgetMnemo ? widgetMnemo : undefined}
                onChange={(value) => onChangeWidget(value)}
                options={arrSelectWidgets}
                style={{ minWidth: 200, maxWidth: 500, width: '100%' }}
            />
    
        </div>
    )
}

export default VtemplateDashboardForm