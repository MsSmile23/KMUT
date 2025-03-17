import {
    SettingOutlined,
    DeleteOutlined,
    InfoCircleOutlined
} from '@ant-design/icons';
import { TInitialDataSettingVTType } from '@containers/vtemplates/VtemplateFormContainer/types/types';
import { widgetType } from '@containers/widgets/widget-types';
import { zIndex } from '@shared/config/zIndex.config';

import { ECTooltip } from '@shared/ui/tooltips/ECTooltip';
import { FC, memo } from 'react';

type SettingsBarTemplateProps = {
    openSettings: (e: any, id: string) => void;
    deleteCard: (id: string) => void
    widget: any
    isInterfaceShowcase?: boolean
    showSettingsInfo?: (widget?: widgetType) => void
    baseSettings?: TInitialDataSettingVTType
}

const SettingsBarTemplate: FC<SettingsBarTemplateProps> = (props) => {

    const { openSettings, deleteCard, widget, isInterfaceShowcase, showSettingsInfo, baseSettings } = props
    
    return (
        <div
            style={{
                position: 'absolute', 
                right: baseSettings?.wideTemplate ? undefined : 10, 
                top: 5, 
                cursor: 'pointer', 
                borderRadius: '3px',
                backgroundColor: '#d9d9d9',
                display: 'flex', 
                flexDirection: 'row', 
                gap: 10, 
                padding: '0 3px 0 3px', 
                zIndex: zIndex.widgetToolbarIndex
            }}
        >
            {!isInterfaceShowcase && 
            <>
                <div>
                    <ECTooltip title="Настройки">
                        <SettingOutlined
                            onClick={(e) => openSettings(e, widget.id)}
                            onMouseDown={(e: any) => e.stopPropagation()}
                        />
                    </ECTooltip>
                </div>
                <div>
                    <ECTooltip title="Удалить">
                        <DeleteOutlined
                            onClick={(e) => deleteCard(widget.id)}
                            onMouseDown={(e: any) => e.stopPropagation()}
                        />
                    </ECTooltip>
                </div>
            </>}
            <div>
                <ECTooltip title="Инфо">
                    <InfoCircleOutlined
                        onClick={(e) => showSettingsInfo(widget)}
                        onMouseDown={(e: any) => e.stopPropagation()}
                    />
                </ECTooltip>
            </div>
        </div>
    )
}

export default memo(SettingsBarTemplate)