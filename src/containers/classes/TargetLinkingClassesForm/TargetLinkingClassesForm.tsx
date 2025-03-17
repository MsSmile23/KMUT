import { ClassesCascader } from '@entities/classes/ClassesCascader/ClassesCascader'
import { useTheme } from '@shared/hooks/useTheme'
import { selectAccount, useAccountStore } from '@shared/stores/accounts'
import { ECIconView } from '@shared/ui/ECUIKit/common/ECIconView/ECIconView'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'
import { Button, Form } from 'antd'
import { FC, useMemo } from 'react'

export interface ITargetLinkingClassesForm {
    target: number[]
    linking: number[]
}
export const TargetLinkingClassesForm: FC<{
    classes: ITargetLinkingClassesForm[]
    getFormValues?: (values: ITargetLinkingClassesForm[]) => void
    isSingle?: boolean
    withoutLinking?: boolean
    labels?: {
        target?: string
        linking?: string
    }
    styles?: {
        button?: React.CSSProperties
        formItem?: React.CSSProperties
        targetCascader?: React.CSSProperties
        linkingCascader?: React.CSSProperties
    }
}> = ({ classes, getFormValues, styles, isSingle, labels, withoutLinking }) => {
    const [form] = Form.useForm()
    const theme = useTheme()
    const accountData = useAccountStore(selectAccount)
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode

    const textColor = useMemo(() => {
        return createColorForTheme(theme?.sideBar?.textColor, theme?.colors, themeMode)
    }, [theme, themeMode])

    return (
        <div
            style={{
                height: '100%',
                width: '100%',
                maxHeight: '70vh',
            }}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{ classes }}
                onValuesChange={(_value, values) => {
                    getFormValues(values)
                }}
            >
                <Form.List name="classes">
                    {(fields, { add, remove }, { errors }) => (
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px',
                            }}
                        >
                            {fields.map((field, index) => {
                                return (
                                    <div
                                        key={`group-${field.key}`}
                                        style={{
                                            position: 'relative',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '12px',
                                            padding: 10,
                                            border: '1px solid #d9d9d9',
                                            ...styles.formItem,
                                        }}
                                    >
                                        {fields.length > 1 && (
                                            <div
                                                onClick={() => {
                                                    remove(field.name)
                                                }}
                                                style={{
                                                    position: 'absolute',
                                                    right: 5,
                                                    top: 0,
                                                    zIndex: 1000,
                                                }}
                                            >
                                                <ECIconView
                                                    icon="CloseOutlined"
                                                    style={{
                                                        cursor: 'pointer',
                                                        fontSize: 12,
                                                    }}
                                                />
                                            </div>
                                        )}
                                        <Form.Item
                                            key={`${field.key}-target-${index}`}
                                            label={
                                                <div style={{ color: textColor }}>
                                                    {labels?.target || 'Целевые классы'}
                                                </div>
                                            }
                                            name={[field.name, 'target']}
                                            style={{
                                                marginBottom: 0,
                                                ...styles.targetCascader,
                                            }}
                                        >
                                            <ClassesCascader />
                                        </Form.Item>
                                        {!withoutLinking && (
                                            <Form.Item
                                                key={`${field.key}-linking-${index}`}
                                                label={
                                                    <div style={{ color: textColor }}>
                                                        {labels?.linking || 'Связующие классы'}
                                                    </div>
                                                }
                                                name={[field.name, 'linking']}
                                                style={{
                                                    marginBottom: 12,
                                                    ...styles.targetCascader,
                                                }}
                                            >
                                                <ClassesCascader />
                                            </Form.Item>
                                        )}
                                    </div>
                                )
                            })}
                            {!isSingle && (
                                <Form.Item
                                    style={{
                                        marginBottom: 0,
                                    }}
                                >
                                    <Button
                                        onClick={() =>
                                            add({
                                                target: [],
                                                linking: [],
                                            })}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            background: 'while',
                                            color: 'black',
                                            ...styles.button,
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
    )
}