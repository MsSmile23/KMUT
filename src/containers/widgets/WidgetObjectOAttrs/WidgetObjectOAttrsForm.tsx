import { IObject } from '@shared/types/objects'
import { useForm } from 'antd/es/form/Form'
import { FC, useEffect, useState } from 'react'
import OAForm from './OAForm'

// const displayTypes = [
//     { value: 'strings', label: 'Строки' },
//     { value: 'table', label: 'Таблица' },
// ]

// const sortOptions = [
//     { value: 'value', label: 'Сортировка по значению' },
//     { value: 'label', label: 'Сортировка по обозначению' },
//     { value: 'dnd', label: 'Ручная сортировка' },
// ]

export type TStateFormType = {
    object: IObject
    displayType: string
    showLinks: boolean
    attributeCategory: number
    attributesIds: number[]
    height: number
    linkedClasses: string
    divided: boolean
    targetClasses: {
        class_id: number
        showClassName: boolean
        attributeIds: number[]
    }[]
    showId: boolean
    customIdLabel: string
    sort: 'label' | 'value'
    oaSortOrder: number[]
    showObjectName?: boolean
}

export interface WidgetObjectAttributesFromProps {
    onChangeForm: <T>(data: T) => void
    settings: { vtemplate: { objectId: number }; widget: TStateFormType }
}

const initialValuesForm = {
    object: {} as IObject,
    displayType: 'table',
    showLinks: false,
    attributeCategory: undefined,
    attributesIds: [],
    height: undefined,
    linkedClasses: undefined,
    divided: false,
    targetClasses: [],
    showId: false,
    customIdLabel: undefined,
    sort: undefined,
    oaSortOrder: [],
    showObjectName: undefined
}

const WidgetObjectOAttrsForm: FC<WidgetObjectAttributesFromProps> = (props) => {
    const { settings, onChangeForm } = props
    // const [dataObjectId] = useState<number>(settings?.vtemplate?.objectId)
    // const [form] = useForm()
    // const objects = useObjectsStore(selectObjects)
    // const [attributeCategories, setAttributeCategories] = useState<IAttributeCategory[]>([])
    // const [attributesForOptions, setAttributesForOption] = useState<IAttribute[]>([])
    // const attributes = useAttributesStore(selectAttributes)
    // const classes = useClassesStore(selectClasses)
    const initialSettings = Object.keys(settings || {}).length
    const [stateForm, setStateForm] = useState<TStateFormType>(initialSettings ? settings?.widget : initialValuesForm)
 
    // useEffect(() => {
    //     SERVICES_ATTRIBUTE_CATEGORIES.Models.getAttributeCategories().then((resp) => {
    //         if (resp?.success) {
    //             if (resp?.data !== undefined) {
    //                 setAttributeCategories(resp?.data)
    //             }
    //         }
    //     })
    // }, [])

    // useEffect(() => {
    //     setAttributesForOption(
    //         attributes
    //             .filter(
    //                 (attr) =>
    //                     attr.classes_ids.filter(
    //                         (cl) => cl.id == objects.find((item) => item?.id === dataObjectId)?.class_id
    //                     )?.length > 0
    //             )
    //             .filter((oa) => ['public', 'private'].includes(oa?.visibility))
    //     )
    // }, [dataObjectId])


    useEffect(() => {
        onChangeForm<TStateFormType>(stateForm)
    }, [stateForm])

    // const onChangeFormHandler = (onChangeForm) => {


    //     if ('displayType' in onChangeForm) {
    //         setStateForm((prev) => {
    //             return {
    //                 ...prev,
    //                 ['displayType']: onChangeForm['displayType'],
    //             }
    //         })
    //     }

    //     if ('showLinks' in onChangeForm) {
    //         setStateForm((prev) => {
    //             return {
    //                 ...prev,
    //                 ['showLinks']: onChangeForm['showLinks'],
    //             }
    //         })
    //     }

    //     if ('attributeCategory' in onChangeForm) {
    //         setStateForm((prev) => {
    //             return {
    //                 ...prev,
    //                 ['attributeCategory']: onChangeForm['attributeCategory'],
    //             }
    //         })
    //     }

    //     if ('attributesIds' in onChangeForm) {
    //         setStateForm((prev) => {
    //             return {
    //                 ...prev,
    //                 ['attributesIds']: onChangeForm['attributesIds'],
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

    //     if ('linkedClasses' in onChangeForm) {
    //         setStateForm((prev) => {
    //             return {
    //                 ...prev,
    //                 ['linkedClasses']: onChangeForm['linkedClasses'],
    //             }
    //         })
    //     }

    //     if ('divided' in onChangeForm) {
    //         setStateForm((prev) => {
    //             return {
    //                 ...prev,
    //                 ['divided']: onChangeForm['divided'],
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

    //     if ('showId' in onChangeForm) {
    //         setStateForm((prev) => {
    //             return {
    //                 ...prev,
    //                 ['showId']: onChangeForm['showId'],
    //             }
    //         })
    //     }

    //     if ('customIdLabel' in onChangeForm) {
    //         setStateForm((prev) => {
    //             return {
    //                 ...prev,
    //                 ['customIdLabel']: onChangeForm['customIdLabel'],
    //             }
    //         })
    //     }

    //     if ('sort' in onChangeForm) {
    //         setStateForm((prev) => {
    //             return {
    //                 ...prev,
    //                 ['sort']: onChangeForm['sort'],
    //             }
    //         })
    //     }

    //     if ('oaSortOrder' in onChangeForm) {
    //         setStateForm((prev) => {
    //             return {
    //                 ...prev,
    //                 ['oaSortOrder']: onChangeForm['oaSortOrder'],
    //             }
    //         })
    //     }

    //     if ('oaSortOrder' in onChangeForm) {
    //         setStateForm((prev) => {
    //             return {
    //                 ...prev,
    //                 ['oaSortOrder']: onChangeForm['oaSortOrder'],
    //             }
    //         })
    //     }

    //     if ('showObjectName' in onChangeForm) {
    //         setStateForm((prev) => {
    //             return {
    //                 ...prev,
    //                 ['showObjectName']: onChangeForm['showObjectName'],
    //             }
    //         })
    //     }
    // }


    const getFormState = (state) => {
        setStateForm(state)
    }

    return (
        <OAForm
            settings={settings}
            onChangeForm={getFormState}
        />


        
    //     <Form
    //         initialValues={stateForm}
    //         form={form}
    //         layout="vertical"
    //         style={{ width: 800 }}
    //         onValuesChange={(_, onChangeForm) => {
    //             onChangeFormHandler(onChangeForm)
    //         }}
    //     >
    //         <Row gutter={16}>
    //             <Col span={12}>
    //                 <Form.Item name="displayType" label="Тип отображения">
    //                     <Select options={displayTypes} placeholder="Выберите тип отображения" />
    //                 </Form.Item>
    //                 <Form.Item name="showLinks" label="Отображение связей" valuePropName="checked">
    //                     <Switch />
    //                 </Form.Item>
    //                 <Form.Item name="attributeCategory" label="Категория атрибута">
    //                     <Select
    //                         customData={{
    //                             data: attributeCategories,
    //                             convert: { valueField: 'id', optionLabelProp: 'name' },
    //                         }}
    //                         placeholder="Выберите категорию атрибута"
    //                     />
    //                 </Form.Item>
    //                 <Form.Item name="attributesIds" label="Атрибуты для вывода">
    //                     <Select
    //                         onChange={() => {form.setFieldsValue({ oaSortOrder: undefined })}}
    //                         mode="multiple"
    //                         customData={{
    //                             data: attributesForOptions,
    //                             convert: { valueField: 'id', optionLabelProp: 'name' },
    //                         }}
    //                         placeholder="Выбраны все атрибуты для вывода"
    //                     />
    //                 </Form.Item>

    //             <Form.Item name="sort" label="Сортировка">
    //                 <Select options={sortOptions} placeholder="Выберите тип сортировки" />
    //             </Form.Item>
    //         </Col>
    //         <Col span={12}>
    //             {/* <Form.Item name="divided" label="Отображение разделителя" valuePropName="checked">
    //                 <Switch />
    //             </Form.Item> */}
    //             <Form.Item name="showObjectName" label="Отображение названия объекта" valuePropName="checked">
    //                 <Switch />
    //             </Form.Item>
    //             <Form.Item name="height" label="Высота виджета">
    //                 <Input type="number" />
    //             </Form.Item>
    //             <Form.Item name="showId" label="Отображение ID объекта" valuePropName="checked">
    //                 <Switch />
    //             </Form.Item>
    //             <Form.Item name="customIdLabel" label="Обозначение ID">
    //                 <Input
    //                     disabled=
    //                         {form.getFieldValue('showId') == false || form.getFieldValue('showId') == undefined}
    //                 />
    //             </Form.Item>
    //         </Col>
    //         <Collapse
    //             collapsible={form.getFieldValue('sort') == 'dnd' ? 'header' : 'disabled'}
    //             style={{ minWidth: '900px', marginBottom: '10px' }}
    //             items={[
    //                 {
    //                     key: '1',
    //                     label: 'Ручная сортировка',
    //                     children: (
    //                         <Form.Item name="oaSortOrder">
    //                             <WidgetDndOAttrsForm
    //                                 attrs={attributesForOptions}
    //                                 chosenAttrs={form.getFieldValue('attributesIds')}
    //                             />
    //                         </Form.Item>
    //                     ),
    //                 },
    //             ]}
    //         />
    //         <Collapse
    //             style={{ minWidth: '900px' }}
    //             items={[
    //                 {
    //                     key: '1',
    //                     label: 'Связующие классы',
    //                     children: (
    //                         <>
    //                             <Form.Item name="linkedClasses">
    //                                 <ClassesCascader />
    //                             </Form.Item>
    //                             {form.getFieldValue('linkedClasses')?.length > 0 && (
    //                                 <Form.Item name="targetClasses">
    //                                     <LinkedObjectsCard
    //                                         classes={classes}
    //                                         attributes={attributes}
    //                                         classesIds={form.getFieldValue('linkedClasses')}
    //                                     />
    //                                 </Form.Item>
    //                             )}
    //                         </>
    //                     ),
    //                 },
    //             ]}
    //         />
    //     </Row>
    // </Form>
    )
}

export default WidgetObjectOAttrsForm