import { FC, useEffect, useState } from 'react'
import { ITargetLinkingClassesForm, TargetLinkingClassesForm } from '@containers/classes/TargetLinkingClassesForm/TargetLinkingClassesForm'
import { TWidgetFormSettings } from '../widget-types'
import { Input } from 'antd'

export interface WidgetObjectsInOutHistoryFormState extends ITargetLinkingClassesForm {}
export interface WidgetObjectsInOutHistoryFormProps extends ITargetLinkingClassesForm {
    objectIdFromPath?: number
    title?: string
    height?: number
}

const WidgetObjectsInOutHistoryForm: FC<TWidgetFormSettings<WidgetObjectsInOutHistoryFormProps>> = (props) => {
    const { settings, onChangeForm } = props
    const { widget, vtemplate } = settings

    const initialValuesForm: ITargetLinkingClassesForm & { objectIdFromPath?: number } = {
        // Целевые классы отображения объектов
        target: widget?.target ?? [],
        // Связующие классы отображения объектов
        linking: widget?.linking ?? [],
        objectIdFromPath: vtemplate?.objectId,
    }

    const [stateForm, setStateForm] = useState<WidgetObjectsInOutHistoryFormProps>(initialValuesForm) 
    const [title, setTitle] = useState<string>(widget?.title ?? undefined)
    const [height, setHeight] = useState<number>(widget?.height ?? undefined)

    useEffect(() => {
        onChangeForm<WidgetObjectsInOutHistoryFormProps>({ ...stateForm, title: title, height: height })
    }, [stateForm, title, height])

    // функция вытягивания данных с формы в виджет
    const getFormValues = (values) => {
        setStateForm(state => {
            // сеттим только target и linking (параметры формы), остальное получает сам компонент
            return {
                ...state,
                target: values?.classes?.[0].target ?? state.target,
                linking: values?.classes?.[0].linking ?? state.linking,
            }
        })
    }

    // приводим наличие айди к булевому значению, чтобы скрыть связующие классы в форме при отсутствии айди
    const isHaveObjectId = Boolean(stateForm['objectIdFromPath'])

    return (
        <div style={{ maxWidth: 400 }}>
            Заголовок виджета
            <Input 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                placeholder="Введите заголовок" 
                style={{ marginBottom: '10px' }} 
            />Высота виджета
            <Input
                type="number" 
                value={height} 
                onChange={e => setHeight(Number(e.target.value))} 
                placeholder="Введите высоту" 
                style={{ marginBottom: '10px' }}
            />
            <TargetLinkingClassesForm 
                classes={[stateForm]}    
                getFormValues={getFormValues}
                isSingle
                labels={{
                    target: 'Выберите классы отображаемых объектов',
                    linking: 'Выберите связующие классы объектов',
                }}
                withoutLinking={!isHaveObjectId}
                styles={{
                    formItem: {
                        border: 0,
                        padding: 0,
                        maxWidth: 400
                    }
                }}
            />
        </div>
    )
}

export default WidgetObjectsInOutHistoryForm