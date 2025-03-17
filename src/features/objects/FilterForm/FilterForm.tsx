import { Col, Divider, Modal, Row, Select } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { FormFilterObject } from './types';
import { allFilters } from './filters';
import { filterFormInitialParameters, filterFormTypesOptions } from './constants';
import { PropertyFilterInput } from './components/PropertyFilterInput/PropertyFilterInput';
import { AttributeFilterInput } from './components/AttributeFilterInput/AttributeFilterInput';
import { HasLinkFilterInput } from './components/HasLinkFilterInput/HasLinkFilterInput';
import './FilterForm.css';
import { ButtonAddRow, ButtonDeleteRow } from '@shared/ui/buttons';

export type FilterOption = Omit<FormFilterObject, 'id'>;

const filterGroupTitles: Record<keyof typeof allFilters, string> = {
    attributeFilter: 'Фильтры аттрибутов',
    hasLinkFilter: 'Фильтры связей',
    propertyFilter: 'Фильтры свойств',
    textFilter: 'Фильтры текста',
}

const FilterComponents = {
    propertyFilter: PropertyFilterInput,
    attributeFilter: AttributeFilterInput,
    hasLinkFilter: HasLinkFilterInput,
}

interface IFilterFormProps {
    targetClassIds: number[];
    onChange: (filters: FilterOption[]) => void;
    filterOptions?: FilterOption[];
}

export const FilterForm = ({ targetClassIds, onChange, filterOptions }: IFilterFormProps) => {
    const [filterType, setFilterType] = useState<keyof typeof allFilters>('propertyFilter');
    const [filterTypeModalOpen, setFilterTypeModalOpen] = useState(false);

    const [filters, setFilters] = useState<FormFilterObject[]>([]);
    const [newFilterValue, setNewFilterValue] = useState<FormFilterObject | null>(null);

    const FilterTypeComponent = FilterComponents[filterType];

    const onFieldChanged = (id: number, parameters: any) => {
        const filter = filters.find(ft => ft.id === id);

        if (filter) {
            filter.parameters = parameters;
            setFilters([...filters]);
        }
    }

    const onRemoveFilter = (id: number) => {
        setFilters(prev => prev.filter(ft => ft.id !== id));
    }

    const onAddFilter = () => {
        if (newFilterValue) {
            setFilters(prev => [
                ...prev,
                {
                    ...newFilterValue,
                    id: Math.random(),
                },
            ]);
        }
    }

    const onNewFilterChange = (id: number, parameters: any) => {
        setNewFilterValue({
            id,
            parameters,
            type: filterType,
        });
    }

    const groupedFilters = useMemo(() => {
        const filterGroups: Record<keyof typeof allFilters, FormFilterObject[]> = {
            attributeFilter: [],
            hasLinkFilter: [],
            propertyFilter: [],
            textFilter: [],
        }

        for (const filter of filters) {
            filterGroups[filter.type].push(filter);
        }

        Object.keys(filterGroups).forEach(group => {
            if (filterGroups[group].length === 0) {
                delete filterGroups[group]
            }
        });

        return filterGroups;
    }, [filters]);

    useEffect(() => {
        onChange(filters.map(filter => {
            const filterObj = { ...filter };

            delete filterObj['id'];

            return filterObj;
        }));
    }, [filters])

    useEffect(() => {
        if (filterOptions && filterOptions !== filters) {
            setFilters(filterOptions.map(filter => ({
                ...filter,
                id: Math.random(),
            })) as unknown as FormFilterObject[]); // TODO fix typing
        }
    }, []);

    return (
        <>
            <Row style={{ marginTop: 16 }}>
                <span style={{ cursor: 'pointer' }} onClick={() => setFilterTypeModalOpen(true)}>
                    <ButtonAddRow />
                    <a style={{ marginLeft: 8 }}>Добавить фильтр</a>
                </span>
            </Row>

            <Divider style={{ margin: '16px 0' }} />

            <div className="filterForm">
                {Object.keys(groupedFilters).map(groupName => (
                    <div key={groupName}>
                        <h4 style={{ marginBottom: 12 }}>{filterGroupTitles[groupName]}</h4>

                        {groupedFilters[groupName].map((filter: FormFilterObject) => {
                            const Component = FilterComponents[filter.type];

                            return (
                                <Row key={filter.id} style={{ marginBottom: 12 }}>
                                    <Col span={1} style={{ paddingTop: 3 }} onClick={() => onRemoveFilter(filter.id)}>
                                        <ButtonDeleteRow />
                                    </Col>
                                    <Col span={23}>
                                        <Component
                                            targetClassIds={targetClassIds}
                                            id={filter.id}
                                            filter={filter}
                                            onChange={onFieldChanged}
                                            onDelete={onRemoveFilter}
                                        />
                                    </Col>
                                </Row>
                            )
                        })}
                    </div>
                ))}
            </div>

            <Modal
                open={filterTypeModalOpen}
                title="Добавить новый фильтр"
                onCancel={() => setFilterTypeModalOpen(false)}
                onOk={() => {
                    onAddFilter();
                    setFilterTypeModalOpen(false);
                }}
                width={800}
            >
                <Row style={{ width: '100%' }}>
                    <Col span={24}>
                        <Select
                            options={filterFormTypesOptions}
                            style={{ width: 200 }}
                            value={filterType}
                            onChange={value => setFilterType(value)}
                        />
                        <Divider style={{ margin: '16px 0' }} />
                        <FilterTypeComponent
                            targetClassIds={targetClassIds}
                            id={1}
                            onChange={onNewFilterChange}
                        />
                    </Col>
                </Row>
            </Modal>
        </>
    )
}