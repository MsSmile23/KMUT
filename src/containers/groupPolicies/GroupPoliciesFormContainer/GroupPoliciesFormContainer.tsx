import { FC, useEffect, useState } from 'react'
import RulesMenu from '../RulesMenu/RulesMenu'
import { CustomTab } from '@shared/ui/CustomTabs/components/CustomTab'
import { Card, Input, message } from 'antd'
import { selectGroupPolicies, useGroupPoliciesStore } from '@shared/stores/groupPolicies/useGroupPoliciesStore'
import { useNavigate, useParams } from 'react-router-dom'
import { IGroupPolicy } from '@shared/types/group-policies'
import { ButtonsFormRow } from '@shared/ui/buttons/ButtonsFormRow/ButtonsFormRow'
import { formatMenuToFlatList, formatValueToMenu, createIcon } from './utils'
import { selectClassByIndex, useClassesStore } from '@shared/stores/classes'
import { ITargetBlockItem } from '../types/types'
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { getURL } from '@shared/utils/nav'
import { initialValues, tabsContent } from './data'
import { useForm } from 'antd/es/form/Form'
import { Form } from 'antd/lib'
import { CheckBox } from '@shared/ui/forms'

interface IGroupPoliciesFormContainerProps {
    id?: string
}

const GroupPoliciesFormContainer: FC<IGroupPoliciesFormContainerProps> = ({ id }) => {
    const idParams = useParams<{ id: string } | null>()
    const ruleId = id ?? idParams.id
    const navigate = useNavigate()
    const [ form ] = useForm()

    const getClassByIndex = useClassesStore(selectClassByIndex)
    const groupPolicies = useGroupPoliciesStore(selectGroupPolicies)
    const { createGroupPolicy, updateGroupPolicyById } = useGroupPoliciesStore()

    const [ data, setData ] = useState<IGroupPolicy | undefined>(undefined)
    const [ activeTab, setActiveTab ] = useState<string>('0')
    const [ stateForm, setStateForm ] = useState<typeof initialValues>(initialValues)
    const [ groupPolicyRules, setGroupPolicyRules ] = useState<ITargetBlockItem[]>([])   // Состояние для правил

    const [childrenKey, setChildrenKey] = useState<number>(1)    // Ключи для подпунктов меню
    const [loading, setLoading] = useState<boolean>(false)

    // Отмена изменений
    const handleUndoChangesButton = () => {
        form.setFieldsValue({
            ruleName: data?.name,
            super_admin: data?.super_admin
        })
        setStateForm(form.getFieldsValue())

        if (data?.rules) {
            const { formatValue, localChildrenKey } = formatValueToMenu(
                data.rules, getClassByIndex, 1, createIcon
            )

            setGroupPolicyRules(formatValue)
            setChildrenKey(localChildrenKey)
        } else {
            setGroupPolicyRules([])
            setChildrenKey(1)
        }
    }

    // Сбросить все значения
    const handleCancelButton = () => {
        form.resetFields()
        setStateForm(initialValues)
        setGroupPolicyRules([])
    }

    // Функция сохранения правила
    const saveRule = async () => {
        const values = await form.validateFields()

        setLoading(true)
        // Форматируем структуру меню в плоский список
        const convertGroupPolicy = formatMenuToFlatList(groupPolicyRules)
        const payload = {
            name: values.ruleName,
            super_admin: values.super_admin,
            rules: convertGroupPolicy,
        }

        try {
            let response

            if (ruleId) {
                response = await updateGroupPolicyById(+ruleId, payload)
            } else {
                response = await createGroupPolicy(payload)
            }
    
            if (response.success) {
                message.success(ruleId ? 'Групповая политика успешно обновлена' : 'Групповая политика успешно создана')

                return response.data
            } else {
                message.error(response.error || 'Ошибка при сохранении групповой политики')
                
                return response.data
            }
        } catch (error) {
            message.error(error.message || 'Неизвестная ошибка')
        } finally {
            setLoading(false)
        }
    }

    // Сохранить и продолжить
    const handleSaveAndContinueButton = async () => {
        const data = await saveRule()

        if (data) {
            navigate(getURL(`${ROUTES.GROUP_POLICIES}/${ROUTES_COMMON.UPDATE}/${data.id}`, 'manager'))
        }
    }

    // Сохранить и перейти в список
    const handleSaveAndGoToListButton = async () => {
        const data = await saveRule()

        if (data) {
            navigate(getURL(`${ROUTES.GROUP_POLICIES}/${ROUTES_COMMON.LIST}`, 'manager'))
        }
    }

    // При редактировании получаем текущее правило по id
    useEffect(() => {
        if (ruleId) {
            const currentRule = groupPolicies.find(policy => `${policy.id}` === ruleId)

            setData(currentRule)
            form.setFieldsValue({
                ruleName: currentRule?.name,
                super_admin: currentRule?.super_admin
            })
            setStateForm(form.getFieldsValue())

            if (currentRule.rules) {
                // Форматируем значение из плоского списка в структуру меню
                const { formatValue, localChildrenKey } = formatValueToMenu(
                    currentRule?.rules, getClassByIndex, childrenKey, createIcon
                )

                setChildrenKey(localChildrenKey)
                setGroupPolicyRules(formatValue)
            }
        }

    }, [ruleId, groupPolicies])

    return (
        <div
            style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <div style={{ marginBottom: 10 }}>
                <ButtonsFormRow 
                    handleCancelButton={handleCancelButton}
                    handleSaveAndGoToListButton={handleSaveAndGoToListButton}
                    handleUndoChangesButton={handleUndoChangesButton}
                    handleSaveAndContinueButton={handleSaveAndContinueButton}
                    disabled={loading}
                />
            </div>
            <Form 
                form={form}
                layout="horizontal"
                style={{ width: 400, display: 'flex', gap: 20 }}
                initialValues={initialValues}
                onValuesChange={(value, values) => {
                    const key = Object.keys(value)[0]

                    setStateForm(prev => {
                        return {
                            ...prev,
                            [key]: values[key]
                        }
                    })
                }}
            >
                <Form.Item name="ruleName" rules={[{ required: true, message: 'Пожалуйста, введите название' }]} >
                    <Input 
                        type="text" 
                        placeholder="Введите название" 
                    />
                </Form.Item>
                <Form.Item 
                    name="super_admin" 
                    valuePropName="checked" 
                    style={{ margin: 0, marginRight: 'auto' }}
                >
                    <CheckBox>Суперадмин</CheckBox >
                </Form.Item>
            </Form>
            <div style={{ display: 'flex', alignSelf: 'flex-end', marginTop: '10px' }} >
                {tabsContent.map((tab, i) => (
                    <span onClick={() => setActiveTab(tab.key)} key={tab.key} >
                        <CustomTab
                            activeKey={activeTab}
                            currentKey={tab.key}
                            tabsLength={tabsContent.length - 1}
                            index={i}
                        >
                            {tab.title}
                        </CustomTab>
                    </span>
                ))}
            </div>
            <Card>
                {activeTab === '0' && stateForm.super_admin === false &&
                    <RulesMenu 
                        groupPolicyRules={groupPolicyRules} 
                        setGroupPolicyRules={setGroupPolicyRules} 
                        setChildrenKey={setChildrenKey}
                    />}
                {/* {activeTab === '1' &&
                <Form.Item name={['accounts']} >
                    accounts
                </Form.Item >} */}
            </Card>
        </div>
    )
}

export default GroupPoliciesFormContainer