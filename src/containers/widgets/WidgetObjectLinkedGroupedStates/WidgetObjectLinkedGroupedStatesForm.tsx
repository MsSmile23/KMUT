import { Form } from 'antd';
import { FC, useMemo } from 'react'
import { IWidgetObjectLinkedGroupedStatesForm } from './types';
import { ClassesCascader } from '@entities/classes/ClassesCascader/ClassesCascader';
import { forumThemeConfig } from '@app/themes/forumTheme/forumThemeConfig';
import { Input } from '@shared/ui/forms';
import { useForm } from 'antd/es/form/Form';

/**
 * Форма создания виджета для отображения истории статусов
 * 
 * @param onChangeForm - функция для обновления пропсов виджета (самого виджета или превью виджета)
 * @param settings - объект с настройками виджета
 * @param settings.widget.objectId - id объекта, на основе которого формируются данные (например, устройство)
 * @param settings.widget - см. interface IStateHistoryProps
 */
const WidgetObjectLinkedGroupedStatesForm: FC<IWidgetObjectLinkedGroupedStatesForm> = ({ onChangeForm, settings }) => {
    const changeForm = (_v: any, values: any) => {
        onChangeForm(form.getFieldsValue())
    }

    const [form] = useForm()
    // console.log('settings.widget', settings.widget)
    const initialValues = useMemo(() => {
        const values = settings?.widget?.classesIds 
            ? ({ 
                ...settings?.widget?.classesIds,
            }) : ({
                parents: forumThemeConfig.classesGroups.favor,
                nodes: forumThemeConfig.classesGroups.services,
                leafs: forumThemeConfig.classesGroups.devices,
            })

        return {
            ...values,
            yAxisStep: settings?.widget?.yAxisStep
        }
    }, [])

    return (
        <Form
            form={form}
            layout="vertical" 
            onValuesChange={changeForm} 
            initialValues={initialValues}
        >
            <Form.Item name="parents" label="Связующие классы (через них ищем)">
                <ClassesCascader />
            </Form.Item>
            <Form.Item name="nodes" label="Классы группировки (через них ищем и по ним группируем)">
                <ClassesCascader />
            </Form.Item>
            <Form.Item name="leafs" label="Целевые классы (считаем)">
                <ClassesCascader />
            </Form.Item>
            
            <Form.Item label="Дополнительные настройки графика">
                <div
                    style={{
                        border: '1px solid #d9d9d9',
                        padding: 10
                    }}
                >
                    <Form.Item name="yAxisStep" label="Шаг горизонтальной оси">
                        <Input
                            type="number"
                            min={1}
                            step={1}
                            style={{
                                width: '200px',    
                                marginBottom: '10px'
                            }}
                        />
                    </Form.Item>
                </div>
            </Form.Item>
        </Form>
    )
}

export default WidgetObjectLinkedGroupedStatesForm