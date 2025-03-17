import { ECIconView } from '@shared/ui/ECUIKit/common/ECIconView/ECIconView'
import { Button, Form } from 'antd'
import { FC, CSSProperties } from 'react'
import { NamePath } from 'rc-field-form/es/interface'
import { DndContext, closestCenter, PointerSensor, useSensor,
    useSensors, DragEndEvent, KeyboardSensor } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, 
    verticalListSortingStrategy } from '@dnd-kit/sortable'
import { SortableFormPart } from './SortableFormPart'
import { IObject } from '@shared/types/objects'

export type IFieldMnemo = 'class' | 'object' | 'attribute' | 'targetClassIds' | 'linkedClassIds'
export interface ITargetObjectsAndOAttrsForm {
    fieldId?: string
    classId: number | null
    targetClassIds: number[]
    linkedClassIds: number[]
    objectId: number| null
    attributeIds: number[]
    showAttrValue: number | string | null
    forceShow: boolean
}
export interface IOptionsListAll {
    classes?: IOptionsList[]
    objects?: IOptionsList[]
    attributes?: IOptionsList[]
    names?: IOptionsList[]
    namesWithObject?: boolean
}
export interface IOptionsList {
    value: number
    label: string
}

export interface ITargetObjectsAndOAttrsFormProps<T = string> {
    objectsWithAttrs: ITargetObjectsAndOAttrsForm[]
    baseClasses?: number[]
    getFormValues?: (
        values: {
            objectsWithAttrs: ITargetObjectsAndOAttrsForm[]
        },
        mnemo: T
    ) => void
    mnemo: T
    isSingle?: boolean
    withoutLinking?: boolean
    labels?: {
        classId?: string
        objectId?: string
        attributeIds?: string
        showAttrValue?: string
        forceShow?: string
        targetClassIds?: string
        linkedClassIds?: string
    }
    styles?: {
        button?: CSSProperties
        formItem?: CSSProperties
    }
    optionsListAll?: IOptionsListAll
    objectId?: IObject['id']
    showForm?: IFieldMnemo[]
    headerProps?: FormHeaderProps
}

/**
 * При настраивании полей учитывать тот факт, что может быть использовано одновременно либо поле classId,
 * либо сочетание полей targetClassIds и linkedClassIds
 * */
export const TargetObjectsAndOAttrsForm: FC<ITargetObjectsAndOAttrsFormProps> = ({
    objectsWithAttrs, getFormValues, styles, isSingle, labels, optionsListAll, /* object, */ objectId, baseClasses,
    showForm = ['class', 'object', 'attribute'], mnemo, headerProps
}) => {
    const [form] = Form.useForm()
    const values = Form.useWatch('objectsWithAttrs', form)

    const customClearFields = (field: 'classId' | 'objectId', index: number) => {
        let fieldsToClear = ['objectId', 'attributeIds', 'showAttrValue']

        fieldsToClear = (field === 'classId') ? ['classId'].concat(fieldsToClear) :  fieldsToClear
        const formValues = form.getFieldsValue()

        fieldsToClear.forEach((field) => {
            formValues['objectsWithAttrs'][index][field] = field === 'attributeIds' ? [] : null
        })
        form.setFieldsValue(formValues)
    }

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    );

    const handleDragEnd = (event: DragEndEvent): void => {
        const { active, over } = event
        
        if (active?.id !== over?.id) {
            const oldIndex = values.findIndex((value) => value?.fieldId === active?.id)
            const newIndex = values.findIndex((value) => value?.fieldId === over?.id)
            const result = arrayMove(values, oldIndex, newIndex) as ITargetObjectsAndOAttrsForm[]
            
            form.setFieldValue('objectsWithAttrs', result)
            getFormValues({ objectsWithAttrs: result }, mnemo)
        }
    }

    return (
        <>
            <FormHeader 
                showForm={showForm}
                headerLabels={headerProps?.headerLabels}
                headerStyles={headerProps?.headerStyles}
                isSingle={isSingle}
            />
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    boxSizing: 'border-box', 
                }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{ objectsWithAttrs }}
                    onValuesChange={(_value, values, ) => {
                        getFormValues(values, mnemo)
                    }}
                >
                    <Form.List
                        name="objectsWithAttrs"
                    >
                        {(fields, { add, remove }, { errors }) => (
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '12px',
                                }}
                            >
                                <DndContext 
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragEnd={handleDragEnd}
                                >
                                    <SortableContext 
                                        items={values?.map((v) => v?.fieldId) ?? []}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        {fields.map((field, index) => {
                                            const currentItem = form
                                                .getFieldValue('objectsWithAttrs' as NamePath)[index]

                                            return (
                                                <SortableFormPart
                                                    key={`group-${currentItem?.fieldId}`}
                                                    field={field}
                                                    index={index}
                                                    currentItem={currentItem} 
                                                    customClearFields={customClearFields}
                                                    labels={labels}
                                                    length={fields.length}
                                                    remove={remove}
                                                    styles={styles}
                                                    optionsListSettings={optionsListAll}
                                                    currentObjectId={objectId}
                                                    isSingle={isSingle}
                                                    showForm={showForm}
                                                    baseClasses={baseClasses}
                                                />
                                            )})}
                                    </SortableContext>
                                </DndContext>
                                {!isSingle && (
                                    <Form.Item style={{ marginBottom: 0 }}>
                                        <Button
                                            onClick={() => add( {
                                                fieldId: mnemo + values.length,
                                                classId: null,
                                                objectId: null,
                                                attributeIds: [],
                                                showAttrValue: null,
                                                forceShow: false,
                                            })}
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                background: 'while',
                                                color: 'black',
                                                ...styles?.button,
                                            }}
                                        >
                                            <ECIconView icon="PlusCircleOutlined" />
                                        </Button>
                                        <Form.ErrorList errors={errors} />
                                    </Form.Item>
                                )}
                            </div>
                        )}
                    </Form.List>
                </Form>
            </div>
        </>
    )
}

interface FormHeaderProps {
    showForm: ITargetObjectsAndOAttrsFormProps['showForm']
    isSingle?: ITargetObjectsAndOAttrsFormProps['isSingle']
    headerLabels?: Partial<Record<IFieldMnemo | 'name' | 'forceShow', string>>
    headerStyles?: {
        wrapper?: React.CSSProperties
        item?: React.CSSProperties
    }
}
const FormHeader: FC<FormHeaderProps> = ({
    showForm, 
    isSingle,
    headerLabels = {
        class: 'Класс объекта',
        targetClassIds: 'Целевые классы',
        linkedClassIds: 'Связующие классы',
        object: 'Объект',
        attribute: 'Атрибуты объекта',
        name: 'Название',
        forceShow: ''
    },
    headerStyles
}) => {

    return (
        <div 
            style={{
                display: 'flex',
                // width: '100%',
                padding: '0px 10px 10px 10px',
                gap: 10,
                lineHeight: '22px',
            }}
        >
            {!isSingle && (
                <div
                    style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 24,
                        ...headerStyles?.wrapper
                    }}
                >
                    <ECIconView 
                        icon="DragOutlined" 
                        style={{ fontSize: 20 }}  
                    />
                </div>)}
            {showForm.map(item => {
                return (
                    <div 
                        key={item}
                        style={{ 
                            width: `${100 / (showForm.length + 1)}%`,
                            ...headerStyles?.item
                        }}
                    >
                        {headerLabels?.[item]}
                    </div>
                )
            })}
            <div 
                style={{ 
                    width: `${100 / (showForm.length + 1)}%`,
                    ...headerStyles?.item
                }}
            >
                {headerLabels?.name}
            </div>
            <div 
                style={{ 
                    width: 44,
                    ...headerStyles?.item
                }}
            >
                {headerLabels?.forceShow}
            </div>
        </div>
    )
}