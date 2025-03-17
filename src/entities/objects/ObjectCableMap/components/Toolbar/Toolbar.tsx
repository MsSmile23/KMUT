import { SaveOutlined } from '@ant-design/icons'
import { ButtonSettings } from '@shared/ui/buttons'
import { Input, Switch } from '@shared/ui/forms'
import { ECTooltip } from '@shared/ui/tooltips'
import { ColorPicker, Space } from 'antd'
import { SettingsMnemo } from '../../ObjectCableMap'
import { FC } from 'react'

interface Toolbar {
    handleChangeSettings: <T extends string | number | boolean>(value: T, key: SettingsMnemo) => void
    loading: boolean
    saveMap: () => void
    lineColor: string
    textColor: string
    textSize: number
    switchStatus: boolean
}

const Toolbar: FC<Toolbar> = (props) => {

    const { handleChangeSettings, loading, saveMap, lineColor, textColor, switchStatus, textSize } = props

    return (
        <Space direction="horizontal" align="center" style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex' }}>
                <ECTooltip title="Сохранить" placement="bottom" >
                    <div>
                        <ButtonSettings
                            icon={false}
                            type="primary"
                            shape="circle"
                            style={{ backgroundColor: 'green' }}
                            loading={loading}
                            onClick={saveMap}
                        >
                            <SaveOutlined />
                        </ButtonSettings>
                    </div>
                </ECTooltip>
            </div>
            <div>
                <ECTooltip title="Цвет линий" placement="bottom" >
                    <ColorPicker
                        value={lineColor || '#000'}
                        disabled={switchStatus}
                        onChange={(color) =>
                            handleChangeSettings<string>(color.toHexString(), SettingsMnemo.LINE_COLOR)}
                    />
                </ECTooltip>
            </div>
            <div>
                <ECTooltip title="Цвет текста" placement="bottom" >
                    <ColorPicker
                        value={textColor || '#000'}
                        disabled={switchStatus}
                        onChange={(color) =>
                            handleChangeSettings<string>(color.toHexString(), SettingsMnemo.TEXT_COLOR)}
                    />
                </ECTooltip>
            </div>
            <div>
                <ECTooltip title="Размер текста" placement="bottom" >
                    <Input
                        type="number"
                        size="middle" style={{ width: 60 }}
                        value={textSize}
                        onChange={(e) =>
                            handleChangeSettings<number>(
                                Number(e.target.value),
                                SettingsMnemo.TEXT_SIZE
                            )}
                    />
                </ECTooltip>
            </div>
            <div>
                <ECTooltip
                    title={switchStatus ? 'Выключить статусы' : 'Включить статусы'}
                    placement="bottom"
                >
                    <Switch
                        checked={switchStatus}
                        onChange={(check) =>
                            handleChangeSettings<boolean>(check, SettingsMnemo.ON_STATUS)}
                    />
                </ECTooltip>
            </div>
        </Space>
    )
}

export default Toolbar