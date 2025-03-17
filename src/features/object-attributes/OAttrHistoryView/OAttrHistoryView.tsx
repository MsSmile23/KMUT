import AttributeHistoryChartContainer from '@containers/objects/AttributeHistoryChartContainer'
import { OAttrHistoryText } from '@entities/object-attributes/OAttrHistoryText/OAttrHistoryText'
import OAHistoryMap from '@entities/objects/OAHistoryMap/OAHistoryMap'
import ObjectAttributeHistoryWrapper from '@entities/objects/ObjectAttributeHistoryWrapper/ObjectAttributeHistoryWrapper'
import ObjectAttributeValueTable from '@entities/objects/ObjectAttributeValueTable/ObjectAttributeValueTable'
import OAButtonFullTable from '@features/objects/OAButtonFullTable/OAButtonFullTable'
import { useEffect, useState, FC } from 'react'
import { buttonsData } from '@entities/objects/ObjectAttributeHistoryWrapper/data'
import { getPriorityState, getStateViewParamsFromState, getStateViewParamsWithDefault } from '@shared/utils/states'
import { OAttrWithHistoryModal } from '@features/object-attributes/OAttrWithHistoryModal/OAttrWithHistoryModal'
import { IObjectOAttrsWithHistoryProps } from '@containers/attributes/ObjectOAttrsWithHistory/ObjectOAttrsWithHistory'
import { useTheme } from '@shared/hooks/useTheme'
import { useAccountStore, selectAccount } from '@shared/stores/accounts'
import { generalStore } from '@shared/stores/general'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'

type TOAttrHistoryView = {
    currentAttrData: any
    index: number
    delay?: number
    limit?: number
    autoUpdate?: IObjectOAttrsWithHistoryProps['autoUpdate']
    vtemplateType?: IObjectOAttrsWithHistoryProps['vtemplateType']
}

export const OAttrHistoryView: FC<TOAttrHistoryView> = ({
    currentAttrData,
    index,
    delay,
    limit,
    autoUpdate,
    vtemplateType,
}) => {
    const [readyToRender, setReadyToRender] = useState(false)
    const [modalShow, setShowModal] = useState<boolean>(false)

    const interfaceView = generalStore((st) => st.interfaceView)
    const isShowcase = interfaceView === 'showcase'
    const theme = useTheme()
    const accountData = useAccountStore(selectAccount)
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode
    const textColor = isShowcase ? createColorForTheme(theme?.widget?.textColor, theme?.colors, themeMode) : 'black'
    const backgroundColor = isShowcase
        ? createColorForTheme(theme?.widget?.background, theme?.colors, themeMode)
        : 'white'

    let priorViewParams

    if (currentAttrData.type === 'table') {
        const priorState = getPriorityState('object_attributes', currentAttrData.currentObject.object_attributes)

        priorViewParams = getStateViewParamsWithDefault(priorState)
    }

    const buttonFullSize = () => {
        const buttons = buttonsData.filter((button) => ['full_screen'].includes(button.mnemo))

        buttons[0].onClick = () => {
            setShowModal((v) => !v)
        }

        return buttons
    }

    useEffect(() => {
        if (delay) {
            const timeoutId = setTimeout(() => setReadyToRender((prev) => !prev), delay)

            return () => clearTimeout(timeoutId)
        }
    }, [])

    if (readyToRender) {
        return (
            <>
                {currentAttrData?.type === 'chart' && (
                    <div className="smooth-appearance">
                        <AttributeHistoryChartContainer
                            color={textColor}
                            background={backgroundColor}
                            key={
                                'oaHistory_chart' +
                                currentAttrData.ids.reduce((acc, it) => {
                                    return acc + it.id + '.'
                                }, index)
                            }
                            ids={currentAttrData.ids}
                            category={
                                currentAttrData.category ??
                                `${currentAttrData.ids?.[0].oa.attribute.name} 
                            ${currentAttrData.showAttrValue}`
                            }
                            limit={limit}
                            autoUpdate={autoUpdate}
                            vtemplateType={vtemplateType}
                        />
                    </div>
                )}
                {currentAttrData?.type === 'traceroute' && (
                    <div className="smooth-appearance">
                        <ObjectAttributeHistoryWrapper
                            key={`oaHistory_table_${currentAttrData.ids[0].oa?.id}`}
                            objectAttribute={currentAttrData.ids[0]?.oa}
                            toolbarButtons={[]}
                            buttons={buttonFullSize()}
                            title={
                                currentAttrData.category ??
                                `${currentAttrData.ids?.[0].oa.attribute.name} 
                            ${currentAttrData.showAttrValue}`
                            }
                        >
                            <OAttrHistoryText height={400} objectAttribute={currentAttrData?.ids[0]} limit={limit} />
                        </ObjectAttributeHistoryWrapper>
                        <OAttrWithHistoryModal
                            children={<OAttrHistoryText height={400} objectAttribute={currentAttrData?.ids[0]} />}
                            showModal={modalShow}
                            setShowModal={() => setShowModal((v) => !v)}
                        />
                    </div>
                )}
                {currentAttrData?.type === 'connection_map' && (
                    <div className="smooth-appearance">
                        <ObjectAttributeHistoryWrapper
                            key={`oaHistory_table_${currentAttrData.ids[0].oa?.id}`}
                            objectAttribute={currentAttrData.ids[0]?.oa}
                            toolbarButtons={[]}
                            buttons={buttonFullSize()}
                            title={
                                currentAttrData.category ??
                                `${currentAttrData.ids?.[0].oa.attribute.name} 
                            ${currentAttrData.showAttrValue}`
                            }
                        >
                            <OAHistoryMap height={400} objectAttribute={currentAttrData?.ids[0]} limit={limit} />
                            <OAttrWithHistoryModal
                                children={
                                    <OAHistoryMap
                                        height={400}
                                        objectAttribute={currentAttrData?.ids[0]}
                                        limit={limit}
                                    />
                                }
                                showModal={modalShow}
                                setShowModal={() => setShowModal((v) => !v)}
                            />
                        </ObjectAttributeHistoryWrapper>
                    </div>
                )}
                {currentAttrData?.type === 'table' &&
                    currentAttrData.ids.map((item, index) => {
                        return (
                            <div className="smooth-appearance" key={index}>
                                <ObjectAttributeHistoryWrapper
                                    key={`oaHistory_table_${item.oa?.id}`}
                                    buttons={buttonsData.filter((button) =>
                                        ['info', 'pause_resume'].includes(button.mnemo)
                                    )}
                                    objectAttribute={item.oa}
                                    toolbarButtons={[<OAButtonFullTable key="full_table" />]}
                                    stateParams={{
                                        color: priorViewParams.fill,
                                        borderColor: priorViewParams.border,
                                        textColor: priorViewParams.textColor,
                                    }}
                                    title={
                                        currentAttrData.category ??
                                        `${currentAttrData.ids?.[0].oa.attribute.name} 
                                ${currentAttrData.showAttrValue}`
                                    }
                                >
                                    <ObjectAttributeValueTable objectAttribute={item.oa} height={400} limit={limit} />
                                </ObjectAttributeHistoryWrapper>
                            </div>
                        )
                    })}
            </>
        )
    }

    return null
}