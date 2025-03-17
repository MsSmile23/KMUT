import { DownloadOutlined, EditOutlined, EyeOutlined, RollbackOutlined, SaveOutlined, SettingOutlined, UploadOutlined } from '@ant-design/icons'
import { resolutionOptions } from '@app/vtemplateMobile/data'
import { dataVtemplateProps, paramsVtemplate, VTGeneratorToolbarType } from '@shared/types/vtemplates'
import { ButtonSettings } from '@shared/ui/buttons'
import { Select } from '@shared/ui/forms'
import { ECTooltip } from '@shared/ui/tooltips'
import { Upload, UploadProps } from 'antd'
import { CSSProperties, FC, ReactNode } from 'react'

interface IToolbarProps {
    loading: boolean,
    saveFlag: boolean,
    handleVTGeneratorToolbar: (type: VTGeneratorToolbarType, file?: any) => void,
    editable: boolean,
    vtemplate: dataVtemplateProps<paramsVtemplate>,
    changeResolution: (value: string) => void
}

const Toolbar: FC<IToolbarProps> = (props) => {
    const { loading, saveFlag, handleVTGeneratorToolbar, vtemplate, editable = true, changeResolution } = props

    const ToolbarButton = ({ title, icon, onClick, loading, disabled = !vtemplate?.params.makroZone, style, uploadProps 
    }: { title: string,  icon: ReactNode, onClick?: () => void, loading?: boolean, disabled?: boolean, 
        style?: CSSProperties,  uploadProps?: UploadProps
    }) => {
        const buttonElement = (
            <ButtonSettings
                icon={false}
                type="primary"
                shape="circle"
                onClick={onClick}
                loading={loading}
                disabled={disabled}
                style={style}
            >
                {icon}
            </ButtonSettings>
        )

        return (
            <ECTooltip title={title} placement="bottom">
                {uploadProps ? (
                    <Upload {...uploadProps}>{buttonElement}</Upload>
                ) : (
                    buttonElement
                )}
            </ECTooltip>
        )
    }

    return (
        <div className="VtemplateSCForm__group-button">
            {!editable ? (
                <div style={{ display: 'flex', gap: 10 }}>
                    <ToolbarButton 
                        title="Редактирование"
                        icon={<EditOutlined />}
                        onClick={() => handleVTGeneratorToolbar(VTGeneratorToolbarType.EDIT)}
                    />
                    <Select 
                        options={resolutionOptions} 
                        onChange={changeResolution} 
                        defaultValue={JSON.stringify({ width: 360, height: 640 })}
                    />
                </div>
            ) : (
                <>
                    <div>
                        <ToolbarButton 
                            title="Просмотр"
                            icon={<EyeOutlined />}
                            onClick={() => handleVTGeneratorToolbar(VTGeneratorToolbarType.SHOW)}
                        />
                        <ToolbarButton 
                            title="Настройки ВШ"
                            icon={<SettingOutlined />}
                            disabled={false}
                            onClick={() => handleVTGeneratorToolbar(VTGeneratorToolbarType.SETTING)}
                        />
                    </div>
                    <div>
                        <ToolbarButton
                            title="Импортировать шаблон"
                            icon={<DownloadOutlined />}
                            uploadProps={{
                                beforeUpload: (file) => {
                                    handleVTGeneratorToolbar(VTGeneratorToolbarType.IMPORT_JSON, file)

                                    return false
                                },
                                showUploadList: false,
                                accept: '.json'
                            }}
                        />
                        <ToolbarButton
                            title="Экспортировать шаблон"
                            icon={<UploadOutlined />}
                            onClick={() => handleVTGeneratorToolbar(VTGeneratorToolbarType.EXPORT_JSON)}
                        />
                        <ToolbarButton
                            title="Сохранить"
                            icon={loading ?  '' : <SaveOutlined />}
                            onClick={() => handleVTGeneratorToolbar(VTGeneratorToolbarType.SAVE)}
                            loading={loading}
                            disabled={saveFlag}
                            style={saveFlag ? { pointerEvents: 'none' } : { backgroundColor: 'green' }}
                        />
                        <ECTooltip title="Сохранить и выйти" placement="bottom">
                            <ButtonSettings
                                icon={false}
                                style={saveFlag ? { pointerEvents: 'none' } : { width: 67, backgroundColor: 'green' }}
                                type="primary"
                                shape="round"
                                disabled={saveFlag}
                                onClick={() => handleVTGeneratorToolbar(VTGeneratorToolbarType.SAVE_AND_EXIT)}
                                loading={loading}
                            >
                                {loading 
                                    ? '' 
                                    : (<><SaveOutlined style={{ marginRight: 5 }} /><RollbackOutlined /></>)}
                            </ButtonSettings>
                        </ECTooltip>
                    </div>
                </>)}
        </div>
    )
}

export default Toolbar