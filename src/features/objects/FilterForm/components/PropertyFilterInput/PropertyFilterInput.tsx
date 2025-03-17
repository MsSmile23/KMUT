import { Col, Input, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import { DeleteFilled } from '@ant-design/icons';
import { PropertyFilter } from '../../filters/propertyFilter';
import { FormFilterObject } from '../../types';
import { ButtonDeleteRow } from '@shared/ui/buttons';

const propertyOptions: { label: string, value: PropertyFilter['property'] }[] = [
    {
        label: 'Код',
        value: 'codename',
    },
    {
        label: 'Имя',
        value: 'name',
    },
    {
        label: 'ID Класса',
        value: 'class_id'
    },
];

const comparisionOptions: { label: string, value: PropertyFilter['comparision'] }[] = [
    {
        label: 'Равен',
        value: 'equals',
    },
    {
        label: 'Включает',
        value: 'includes',
    },
    {
        label: 'Не равен',
        value: 'not_equals',
    },
    {
        label: 'Не включает',
        value: 'not_includes',
    },
];

interface IPropertyFilterInputProps {
    onChange: (id: number, parameters: PropertyFilter) => void;
    id: number;
    filter?: FormFilterObject;
}

export const PropertyFilterInput = ({ onChange, id, filter }: IPropertyFilterInputProps) => {
    const [property, setProperty] = useState<PropertyFilter['property']>(filter?.parameters?.property || 'codename');
    const [
        comparision, setComparision
    ] = useState<PropertyFilter['comparision']>(filter?.parameters?.comparision || 'includes');
    const [value, setValue] = useState<string | number>(filter?.parameters?.value || '');

    useEffect(() => {
        onChange(id, {
            property,
            comparision,
            value,
        });
    }, [property, comparision, value]);

    useEffect(() => {
        if (filter) {
            setProperty(filter.parameters.property);
            setComparision(filter.parameters.comparision);
            setValue(filter.parameters.value);
        }
    }, [filter]);

    return (
        <Row gutter={[4, 4]} style={{ width: '100%' }}>
            <Col span={8}>
                <Select
                    style={{ width: '100%' }}
                    options={propertyOptions}
                    value={property}
                    onChange={e => setProperty(e)}
                />
            </Col>
            <Col span={8}>
                <Select
                    style={{ width: '100%' }}
                    options={comparisionOptions}
                    value={comparision}
                    onChange={value => setComparision(value)}
                />
            </Col>
            <Col span={7}>
                <Input
                    style={{ width: '100%' }}
                    value={value}
                    onChange={e => setValue(e.target.value)}
                />
            </Col>
        </Row>
    )
}