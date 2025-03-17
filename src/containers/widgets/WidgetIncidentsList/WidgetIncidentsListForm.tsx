/* eslint-disable react/jsx-max-depth */
import { FC, useEffect, useState } from 'react'
import { Button, Form } from 'antd'
import { ECIconView } from '@shared/ui/ECUIKit/common/ECIconView/ECIconView'
import { ClassesCascader } from '@entities/classes/ClassesCascader/ClassesCascader'
import { IOptionsList } from '@shared/ui/charts/highcharts/types'
import { PACKAGE_AREA } from '@shared/config/entities/package'
import { selectClassByIndex, selectClasses, useClassesStore } from '@shared/stores/classes'
import { selectObjectByIndex, useObjectsStore } from '@shared/stores/objects'
import { useForm, useWatch } from 'antd/es/form/Form'
import { TWidgetFormSettings } from '@shared/types/widgets'
import { TableViewForm } from '@shared/ui/tables'
import { CheckBox } from '@shared/ui/forms'
import { incidentColumns } from '@entities/incidents/IncidentTableServerFiltration/prepare'

interface TargetAndLikingClasses {
    target: number[]
    linking: number[]
}

export interface IWidgetIncidentsListFormProps {
    classes: TargetAndLikingClasses[]
    tableRowCount: number
    hide_attr: boolean
    editColumns: object
}

interface IOption {
    label: string
    value: number
}

const WidgetIncidentsListForm: FC<TWidgetFormSettings<IWidgetIncidentsListFormProps>> = (props) => {
    const { settings, onChangeForm } = props
    const { widget } = settings
    const [form] = useForm()
    const { classes, tableRowCount, hide_attr, editColumns } = widget ?? {}

    const initialFormValues: IWidgetIncidentsListFormProps = {
        classes: classes ?? [{
            target: [],
            linking: []
        }],
        tableRowCount: tableRowCount ?? null,
        hide_attr: hide_attr ?? false,
        editColumns: editColumns ?? null
    }

    const formChange = (v, vs) => {
        onChangeForm(vs)

        return v
    }

    return (
        <div>
            <Form
                form={form}
                layout="vertical"
                initialValues={initialFormValues}
                onValuesChange={formChange}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        // border: '1px solid #d9d9d9',
                        gap: 10,
                        padding: 10
                    }}
                >
                    <b>Настройки связанных классов</b>
                    <Form.List
                        name="classes"
                    >
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
                                                border: '1px solid #d9d9d9'
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
                                                            fontSize: 12
                                                        }}
                                                    />
                                                </div>
                                            )}
                                            <Form.Item
                                                key={`${field.key}-target-${index}`}
                                                label="Целевые классы"
                                                name={[field.name, 'target']}
                                                style={{
                                                    marginBottom: 0,
                                                }}
                                            >
                                                <ClassesCascader />
                                            </Form.Item>
                                            <Form.Item
                                                key={`${field.key}-linking-${index}`}
                                                label="Связующие классы"
                                                name={[field.name, 'linking']}
                                                style={{
                                                    marginBottom: 12,
                                                }}
                                            >
                                                <ClassesCascader />
                                            </Form.Item>
                                        </div>
                                    )
                                })}
                                <Form.Item
                                    style={{
                                        marginBottom: 0
                                    }}
                                >
                                    <Button
                                        onClick={() => add({
                                            target: [],
                                            linking: [],
                                        })}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            background: 'while',
                                            color: 'black',
                                        }}
                                    >
                                        <ECIconView icon="PlusCircleOutlined" />
                                    </Button>
                                    <Form.ErrorList errors={errors} />
                                </Form.Item>
                            </div>
                        )}
                    </Form.List>
                    <TableViewForm columns={incidentColumns} />
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <Form.Item
                            style={{ margin: 0, marginRight: 10 }}
                            key="hide_attr"
                            name="hide_attr"
                            valuePropName="checked"
                        >
                            <CheckBox />
                        </Form.Item>
                        <p>Не показывать Здание, Услуга, Сервис</p>
                    </div>
                </div>
            </Form >
        </div >
    )
}

export default WidgetIncidentsListForm