import { layoutType } from '@shared/types/vtemplates'

export const getLayouts = (dataLayout?: layoutType) => {
    if (Object.keys(dataLayout || {}).length !== 0) {
        if (dataLayout?.allZones && Object.keys(dataLayout?.allZones || {}).length !== 0) {
            return dataLayout?.allZones
        } else {
            return {
                lg: dataLayout?.widgets?.length
                    ? dataLayout?.widgets?.map((widget: any) => {
                        return {
                            i: widget?.id,
                            ...widget?.layout
                        }
                    })
                    :
                    []
            }
        }
    } else {
        return {}
    }
};