/* eslint-disable react/jsx-max-depth */
import { Upload, UploadProps } from 'antd'
import { FC } from 'react'
import {
    EditOutlined,
    EyeOutlined,
    RollbackOutlined,
    SaveOutlined,
    SettingOutlined,
    DownloadOutlined,
    UploadOutlined,
    InfoCircleOutlined,
    DownOutlined,
    UpOutlined
} from '@ant-design/icons';

import { ButtonSettings } from '@shared/ui/buttons';
import { TBuilderData, VTGeneratorToolbarType } from '../../types/types';
import { ECTooltip } from '@shared/ui/tooltips';
import { widgetType } from '@containers/widgets/widget-types';
import { Select } from '@shared/ui/forms';
import { builderDataList } from '../../data';

type VTGeneralToolbarProps = {
    handleVTGeneratorToolbar: (type: VTGeneratorToolbarType, file?: any) => void,
    preview: boolean;
    saveFlag: boolean;
    loading: boolean;
    isInterfaceShowcase?: boolean;
    showSettingsInfo?: (widget?: widgetType) => void;
    setShowHeaderZone?: (value?: any) => void;
    showHeaderZone?: boolean;
    isManagedZone?: boolean;
    onBuilderDataChange?: (value: TBuilderData) => void;
    builderData?: TBuilderData
}

const VTGeneralToolbar: FC<VTGeneralToolbarProps> = (props) => {

    const { 
        handleVTGeneratorToolbar, 
        preview, 
        saveFlag, 
        loading, 
        isInterfaceShowcase, 
        showSettingsInfo, 
        setShowHeaderZone,
        showHeaderZone,
        isManagedZone,
        onBuilderDataChange,
        builderData
    } = props

    const readJsonFile = (file: Blob) =>
        new Promise((resolve, reject) => {
            const fileReader = new FileReader()

            fileReader.onload = event => {
                if (event.target) {
                    resolve(JSON.parse(event.target.result as string))
                }
            }

            fileReader.onerror = error => reject(error)
            fileReader.readAsText(file)
        })

    const propsDownload: UploadProps = {
        beforeUpload: async (file) => {
            const result = await readJsonFile(file)

            console.log('result', result)
            
            return false;
        },
    };

    return (

        <div className="VtemplateSCForm__group-button">
            <div>
                {preview ?
                    <ECTooltip title="Редактирование" placement="bottom">
                        <span>
                            <ButtonSettings
                                icon={false}
                                type="primary"
                                shape="circle"
                                onClick={() => handleVTGeneratorToolbar(VTGeneratorToolbarType.EDIT)}
                            >
                                <EditOutlined />
                            </ButtonSettings>
                        </span>
                    </ECTooltip>
                    :
                    <>
                        <ECTooltip title="Просмотр" placement="bottom">
                            <span>
                                <ButtonSettings
                                    icon={false}
                                    type="primary"
                                    shape="circle"
                                    onClick={() => handleVTGeneratorToolbar(VTGeneratorToolbarType.SHOW)}
                                >
                                    <EyeOutlined />
                                </ButtonSettings>
                            </span>
                        </ECTooltip>
                        {!isInterfaceShowcase && 
                            <ECTooltip title="Настройки ВШ" placement="bottom">
                                <span>
                                    <ButtonSettings
                                        icon={false}
                                        type="primary"
                                        shape="circle"
                                        onClick={() => handleVTGeneratorToolbar(VTGeneratorToolbarType.SETTING)}
                                    >
                                        <SettingOutlined />
                                    </ButtonSettings>
                                </span>
                            </ECTooltip>}
                        <ECTooltip title="Инфо" placement="bottom">
                            <span>
                                <ButtonSettings
                                    icon={false}
                                    type="primary"
                                    shape="circle"
                                    onClick={() => showSettingsInfo()}
                                >
                                    <InfoCircleOutlined />
                                </ButtonSettings>
                            </span>
                        </ECTooltip>
                    </>}
            </div>
            <div style={preview ? { opacity: 0, visibility: 'hidden' } : { display: 'flex', alignItems: 'center' }}>
                {!isInterfaceShowcase && 
                <>
                    <div>
                        <Select 
                            style={{ width: 355 }} 
                            options={builderDataList} 
                            onChange={onBuilderDataChange}
                            value={builderData}
                        />
                    </div>
                    {isManagedZone && 
                        <ECTooltip title={`${showHeaderZone ? 'Скрыть' : 'Показать'} шапку`} placement="bottom">
                            <div>
                                <ButtonSettings
                                    disabled={loading}
                                    icon={false}
                                    type={showHeaderZone ? 'primary' : 'default'}
                                    shape="circle"
                                    style={showHeaderZone ? { backgroundColor: '' } : { backgroundColor: 'white' }}
                                    onClick={() => setShowHeaderZone(prevState => prevState ? false : true)}
                                >
                                    {loading ?  '' : (showHeaderZone ? <UpOutlined /> : <DownOutlined />)}
                                </ButtonSettings>
                            </div>
                        </ECTooltip>}
                    <ECTooltip title="Импортировать шаблон" placement="bottom">
                        <div>
                            <Upload
                                beforeUpload={(file) => {
                                    handleVTGeneratorToolbar(VTGeneratorToolbarType.IMPORT_JSON, file)
                                    
                                    return false;
                                }}
                                showUploadList={false}
                                accept=".json"
                            >
                                <ButtonSettings
                                    icon={false}
                                    type="primary"
                                    shape="circle"
                                >
                                    <DownloadOutlined />
                                </ButtonSettings>
                            </Upload>

                        </div>
                    </ECTooltip>
                    <ECTooltip title="Экспортировать шаблон" placement="bottom">
                        <div>
                            <ButtonSettings
                                icon={false}
                                type="primary"
                                shape="circle"
                                // style={{ backgroundColor: 'green' }}
                                onClick={() => handleVTGeneratorToolbar(VTGeneratorToolbarType.EXPORT_JSON)}
                            >
                                <UploadOutlined />
                            </ButtonSettings>
                        </div>
                    </ECTooltip>
                </>}
                <ECTooltip title="Сохранить" placement="bottom">
                    <div>
                        <ButtonSettings
                            loading={loading}
                            icon={false}
                            type="primary"
                            shape="circle"
                            style={{ backgroundColor: 'green' }}
                            onClick={() => handleVTGeneratorToolbar(VTGeneratorToolbarType.SAVE)}
                        >
                            {loading ?  '' : <SaveOutlined />}
                        </ButtonSettings>
                    </div>
                </ECTooltip>
                <ECTooltip title="Сохранить и выйти" placement="bottom">
                    <div>
                        <ButtonSettings
                            icon={false}
                            style={saveFlag ? { pointerEvents: 'none' } : { width: 67, backgroundColor: 'green' }}
                            type="primary"
                            shape="round"
                            disabled={saveFlag}
                            onClick={() => handleVTGeneratorToolbar(VTGeneratorToolbarType.SAVE_AND_EXIT)}
                            loading={loading}
                        >
                            
                            <span>
                                {loading ? '' : <SaveOutlined style={{ marginRight: 5 }} />}
                                <RollbackOutlined />
                            </span>
                        </ButtonSettings>
                    </div>
                </ECTooltip>

                {/* <ECTooltip
                    title={makroZone
                        ? 'Неуправляемая макро-зона' 
                        : 'Управляемая макро-зона'} 
                    placement="bottom"
                >
                    <span>
                        <ButtonSettings
                            icon={false}
                            style={{ backgroundColor: 'green' }}
                            type="primary"
                            shape="round"
                            disabled={false}
                            onClick={() => handleVTGeneratorToolbar(VTGeneratorToolbarType.MAKRO_ZONE)}
                        >
                            <AppstoreAddOutlined />
                        </ButtonSettings>
                    </span>
                </ECTooltip> */}
                {/* <Popconfirm
                    placement="bottomRight"
                    title="Отменить ВСЕ изменения ?"
                    okText="Да"
                    cancelText="Нет"
                    onConfirm={() => handleVTGeneratorToolbar(VTGeneratorToolbarType.CANCEL)}
                >
                    <ECTooltip title="Отменить" placement="bottom">
                        <span>
                            <ButtonSettings
                                icon={false}
                                type="primary"
                                shape="circle"
                           
                            >
                                <RollbackOutlined />
                            </ButtonSettings>
                          
                        </span>
                    </ECTooltip>
                </Popconfirm> */}
                {/* <Popconfirm
                    placement="bottomRight"
                    title="Полная очистка данных в шаблоне"
                    okText="Да"
                    cancelText="Нет"
                    onConfirm={() => handleVTGeneratorToolbar(VTGeneratorToolbarType.CLEAR)}
                >
                    <ECTooltip title="Очистить" placement="bottom">
                        <span>
                            <ButtonSettings
                                icon={false}
                                type="primary"
                                shape="circle"
                                style={{ backgroundColor: 'red' }}
                            >
                                <CloseCircleOutlined />
                            </ButtonSettings>
                        </span>
                    </ECTooltip>
                </Popconfirm> */}
            </div>
        </div>

    )
}

export default VTGeneralToolbar