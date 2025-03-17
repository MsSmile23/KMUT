import { dataVtemplateProps, layoutType, MacroZoneType, paramsVtemplate, TDataSettingFullScreenZone } from '@shared/types/vtemplates'

export const initialLayout: dataVtemplateProps<paramsVtemplate> = {
    id: 0,
    mnemonic: '',
    name: '',
    params: {
        tabs: [],
        dataToolbar: {
            name: '',
            maketType: 0,
            purpose: 0,
            classes: []
        },
        layoutContentManageZone: {},
        layoutContentUnmanageableZone: {} as layoutType,
        dataSettingManageZoneTab: { typeManageElement: 0, typeEditContent: 0 },
        dataSettingUnmanageZoneTab: { typeEditContent: 0 },
        dataSettingFullScreenZone: {} as TDataSettingFullScreenZone,
        makroZone: MacroZoneType.DEFAULT_ZONE,
        showHeaderZone: false,
        typeTabs: 'horizontal',
        builderData: 'preview'
    },
    vtemplate_type: {
        id: 0,
        mnemonic: '',
        name: '',
        params: ''
    },
    vtemplate_type_id: 0
}

export const initialDataLayout = {
    widgets: [],
    allZones: {},
    edit: true,
    cols: 0,
    breakpoint: '',
    width: 0
}

export const initialLabels = {
    title_position: 'left',
    title_show: false,
    title_color: '#000000',
    title_text: ''
}

export const initialStyle = {
    paddingOutWidgetTop: 0,
    paddingOutWidgetRight: 0,
    paddingOutWidgetLeft: 0,
    paddingOutWidgetBottom: 0,
    borderThickness: 0,
    borderColor: '#000000',
    borderRadiusTopLeft: 10,
    borderRadiusTopRight: 10,
    borderRadiusBottomLeft: 10,
    borderRadiusBottomRight: 10,
    backgroundColor: '#f0f0f0',
}