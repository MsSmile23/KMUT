import { Row, Col, Select } from 'antd'
import { selectRelations, useRelationsStore } from '@shared/stores/relations';
import { useEffect, useMemo, useState } from 'react';
import { selectObjectByIndex, useObjectsStore } from '@shared/stores/objects';
import { HasLinksFilter } from '../../filters/hasLinkFilter';
import { FormFilterObject } from '../../types';

interface IHasLinkFilterInputProps {
    targetClassIds: number[];
    id: number;
    onChange: (id: number, parameters: HasLinksFilter) => void;
    filter?: FormFilterObject;
}

export const HasLinkFilterInput = ({ id, onChange, targetClassIds, filter }: IHasLinkFilterInputProps) => {
    const relations = useRelationsStore(selectRelations);
    const [selectedRelationId, setSelectedRelationId] = useState<null | number>(filter?.parameters?.relationId || null);
    const [has, setHas] = useState(filter?.parameters.has || false);
    const [selectedObjectIds, setSelectedObjectIds] = useState<number[]>(filter?.parameters?.objectIds || []);
    const getObjectByIndex = useObjectsStore(selectObjectByIndex);

    const usedRelations = useMemo(() => {
        return relations.filter(rel => targetClassIds.includes(rel.left_class_id));
    }, [relations, targetClassIds]);

    const relationObjects = useMemo(() => {
        if (!selectedRelationId) {
            return [];
        }

        const selectedRelation = relations.find(rel => rel.id === selectedRelationId);
        const rightClassId = selectedRelation?.right_class_id
        const objects = getObjectByIndex('class_id', rightClassId);

        const prevObjectIds = selectedObjectIds || [];
        let objectsAllowed = true;

        for (const objectId of prevObjectIds) {
            const object = getObjectByIndex('id', objectId);

            if (object.class_id !== rightClassId) {
                objectsAllowed = false;
                break
            }
        }

        setSelectedObjectIds(objectsAllowed ? selectedObjectIds : []);

        return objects;
    }, [selectedRelationId]);

    const onSelectRelation = (relationId: number) => {
        setSelectedRelationId(relationId);
    }

    const onSelectedObjectsIds = (objects: number[]) => {
        setSelectedObjectIds(objects);
    }

    useEffect(() => {
        if (usedRelations.length > 0) {
            if (!usedRelations.find(rel => rel.id === selectedRelationId)) {
                setSelectedRelationId(usedRelations[0].id);
            }
        } else {
            setSelectedRelationId(null);
        }
    }, [usedRelations]);

    useEffect(() => {
        if (typeof has === 'boolean' && selectedObjectIds && selectedRelationId) {
            const parameters: HasLinksFilter = {
                has,
                relationId: selectedRelationId,
            }

            if (selectedObjectIds?.length) {
                parameters.objectIds = selectedObjectIds;
            }

            onChange(id, parameters);
        }
    }, [selectedRelationId, selectedObjectIds, has]);

    useEffect(() => {
        if (filter) {
            setHas(filter.parameters.has);
            setSelectedRelationId(filter.parameters.relationId);
            setSelectedObjectIds(filter.parameters.objectIds);
        }
    }, []);

    return (
        <Row gutter={[4, 4]} style={{ width: '100%' }}>
            <Col span={8}>
                <Select
                    style={{ width: '100%' }}
                    options={usedRelations.map(rel => ({
                        label: rel.name,
                        value: rel.id,
                    }))}
                    value={selectedRelationId}
                    onChange={onSelectRelation}
                    disabled={usedRelations.length === 0}
                />
            </Col>
            <Col span={5}>
                <Select
                    style={{ width: '100%' }}
                    options={[
                        {
                            label: 'Имеет связь',
                            value: true,
                        },
                        {
                            label: 'Не имеет связь',
                            value: false,
                        },
                    ]}
                    value={has}
                    disabled={!selectedRelationId}
                    onChange={value => setHas(value)}
                />
            </Col>
            <Col span={10}>
                <Select
                    style={{ width: '100%' }}
                    mode="multiple"
                    options={relationObjects.map(obj => ({
                        label: obj.name,
                        value: obj.id,
                    }))}
                    disabled={relationObjects.length === 0}
                    value={selectedObjectIds}
                    onChange={onSelectedObjectsIds}
                    optionFilterProp="label"
                />
            </Col>
        </Row>
    )
}