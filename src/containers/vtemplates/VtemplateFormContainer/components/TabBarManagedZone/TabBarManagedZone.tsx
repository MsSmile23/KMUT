import { FC, useMemo } from 'react'
import {
    SettingOutlined,
} from '@ant-design/icons';
import { ButtonSettings } from '@shared/ui/buttons';
import CustomTabs from '@shared/ui/CustomTabs/CustomTabs';
import { TabsArrType } from '../../types/types';
import { ECTooltip } from '@shared/ui/tooltips';

type MainVTProps = {
    tabsArr: TabsArrType[],
    preview: boolean,
    onEdit?: (targetKey: React.MouseEvent | React.KeyboardEvent | string,
        action: 'add' | 'remove') => void;
    activeKey: string;
    onChangeTab?: (newActiveKey: string) => void;
    settingZoneVT?: () => void;
    isInterfaceShowcase?: boolean;
}

const TabBarManagedZone: FC<MainVTProps> = (props) => {

    const { tabsArr, preview, onEdit, activeKey, onChangeTab, settingZoneVT, isInterfaceShowcase } = props

    //Правый блок кнопок
    const operationsRight = (
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
                    onClick={settingZoneVT}
                >
                    <SettingOutlined />
                </ButtonSettings>
                {/* <Button
                    style={{ marginLeft: 10 }}
                    className="tabs-extra-demo-button"
                    color={ButtonColor.CYAN}
                    size={ButtonSize.S}
                    shape={ButtonShape.CIRCLE}
                    icon={<SettingOutlined />}
                    onClick={settingZoneVT}
                /> */}
            </span>
        </ECTooltip>)

    const slot = useMemo(() => {
        return {
            right: !isInterfaceShowcase ? (!preview ? operationsRight : undefined) : undefined,
            // left: <CircleTabPanel subject_id={subject_id} />
        }
    }, [preview]);

    const lengthTabs = tabsArr?.length >= 6 ? 'VtemplateSCForm_start' : false

    return (
        <div className="VtemplateSCForm__tabs-container">
            <CustomTabs
                isCustomLayout
                items={tabsArr}
                className={`VtemplateCustomWrapper ${lengthTabs}`}
                tabBarExtraContent={slot}
                activeKey={activeKey}
                type={(preview || isInterfaceShowcase) ? 'card' : 'editable-card'}
                size="small"
                onEdit={onEdit}
                onChange={onChangeTab}
            />
            {!tabsArr.length && (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginTop: 50,
                        cursor: 'pointer'
                    }}
                    onClick={() => onEdit('', 'add')}
                >
                    <ButtonSettings
                        size="large"
                        icon={false}
                        type="primary"
                        onClick={() => onEdit('', 'add')}
                    >
                        Создайте первый таб
                    </ButtonSettings>
                </div>

            // <div
            //     style={{ 
            //         display: 'flex', 
            //         flexDirection: 'column', 
            //         alignItems: 'center', 
            //         marginTop: 50,
            //         cursor: 'pointer'
            //     }} 
            //     onClick={() => onEdit('', 'add')}
            // >
            //     <div
            //         style={{ 
            //             width: 200, 
            //             // border: '1px solid #f0f0f0',
            //             borderRadius: 10,
            //             display: 'flex', 
            //             flexDirection: 'column', 
            //             alignItems: 'center',
            //             boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px'
            //         }}
            //     >
            //         <h3>Создайте первый таб</h3>
            //     </div>

            // </div>
            )}
        </div>
    )
}

export default TabBarManagedZone