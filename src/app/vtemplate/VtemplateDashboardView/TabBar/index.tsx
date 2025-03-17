import { Dropdown, MenuProps, Upload } from 'antd'
import { FC, memo } from 'react'

import {
    ShrinkOutlined,
    AppstoreAddOutlined
} from '@ant-design/icons';
import { ButtonSettings } from '@shared/ui/buttons';
import { ECTooltip } from '@shared/ui/tooltips';

type TabBarType = {
    addCard: () => void
    exportRGL: () => void
    importRGL: (file: Blob) => void
    exportRGLWidgetsZip: () => void
    onChangeFileWidgetImport: (file: Blob) => void
}



const TabBar: FC<TabBarType> = (props) => {

    const { addCard, exportRGL, importRGL, exportRGLWidgetsZip, onChangeFileWidgetImport } = props

    const items: MenuProps['items'] = [
        {
            key: '1',
            type: 'group',
            label: 'Панель',
            children: [
                {
                    key: '1-1',
                    label: (
                        <Upload
                            beforeUpload={(file) => {
                                importRGL(file)
                                // handleVTGeneratorToolbar(VTGeneratorToolbarType.IMPORT_JSON, file)
                                        
                                return false;
                            }}
                            showUploadList={false}
                            accept=".json"
                        >
                            Импорт всей панели
                        </Upload>
                    ),
                },
                {
                    key: '1-2',
                    label: (
                        <div onClick={exportRGL}>Экспорт всей панели</div>
                    ),
                },
            ],
        },
        {
            key: '2',
            type: 'group',
            label: 'Виджеты',
            children: [
                {
                    key: '2-1',
                    label: (
                        <Upload
                            accept=".json"
                            multiple={true}
                            beforeUpload={async (file) => {
                                onChangeFileWidgetImport(file)

                                return false;
                            }}
                            showUploadList={false}
                        >
                           Импорт виджетов зонами
                        </Upload>
                    ),
                },
                {
                    key: '2-2',
                    label: (
                        <div onClick={exportRGLWidgetsZip}>Экспорт всех виджетов зонами</div>
                    ),
                },
                {
                    key: '2-3',
                    label: (
                        <div>Экспорт всех виджетов без зон </div>
                    ),
                    disabled: true
                },
            ]
        }
        
    ]

    return (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginBottom: 10 }}>
            <div>
                <ECTooltip title="Импорт - Экспорт">
                    
                    <Dropdown menu={{ items }} placement="bottom">
                        <ButtonSettings
                            shape="circle"
                            size="small"
                            icon={false}
                        >
                            <ShrinkOutlined />
                        </ButtonSettings>
                    </Dropdown>
                </ECTooltip>
            </div>
            <div>
                <ECTooltip title="Добавить зону">
                    <ButtonSettings
                        shape="circle"
                        size="small"
                        onClick={addCard}
                        icon={false}
                    >
                        <AppstoreAddOutlined />
                    </ButtonSettings>
                </ECTooltip>
            </div>
            {/* <div>
                <ECTooltip title="Отмена">
                    <Button
                        shape="circle"
                        size="small"
                    >
                        <ArrowLeftOutlined />
                    </Button>
                </ECTooltip>
            </div> */}
        </div>
    )
}

export default memo(TabBar)