/* eslint-disable react/jsx-max-depth */
import { selectClasses, useClassesStore } from '@shared/stores/classes'
import { Col, Divider, Row, Select, Switch } from 'antd'
import { useEffect, useState } from 'react';
import { TreeSettingsParameters } from './types';

interface ITreeSettingsFormProps {
    onChange?: (values: TreeSettingsParameters) => void;
    showTrackParentOptions?: boolean;
}

export const TreeSettingsForm = ({ onChange, showTrackParentOptions }: ITreeSettingsFormProps) => {
    const classes = useClassesStore(selectClasses);

    const [targetClassesIds, setTargetClassesIds] = useState<number[]>([]);
    const [groupingClassesIds, setGroupingClassesIds] = useState<number[]>([]);
    const [parentClassesIds, setParentClassesIds] = useState<number[]>([]);
    const [horizontalScroll, setHorizontalScroll] = useState(true);
    const [trackParentClass, setTrackParentClass] = useState(false);

    useEffect(() => {
        const parameters: TreeSettingsParameters = {
            groupingClassesIds,
            horizontalScroll,
            targetClassesIds,
        }

        if (showTrackParentOptions) {
            parameters.trackParentClass = trackParentClass;
        }

        if (trackParentClass) {
            parameters.parentClassesIds = parentClassesIds;
        }

        onChange?.(parameters);
    }, [
        targetClassesIds,
        groupingClassesIds,
        horizontalScroll,
        parentClassesIds,
        trackParentClass,
    ]);

    const filterOption = (input, option,) => {
        return (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
    }

    return (
        <Row>
            <Col span={24}>
                <h4 style={{ margin: '16px 0' }}>Визуальные настройки дерева</h4>
                Скрытие/Показ горизонтальной прокрутки
                <Switch
                    checked={horizontalScroll}
                    onChange={value => setHorizontalScroll(value)}
                    style={{ marginLeft: 8 }}
                />
            </Col>

            <Divider style={{ margin: '16px 0' }} />

            <Col span={24}>
                <Row gutter={[32, 0]}>
                    <Col span={14}>
                        <h4 style={{ margin: '0 0 16px' }}>Настройки отображения объектов в дереве</h4>
                        <Row gutter={[0, 4]} style={{ border: '1px solid #DDDDDD', padding: '8px 12px 28px' }}>
                            <Col span={24}>
                                <span>Целевые классы</span>
                            </Col>
                            <Col span={24}>
                                <Select
                                    placeholder="Выберите классы"
                                    style={{ width: '100%' }}
                                    options={classes.map(class_obj => ({
                                        label: class_obj.name,
                                        value: class_obj.id,
                                    }))}
                                    mode="multiple"
                                    maxTagCount="responsive"
                                    value={targetClassesIds}
                                    onChange={values => setTargetClassesIds(values)}
                                    showSearch
                                    filterOption={filterOption}
                                />
                            </Col>
                            <Col span={24} style={{ marginTop: 8 }}>
                                <span>Связующие классы</span>
                            </Col>
                            <Col span={24}>
                                <Select
                                    placeholder="Выберите классы"
                                    style={{ width: '100%' }}
                                    options={classes.map(class_obj => ({
                                        label: class_obj.name,
                                        value: class_obj.id,
                                    }))}
                                    mode="multiple"
                                    maxTagCount="responsive"
                                    value={groupingClassesIds}
                                    onChange={values => setGroupingClassesIds(values)}
                                    showSearch
                                    filterOption={filterOption}
                                />
                            </Col>
                        </Row>
                    </Col>
                    <Col span={10}>
                        {
                            showTrackParentOptions &&
                            <>
                                <h4 style={{ margin: '0 0 16px' }}>Настройки дочернего дерева</h4>
                                <Row gutter={[0, 4]} style={{ border: '1px solid #DDDDDD', padding: '8px 12px 28px' }}>
                                    <Col span={24}>
                                        <span>Отслеживать класс родителя</span>
                                    </Col>
                                    <Col span={24}>
                                        <Select
                                            style={{ width: '100%' }}
                                            options={[
                                                {
                                                    label: 'Не отслеживать',
                                                    value: false,
                                                },
                                                {
                                                    label: 'Последний открытый',
                                                    value: true,
                                                }
                                            ]}
                                            value={trackParentClass}
                                            onChange={value => setTrackParentClass(value)}
                                        />
                                    </Col>
                                    {
                                        trackParentClass && (
                                            <>
                                                <Col span={24} style={{ marginTop: 8 }}>
                                                    <span>Класс родителя</span>
                                                </Col>
                                                <Col span={24}>
                                                    <Select
                                                        placeholder="Выберите классы"
                                                        style={{ width: '100%' }}
                                                        options={classes.map(class_obj => ({
                                                            label: class_obj.name,
                                                            value: class_obj.id,
                                                        }))}
                                                        mode="multiple"
                                                        maxTagCount="responsive"
                                                        value={parentClassesIds}
                                                        onChange={values => setParentClassesIds(values)}
                                                        showSearch
                                                        filterOption={filterOption}
                                                    />
                                                </Col>
                                            </>
                                        )
                                    }
                                </Row>
                            </>
                        }
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}