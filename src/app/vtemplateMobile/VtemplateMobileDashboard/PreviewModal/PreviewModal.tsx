import { FC, useState } from 'react'
import { ArrowsAltOutlined, ShrinkOutlined } from '@ant-design/icons'
import { Widget } from '@containers/widgets'
import { WrapperWidget } from '@containers/widgets/WrapperWidget'
import { ECTooltip } from '@shared/ui/tooltips'
import { Responsive as ResponsiveGridLayout } from 'react-grid-layout';
import { useVtemplateStore } from '@shared/stores/vtemplate'
import { WIDGET_TYPES } from '@containers/widgets/widget-const'

interface PreviewModalProps {
    layoutSize: { width: number, height: number }
}

const PreviewModal: FC<PreviewModalProps> = (props) => {
    const { layoutSize } = props
    const { zone } = useVtemplateStore()
    const [height, setHeight] = useState<{ block_1: string | number, block_2: string | number }>({
        block_1: '100%',
        block_2: 50
    });
    const onToggleHeight = (num: string) => {
        if (num === '2') {
            setHeight((prev) => {
                if (prev.block_2 === 50) {
                    return {
                        block_1: '50%',
                        block_2: '50%'
                    }
                }
                else {
                    return {
                        block_1: '100%',
                        block_2: 50
                    }
                }
            })
        }
    };

    const fullScreenPreview = (e) => {
        e.stopPropagation()
        setHeight((prev) => {
            if (prev.block_2 === 50 || prev.block_2 === '50%') {
                return {
                    block_1: 50,
                    block_2: '100%'
                }
            }

            if (prev.block_2 === '100%') {
                return {
                    block_1: '50%',
                    block_2: '50%'
                }
            }
        })
    }

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: height.block_2,
                transition: 'height 0.3s ease-in-out',
            }}
        >
            <div
                onClick={() => height.block_2 === '100%' ? {} : onToggleHeight('2')}
                style={{
                    backgroundColor: '#f0f0f0',
                    cursor: 'pointer',
                    height: 50,
                    borderBottomRightRadius: typeof height.block_2 === 'number' ? 10 : 0,
                    borderBottomLeftRadius: typeof height.block_2 === 'number' ? 10 : 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    paddingLeft: 10,
                    flexShrink: 0,
                    overflow: 'hidden',
                    zIndex: 999
                }}
            >
                <div style={{ display: 'flex', flexDirection: 'row', gap: 20 }}>
                    <div>Превью</div>
                    <div
                        onClick={(e) => fullScreenPreview(e)}
                        style={{ cursor: 'pointer' }}
                    >
                        <ECTooltip
                            placement="top"
                            title={height.block_2 === '100%' ? 'Свернуть' : 'Развернуть'}
                        >
                            {height.block_2 === '100%'
                                ? (<ShrinkOutlined />)
                                : (<ArrowsAltOutlined />)}
                        </ECTooltip>
                    </div>
                </div>
            </div>
            <div
                style={{
                    height: '100%',
                    display: 'flex',
                    flex: 1,
                    overflowY: 'auto',
                    paddingLeft: 10,
                    paddingRight: 10,
                    paddingTop: typeof height.block_2 === 'number' ? 0 : 10,
                    border: typeof height.block_2 === 'number' ?  'none' : '1px solid #f0f0f0',
                    borderRadius: '0px 0px 5px 5px',
                    borderTop: 'none'
                }}
            >
                <ResponsiveGridLayout
                    className="layout"
                    style={{
                        background: 'rgb(245, 245, 245)',
                        borderRadius: 10,
                        overflow: 'hidden',
                        minHeight: 300,
                        flex: 1
                    }}
                    breakpoints={{ lg: 1200, md: 966, sm: 768, xs: 480, xxs: 0 }}
                    cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                    rowHeight={100}
                    autoSize={true}
                    width={layoutSize?.width}
                    isDraggable={false}
                    isResizable={false}
                >
                    <div
                        key="1"
                        data-grid={{
                            w: zone?.layout?.w,
                            h: zone?.layout?.h,
                            x: 0,
                            y: 0
                        }}
                        style={{
                            border: '1px solid grey',
                            borderRadius: 5,
                            display: 'flex',
                            height: '100%',
                            width: '100%',
                            boxSizing: 'border-box',
                            overflowY: 'auto'
                        }}
                    >
                        <WrapperWidget
                            settings={zone?.wrapper}
                        >
                            <Widget
                                settings={zone?.settings}
                                widgetMnemo={zone?.widgetMnemo}
                                widgetType={WIDGET_TYPES.WIDGET_TYPE_PREVIEW}
                            />
                        </WrapperWidget>
                    </div>
                </ResponsiveGridLayout>
            </div>
        </div>
    )
}

export default PreviewModal