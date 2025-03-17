// import { StateLabel } from '@entities/states/StateLabels'
import { IObjectsStatusLabelsProps } from '@entities/objects/ObjectsStatusLabels/ObjectsStatusLabels'
import { IStateLAbelProps } from '@entities/states/StateLabels/StateLabel'
import { IStatusProps } from '@entities/statuses/ObjectLinkedShares/ObjectLinkedShares'
import { IClass } from '@shared/types/classes'
import { IObject } from '@shared/types/objects'
import { getStateFromEntity } from '@shared/utils/states'
import { Spin } from 'antd'
import { lazy, FC, PropsWithChildren, Suspense } from 'react'

/**
 *
 * 
 * @param height - Высота задается для вывода вертикально со скорллом
 */
const StateLabel = lazy(() => import('@entities/states/StateLabels/StateLabel')
    .then(module => ({ default: module.StateLabel })))

const ObjectsStatusLabels = lazy(() => import('@entities/objects/ObjectsStatusLabels/ObjectsStatusLabels'))
const ObjectLinkedShares = lazy(() => import('@entities/statuses/ObjectLinkedShares/ObjectLinkedShares')
    .then(module => ({ default: module.ObjectLinkedShares })))

export interface IObjectOAttrStateProps {
    object: IObject
    representationType: 'label' | 'historyBar' | 'pieChart' | 'lineChart' | 'horizontalTags' | 'verticalTags'
    labelProps?: IStateLAbelProps
    oslProps?: IObjectsStatusLabelsProps
    statusChartProps?: IStatusProps
    height?: number
    maxWidth?: boolean
    customStyles?: any
    labelsContainerHeight?: number
    labelsCount?: number
    horizontalAligning?: 'left' | 'center' | 'right',
    verticalAlining?: 'left' | 'center' | 'right',
    chosenObjectsIds?: number[],
    chosenObjectsPrefix?: {id: number, prefix: string}[]
    labelWidth?: number
    targetClasses?: number[]
    linkedClasses?: number[]
    linksDirection?: 'parents' | 'childs'
    labelValue?: string | number
    labelMargin?: number 
    serviceClasses?: number []
    showParentStatus?: boolean

}

export const ObjectOAttrState: FC<PropsWithChildren<IObjectOAttrStateProps>> = ({
    object,
    representationType,
    labelProps,
    oslProps,
    statusChartProps,
    children,
    height,
    maxWidth,
    customStyles,
    labelsContainerHeight,
    labelsCount,
    horizontalAligning,
    verticalAlining,
    chosenObjectsIds,
    chosenObjectsPrefix,
    labelWidth,
    labelValue,
    showParentStatus
}) => {
    const objectState = getStateFromEntity(object?.id, 'objects')

    const currentLabelProps: IStateLAbelProps = {
        ...labelProps,
        state: objectState,
    }

    const currentOSLProps: IObjectsStatusLabelsProps = {
        ...oslProps,
        object_id: object?.id,
        //classes_id: forumThemeConfig.build.deviceStatuses.stateLabels.classes_id,
        //childClsIds: [],
    }

    const renderType = () => {
        switch (representationType) {
            case 'label': {
                return (
                    <StateLabel {...currentLabelProps}>
                        {children}
                    </StateLabel>
                )
            }
            case 'historyBar': {
                return <> </>
            }
            case 'pieChart': {
                return (
                    <ObjectLinkedShares
                        {...statusChartProps}
                        parentObject={object}
                    />)
            }
            case 'horizontalTags': {

                return (
                    <ObjectsStatusLabels 
                        {...currentOSLProps} 
                        displayType="rows"
                        maxWidth={maxWidth}
                        customStyles={customStyles}
                        labelsContainerHeight={labelsContainerHeight}
                        labelsCount={labelsCount}
                        horizontalAligning={horizontalAligning}
                        chosenObjectsIds={chosenObjectsIds}
                        chosenObjectsPrefix={chosenObjectsPrefix}
                        labelWidth={labelWidth}
                        labelValue={labelValue}
                        showParentStatus={showParentStatus}
                                        
                    />
                )
            }
            case 'verticalTags': {
                return (
                    <ObjectsStatusLabels 
                        {...currentOSLProps}
                        displayType="tags"
                        height={height}
                        maxWidth={maxWidth}
                        customStyles={customStyles}
                        labelsContainerHeight={labelsContainerHeight}
                        labelsCount={labelsCount}
                        verticalAlining={verticalAlining}
                        chosenObjectsIds={chosenObjectsIds}
                        chosenObjectsPrefix={chosenObjectsPrefix}
                        labelWidth={labelWidth}
                        labelValue={labelValue}
                        showParentStatus={showParentStatus}
                    />
                )
            }
            case 'lineChart': {
                return <> </>
            }
        }
    }

    return (
        <Suspense fallback={<Spin size="small" />} >
            {renderType()}
        </Suspense>
    )
} 