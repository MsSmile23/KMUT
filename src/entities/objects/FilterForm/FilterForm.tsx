/* eslint-disable max-len */
import { Collapse, Form } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { FC, PropsWithChildren, useState } from 'react'
import { Buttons } from '@shared/ui/buttons'
import { ClassesCascader } from '@entities/classes/ClassesCascader/ClassesCascader'
import { useClassesOptions } from './hooks/useClassesOptions'
import { IExtendedFilterFormProps, IFilterFormProps } from './types'
import { useListFromChosenClasses } from './hooks/useListFromChosenClasses.tsx'
import { useInitialFormValues } from './hooks/useInitialFormValues'
import { useStateOptions } from './hooks/useStateOptions'
import { ECSelect } from '@shared/ui/forms'
import { useRelationList } from './hooks/useRelationList.tsx'
import { defaultFormValues, relationTypesList } from './utils.ts'
import OAttrFormField from '@entities/object-attributes/OAttrFormField/OAttrFormField.tsx'
import { selectAttribute, useAttributesStore } from '@shared/stores/attributes/index.ts'
import { CustomAccountTemplatesToolbar, TLoadingStatus } from '@entities/account/CustomAccountTemplatesToolbar/CustomAccountTemplatesToolbar.tsx'

export const FilterForm: FC<IExtendedFilterFormProps> = (props) => {
    const { 
        getFormState, 
        settings,
        widgetId
    } = props
    
    const [ form ] = useForm()
    // const accountData = useAccountStore(selectAccount)
    // const forceUpdateAccount = useAccountStore((st) => st.forceUpdate)

    const getAttrById = useAttributesStore(selectAttribute)
    const { initialFormValues } = useInitialFormValues(settings)
    
    const { 
        abstractClassesList, 
        stereotypeClassesList 
    } = useClassesOptions()
    
    const { 
        objectOptionsList,
        attributeOptionsList,
    } = useListFromChosenClasses({
        classFilter: form.getFieldValue('classFilter'),
    })
    
    const { 
        stateList, 
        stereoList, 
        stateMachineList,
    } = useStateOptions({
        stateMachineIds: form.getFieldValue(['stateFilter', 'stateMachineIds'])
    })

    const {
        relationList,
        relationStereoList,
        relatedObjectList
    } = useRelationList({
        relationSettings: form.getFieldValue(['relationFilter']),
        objectSettings: form.getFieldValue(['objectFilter'])
    })

    const changeForm = (v: Partial<IFilterFormProps>, vs: IFilterFormProps) => {
        if (getFormState) {
            getFormState(vs)
        }
    }

    const filterOption = (input, option, ) => {
        return (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
    }

    // console.log('form', form.getFieldsValue())
    const [status, setStatus] = useState<TLoadingStatus>('idle')

    const setTemplate = (data: IFilterFormProps) => {
        form.setFieldsValue(data)
    }

    return (
        <Form
            form={form}
            onValuesChange={changeForm}
            initialValues={initialFormValues}
            style={{
                width: '100%',
                height: '100%'
            }}
            layout="vertical"
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexDirection: 'row',
                }}
            >
                <div
                    style={{
                        fontWeight: 'bold'
                    }}
                >
                    Сохранение и выбор набора настроек 
                </div>
                <Buttons.ButtonClear 
                    customText="Очистить поля"
                    onClick={() => {
                        form.setFieldsValue(defaultFormValues)
                    }}
                    style={{
                        background: 'rgb(22, 119, 255)',
                    }}
                >
                    Очистить поля 
                </Buttons.ButtonClear >
            </div>
            <div
                style={{
                    padding: '10px 0px'
                }}
            >
                <CustomAccountTemplatesToolbar
                    accountDataTemplateSettings={{
                        widgetId: widgetId
                    }}
                    accountTemplateData={form.getFieldsValue()}
                    setAccountData={setTemplate}
                    setLoadingStatus={setStatus}
                    loadingStatus={status}
                    layoutSettings={{
                        buttonSize: 'large',
                    }}
                    isAbleToSave={true}
                    // Куда сохранять настройки - в акк или конфиг (по дефолту)
                    source="account" // "config"
                />
            </div>
            <FilterGroup title="Классы">
                <Form.Item
                    label="Список классов"
                    name={['classFilter', 'classIds']}
                    style={{ 
                        flex: 1,
                        marginBottom: 0,
                    }}
                >
                    <ClassesCascader />
                </Form.Item>
                <Form.Item
                    label="Стереотипы классов"
                    name={['classFilter', 'stereotypeClassIds']}
                    style={{ 
                        flex: 1,
                        marginBottom: 0,
                    }}
                >
                    <ECSelect 
                        placeholder="Выберите стереотипы классов"
                        filterOption={filterOption}
                        options={stereotypeClassesList}
                        mode="multiple"
                        maxTagCount="responsive"
                    />
                </Form.Item>
                <Form.Item
                    label="Абстрактные классы"
                    name={['classFilter', 'abstractClassIds']}
                    style={{ 
                        flex: 1,
                        marginBottom: 0,
                    }}
                >
                    <ECSelect 
                        placeholder="Выберите абстрактные классы"
                        filterOption={filterOption}
                        options={abstractClassesList}
                        mode="multiple"
                        maxTagCount="responsive"
                    />
                </Form.Item>
            </FilterGroup>
            <FilterGroup title="Объекты">
                <Form.Item
                    // label="Объекты"
                    name={['objectFilter', 'objectIds']}
                    style={{ 
                        width: 'calc((100% - 20px) / 3)',
                        marginBottom: 0,
                    }}
                >
                    <ECSelect 
                        placeholder="Выберите объекты"
                        filterOption={filterOption}
                        options={objectOptionsList}
                        mode="multiple"
                        maxTagCount="responsive"
                        listHeight={300}
                        popupMatchSelectWidth={true}
                    />
                </Form.Item>
            </FilterGroup>
            <FilterGroup title="Стейты">
                <Form.Item
                    label="Стереотипы состояний"
                    name={['stateFilter', 'stateStereotypeIds']}
                    style={{ 
                        width: 'calc((100% - 4 * 10px) / 4)',
                        // flex: 1,
                        marginBottom: 0,
                    }}
                >
                    <ECSelect 
                        placeholder="Выберите стереотипы состояния"
                        filterOption={filterOption}
                        options={stereoList}
                        mode="multiple"
                        maxTagCount="responsive"
                        listHeight={300}
                    />
                </Form.Item>
                <Form.Item
                    label="Тип сущности"
                    name={['stateFilter', 'stateType']}
                    style={{ 
                        width: 'calc((100% - 4 * 10px) / 4)',
                        // flex: 1,
                        marginBottom: 0,
                    }}
                >
                    <ECSelect 
                        // placeholder="Выберите тип сущности"
                        filterOption={filterOption}
                        options={[{
                            label: 'Объекты',
                            value: 'objects'
                        }, {
                            label: 'Атрибуты',
                            value: 'object_attributes'
                        }]}
                        allowClear={false}
                        showSearch={false}
                    />
                </Form.Item>
                <Form.Item
                    label="Стейтмашины"
                    name={['stateFilter', 'stateMachineIds']}
                    style={{ 
                        width: 'calc((100% - 4 * 10px) / 4)',
                        // flex: 1,
                        marginBottom: 0,
                    }}
                >
                    <ECSelect 
                        placeholder="Выберите стейтмашину"
                        filterOption={filterOption}
                        options={stateMachineList}
                        mode="multiple"
                        maxTagCount="responsive"
                        listHeight={300}
                        popupMatchSelectWidth={500}
                    />
                </Form.Item>
                <Form.Item
                    label="Состояния"
                    name={['stateFilter', 'stateIds']}
                    style={{ 
                        width: 'calc((100% - 4 * 10px) / 4)',
                        // flex: 1,
                        marginBottom: 0,
                    }}
                >
                    <ECSelect 
                        placeholder="Выберите тип состояния"
                        filterOption={filterOption}
                        options={stateList}
                        mode="multiple"
                        maxTagCount="responsive"
                        listHeight={300}
                        popupMatchSelectWidth={500}
                    />
                </Form.Item>
            </FilterGroup>
            <FilterGroup title="Атрибуты">
                <Form.List
                    name="attrFilter"
                >
                    {(fields, { add, remove }, { errors }) => {
                        
                        
                        return (
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    gap: 10,
                                    width: '100%'
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        gap: 10
                                    }}
                                >
                                    {fields.map((field, idx) => {
                                        const currentField = form.getFieldValue(['attrFilter'])[idx] as IFilterFormProps['attrFilter'][number]
                                        const currentAttr = getAttrById(currentField?.currentAttr)

                                        // console.log('currentField attr', idx, currentField)
                                        // console.log('currentAttr', idx, currentAttr)

                                        return (
                                            <div
                                                key={field.key}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 10
                                                }}
                                            >
                                                <Form.Item
                                                    name={[field.name, 'currentAttr']}
                                                    style={{ 
                                                        width: 'calc((100% - 20px) / 3)',
                                                        marginBottom: 0,
                                                    }}
                                                >
                                                    <ECSelect 
                                                        placeholder="Выберите атрибут"
                                                        filterOption={filterOption}
                                                        options={attributeOptionsList}
                                                        listHeight={300}
                                                        popupMatchSelectWidth={true}                    
                                                    />
                                                </Form.Item>
                                                {currentField?.currentAttr && (
                                                    <Form.Item 
                                                        style={{ 
                                                            width: 'calc((100% - 20px) / 3)',
                                                            marginBottom: 0 
                                                        }}
                                                        name={[field.name, 'attrValue']}
                                                    >
                                                        <OAttrFormField 
                                                            attribute={currentAttr}
                                                            dataType={currentAttr?.data_type.inner_type}
                                                            style={{
                                                                flex: 1
                                                            }}
                                                            onChange={(e) => {
                                                                switch (true) {
                                                                    case e.target.type === 'checkbox': {
                                                                        form.setFieldValue([field.name, 'attrValue'], e.target.checked)
                                                                        break
                                                                    }
                                                                    case ['number', 'string', 'double', 'integer'].includes(e.target.type): {
                                                                        form.setFieldValue([field.name, 'attrValue'], e.target.value)
                                                                    }
                                                                }
                                                            }}
                                                        />
                                                    </Form.Item>
                                                )}
                                                {fields.length > 1 && (
                                                    <Form.Item 
                                                        style={{ 
                                                            width: 'calc((100% - 20px) / 3)',
                                                            marginBottom: 0 
                                                        }}
                                                    >
                                                        <Buttons.ButtonDeleteRow
                                                            onClick={() => remove(field.name)}
                                                            style={{
                                                                display: 'flex',
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                background: 'white',
                                                                color: '#d9d9d9',
                                                                border: '1px solid #d9d9d9', 
                                                            }}
                                                        />
                                                        <Form.ErrorList errors={errors} />
                                                    </Form.Item>
                                                )}

                                            </div>
                                        )
                                    })}
                                </div>
                                <Form.Item style={{ marginBottom: 0 }}>
                                    <Buttons.ButtonAddRow
                                        onClick={() => add({
                                            currentAttr: undefined,
                                            valueType: undefined
                                        })}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            background: 'white',
                                            color: '#d9d9d9',
                                            border: '1px solid #d9d9d9', 
                                        }}
                                    />
                                    <Form.ErrorList errors={errors} />
                                </Form.Item>
                            </div>
                        )
                    }}
                </Form.List>
            </FilterGroup>
            <FilterGroup title="Связи">
                <Form.List
                    name="relationFilter"
                >
                    {(fields, { add, remove }, { errors }) => {                
                        return (
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    gap: 10,
                                    width: '100%'
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        gap: 10
                                    }}
                                >
                                    {fields.map((field, idx) => {
                                        const currentField = form.getFieldValue(['relationFilter'])[idx] as IFilterFormProps['relationFilter'][number]

                                        return (
                                            <div
                                                key={field.key}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 10
                                                }}
                                            >
                                                <Form.Item
                                                    name={[field.name, 'type']}
                                                    style={{ 
                                                        width: `calc((100% - 4 * 10px - ${fields.length > 1 ? '34px' : '0px'}) / 4)`,
                                                        // flex: 1,
                                                        marginBottom: 0,
                                                    }}
                                                >
                                                    <ECSelect 
                                                        placeholder="Выберите тип связи"
                                                        filterOption={filterOption}
                                                        options={relationTypesList}
                                                        listHeight={300}
                                                    />
                                                </Form.Item>
                                                <Form.Item
                                                    name={[field.name, 'stereoId']}
                                                    style={{ 
                                                        width: `calc((100% - 4 * 10px - ${fields.length > 1 ? '34px' : '0px'}) / 4)`,
                                                        marginBottom: 0,
                                                    }}
                                                >
                                                    <ECSelect 
                                                        placeholder="Выберите стереотип связи"
                                                        filterOption={filterOption}
                                                        options={relationStereoList[idx]}
                                                        listHeight={300}
                                                        popupMatchSelectWidth={400}
                                                    />
                                                </Form.Item>
                                                <Form.Item
                                                    name={[field.name, 'id']}
                                                    style={{ 
                                                        width: `calc((100% - 4 * 10px - ${fields.length > 1 ? '34px' : '0px'}) / 4)`,
                                                        marginBottom: 0,
                                                    }}
                                                >
                                                    <ECSelect 
                                                        placeholder="Выберите связь"
                                                        filterOption={filterOption}
                                                        options={relationList[idx]}
                                                        popupMatchSelectWidth={400}
                                                        listHeight={300}
                                                    />
                                                </Form.Item>
                                                <Form.Item
                                                    name={[field.name, 'objectIds']}
                                                    style={{ 
                                                        width: `calc((100% - 4 * 10px - ${fields.length > 1 ? '34px' : '0px'}) / 4)`,
                                                        marginBottom: 0,
                                                    }}
                                                >
                                                    <ECSelect 
                                                        placeholder={currentField.id 
                                                            ? 'Выберите объекты'
                                                            : 'Не выбрана связь'
                                                        }
                                                        filterOption={filterOption}
                                                        options={relatedObjectList[idx]}
                                                        mode="multiple"
                                                        maxTagCount="responsive"
                                                        listHeight={300}
                                                        popupMatchSelectWidth={400}
                                                    />
                                                </Form.Item>                                                
                                                {fields.length > 1 && (
                                                    <Form.Item style={{ marginBottom: 0 }}>
                                                        <Buttons.ButtonDeleteRow
                                                            onClick={() => remove(field.name)}
                                                            style={{
                                                                display: 'flex',
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                background: 'white',
                                                                color: '#d9d9d9',
                                                                border: '1px solid #d9d9d9', 
                                                            }}
                                                        />
                                                        <Form.ErrorList errors={errors} />
                                                    </Form.Item>
                                                )}
                                            </div>
                                        )})}
                                </div>
                                <Form.Item style={{ marginBottom: 0 }}>
                                    <Buttons.ButtonAddRow
                                        onClick={() => add({
                                            type: undefined,
                                            id: undefined,
                                            objectIds: []
                                        })}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            background: 'white',
                                            color: '#d9d9d9',
                                            border: '1px solid #d9d9d9', 
                                        }}
                                    />
                                    <Form.ErrorList errors={errors} />
                                </Form.Item>
                            </div>
                        )
                    }}
                </Form.List>
            </FilterGroup>
        </Form>
    )
}

const FilterGroup: FC<PropsWithChildren<{ title: string}>> = ({ children, title }) => {
    return (
        <Collapse
            defaultActiveKey={['1']}
            style={{ 
                marginBottom: '10px',
            }}
            items={[
                {
                    key: '1',
                    label: title,
                    children: (
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                            }}
                        >
                            {children}
                        </div>

                    )
                },
            ]}
        />
    )
}