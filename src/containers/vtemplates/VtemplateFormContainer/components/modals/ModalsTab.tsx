import { Checkbox, Form, Input, Space } from 'antd'
import { FC, useEffect, useState } from 'react'
import { ButtonSettings } from '@shared/ui/buttons'
import { initialDataModalTabtype, TInitialDataSettingVTType } from '../../types/types'
import { Select } from '@shared/ui/forms'
import { tabTypesList } from '../../data'
import { ClassesCascader } from '@entities/classes/ClassesCascader/ClassesCascader'
import { selectObjects, useObjectsStore } from '@shared/stores/objects'
import { findChildObjectsWithPaths } from '@shared/utils/objects.ts'
import ECTemplatedTextInput from '@shared/ui/ECUIKit/ECTemplatedText/ECTemplatedTextInput/ECTemplatedTextInput'
import { useGetObjects } from '@shared/hooks/useGetObjects'

interface ModalsTab {
    value: initialDataModalTabtype
    save: (data: initialDataModalTabtype) => void
    baseSettings?: TInitialDataSettingVTType,
    isMobile?: boolean,
}

const ModalsTab: FC<ModalsTab> = (props): JSX.Element => {
    const { value, save, baseSettings, isMobile } = props
    const [form] = Form.useForm()
    // const objects = useObjectsStore(selectObjects)
    const objects = useGetObjects()
    const objectsStore = useObjectsStore()

    const initialValues = {
        key: value?.key ?? '',
        name: value?.name ?? '',
        objectBinding: value?.objectBinding ?? undefined,
        enabledStatelable: value?.enabledStatelable ?? false,
        group_name: value?.group_name ?? '',
        type: value?.type ?? 'single',
        settings: {
            targetClasses: value?.settings?.targetClasses || [],
            connectingClasses: value?.settings?.connectingClasses || [],
        },
        objectGroupPreview: value?.objectGroupPreview || undefined,
        tabOutputMode: value?.tabOutputMode || 'individualTabs',
    }

    const [stateForm, setStateForm] = useState<initialDataModalTabtype>(initialValues)

    useEffect(() => {
        form.setFieldsValue({
            name: value.name || '',
            type: value?.type || 'single',
            targetClasses: value?.settings?.targetClasses || [],
            connectingClasses: value?.settings?.connectingClasses || [],
            objectBinding: value?.objectBinding || undefined,
            enabledStatelable: value?.enabledStatelable || false,
            group_name: value?.group_name || '',
            objectGroupPreview: value?.objectGroupPreview || undefined,
            tabOutputMode: value?.tabOutputMode || 'individualTabs',
        })
    }, [value])

    const onValuesChange = (value, onChangeForm) => {
        const key = Object.keys(value)[0]

        if (key === 'objectBinding' && onChangeForm[key] === undefined) {
            setStateForm((prev) => {
                return {
                    ...prev,
                    [key]: onChangeForm[key],
                    enabledStatelable: false,
                }
            })
            form.setFieldsValue({
                ...form,
                enabledStatelable: false,
            })
        } else if (key === 'type' && onChangeForm[key] !== 'single') {
            setStateForm((prev) => {
                return {
                    ...prev,
                    [key]: onChangeForm[key],
                    objectBinding: undefined,
                    enabledStatelable: false
                }
            })
            form.setFieldsValue({
                ...form,
                objectBinding: undefined,
                enabledStatelable: false
            })
        } else if (key === 'type' && onChangeForm[key] !== 'group') {
            setStateForm((prev) => {
                return {
                    ...prev,
                    [key]: onChangeForm[key],
                    group_name: '',
                    settings: {
                        targetClasses: [],
                        connectingClasses: [],
                    },
                    objectGroupPreview: undefined,
                    tabOutputMode: 'individualTabs'
                }
            })
            form.setFieldsValue({
                ...form,
                group_name: '',
                targetClasses: [],
                connectingClasses: [],
                objectGroupPreview: undefined,
                tabOutputMode: 'individualTabs'
            })
        } else if (key === 'targetClasses' || key === 'connectingClasses') {
            setStateForm((prev) => {
                return {
                    ...prev,
                    settings: {
                        ...prev.settings,
                        [key]: onChangeForm[key],
                    }
                }
            })
        } else {
            setStateForm((prev) => {
                return {
                    ...prev,
                    [key]: onChangeForm[key]
                }
            })
        }
    }

    const objectOptions = (objects || []).map(obj => ({
        label: obj.name,
        value: obj.id
    }))

    const onFinish = () => {
        save(stateForm)
    };

    const objectPreviewOptions = findChildObjectsWithPaths({
        currentObj: objectsStore?.getByIndex('id', baseSettings?.objectId),
        childClassIds: stateForm?.settings?.connectingClasses,
        targetClassIds: stateForm?.settings?.targetClasses,
    })?.objectsWithPath?.map((obj) => ({
        label: obj.name,
        value: obj.id
    })
    )

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: '50%' }}>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                onValuesChange={onValuesChange}
                initialValues={{
                    connectingClasses: stateForm.settings.connectingClasses,
                    targetClasses: stateForm.settings.targetClasses,
                }}
            >
                <Form.Item
                    name="name"
                    label="Название вкладки"
                    rules={[{ required: true, message: 'Поле обязательно для заполнения' }]}
                >
                    {/* <Input
                        placeholder="Введите название таба"
                    /> */}
                    <ECTemplatedTextInput 
                        classes={stateForm?.settings?.targetClasses.length > 0 ? stateForm?.settings?.targetClasses 
                            : baseSettings.classes} 
                        // text={stateForm.name}
                    />
                </Form.Item>

                {!isMobile && ( 
                    <>
                        <Form.Item
                            name="type"
                            label="Тип вкладки"
                            rules={[{ required: true, message: 'Поле обязательно для заполнения' }]}
                        >
                            <Select
                                placeholder="Выберите тип вкладки"
                                options={tabTypesList}
                            />
                        </Form.Item>

                        {stateForm?.type === 'single' &&
                        <Form.Item
                            name="objectBinding"
                            label="Привязка объекта"
                        >
                            <Select
                                placeholder="Выберите объект для привязки"
                                options={objectOptions}
                            />
                        </Form.Item>}

                        <Form.Item name="enabledStatelable" valuePropName="checked">
                            <Checkbox>
                                Отображать статус
                            </Checkbox>
                        </Form.Item>

                        {stateForm?.type === 'group' &&
                        <>
                            <Form.Item
                                name="group_name"
                                label="Название группы"
                                rules={[{ required: true, message: 'Поле обязательно для заполнения' }]}
                            >
                                <Input
                                    placeholder="Введите название группы"
                                />
                            </Form.Item>
                            <Form.Item
                                name="tabOutputMode"
                                label="Режим вывода вкладок"
                            >
                                <Select
                                    placeholder="Выберите режим"
                                    options={[
                                        { label: 'Отдельные вкладки', value: 'individualTabs' },
                                        { label: 'Выпадающий список', value: 'tabsList' },
                                    ]}
                                />
                            </Form.Item>
                            <Form.Item name="targetClasses" label="Целевые классы">
                                <ClassesCascader />
                            </Form.Item>
                            <Form.Item name="connectingClasses" label="Связующие классы">
                                <ClassesCascader />
                            </Form.Item>
                            <Form.Item
                                name="objectGroupPreview"
                                label="Объект для превью"
                            >
                                <Select
                                    placeholder="Выберите объект для превью"
                                    options={objectPreviewOptions}
                                />
                            </Form.Item>
                        </>}
                    </>)}

                <Form.Item>
                    <Space align="end" direction="horizontal">
                        <ButtonSettings
                            icon={false}
                            type="primary" htmlType="submit"
                        >
                            Применить
                        </ButtonSettings>
                    </Space>
                </Form.Item>
            </Form>
        </div>
    )
}

export default ModalsTab