/* eslint-disable react/jsx-max-depth */
import { TInitialDataSettingVTType } from '@containers/vtemplates/VtemplateFormContainer/types/types'
import LinkedObjects, { ILinkedObjectsForm } from '@entities/objects/LinkedObjects/LinkedObjects'
import { selectAttributes, useAttributesStore } from '@shared/stores/attributes'
import { selectGetClassById, useClassesStore } from '@shared/stores/classes'
import { selectObjectByIndex, useObjectsStore } from '@shared/stores/objects'
import { IClass } from '@shared/types/classes'
import { Select } from '@shared/ui/forms'
import { Col, Form, Input, Row, Switch } from 'antd'
import { FC } from 'react'

export type TWidgetObjectsOverImage = {
    height?: number,
    schemeAttributeId?: number,
    viewType: 'markup' | 'coordinates',
    attributeMarkupId?: number,
    attributeSortId?: number,
    coordinateXAttributeId?: number,
    coordinateYAttributeId?: number,
    linkedObjectsForm?: ILinkedObjectsForm,
    view?: 'circle' | 'square' | 'squareWithState' | 'classIcon',
    border?: boolean,
    fill?: boolean,
    squareWidth?: number,
    squareHeight?: number,
    stateWidth?: number,
    stateHeight?: number,
    leftOffsetState?: number,
    topOffsetState?: number,
    sideSize?: number,
}

interface WidgetObjectsOverImageProps {
    onChangeForm: <T>(data: T) => void
    settings: {
        widget: TWidgetObjectsOverImage,
        vtemplate?: {
            objectId?: number
        },
        baseSettings: TInitialDataSettingVTType
    }
}

//Вывод
const viewTypeOptions = [
    { label: 'По разметке', value: 'markup' },
    { label: 'По координатам', value: 'coordinates' }
]

//Представление
const viewOptions = [
    { label: 'Круг', value: 'circle' },
    { label: 'Прямоугольник', value: 'square' },
    { label: 'Прямоугольник со статусом внизу', value: 'squareWithState' },
    { label: 'Иконка класса', value: 'classIcon' }
]

const WidgetObjectsOverImageForm: FC<WidgetObjectsOverImageProps> = (props) => {
    const { onChangeForm, settings } = props
    const { widget } = settings
    const [ form ] = Form.useForm()
    const classById = useClassesStore(selectGetClassById)
    const getObjectByIndex = useObjectsStore(selectObjectByIndex)

    const attributes = useAttributesStore(selectAttributes)
    const attributesOptions = attributes?.map(({ id, name }) => ({ label: name, value: id }))
        ?.sort((a, b) => a.label.localeCompare(b.label))
    
    //Поиск классов по id
    const getClassById = (classes: number[]) => {
        const classesById: IClass[] = []

        classes?.forEach((cl) => {
            const classFull = classById(cl)

            if (classFull) { classesById.push(classFull) }
        })

        return classesById
    }

    //Получаем атрибуты классов
    const getAttributesClasses = (classes: IClass[]) => {
        return classes?.flatMap((cl) => cl.attributes)
            ?.map(({ id, name }) => ({ label: name, value: id }))?.filter(
                (item, index, array) =>
                    array.findIndex((element) => element.value === item.value) === index)
    }

    const targetClassesFull = getClassById(widget?.linkedObjectsForm?.targetClasses)
    
    //Получаем атрибуты целевых классов
    const attrsByTargetClassesOptions = getAttributesClasses(targetClassesFull)
        ?.sort((a, b) => a.label.localeCompare(b.label))
    
    //Получаем список атрибутов для выбора схемы
    const getSchemaOptionList = () => {
        if (widget?.linkedObjectsForm?.baseObject) {
            const baseObjectFull = getObjectByIndex('id', widget?.linkedObjectsForm?.baseObject)
            const attrsByBaseObjectClass = getClassById([baseObjectFull?.class_id])

            //Получаем атрибуты классов базового объекта
            return getAttributesClasses(attrsByBaseObjectClass)
        } else {
            const baseSettingsClassesFull = getClassById(settings?.baseSettings?.classes)

            //Получаем атрибуты классов из базовых настроек виджета
            return getAttributesClasses(baseSettingsClassesFull)?.sort((a, b) => a.label.localeCompare(b.label))
        }
    }

    return (
        <>
            <LinkedObjects 
                getFormValues={(value) => onChangeForm({ linkedObjectsForm: value })} 
                {...widget?.linkedObjectsForm} 
            />
            <Form
                form={form}
                layout="horizontal"
                onValuesChange={onChangeForm}
                initialValues={widget}
                style={{ width: '100%' }}
            >
                <Row gutter={20}>
                    <Col span={12} style={{ maxWidth: 600 }}>
                        {/* <Form.Item
                            name="height"
                            label="Высота"
                        >
                            <Input placeholder="Введите высоту" type="number" />
                        </Form.Item> */}
                        <Form.Item
                            name="schemeAttributeId"
                            label="Атрибут схемы"
                        >
                            <Select options={getSchemaOptionList()} placeholder="Выберите атрибут" />
                        </Form.Item>
                        <Form.Item
                            name="viewType"
                            label="Вывод"
                        >
                            <Select options={viewTypeOptions} placeholder="Выберите тип вывода" />
                        </Form.Item>
                        {widget?.viewType == 'markup' && 
                        <>
                            <Form.Item
                                name="attributeMarkupId"
                                label="Атрибут разметки"
                            >
                                <Select options={attributesOptions} placeholder="Выберите атрибут" />
                            </Form.Item>
                            
                            <Form.Item
                                name="attributeSortId"
                                label="Атрибут последовательности"
                            >
                                <Select options={attrsByTargetClassesOptions} placeholder="Выберите атрибут" />
                            </Form.Item>
                        </>}
                        {widget?.viewType == 'coordinates' &&  
                        <>
                            <Form.Item
                                name="coordinateXAttributeId"
                                label="Атрибут координаты X"
                            >
                                <Select options={attrsByTargetClassesOptions} placeholder="Выберите атрибут" />
                            </Form.Item>
                            <Form.Item
                                name="coordinateYAttributeId"
                                label="Атрибут координаты Y"
                            >
                                <Select options={attrsByTargetClassesOptions} placeholder="Выберите атрибут" />
                            </Form.Item>
                        </>}
                    </Col>
                    <Col span={12} style={{ maxWidth: 600 }}>
                        <Form.Item
                            name="view"
                            label="Представление"
                        >
                            <Select options={viewOptions} placeholder="Выберите тип вывода" />
                        </Form.Item>
                        {(widget?.view === 'circle' || widget?.view === 'classIcon') &&
                            <Form.Item
                                name="sideSize"
                                label="Высота"
                                wrapperCol={{ span: 12 }}
                            >
                                <Input placeholder="Введите высоту" type="number" />
                            </Form.Item>}
                        {(widget?.view == 'squareWithState' || widget?.view === 'square') &&
                            <Row wrap={false} style={{ display: 'flex', gap: 12 }}>
                                <Form.Item
                                    name="squareWidth"
                                    label="Ширина"
                                >
                                    <Input placeholder="Введите ширину" type="number" step="0.1" />
                                </Form.Item>
                                <Form.Item
                                    name="squareHeight"
                                    label="Высота"
                                >
                                    <Input placeholder="Введите высоту" type="number" step="0.1" />
                                </Form.Item>
                            </Row>}
                        {widget?.view == 'squareWithState' &&
                        <>
                            <Row wrap={false} style={{ display: 'flex', gap: 12 }}>
                                <Form.Item
                                    name="stateWidth"
                                    label="Ширина статуса"
                                >
                                    <Input placeholder="Введите ширину" type="number" />
                                </Form.Item>
                                <Form.Item
                                    name="stateHeight"
                                    label="Высота статуса"
                                >
                                    <Input placeholder="Введите высоту" type="number" />
                                </Form.Item>
                            </Row>
                            <Row wrap={false} style={{ display: 'flex', gap: 12 }}>
                                <Form.Item
                                    name="leftOffsetState"
                                    label="Смещение статуса слева"
                                >
                                    <Input placeholder="Введите смещение" type="number" />
                                </Form.Item>
                                <Form.Item
                                    name="topOffsetState"
                                    label="Смещение статуса сверху"
                                >
                                    <Input placeholder="Введите смещение" type="number" />
                                </Form.Item>
                            </Row>
                        </>}
                        <Row style={{ display: 'flex', gap: 20 }}>
                            <Form.Item
                                name="fill"
                                valuePropName="checked"
                                label="Заливка"
                            >
                                <Switch defaultChecked />
                            </Form.Item>
                            {widget?.view !== 'classIcon' && 
                            <Form.Item
                                name="border"
                                valuePropName="checked"
                                label="Границы"
                            >
                                <Switch defaultChecked />
                            </Form.Item>}
                        </Row>
                    </Col>
                </Row>
            </Form>
          
        </>
    )
}

export default WidgetObjectsOverImageForm