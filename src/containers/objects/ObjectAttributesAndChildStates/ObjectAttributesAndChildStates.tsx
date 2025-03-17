/* eslint-disable max-len */
import { IObject } from '@shared/types/objects'
import { Col, Row } from 'antd'
import { FC } from 'react'
import { IObjectAttributesWidget } from '../ObjectAttributesWidget/ObjectAttributesWidget'
import { Typography } from 'antd'
import { IStatusProps, ObjectLinkedShares } from '@entities/statuses/ObjectLinkedShares/ObjectLinkedShares'
import ObjectsStatusLabels, {
    IObjectsStatusLabelsProps,
} from '@entities/objects/ObjectsStatusLabels/ObjectsStatusLabels'
import ObjectOAttrs from '@entities/objects/ObjectOAttrs/ObjectOAttrs'
import { useNavigate } from 'react-router-dom'
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { ButtonShowObject } from '@shared/ui/buttons/ButtonShowObject/ButtonShowObject'
import { getURL } from '@shared/utils/nav'
import { useTheme } from '@shared/hooks/useTheme'
import { selectAccount, useAccountStore } from '@shared/stores/accounts'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'
import { generalStore } from '@shared/stores/general'

const { Title, Text } = Typography

export type TSections = 'objectLinkedShares' | 'objectOAttrs' | 'objectOAttrState'

export interface IObjectAttributesAndChildStates {
    object: IObject
    mainObject?: boolean
    sectionsToShow?: TSections[]
    sections?: {
        objectAttributesWidgetProps?: {
            // title?: string
            oaAtrrWidgetProps?: IObjectAttributesWidget
        }
        objectStatusLabelsProps?: {
            title?: string
            statusLabelsProps?: IObjectsStatusLabelsProps
        }
        statusChartProps?: {
            title?: string
            chartProps?: IStatusProps
        }
    }
    titleStyle?: React.CSSProperties
    onClickTransition?: boolean
    titleStateDevice?: string
    labelsCount?: number
    labelsContainerHeight?: number
    maxWidth?: boolean
}
const ObjectAttributesAndChildStates: FC<IObjectAttributesAndChildStates> = ({
    object,
    sections,
    sectionsToShow,
    mainObject = false,
    titleStyle,
    onClickTransition,
    titleStateDevice,
    labelsCount,
    labelsContainerHeight,
    maxWidth = true,
}) => {
    const navigate = useNavigate()
    const theme = useTheme()
    const accountData = useAccountStore(selectAccount)
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode

    const interfaceView = generalStore((st) => st.interfaceView)
    const isShowcase = interfaceView === 'showcase'

    const textColor = isShowcase
        ? createColorForTheme(theme?.widget?.textColor, theme?.colors, themeMode) || 'black'
        : '#000000'
    const backgroundColor = isShowcase
        ? createColorForTheme(theme?.widget?.background, theme?.colors, themeMode) || 'white'
        : '#ffffff'

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                height: '100%',
                backgroundColor: backgroundColor || 'white',
            }}
        >
            {/* Если есть секция атрибутов, то скрыть название ( в атрибутах оно есть) */}
            {((!mainObject && sections.objectAttributesWidgetProps == undefined) ||
                (sectionsToShow && !sectionsToShow.includes('objectOAttrs'))) && (
                <ButtonShowObject id={object.id} type="text" disableNavigate={!onClickTransition}>
                    <Text strong style={{ color: textColor || 'black' }}>
                        {object?.name}
                    </Text>
                </ButtonShowObject>
            )}
            <Row style={{ marginTop: '5px', overflow: 'auto' }}>
                {sectionsToShow && sectionsToShow.length > 0 ? (
                    sectionsToShow.map((section, idx) => {
                        const labels = {
                            objectLinkedShares: titleStateDevice ?? sections?.statusChartProps?.title,
                            objectOAttrs: object?.name,
                            objectOAttrState: 'Услуги',
                        }
                        const renderComponent = () => {
                            switch (section) {
                                case 'objectLinkedShares': {
                                    return (
                                        <ObjectLinkedShares
                                            {...sections?.statusChartProps?.chartProps}
                                            parentObject={!mainObject ? object : undefined}
                                            // isWidget
                                        />
                                    )
                                }
                                case 'objectOAttrs': {
                                    return (
                                        <ObjectOAttrs
                                            {...sections?.objectAttributesWidgetProps?.oaAtrrWidgetProps}
                                            objectId={object?.id}
                                            // displayType="strings"
                                            // attributesIds={sections?.objectAttributesWidgetProps?.oaAtrrWidgetProps?.attributesIds}
                                            // height={sections?.objectAttributesWidgetProps?.oaAtrrWidgetProps?.height}
                                        />
                                    )
                                }
                                case 'objectOAttrState': {
                                    return (
                                        <div style={{ padding: '10px ' }}>
                                            <ObjectsStatusLabels
                                                object_id={object?.id}
                                                classes_id={sections?.objectStatusLabelsProps?.statusLabelsProps?.classes_id}
                                                {...sections?.objectStatusLabelsProps?.statusLabelsProps}
                                                // childClsIds={[]}
                                                // displayType="tags"
                                                // maxWidth={maxWidth}
                                                // labelsCount={labelsCount}
                                                // labelsContainerHeight={labelsContainerHeight}
                                            />
                                        </div>
                                    )
                                }
                            }
                        }

                        return (
                            <Col
                                key={section}
                                span={24 / sectionsToShow?.length}
                                style={{
                                    borderRight:
                                        idx === sectionsToShow.length - 1
                                            ? 'none'
                                            : `1px dashed ${textColor || 'black'}`,
                                    cursor: onClickTransition ? 'pointer' : 'auto',
                                }}
                                onClick={
                                    onClickTransition
                                        ? () => {
                                            navigate(
                                                getURL(
                                                    `${ROUTES.OBJECTS}/${ROUTES_COMMON.SHOW}/${object.id}`,
                                                    'showcase'
                                                )
                                            )
                                            // navigate(`/${ROUTES.OBJECTS}/${ROUTES_COMMON.SHOW}/${object.id}`)
                                        }
                                        : null
                                }
                            >
                                <Title
                                    style={{
                                        marginTop: '0px',
                                        textAlign: 'center',
                                        color: textColor || 'black',
                                        fontSize: 14,
                                    }}
                                    // level={5}
                                >
                                    {labels[section]}
                                    {/* {sections?.statusChartProps?.title ?? 'Оборудование'} */}
                                </Title>
                                {renderComponent()}
                            </Col>
                        )
                    })
                ) : (
                    <>
                        {sections.objectAttributesWidgetProps == undefined && (
                            <Col
                                span={sections.objectAttributesWidgetProps ? 8 : 12}
                                style={{
                                    borderRight: `1px dashed ${textColor || 'black'}`,
                                    cursor: onClickTransition ? 'pointer' : 'auto',
                                }}
                                onClick={
                                    onClickTransition
                                        ? () => {
                                            navigate(
                                                getURL(
                                                    `${ROUTES.OBJECTS}/${ROUTES_COMMON.SHOW}/${object.id}`,
                                                    'showcase'
                                                )
                                            )
                                            // navigate(`/${ROUTES.OBJECTS}/${ROUTES_COMMON.SHOW}/${object.id}`)
                                        }
                                        : null
                                }
                            >
                                <Title
                                    style={{
                                        marginTop: '0px',
                                        textAlign: 'center',
                                        color: textColor || 'black',
                                        fontSize: 14,
                                    }}
                                    // level={5}
                                >
                                    {sections?.statusChartProps?.title ?? 'Оборудование'}
                                </Title>
                                <ObjectLinkedShares
                                    {...sections?.statusChartProps?.chartProps}
                                    parentObject={!mainObject ? object : undefined}
                                />
                            </Col>
                        )}
                        {/* <Row style={{ paddingTop: '5px', overflow: 'auto' }}> */}
                        {sections.objectAttributesWidgetProps && (
                            <Col span={10} style={{ borderRight: `1px dashed ${textColor || 'black'}` }}>
                                <Title
                                    // level={5}
                                    style={{
                                        marginTop: '0px',
                                        textAlign: 'center',
                                        color: textColor || 'black',
                                        fontSize: 14,
                                    }}
                                >
                                    {object?.name}
                                </Title>
                                <ObjectOAttrs
                                    objectId={object?.id}
                                    displayType="strings"
                                    attributesIds={sections?.objectAttributesWidgetProps?.oaAtrrWidgetProps?.attributesIds}
                                />
                            </Col>
                        )}
                        <Col
                            span={sections.objectAttributesWidgetProps ? 6 : 12}
                            style={{ padding: '0 10px', textAlign: 'center', height: 241 }}
                        >
                            <Title
                                // level={5}
                                style={{
                                    marginTop: '0px',
                                    textAlign: 'center',
                                    color: textColor || 'black',
                                    fontSize: 14,
                                }}
                            >
                                {sections?.objectStatusLabelsProps?.title ?? 'Услуги'}
                            </Title>
                            <ObjectsStatusLabels
                                object_id={object?.id}
                                classes_id={sections?.objectStatusLabelsProps?.statusLabelsProps?.classes_id}
                                childClsIds={[]}
                                displayType="tags"
                                maxWidth={maxWidth}
                                labelsCount={labelsCount}
                                labelsContainerHeight={labelsContainerHeight}
                            />
                        </Col>
                        {sections.objectAttributesWidgetProps && (
                            <Col
                                span={sections.objectAttributesWidgetProps ? 8 : 12}
                                style={{ borderLeft: `1px dashed ${textColor || 'black'}` }}
                            >
                                <Title
                                    style={{
                                        marginTop: '0px',
                                        textAlign: 'center',
                                        color: textColor || 'black',
                                        fontSize: 14,
                                    }}
                                    // level={5}
                                >
                                    {sections?.statusChartProps?.title ?? 'Оборудование'}
                                </Title>

                                <ObjectLinkedShares
                                    {...sections?.statusChartProps?.chartProps}
                                    parentObject={!mainObject ? object : undefined}
                                />
                            </Col>
                        )}
                    </>
                )}
            </Row>
        </div>
    )
}

export default ObjectAttributesAndChildStates