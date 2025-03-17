import { SVGAttributes } from 'highcharts';

interface IRangeInputIcons {
    // нужен только path svg иконки, остальные теги не нужны, так как вставка иконки происходит в существующий svg
    path: string 
    fill?: string // при необходимости заливки цветом передать цвет сюда
}
type IRenderLegendParams = (params: ('left' | 'right' | 'top' | 'bottom' | any)) => Highcharts.LegendOptions

////////////////////////////////////////////

export const helpers = {
    addCustomSvgElement: (chart) => {
        if (chart.name) {
            chart.name.destroy();
            chart.name = undefined;
        }
    },
    addAttrsToSVG: (element: SVGElement, attrs: SVGAttributes) => {
        Object.entries(attrs).map(([key, value]) => {
            element.setAttribute(key, value)
        })

        return element;
    },
    roundToFirstDecimal: (value: number) => Math.round(value * 10) / 10,
    roundToDecimalPoint: (value: number, decimalPoint: number) => {
        const roundOrder = Math.pow(10, decimalPoint)

        return Math.round(value * roundOrder / roundOrder)
    },
}

// Поместить значение в центр бублика
export const addTotalToDonutCenter = (chart) => {
    if (chart.customTitle) {
        chart.customTitle.destroy()
        chart.customTitle = undefined
    }

    const series = chart.series[0]
    const seriesCenter = series.center
    const x = seriesCenter[0] + chart.plotLeft
    const y = seriesCenter[1] + chart.plotTop
    const text = '' + series?.total

    chart.customTitle = chart.renderer.text(
        text,
        x,
        y,
        false
    )
        .css({
            fontSize: '1em',
            color: '#000000',
            fontWeight: 'bold'
        })
        .add();

    const fontMetrics = chart.renderer.fontMetrics(chart.customTitle);
    const customTitleSizes = chart.customTitle.getBBox()

    chart.customTitle.attr({
        x: x - customTitleSizes.width / 2,
        y: y + fontMetrics.f / 2,
        zIndex: 6,
    });
}

//Добавление двойного кольца к бублику
export const addDoubleRing = (
    chart,
    settings: {
        outer: {
            name: string,
            radCoef: number,
            background: string,
            color: string,
            borderWidth: number
        },
        inner: {
            name: string,
            radCoef: number,
            background: string,
            color: string,
            borderWidth: number
        }
    }
) => {
    if (chart.customCircles) {
        chart.customCircles.destroy()
        chart.customCircles = undefined
    }
    const ren = chart.renderer
    const centerX = chart.plotLeft + chart.plotSizeX / 2
    const centerY = chart.plotTop + chart.plotSizeY / 2
    const radius = [
        chart?.series[0]?.data[0]?.shapeArgs?.r * settings.outer.radCoef,
        chart?.series[0]?.data[0]?.shapeArgs?.innerR * settings.inner.radCoef
    ]

    chart.customCircles = chart.renderer.g('customCircles').add();

    //Внешнее кольцо
    if (radius[0]) {
        ren.circle(centerX, centerY, radius[0]).attr({
            fill: settings.outer.background,
            stroke: settings.outer.color,
            'stroke-width': settings.outer.borderWidth,
            zIndex: 6 // Такой чтобы перекрывать коннекторы (zIndex: 2)
        }).add(chart.customCircles);
    }

    //Внутреннее кольцо
    if (radius[1]) {
        ren.circle(centerX, centerY, radius[1]).attr({
            fill: settings.inner.background,
            stroke: settings.inner.color,
            'stroke-width': settings.inner.borderWidth,
            zIndex: 6 // Такой чтобы перекрывать коннекторы (zIndex: 2)
        }).add(chart.customCircles);
    }

}

// Добавить иконки после инпутов rangeSelector
export const addIconsToRangeInputs = (
    chart,
    iconFrom: IRangeInputIcons,
    iconTo: IRangeInputIcons,
    gutter: number,
) => {
    if (chart.rangeSelector.iconFrom) {
        chart.rangeSelector.iconFrom.destroy();
        chart.rangeSelector.iconFrom = undefined;
    }
    
    if (chart.rangeSelector.iconTo) {
        chart.rangeSelector.iconTo.destroy();
        chart.rangeSelector.iconTo = undefined;
    }

    // Размеры группы инпутов
    const inputGroupSizes = chart.rangeSelector.inputGroup.getBBox()
    //Размеры лейбла инпута 'даты от'
    const minLabelSizes = chart.rangeSelector.minLabel.getBBox()
    //Размеры самогоинпута 'даты от'
    const minDateBoxSizes = chart.rangeSelector.minDateBox.getBBox()

    // добавить иконку по координатам maxLabel
    chart.rangeSelector.iconFrom = chart.renderer
        .path(iconFrom.path.split(' '))
        .attr({
            fill: iconFrom.fill,
            zIndex: 30,
        })
        .add(chart?.rangeSelector?.inputGroup)

    const iconFromSizes = chart.rangeSelector.iconFrom.getBBox()

    // сместить иконку от maxLabel и отцентрировать по высоте
    chart.rangeSelector.iconFrom.attr({
        transform: `translate(
                    ${minLabelSizes.width + minDateBoxSizes.width + gutter * 2},
                    ${(inputGroupSizes.height - iconFromSizes.height) / 2}
                )`
    })

    // добавить иконку по конечным координатам inputGroup
    chart.rangeSelector.iconTo = chart.renderer
        .path(iconTo.path.split(' '))
        .attr({
            fill: iconTo.fill,
            zIndex: 30
        })
        .add(chart.rangeSelector.inputGroup)

    const iconToSizes = chart.rangeSelector.iconFrom.getBBox()

    // сместить иконку от inputGroup и отцентрировать по высоте
    chart.rangeSelector.iconTo.attr({
        transform: `translate(
                ${inputGroupSizes.width + gutter},
                ${(inputGroupSizes.height - iconToSizes.height) / 2}
            )`,
    })
}

// стилизация инпутов rangeSelector
export const styleRangeInputs = (chart, attrs: SVGAttributes) => {

    const inputsRects = chart.rangeSelector.inputGroup.element.querySelectorAll('.highcharts-range-input > rect')

    // 'from range input' attributes
    const fromAtrrs = {
        fill: attrs.background,
        stroke: attrs.borderColor,
        'stroke-width': attrs.width,
        rx: attrs.borderRadius
    }

    // 'to range input' attributes
    const toAtrrs = {
        fill: attrs.background,
        stroke: attrs.borderColor,
        'stroke-width': attrs.width,
        rx: attrs.borderRadius
    }

    helpers.addAttrsToSVG(inputsRects[0], fromAtrrs)
    helpers.addAttrsToSVG(inputsRects[1], toAtrrs)
}

// кастомный навигатор
export const customNavigator = (chart) => {
    if (chart.navigator.navigatorGroup.customBox) {
        chart.navigator.navigatorGroup.customBox.destroy();
        chart.navigator.navigatorGroup.customBox = undefined;
    }
    const navigatorSizes = chart.navigator.navigatorGroup.getBBox()
    const boxBorderWidth = 1

    // const outsideNavs = chart.navigator.navigatorGroup.element.querySelectorAll('.highcharts-navigator-mask-outside')
    // const [leftNav, rightNav] = outsideNavs
    // const insideNav = chart.navigator.navigatorGroup.element.querySelectorAll('.highcharts-navigator-mask-inside')
    
    chart.navigator.navigatorGroup.customBox = chart.renderer
        .rect({
            'stroke-width': 1,
            height: navigatorSizes.height + 2 * boxBorderWidth,
            width: navigatorSizes.width,
            // width: navigatorSizes.width + 2 * boxBorderWidth,
            x: navigatorSizes.x,
            y: navigatorSizes.y - boxBorderWidth,
            r: 4
        })
        .attr({
            stroke: 'blue',
        })
        .add(chart?.navigator.navigatorGroup)


}

// скрытие группы инпутов при маленьком размере
export const toggleRangeInputs = (chart) => {
    if (chart.options.rangeSelector.enabled && chart.rangeSelector.buttonGroup && chart.rangeSelector.inputGroup) {
        const RSwidth = chart.rangeSelector.group.getBBox().width
        const BGwidth = chart.rangeSelector.buttonGroup.getBBox().width
        const IGwidth = chart.rangeSelector.inputGroup.getBBox().width
        const freeSpace = RSwidth - BGwidth - IGwidth
        
        freeSpace < 150
            ? chart.rangeSelector.inputGroup.hide()
            : chart.rangeSelector.inputGroup.show()
    }
}

// определение положения легенды в зависимости от пользовательского параметра
export const renderLegendParams: IRenderLegendParams = (params) => {
    switch (params) {
        case 'left': {
            return {
                align: 'left',
                verticalAlign: 'middle'
            }
        }
        case 'right': {
            return {
                align: 'right',
                verticalAlign: 'middle'
            }
        }

        case 'top': {
            return {
                align: 'center',
                verticalAlign: 'top'
            }
        }
        case 'bottom': {
            return {
                align: 'center',
                verticalAlign: 'bottom'
            }
        }
        default: {
            return {
                align: 'left',
                verticalAlign: 'middle'
            }
        }
    }
}

// Кастомные лейблы для простой и выносной легенды пайчартов
export const customLabels = (
    label,
    legendUnits = '',
    legendTypeValues = 'absolute',
    activeLabelLegend = false
) => {
    // настройка, чтобы не отображать пробел после значений, если единица измерения равна '' 
    const unit = legendUnits && legendUnits.length > 0
        ? ` ${legendUnits}`
        : ''

    switch (legendTypeValues) {
        case 'absolute': {

            return activeLabelLegend 
                ? `${label.name} - ${helpers.roundToFirstDecimal(label.y)}${unit}` 
                : `${helpers.roundToFirstDecimal(label.y)}${unit}`
        }
        case 'percentage': {

            return activeLabelLegend 
                ? `${label.name} - ${helpers.roundToFirstDecimal(label.percentage)}%` 
                : `${helpers.roundToFirstDecimal(label.percentage)}%`
        }
        case 'both': {

            return activeLabelLegend
                ? `${label.name} - ${helpers.roundToFirstDecimal(label.percentage)}% 
                    (${helpers.roundToFirstDecimal(label.y)}${unit})`
                : `${helpers.roundToFirstDecimal(label.percentage)}% (${helpers.roundToFirstDecimal(label.y)}${unit})`
        }
        default: {

            return activeLabelLegend 
                ? `${label.name} - ${helpers.roundToFirstDecimal(label.y)}${unit}` 
                : `${helpers.roundToFirstDecimal(label.y)}${unit}`
        }
    }
}