import { useClassesStore } from '@shared/stores/classes'
import ECTabs from '@shared/ui/ECUIKit/tabs/ECTabs'
import { ECSelect } from '@shared/ui/forms'
import { Col, Form, Row } from 'antd/lib'
import { useEffect, useMemo, useState } from 'react'
import RootClassLinkForm from './RootClassLinkForm'
import { getReportsMeta } from '@shared/api/Reports/Models/getReportsMeta/getReportsMeta'

const getClassesByOperationsMnemo = (mnemo) => {
    const allClasses = useClassesStore.getState().store.data

    return allClasses.filter(cls => {
        const operationsMnemo = cls.operations.map(operation => operation.mnemo)

        return operationsMnemo?.includes(mnemo)
    })
}

const getAttributesByVisibilityAndClassId = (classId) => {

    const classAttributes = useClassesStore?.getState().getClassById(classId)?.attributes

    if (classId) {
        return classAttributes?.filter(attr => attr.visibility === 'public' || attr.visibility === 'private')
    }

    return []
}

const ROUND_OPTIONS = [
    { value: 1, label: '1 мин' },
    { value: 5, label: '5 мин' },
    { value: 10, label: '10 мин' },
    { value: 15, label: '15 мин' },
    { value: 30, label: '30 мин' },
    { value: 60, label: '1 час' },
]

const ReportFieldsConstructorForm = ({ form, setUpLinksItems, setDownLinksItems, upLinksItems, downLinksItems }) => {

    const [activeTab, setActiveTab] = useState('up-link')
    const selectedRootClass = Form.useWatch('root_class', form)

    const CLASSES_OPTIONS = useMemo(() => {
        return getClassesByOperationsMnemo('reportable_class_root')
            ?.map(cls => ({ value: cls.id, label: cls.name }))
    }, [])

    const ATTRIBUTES_OPTIONS = useMemo(() => {
        return getAttributesByVisibilityAndClassId(selectedRootClass)
            ?.map(attr => ({ value: attr.id, label: attr.name }))
    }, [selectedRootClass])

    const [agregationOptions, setAgregationOptions] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            const metaData = await getReportsMeta()

            if (metaData?.data) {
                setAgregationOptions(Object.values(metaData?.data?.attribute_history_options)
                    .map(item => ({
                        value: item.mnemo,
                        label: item.label,
                    })))
            }
        };

        fetchData();
    }, []);

    return (
        <Form
            form={form}
            layout="vertical"
            style={{ width: '1000px' }}
        >
            {/* Блок 1: Класс объектов отчёта */}
            <Row gutter={32} justify="start">
                <Col>
                    <Form.Item
                        label="Класс объекта отчёта"
                        name="root_class"
                    >
                        <ECSelect
                            style={{ width: '200px' }}
                            size="small"
                            options={CLASSES_OPTIONS}
                            placeholder="Выберите класс"
                            onChange={() => {
                                setUpLinksItems([])
                                setDownLinksItems([])
                                form.setFieldValue('root_attributes', [])
                            }}
                        />
                    </Form.Item>
                </Col>
                <Col>
                    <Form.Item
                        name="root_attributes"
                        label={' '}
                    >
                        <ECSelect
                            mode="multiple"
                            maxTagCount="responsive"
                            size="small"
                            style={{ width: '400px' }}
                            options={ATTRIBUTES_OPTIONS}
                            placeholder="Выберите атрибуты"
                        />
                    </Form.Item>
                </Col>
            </Row>

            {/* Блок 2: Табы связей и настройки */}
            <Row>
                <ECTabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={[
                        {
                            key: 'up-link',
                            label: 'Связи вверх',
                            children: (
                                <div style={{ height: '400px' }}>
                                    <RootClassLinkForm
                                        root={selectedRootClass}
                                        direction="parents"
                                        items={upLinksItems}
                                        setItems={setUpLinksItems}
                                        agregationOptions={agregationOptions}
                                    />
                                </div>
                            )
                        },
                        {
                            key: 'down-link',
                            label: 'Связи вниз',
                            children: (
                                <div style={{ height: '400px' }}>
                                    <RootClassLinkForm
                                        root={selectedRootClass}
                                        direction="childs"
                                        items={downLinksItems}
                                        setItems={setDownLinksItems}
                                        agregationOptions={agregationOptions}
                                    />
                                </div>
                            )
                        },
                        {
                            key: 'settings',
                            label: 'Настройки',
                            children: (
                                <div style={{ height: '400px', paddingTop: 20 }}>
                                    <Form.Item
                                        name="timeRounding"
                                        label="Округление времени"
                                    >
                                        <ECSelect
                                            size="small"
                                            style={{ width: '200px' }}
                                            placeholder="Выберите округление"
                                            options={ROUND_OPTIONS}
                                        />
                                    </Form.Item>
                                </div>

                            )
                        },
                    ]}
                    renderTabsOnLoad={true}
                />
            </Row>

        </Form>
    )
}

export default ReportFieldsConstructorForm