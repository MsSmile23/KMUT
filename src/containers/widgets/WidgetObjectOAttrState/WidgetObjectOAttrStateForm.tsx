import { IObjectOAttrStateProps } from '@containers/objects/ObjectOAttrState/ObjectOAttrState'
import { FC, PropsWithChildren, useEffect, useState } from 'react'
import { useForm } from 'antd/es/form/Form'
import { Input, Select } from '@shared/ui/forms'
import { Col, Form, Row, Switch } from 'antd'
import { forumThemeConfig } from '@app/themes/forumTheme/forumThemeConfig'
import { selectObjectByIndex, selectObjects, useObjectsStore } from '@shared/stores/objects'
import { ROUTES } from '@shared/config/paths'
import { useLocationParams } from '@shared/hooks/useLocationParams'
import { ClassesCascader } from '@entities/classes/ClassesCascader/ClassesCascader'
import ObjectPropsAndAttributesSelect from '@entities/objects/ObjectPropsAndAttributesSelect/ObjectPropsAndAttributesSelect'
import OAttrStateForm from './OAttrStateForm'

interface IWidgetObjectOAttrStateFormState {
    vtemplate: { objectId: number }
    widget: PropsWithChildren<IObjectOAttrStateProps>
}

interface IWidgetObjectOAttrStateForm {
    onChangeForm: <T>(data: T) => void
    settings: IWidgetObjectOAttrStateFormState
}

export const representationTypeList = [

    {
        label: 'Горизонтально',
        value: 'horizontalTags',
    },
    {
        label: 'Вертикально',
        value: 'verticalTags',
    },
]

const aligningOptions = [
    { value: 'left', label: 'Слева' },
    { value: 'right', label: 'Справа' },
    { value: 'center', label: 'По центру' },
]


const linksDirectionList = [
    { value: 'parents', label: 'Вверх' },
    { value: 'childs', label: 'Вниз' }
]

const WidgetObjectOAttrStateForm: FC<IWidgetObjectOAttrStateForm> = (props) => {
    const { settings, onChangeForm } = props
    const { widget, vtemplate } = settings

    // const [form] = useForm()
    const params = useLocationParams()

    //Получаем объект
    const currentObjectId = params.entity === ROUTES.OBJECTS ? params.idFromPath : vtemplate?.objectId

    const getObject = useObjectsStore(selectObjectByIndex)
    const currentObject = getObject('id', currentObjectId)
    // const objects = useObjectsStore(selectObjects)
    // const [chosenObjectsIds, setChosenObjectsIds] = useState<number[]>([])
    // const [chosenObjectsPrefix, setChosenObjectsPrefix] = useState<{ id: number; prefix: string }[]>([])

    const initialValuesForm = {
        object: currentObject ?? undefined,
        representationType: widget?.representationType,
        labelProps: widget?.labelProps,
        statusChartProps: widget?.statusChartProps,
        children: widget?.children,
        height: widget?.height ?? forumThemeConfig.build.deviceStatuses.chart.height,
        maxWidth: widget?.maxWidth,
        customStyles: widget?.customStyles,
        horizontalAligning: widget?.horizontalAligning,
        verticalAlining: widget?.verticalAlining,
        chosenObjectsIds: widget?.chosenObjectsIds,
        labelWidth: widget?.labelWidth,
        linkedClasses: widget?.linkedClasses,
        targetClasses: widget?.targetClasses,
        linksDirection: widget?.linksDirection,
        labelValue: widget?.labelValue
    }

    // useEffect(() => {
    //     form.setFieldsValue({
    //         representationType: widget?.representationType || undefined,
    //         maxWidth: widget?.maxWidth,
    //         labelsContainerHeight: widget?.labelsContainerHeight,
    //         labelsCount: widget?.labelsCount,
    //         height: widget?.height,
    //         verticalAlining: widget?.verticalAlining,
    //         horizontalAligning: widget?.horizontalAligning,
    //         chosenObjectsIds: widget?.chosenObjectsIds,
    //         labelWidth: widget?.labelWidth,
    //         linkedClasses: widget?.linkedClasses,
    //         targetClasses: widget?.targetClasses,
    //         labelValue: widget?.labelValue
    //     })
    //     setChosenObjectsIds(widget?.chosenObjectsIds)

    //     if (widget?.chosenObjectsIds?.length > 0) {
    //         widget?.chosenObjectsIds.forEach((item) => {
    //             const prefix = widget.chosenObjectsPrefix.find((pr) => pr.id == item)?.prefix ?? ''

    //             form.setFieldsValue({
    //                 [`prefix-${item}`]: prefix,
    //             })
    //         })
    //     }
    // }, [])

    const [stateForm, setStateForm] = useState<PropsWithChildren<IObjectOAttrStateProps>>(initialValuesForm)

    useEffect(() => {
        onChangeForm<PropsWithChildren<IObjectOAttrStateProps>>(stateForm)
    }, [stateForm])
    const getFormState = (state) => {
        setStateForm(state)
    }

    //Показываем чекбокс "На всю ширину" только для вертикального представления
    // const [enabledMaxWidth, setEnabledMaxWidth] = useState(false)

    // useEffect(() => {
    //     if (widget?.representationType === 'verticalTags') {
    //         setEnabledMaxWidth(true)
    //     } else {
    //         setEnabledMaxWidth(false)
    //     }
    // }, [widget?.representationType])

    // const inputHandler = (id, value) => {
    //     const localChosenPrefix = [...chosenObjectsPrefix]

    //     if (localChosenPrefix.find((item) => item.id == id)) {
    //         localChosenPrefix.forEach((pr) => {
    //             if (pr.id == id) {
    //                 pr.prefix = value
    //             }
    //         })
    //     } else {
    //         localChosenPrefix.push({ id: id, prefix: value })
    //     }
    //     setChosenObjectsPrefix(localChosenPrefix)
    // }

    // useEffect(() => {
    //     setStateForm((prev) => {
    //         return {
    //             ...prev,
    //             ['chosenObjectsPrefix']: chosenObjectsPrefix,
    //         }
    //     })
    // }, [chosenObjectsPrefix])
    // //Записываем значения при изменении
    // const onValuesChange = (_, onChangeForm) => {
    //     if ('representationType' in onChangeForm) {
    //         setStateForm((prev) => {
    //             return {
    //                 ...prev,
    //                 ['representationType']: onChangeForm['representationType'],
    //             }
    //         })
    //     }

    //     if ('maxWidth' in onChangeForm) {
    //         setStateForm((prev) => {
    //             return {
    //                 ...prev,
    //                 ['maxWidth']: onChangeForm['maxWidth'],
    //             }
    //         })
    //     }


    //     if ('labelsContainerHeight' in onChangeForm) {
    //         setStateForm((prev) => {
    //             return {
    //                 ...prev,
    //                 ['labelsContainerHeight']: onChangeForm['labelsContainerHeight']
    //             }
    //         })
    //     }

    //     if ('height' in onChangeForm) {
    //         setStateForm((prev) => {
    //             return {
    //                 ...prev,
    //                 ['height']: onChangeForm['height'],

    //             }
    //         })
    //     }

    //     if ('labelsCount' in onChangeForm) {
    //         setStateForm((prev) => {
    //             return {
    //                 ...prev,
    //                 ['labelsCount']: onChangeForm['labelsCount']
    //             }
    //         })
    //     }

    //     if ('horizontalAligning' in onChangeForm) {
    //         setStateForm((prev) => {
    //             return {
    //                 ...prev,
    //                 ['horizontalAligning']: onChangeForm['horizontalAligning'],
    //             }
    //         })
    //     }

    //     if ('verticalAlining' in onChangeForm) {
    //         setStateForm((prev) => {
    //             return {
    //                 ...prev,
    //                 ['verticalAlining']: onChangeForm['verticalAlining'],
    //             }
    //         })
    //     }

    //     if ('chosenObjectsIds' in onChangeForm) {
    //         setStateForm((prev) => {
    //             return {
    //                 ...prev,
    //                 ['chosenObjectsIds']: onChangeForm['chosenObjectsIds'],
    //             }
    //         })
    //     }

    //     if ('labelWidth' in onChangeForm) {
    //         setStateForm((prev) => {
    //             return {
    //                 ...prev,
    //                 ['labelWidth']: Number(onChangeForm['labelWidth']),
    //             }
    //         })
    //     }

    //     if ('linkedClasses' in onChangeForm) {
    //         setStateForm((prev) => {
    //             return {
    //                 ...prev,
    //                 ['linkedClasses']: onChangeForm['linkedClasses'],
    //             }
    //         })
    //     }

    //     if ('linksDirection' in onChangeForm) {
    //         setStateForm((prev) => {
    //             return {
    //                 ...prev,
    //                 ['linksDirection']: onChangeForm['linksDirection'],
    //             }
    //         })
    //     }

    //     if ('targetClasses' in onChangeForm) {
    //         setStateForm((prev) => {
    //             return {
    //                 ...prev,
    //                 ['targetClasses']: onChangeForm['targetClasses'],
    //             }
    //         })
    //     }

    //     if ('labelValue' in onChangeForm) {
    //         setStateForm((prev) => {
    //             return {
    //                 ...prev,
    //                 ['labelValue']: onChangeForm['labelValue'],
    //             }
    //         })
    //     }
    // }

    // return (
    //     <Form
    //         form={form}
    //         layout="vertical"
    //         style={{ maxWidth: '100%' }}
    //         initialValues={initialValuesForm}
    //         onValuesChange={onValuesChange}
    //     >
    //         <Row gutter={12}>
    //             <Col md={6}>
    //                 <Form.Item name="representationType" label="Представление">
    //                     <Select options={representationTypeList} placeholder="Выберите тип представления" />
    //                 </Form.Item>
    //             </Col>


    //             <Col md={6}>
    //                 {widget?.representationType == 'verticalTags' && (
    //                     <Form.Item name="verticalAlining" label="Выравнивание">
    //                         <Select options={aligningOptions} placeholder="" />
    //                     </Form.Item>
    //                 )}
    //             </Col>
    //             <Col md={6}>
    //                 <Form.Item 
    //                     name="height" 
    //                     label="Высота виджета"
    //                 >
    //                     <Input
    //                         // style={{ maxWidth: 300 }}
    //                         placeholder="Введите высоту виджета"
    //                         type="number"
    //                     />
    //                 </Form.Item>
    //             </Col>
    //             <Col md={6}>
    //                 <Form.Item name="labelValue" label="Название из">
    //                     <ObjectPropsAndAttributesSelect  
    //                         classes={stateForm.targetClasses ?? []}
    //                     />
    //                 </Form.Item>
    //             </Col>
    //         </Row>

    //         <Row gutter={12}>

    //             <Col md={6}>
    //                 {enabledMaxWidth && 
    //         <Form.Item name="maxWidth" label="Отображение на всю ширину" valuePropName="checked">
    //             <Switch />
    //         </Form.Item>}
    //             </Col>
    //             <Col md={6}>
    //                 <Form.Item name="labelWidth" label="Фиксированная ширина плашки">
    //                     <Input
    //                         type="number" min={1} onChange={(e) => {

    //                             if (e.target.value == '') {

    //                                 setStateForm((prev) => {
    //                                     return {
    //                                         ...prev,
    //                                         ['labelWidth']: undefined,
    //                                     }
    //                                 })
    //                             }}}
    //                     />
    //                 </Form.Item>
    //             </Col>

    //             <Col md={6}>
    //                 <Form.Item
    //                     name="labelsContainerHeight"
    //                     label="Высота контейнера для плашек"
    //                 >
    //                     <Input type="number" />
    //                 </Form.Item>
    //             </Col>
    //             <Col md={6}>

    //                 <Form.Item 
    //                     name="labelsCount"
    //                     label="Количество отображаемых плашек"
    //                 ><Input type="number" />
    //                 </Form.Item>
        
    //             </Col>
    //         </Row>

    //         <Row gutter={12}>
    //             <Col md={6}>
    //                 <Form.Item label="Связующие классы" name="linkedClasses">
    //                     <ClassesCascader />
    //                 </Form.Item>
    //             </Col>
    //             <Col md={6}>
    //                 <Form.Item label="Целевые классы" name="targetClasses">
    //                     <ClassesCascader />
    //                 </Form.Item>
    //             </Col>
    //             <Col md={6}>
    //                 <Form.Item name="chosenObjectsIds" label="Объекты для вывода">
    //                     <Select
    //                         placeholder="Все найденные объекты"
    //                         onChange={(e) => setChosenObjectsIds(e)}
    //                         mode="multiple"
    //                         customData={{
    //                             data: objects,
    //                             convert: {
    //                                 valueField: 'id',
    //                                 optionLabelProp: 'name',
    //                             },
    //                         }}
    //                     />
    //                 </Form.Item>
    //             </Col>
    //             <Col md={6}>
    //                 <Form.Item name="linksDirection" label="Направление поиска">
    //                     <Select
    //                         placeholder="Выберите направление поиска"
    //                         onChange={(value) => {
    //                             setStateForm((prev) => {
    //                                 return {
    //                                     ...prev,
    //                                     ['linksDirection']: value,
    //                                 }
    //                             })
    //                         }}
    //                         options={linksDirectionList}
    //                     />
    //                 </Form.Item>
    //             </Col>
    //         </Row>
    //         {chosenObjectsIds?.map((item) => {
    //             const object = objects?.find((obj) => obj.id == item)

    //             return (
    //                 <Col span={8} key={`key_${item}`}>
    //                     <Form.Item name={`prefix-${item}`} label={`Префикс для объекта ${object?.name}`}>
    //                         <Input
    //                             onChange={(e) => {
    //                                 inputHandler(item, e.target.value)
    //                             }}
    //                             type="text"
    //                         />
    //                     </Form.Item>
    //                 </Col>
    //             )
    //         })}

    //     </Form>
    // )
    return (
        <OAttrStateForm
            settings={settings}
            onChangeForm={getFormState}
        />
    )
}

export default WidgetObjectOAttrStateForm