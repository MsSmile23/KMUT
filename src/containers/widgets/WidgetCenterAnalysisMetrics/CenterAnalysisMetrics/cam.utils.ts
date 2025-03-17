import { ICenterAnalysisMetricsProps } from './cam.types'

export type TMergeArrays<T = any> = (arrs: T[]) => T

export const mergeArrays: TMergeArrays = (arrays) => {
    const result = arrays.reduce((acc, arr) => {
        return arr 
            ? [...acc, ...arr] 
            : acc
    }, [])
    
    return [...new Set(result)]
}

export const defaultVisualSettings: ICenterAnalysisMetricsProps['camVisualSettings'] = {
    layout: {
        verticalGap: 10,
        horizontalGap: 10,
        boxShadowColor: 'rgba(0, 0, 0, 0.1)',
        boxShadowWidth: 2,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 0,
        borderRadius: 8,
    },
    tree: {
        width: 30,
        widthUnit: '%',
        OAttrValueWidth: 100,
        titleWidth: 100,
        stepWidth: 100,
        showButtons: 'all',
        titleButtonsWidth: 100,
        shortenTitle: false,
        showOAttrValue: true,
        showTitle: true,
    },
    chart: {
        padding: 10,
        zonesGap: 10,
        graphGap: 10,
    }
}