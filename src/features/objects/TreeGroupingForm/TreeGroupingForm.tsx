import { Col, Divider, Row, Select } from 'antd'
import { useEffect, useMemo, useState } from 'react';
import { FormRelationGrouping, FormTreeGrouping } from './types';
import { selectRelations, useRelationsStore } from '@shared/stores/relations';
import { DndGroupList } from '@containers/objects/ObjectTree/TreeGrouping/DndGroupList';
import { uniq } from 'lodash';
import { IObject } from '@shared/types/objects';

interface ITreeGroupingFormProps {
    targetClassesIds: number[];
    groupingClassesIds: number[];
    onChange?: (value: FormTreeGrouping[]) => void;
    trackedObject?: IObject | null | undefined;
}

export const TreeGroupingForm = ({
    targetClassesIds,
    onChange,
    groupingClassesIds,
    trackedObject,
}: ITreeGroupingFormProps) => {
    const relations = useRelationsStore(selectRelations);
    const [groupingOptions, setGroupingOptions] = useState<FormTreeGrouping[]>([]);
    // Те, что идут от выбранных связей
    const [additionalGroupingOptions, setAdditionalGroupingOptions] = useState<FormRelationGrouping[]>([]);

    const [selectedGroupingOptions, setSelectedGroupingOptions] = useState<FormTreeGrouping[]>([]);

    const selectOptions = useMemo(() => {
        return [
            ...groupingOptions,
            ...additionalGroupingOptions
        ].map(option => ({
            value: option.id,
            label: option.name,
        }))
    }, [groupingOptions, additionalGroupingOptions, targetClassesIds]);

    const onSelectChange = (optionids: string[]) => {
        const options = optionids
            .map(id => [...groupingOptions, ...additionalGroupingOptions].find(option => option.id === id))
            .filter(Boolean);

        setSelectedGroupingOptions(options);
    }

    useEffect(() => {
        const newTargetClassesIds = targetClassesIds || [];
        const newGroupingClassesIds = groupingClassesIds || [];

        let trackedRelations = [];

        if (trackedObject) {
            trackedRelations = relations.filter(rel =>
                rel.right_class_id === trackedObject.class_id &&
                targetClassesIds.includes(rel.left_class_id)
            );
        }

        setGroupingOptions([
            {
                type: 'by_class',
                id: '0',
                name: 'По классу',
            },
            ...trackedRelations
                .map(rel => ({
                    type: 'by_relation' as FormTreeGrouping['type'],
                    relation: rel,
                    id: rel.id.toString(),
                    name: rel.name,
                })),
            ...relations
                .filter(rel =>
                    newTargetClassesIds
                        .includes(rel.left_class_id) && newGroupingClassesIds.includes(rel.right_class_id)
                )
                .map(rel => ({
                    type: 'by_relation' as FormTreeGrouping['type'],
                    relation: rel,
                    id: rel.id.toString(),
                    name: rel.name,
                })),
        ]);
        setSelectedGroupingOptions([]);
    }, [targetClassesIds, groupingClassesIds, trackedObject]);

    useEffect(() => {
        const leftClassesIds = uniq(
            selectedGroupingOptions
                .filter(opt => opt.type === 'by_relation')
                .map(opt => opt.relation.right_class_id)
        );

        const additionalRelations = relations
            .filter(rel =>
                leftClassesIds.includes(rel.left_class_id) && (groupingClassesIds || []).includes(rel.right_class_id)
            )
            .map(rel => ({
                type: 'by_relation',
                relation: rel,
                id: rel.id.toString(),
                name: rel.name,
            }));

        setAdditionalGroupingOptions(additionalRelations as FormRelationGrouping[]);
    }, [selectedGroupingOptions]);

    useEffect(() => {
        onChange?.(selectedGroupingOptions);
    }, [selectedGroupingOptions]);

    const filterOption = (input, option,) => {
        return (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
    }

    return (
        <Row gutter={[16, 0]}>
            <Divider style={{ margin: '8px 0 16px' }} />
            <Col span={12}>
                <Select
                    style={{ width: '100%' }}
                    mode="multiple"
                    options={selectOptions}
                    onChange={onSelectChange}
                    placeholder="Выберите параметры группировки"
                    value={selectedGroupingOptions.map(opt => opt.id)}
                    showSearch
                    filterOption={filterOption}
                />
            </Col>

            <Col span={12}>
                <Row style={{ border: '1px solid #bbb9b9', borderRadius: 6 }}>
                    <Col span={24}>
                        <div style={{ padding: 12 }}>
                            Задайте порядок группировки
                        </div>
                    </Col>

                    <Divider style={{ margin: '0px 0' }} />

                    <Col span={24}>
                        <div>
                            <DndGroupList
                                dragOrder={selectedGroupingOptions}
                                setOrder={(values: FormTreeGrouping[]) => setSelectedGroupingOptions(values)}
                            />
                        </div>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}