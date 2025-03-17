import { FC, useMemo } from 'react'
import { TWidgetSettings } from '../widget-types'
import AttributeValueContainer from '@entities/attributes/AttributeValueContainer/AttributeValueContainer'
import { ILinkedObjectsForm } from '@entities/objects/LinkedObjects/LinkedObjects'

interface WidgetWidgetAttributeValueProps {
    linkedObjectsForm?: ILinkedObjectsForm
    viewType: 'text' | 'histogram'
    aggregation: 'sum' | 'average'
    textPosition:
        | 'topLeft'
        | 'topCenter'
        | 'topRight'
        | 'centerLeft'
        | 'center'
        | 'centerRight'
        | 'bottomLeft'
        | 'bottomCenter'
        | 'bottomRight'

    attributes: number[]
    ratio: number
    textLabel: string
    textUnit: string
    textFontsize: number
    histogramDirection: 'horizontal' | 'vertical'
    histogramMaxValue: number
    histogramUnit: string
    histogramColumnColor: string
}
const WidgetAttributeValue: FC<TWidgetSettings<WidgetWidgetAttributeValueProps>> = (props) => {
    const { settings } = props
    const { widget, vtemplate } = settings
    const {
        attributes,
        linkedObjectsForm,
        viewType,
        ratio,
        aggregation,
        textLabel,
        textUnit,
        textFontsize,
        textPosition,
        histogramMaxValue,
        histogramUnit,
        histogramColumnColor,
        histogramDirection,
    } = widget

    const customAttrLabels = useMemo(() => {
        const names = {}

        if (settings?.widget) {
            Object.keys(settings?.widget).forEach((key) => {
                if (key.includes('customName')) {
                    const attr = key.split('_')[1]

                    names[attr] = settings?.widget[key]
                }
            })

            return names
        }
    }, [settings])



    return (
        <AttributeValueContainer
            objectId={vtemplate?.objectId}
            histogramDirection={histogramDirection}
            customAttrLabels={customAttrLabels}
            viewType={viewType}
            linkedObjectsForm={linkedObjectsForm}
            attributes={attributes}
            ratio={ratio}
            aggregation={aggregation}
            textFontsize={textFontsize}
            textLabel={textLabel}
            textUnit={textUnit}
            textPosition={textPosition}
            histogramColumnColor={histogramColumnColor}
            histogramMaxValue={histogramMaxValue}
            histogramUnit={histogramUnit}
        />
    )
}

export default WidgetAttributeValue