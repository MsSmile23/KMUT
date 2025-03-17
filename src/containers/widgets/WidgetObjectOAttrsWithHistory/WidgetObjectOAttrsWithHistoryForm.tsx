import { FC } from 'react'
import { IGetFormState, TWidgetFormSettings } from '../widget-types'
import { IWidgetObjectOAttrsWithHistoryFormProps, ObjectOAttrsWithHistoryForm } from './ObjectOAttrsWithHistoryForm'

const WidgetObjectOAttrsWithHistoryForm: FC<TWidgetFormSettings<
    IWidgetObjectOAttrsWithHistoryFormProps
>> = (props) => {
    const { settings, onChangeForm } = props

    const getFormState: IGetFormState<
        IWidgetObjectOAttrsWithHistoryFormProps, 
        'baseHistoryForm'
    > = (form, formName) => {
        onChangeForm<IWidgetObjectOAttrsWithHistoryFormProps>(form)
    }

    return (
        <ObjectOAttrsWithHistoryForm 
            settings={settings}
            getFormState={getFormState}
        />
    )
}

export default WidgetObjectOAttrsWithHistoryForm