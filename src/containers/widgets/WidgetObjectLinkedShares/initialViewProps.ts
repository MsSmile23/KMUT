import { TViewPropsPieChart, TRepresentationType, TViewPropsTreeMapChart, TViewPropsProgressBar, TViewPropsStatusPorts, TViewPropsVerticalHistogram } from '@containers/widgets/WidgetObjectLinkedShares/representationTypes'

const initialViewPropsPieChart: TViewPropsPieChart = {
    height: 300,
    width: undefined,
    chartRatio: 30,
    legendRatio: 55,
    chartTitle: '',
    legendEnabled: false,
    showNames: false,
    roundDigits: 1,
    showShortName: false,
    showCategoryTitle: false,
    orientation: 'bottom',
    showObjectsTable: false
}

const initialViewPropsTreeMap: TViewPropsTreeMapChart = {
    height: 300,
    valueDisplayType: 'absolute'
}

const initialViewPropsProgressBar: TViewPropsProgressBar = {
    height: 300,
    iconColor: '#1677ff',
    rightFromTitleView: 'absolute',
    rightFromProgressBarView: 'absolute',
    precentType: 'absolute'
}

const initialViewPropsStatusPorts: TViewPropsStatusPorts = {
    height: 300,
    directionViewPorts: 'horizontal'
}

const initialViewVerticalHistogram: TViewPropsVerticalHistogram = {
    height: 300,
    legendItemWidth: 112,
    legendOffset: 25,
    showPercents: false,
    maxValue: undefined
    
}



const initialViewProps = {
    pieChart: initialViewPropsPieChart,
    treemap: initialViewPropsTreeMap,
    progressBar: initialViewPropsProgressBar,
    statePorts: initialViewPropsStatusPorts,
    verticalHistogram: initialViewVerticalHistogram
}

export const initialViewPropsValues = (representationType: TRepresentationType)  => {
    return initialViewProps[representationType || 'pieChart']
}