import { selectAttributes, useAttributesStore } from '@shared/stores/attributes'
import { selectObjects, useObjectsStore } from '@shared/stores/objects'
import { Input, Select } from '@shared/ui/forms'
import { Form, InputNumber } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { FC, useEffect, useState } from 'react'
import { selectClasses, useClassesStore } from '@shared/stores/classes'
import { useGetObjects } from '@shared/hooks/useGetObjects'


type TStateFormType = {
    chosenClass: number
    objectIds: number[]
    metricAttrIds: number[]
    height?: number
}

export interface WidgetObjectsWithOAStatesFormProps {
    onChangeForm: <T>(data: T) => void
    settings: { vtemplate: { objectId: number }; widget: TStateFormType }
}

const initialValuesForm = {
    chosenClass: 0,
    metricAttrIds: [],
    objectIds: [],
    height: undefined,

}

const WidgetObjectsWithOAStatesForm: FC<WidgetObjectsWithOAStatesFormProps> = (props) => {
    const { settings, onChangeForm } = props
    const [dataObjectId] = useState<number>(settings?.vtemplate?.objectId)
    const [form] = useForm()
    // const objects = useObjectsStore(selectObjects)
    const objects = useGetObjects()
    const attributes = useAttributesStore(selectAttributes)
        .filter(attr => attr.history_to_db == true || attr.history_to_cache == true)
    const classes = useClassesStore(selectClasses)
    const initialSettings = Object.keys(settings || {}).length
    const [stateForm, setStateForm] = useState<TStateFormType>(initialSettings ? settings?.widget : initialValuesForm)

    const [chosenClassId, setChosenClassId] = useState<number>(0)

    useEffect(() => {
    
        form.setFieldsValue({
            chosenClass: settings?.widget?.chosenClass || undefined,
            metricAttrIds: settings?.widget?.metricAttrIds || [],
            objectIds: settings?.widget?.objectIds || [],
            height: settings?.widget?.height,
        })
        setChosenClassId(settings?.widget?.chosenClass)
    }, [])


    useEffect(() => {
        onChangeForm<TStateFormType>(stateForm)
    }, [stateForm])

    const onChangeFormHandler = (onChangeForm) => {
        console.log('ARDEV 1', onChangeForm)
        setStateForm((prev) => {
            return {
                ...prev,
                ...onChangeForm
            }
        })

        /*
        if ('chosenClass' in onChangeForm) {
            setStateForm((prev) => {
                return {
                    ...prev,
                    ['chosenClass']: onChangeForm['chosenClass'],
                }
            })
        }

        if ('objectIds' in onChangeForm) {
            setStateForm((prev) => {
                return {
                    ...prev,
                    ['objectIds']: onChangeForm['objectIds'],
                }
            })
        }

        if ('metricAttrIds' in onChangeForm) {
            setStateForm((prev) => {
                return {
                    ...prev,
                    ['metricAttrIds']: onChangeForm['metricAttrIds'],
                }
            })
        }

         */

        
    }

    return (
        <Form
            initialValues={stateForm}
            form={form}
            layout="vertical"
            style={{ width: 800 }}
            onValuesChange={(_, onChangeForm) => {
                onChangeFormHandler(onChangeForm)
            }}
        >

            <Form.Item name="chosenClass" label="Класс объекта">
                <Select
                    onChange={(e) => {setChosenClassId(e)}}
                    customData={{
                        data: classes,
                        convert: { valueField: 'id', optionLabelProp: 'name' },
                    }}
                    placeholder="Выберите класс"
                />
            </Form.Item>

            <Form.Item name="objectIds" label="Объекты выбранного класса">
                <Select
                    mode="multiple"
                    disabled={!chosenClassId}
                    customData={{
                        data: objects.filter(obj => obj.class_id == chosenClassId),
                        convert: { valueField: 'id', optionLabelProp: 'name' },
                    }}
                    placeholder="Выберите объекты"
                />
            </Form.Item>
            
            <Form.Item name="metricAttrIds" label="Атрибуты выбранного класса">
                <Select
                    mode="multiple"
                    disabled={!chosenClassId}
                    customData={{
                        data: attributes.filter(attr => attr.classes.filter(cl => cl.id == chosenClassId).length > 0),
                        convert: { valueField: 'id', optionLabelProp: 'name' },
                    }}
                    placeholder="Выберите атрибуты"
                />
            </Form.Item>

            <Form.Item name="height" label="Высота таблицы (опционально)">
                <InputNumber placeholder="Введите высоту таблицы в пикселях" />
            </Form.Item>


          
        </Form>
    )
}

export default WidgetObjectsWithOAStatesForm