import { FC } from 'react'
import { TWidgetFormSettings } from '../widget-types'
import { IStatusProps } from '@entities/statuses/ObjectLinkedShares/ObjectLinkedShares'
import { ITargetLinkingClassesForm } from '@containers/classes/TargetLinkingClassesForm/TargetLinkingClassesForm'
import { ObjectLinkedSharesForm } from './ObjectLinkedSharesForm'
import { IStateEntities } from '@shared/types/state-entities'
import { TViewProps, TRepresentationType } from '@containers/widgets/WidgetObjectLinkedShares/representationTypes'
import { clearOldViewProps, generateNewViewProps } from './utils'

export interface IWidgetObjectLinkedSharesFormProps<T = 'pieChart'> {
    ids?: ITargetLinkingClassesForm
    classes?: ITargetLinkingClassesForm[]
    parentClass?: number
    parentObjectId?: number | null
    objectId: number
    objectAttributeIds?: number[]
    groupingClass: number
    countInRow?: number
    entityType?: keyof IStateEntities
    groupingType?: IStatusProps['groupingType']
    dividingCriteria: IStatusProps['dividingCriteria']
    representationType: TRepresentationType
    viewProps: TViewProps<T>
    dividingCriteriaProps?: {
        attribute_id: number
    }
    showFilters?: boolean
    linkedObjectsClasses?: number
    linkedObjects?: number[]
}

const WidgetObjectLinkedSharesForm: FC<TWidgetFormSettings<
    IWidgetObjectLinkedSharesFormProps
>> = (props) => {
    const { settings, onChangeForm } = props

    const newWidget: IWidgetObjectLinkedSharesFormProps = clearOldViewProps(settings.widget)
    const newViewProps = { viewProps: generateNewViewProps(settings.widget) || settings.widget.viewProps }
    
    // eslint-disable-next-line max-len
    const newSettings = { widget: { ...newWidget, ...newViewProps }, vtemplate: settings.vtemplate, view: settings.view }


    const getFormState = (currentForm: IWidgetObjectLinkedSharesFormProps) => {
        onChangeForm<IWidgetObjectLinkedSharesFormProps>(currentForm)
    }

    return (
        <ObjectLinkedSharesForm 
            settings={newSettings}
            getFormState={getFormState}
        />
    )
}

export default WidgetObjectLinkedSharesForm