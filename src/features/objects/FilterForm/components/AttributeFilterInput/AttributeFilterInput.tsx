import { selectClassByIndex, useClassesStore } from '@shared/stores/classes';
import { IAttribute } from '@shared/types/attributes';
import { Col, Input, InputNumber, Row, Select } from 'antd'
import { useEffect, useMemo, useState } from 'react';
import { allowedComparisionsOptions } from './constants';
import { selectDataTypes, useDataTypes } from '@shared/stores/dataTypes';
import { DeleteFilled } from '@ant-design/icons';
import { AttributeFilter } from '../../filters/attributeFilter';
import { FormFilterObject } from '../../types';
import { ButtonDelete, ButtonDeleteRow } from '@shared/ui/buttons';

interface IAttributeFilterInputProps {
    targetClassIds: number[];
    id: number;
    onChange: (id: number, parameters: AttributeFilter) => void;
    filter?: FormFilterObject;
}

export const AttributeFilterInput = ({
    targetClassIds, id, onChange, filter
}: IAttributeFilterInputProps) => {
    const [attributes, setAttributes] = useState<IAttribute[]>([]);

    const [
        selectedAttributeId, setSelectedAttributeId
    ] = useState<number | null>(filter?.parameters?.attributeId || null);
    const [value, setValue] = useState<string | number | boolean>(filter?.parameters?.value || '');
    const [
        comparision, setComparision
    ] = useState<null | AttributeFilter['comparision']>(filter?.parameters?.comparision || 'equals');

    const getClassByIndex = useClassesStore(selectClassByIndex);

    const dataTypes = useDataTypes(selectDataTypes);
    const dataType = useMemo(() => {
        const selectedAttribute = attributes.find(attr => attr.id === selectedAttributeId);

        return dataTypes.find(dt => dt.id === selectedAttribute?.data_type_id)
    }, [selectedAttributeId, attributes]);
    const innerType = dataType?.inner_type;
    const comparisionOptions = allowedComparisionsOptions[innerType] || [];

    const onSelectAttribute = (attributeId: number) => {
        setSelectedAttributeId(attributeId);
    }

    const onSelectComparision = (comparision: AttributeFilter['comparision']) => {
        setComparision(comparision);
    }

    useEffect(() => {
        const newAttributes = targetClassIds
            .map(tcId => getClassByIndex('id', tcId))
            .filter(Boolean)
            .map(class_obj => class_obj.attributes)
            .flat();

        setAttributes(newAttributes);

        if (newAttributes.length > 0) {
            setSelectedAttributeId(newAttributes[0].id);
        } else {
            setSelectedAttributeId(null);
        }
    }, [targetClassIds]);

    useEffect(() => {
        if (innerType === 'string' && typeof value !== 'string') {
            setValue('');
        }

        if ((innerType === 'double' || innerType === 'integer') && typeof value !== 'number') {
            setValue(0);
        }

        if (innerType === 'boolean' && typeof value !== 'boolean') {
            setValue(true);
        }

        if (!comparisionOptions.find(option => option.value === comparision)) {
            setComparision(comparisionOptions.length ? comparisionOptions[0].value : null);
        }
    }, [innerType]);

    useEffect(() => {
        if (comparision && (value !== null) && selectedAttributeId) {
            onChange(id, {
                attributeId: selectedAttributeId,
                comparision,
                value,
            });
        }
    }, [comparision, value, selectedAttributeId]);

    useEffect(() => {
        if (filter) {
            setSelectedAttributeId(filter.parameters.attributeId);
            setComparision(filter.parameters.comparision);
            setValue(filter.parameters.value);
        }
    }, [filter]);

    return (
        <Row gutter={[4, 4]} style={{ width: '100%' }}>
            <Col span={8}>
                <Select
                    style={{ width: '100%' }}
                    options={attributes.map(attr => ({
                        label: attr.name,
                        value: attr.id,
                    }))}
                    disabled={attributes.length === 0}
                    onSelect={onSelectAttribute}
                    value={selectedAttributeId}
                />
            </Col>

            <Col span={6}>
                <Select
                    style={{ width: '100%' }}
                    options={comparisionOptions}
                    onSelect={onSelectComparision}
                    disabled={comparisionOptions.length === 0 || selectedAttributeId === null}
                    value={comparision}
                />
            </Col>

            <Col span={9}>
                {['double', 'integer'].includes(dataType?.inner_type) && (
                    <InputNumber
                        style={{ width: '100%' }}
                        value={value as number}
                        onChange={value => setValue(value)}
                    />
                )}
                {dataType?.inner_type === 'string' && (
                    <Input
                        value={value as string}
                        style={{ width: '100%' }}
                        onChange={e => setValue(e.target.value)}
                    />
                )}
                {dataType?.inner_type === 'boolean' && (
                    <Select
                        value={value as boolean}
                        style={{ width: '100%' }}
                        onChange={value => setValue(value)}
                        options={[
                            {
                                label: 'Истина',
                                value: true,
                            },
                            {
                                label: 'Ложь',
                                value: false,
                            },
                        ]}
                    />
                )}
                {['jsonb', 'array', undefined].includes(dataType?.inner_type) && (
                    <Input
                        value=""
                        disabled
                        style={{ width: '100%' }}
                    />
                )}
            </Col>
        </Row>
    )
}