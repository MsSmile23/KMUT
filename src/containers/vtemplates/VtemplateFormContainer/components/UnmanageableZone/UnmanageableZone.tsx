import VtemplateDashboardView from '@app/vtemplate/VtemplateDashboardView'
import { ButtonSettings } from '@shared/ui/buttons'
import {
    SettingOutlined,
} from '@ant-design/icons';
import { FC } from 'react';
import { TBuilderData, TInitialDataSettingVTType, layoutType } from '../../types/types';
import { ECTooltip } from '@shared/ui/tooltips';
import { widgetType } from '@containers/widgets/widget-types';
import { TPage } from '@shared/types/common';

interface UnmanageableZoneProps {
    preview: boolean
    handleChangeEditLayoutUnmanageableZone: (layout: layoutType) => void
    dataResponse: layoutType
    settingUnmanageZone: () => void;
    objectId?: number,
    baseSettings?: TInitialDataSettingVTType,
    isInterfaceShowcase?: boolean,
    showSettingsInfo?: (widget?: widgetType) => void,
    page?: TPage,
    builderData?: TBuilderData,
}

const UnmanageableZone: FC<UnmanageableZoneProps> = (props) => {

    const {
        preview,
        handleChangeEditLayoutUnmanageableZone,
        dataResponse,
        settingUnmanageZone,
        objectId,
        baseSettings,
        isInterfaceShowcase,
        showSettingsInfo,
        page,
        builderData
    } = props

    return (
        <div style={{ marginTop: '-10px' }}>
            {!preview && !isInterfaceShowcase && (
                <div
                    style={{ 
                        display: 'flex', 
                        justifyContent: 'end',
                        marginBottom: 20, 
                        marginTop: 31, 
                        marginRight: 11 
                    }}
                >
                    <ECTooltip title="Настройки зоны" placement="bottom">
                        <span>
                            <ButtonSettings
                                icon={false}
                                style={{ marginLeft: 10 }}
                                className="tabs-extra-demo-button"
                                // style={{ backgroundColor: 'green' }}
                                type="primary"
                                shape="circle"
                                disabled={false}
                                onClick={settingUnmanageZone}
                            >
                                <SettingOutlined />
                            </ButtonSettings>
                        </span>
                    </ECTooltip>
                </div>
            )}

            <VtemplateDashboardView
                editable={!preview}
                objectId={objectId}
                onChange={handleChangeEditLayoutUnmanageableZone}
                dataResponse={dataResponse || {} as layoutType}
                baseSettings={baseSettings}
                isInterfaceShowcase={isInterfaceShowcase}
                showSettingsInfo={showSettingsInfo}
                page={page}
                builderData={builderData}
            />
        </div>
    )
}

export default UnmanageableZone