import { TWidgetFormSettings } from '../widget-types'
import { FC } from 'react'
import { IWidgetMultipleChartFormProps } from './WidgetMultipleChartForm'
import MultipleChartContainer from '@entities/attributes/MultipleChartContainer/MultipleChartContainer'
import { useTheme } from '@shared/hooks/useTheme'
import { useAccountStore, selectAccount } from '@shared/stores/accounts'
import { generalStore } from '@shared/stores/general'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'

const WidgetMultipleChart: FC<TWidgetFormSettings<IWidgetMultipleChartFormProps>> = ({ settings }) => {
    // const { settings } = props
    const { widget, vtemplate } = settings ?? {}
    const { /* attrsFromBaseForm, */ multipleHistoryForm, baseHistoryForm, baseMultipleHistoryForm } = widget ?? {}

    const interfaceView = generalStore((st) => st.interfaceView)
    const isShowcase = interfaceView === 'showcase'
    const theme = useTheme()
    const accountData = useAccountStore(selectAccount)
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode
    const textColor = isShowcase ? createColorForTheme(theme?.widget?.textColor, theme?.colors, themeMode) : 'black'
    const backgroundColor = isShowcase
        ? createColorForTheme(theme?.widget?.background, theme?.colors, themeMode)
        : 'white'

    // console.log('widget settings', settings)
    // console.log('widget', widget)

    return (
        <div
            style={{
                width: '100%',
            }}
        >
            <MultipleChartContainer
                background={backgroundColor}
                color={textColor}
                legend={{ position: 'left', layout: 'vertical' }}
                axisProps={multipleHistoryForm}
                commonSettings={baseMultipleHistoryForm}
                attrBlockProps={baseHistoryForm}
                currentObjectId={vtemplate.objectId}
                // autoUpdate={{
                //     enabled: true,
                //     time: 60_000
                // }}
                // objectAttributes={attrsFromBaseForm}
            />
        </div>
    )
}

export default WidgetMultipleChart