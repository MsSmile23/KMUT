import LinkedObjects, { ILinkedObjectsForm } from '@entities/objects/LinkedObjects/LinkedObjects'
import { selectAttributes, useAttributesStore } from '@shared/stores/attributes'
import { Select } from '@shared/ui/forms'
import { Col, Divider, Form, Row } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { FC, useEffect, useMemo, useState } from 'react'

export type TStateFormWidgetObjectStatesWithHierarchyForm = {
    linkedObjectsForm?: ILinkedObjectsForm
    viewType: 'horizontal'
    linkedObjectsChilds: ILinkedObjectsForm
    onClickType: 'link' | 'modal'
    attrMainObjects?: number
    attrLinkedObjects?: number
}

const VIEW_TYPE_OPTIONS = [{ value: 'horizontal', label: 'Горизонтальное.Плашки' }]
const CLICK_TYPE_OPTIONS = [
    { value: 'link', label: 'Переход на страницу объекта' },
    { value: 'modal', label: 'Открытие модального окна' },
]

export interface WidgetWidgetObjectStatesWithHierarchyFormProps {
    onChangeForm: <T>(data: T) => void
    settings: { vtemplate: { objectId: number }; widget: TStateFormWidgetObjectStatesWithHierarchyForm }
}

const WidgetObjectStatesWithHierarchyForm: FC<WidgetWidgetObjectStatesWithHierarchyFormProps> = (props) => {
    const { settings, onChangeForm } = props
    const { widget } = settings
    const [form] = useForm()
    const [stateForm, setStateForm] = useState<TStateFormWidgetObjectStatesWithHierarchyForm>(settings?.widget)

    const attrs = useAttributesStore(selectAttributes)


    useEffect(() => {
        onChangeForm<TStateFormWidgetObjectStatesWithHierarchyForm>(stateForm)
    }, [stateForm])

    const onChangeFormHandler = (onChangeForm) => {
        setStateForm((prev) => {
            return {
                ...prev,
                ...onChangeForm,
            }
        })
    }


    //*Селекты для атрибутов таргет классов
    const createOptionsForAttrSelect = (targetClasses) => {
        const options = attrs.filter((attr) =>
            attr.classes?.some((item) => targetClasses.includes(item.id))
        ).map(attr => ({
            value: attr.id,
            label: attr.name
        }))

        return options
    }

    const attrMainObjectsOptions = useMemo(() => {
        return createOptionsForAttrSelect(stateForm?.linkedObjectsForm?.targetClasses)
    }, [stateForm?.linkedObjectsForm?.targetClasses])

    const attrLinkedObjectsOptions = useMemo(() => {
        return createOptionsForAttrSelect(stateForm?.linkedObjectsChilds?.targetClasses)
    }, [stateForm?.linkedObjectsChilds?.targetClasses])

    return (
        <Form
            initialValues={stateForm}
            form={form}
            layout="vertical"
            onValuesChange={(_, onChangeForm) => {
                onChangeFormHandler(onChangeForm)
            }}
        >
            <Divider orientation="left" plain>
                Основные объекты
            </Divider>
            <LinkedObjects 
                getFormValues={(value) => onChangeFormHandler({ linkedObjectsForm: value })} 
                {...widget?.linkedObjectsForm} 
            />
            <Row gutter={16}>
                <Col span={6}>
                    <Form.Item name="attrMainObjects" label="Значение атрибута вывода">
                        <Select options={attrMainObjectsOptions} />
                    </Form.Item>
                </Col>
            </Row>
            <Divider orientation="left" plain>
                Связанные объекты
            </Divider>
            <LinkedObjects
                getFormValues={(value) => onChangeFormHandler({ linkedObjectsChilds: value })} 
                {...widget?.linkedObjectsChilds}
            />
            <Row gutter={16}>
                <Col span={6}>
                    <Form.Item name="attrLinkedObjects" label="Значение атрибута вывода">
                        <Select options={attrLinkedObjectsOptions} />
                    </Form.Item>
                </Col>
            </Row>
 
            <Divider orientation="left" plain>
                    Представление
            </Divider>
            <Row gutter={16}>
                <Col span={6}>
                    <Form.Item name="viewType" label="Тип представления">
                        <Select options={VIEW_TYPE_OPTIONS} />
                    </Form.Item>
                </Col>
            </Row>
            <Divider orientation="left" plain>
                    Плашки
            </Divider>
            <Row gutter={16}>
                <Col span={6}>
                    <Form.Item name="onClickType" label="Действие по клику">
                        <Select options={CLICK_TYPE_OPTIONS} />
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    )
}

export default WidgetObjectStatesWithHierarchyForm