export const initialTableRows = {
    objectFilters: undefined,
    representationType: undefined
}

export const initialValues = {
    mapCenter: undefined,
    startZoom: undefined,
    fitToMarkers: false,
    isTile: true,
    fixedMap: false,
    isLegend: false,
    groups: {}
}

export const viewTypeOptionsAfter = [
    // { label: 'кластеры', value: 'clustersVeiw' },
    { label: 'точки', value: 'pointsVeiw' },
    { label: 'контуры', value: 'polygonsVeiw' },
]

export const viewTypeOptionsBefore = [
    // { label: 'кластеры', value: 'clustersVeiw' },
    { label: 'точки', value: 'pointsVeiw' },
    { label: 'контуры', value: 'polygonsVeiw' },
]

export const representationOptions = [
    { label: 'точки', value: 'points' },
    { label: 'контуры', value: 'polygons' },
    { label: 'точки и контуры', value: 'pointsAndPolygons' },
]