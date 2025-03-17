import { useEffect, useState } from 'react'
import { ECSimpleFiltersClassFieldProp, ECSimpleFiltersFieldsProps } from '../../types'
import { ECSimpleFiltersFormClass } from './components/ECSimpleFiltersFormClass/ECSimpleFiltersFormClass';
import { ECSimpleFiltersFormAttribute } from './components/ECSimpleFiltersFormAttribute/ECSimpleFiltersFormAttribute';
import { ECSimpleFiltersFormCustomField } from './components/ECSimpleFiltersFormCustomField/ECSimpleFiltersFormCustomField';
import { ButtonAddRow, ButtonDeleteRow } from '@shared/ui/buttons';
import { Divider, Modal, Select } from 'antd';
import { ECSelect } from '@shared/ui/ECUIKit/forms';

const selectFilterTypeOptions: { label: string; value: ECSimpleFiltersFieldsProps['type'] }[] = [
    {
        label: 'Аттрибут',
        value: 'attribute',
    },
    {
        label: 'Класс',
        value: 'class',
    },
    {
        label: 'Период (2 даты)',
        value: 'dates',
    },
    {
        label: 'Период (селект)',
        value: 'dates_last',
    },
    {
        label: 'Логин',
        value: 'user_login',
    },
]

interface IWidgetECSimpleFiltersForm {
    onChange?: (fields: ECSimpleFiltersFieldsProps[]) => void;
    value?: ECSimpleFiltersFieldsProps[];
}

export const WidgetECSimpleFiltersForm = ({
    onChange,
    value,
}: IWidgetECSimpleFiltersForm) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedFilterType, setSelectedFilterType] = useState(selectFilterTypeOptions[0].value);

    const [fields, setFields] = useState<ECSimpleFiltersFieldsProps[]>(value || []);

    const onClassIdChange = (value: ECSimpleFiltersClassFieldProp, index) => {
        const newFields = [...fields];
        const field = newFields[index];

        if (field?.type === 'class') {
            field.class_id = value.class_id;
            field.isMultiSelect = value.isMultiSelect;
            field.tagCloud = value.tagCloud;
            field.defaultValues = value.defaultValues;
            field.version = value.version;
        }

        setFields(newFields);
    }

    const onAttributeIdChange = (value, index) => {
        const newFields = [...fields];
        const field = newFields[index];

        if (field?.type === 'attribute') {
            field.attribute_id = value;
        }

        setFields(newFields);
    }

    const selectFilterType = (value: ECSimpleFiltersFieldsProps['type']) => {
        setSelectedFilterType(value);
    }

    const addFilter = () => {
        const addField = (field: ECSimpleFiltersFieldsProps) => {
            const newFields = [...fields, field];

            setFields(newFields);
        }

        if (selectedFilterType === 'attribute') {
            addField({
                type: 'attribute',
                attribute_id: null,
            })
        }

        if (selectedFilterType === 'class') {
            addField({
                type: 'class',
                class_id: null,
                isMultiSelect: true,
                tagCloud: true,
                defaultValues: [],
            })
        }

        if (['user_login', 'dates', 'dates_last'].includes(selectedFilterType)) {
            addField({
                type: selectedFilterType,
            } as ECSimpleFiltersFieldsProps);
        }

        setModalOpen(false);
    }

    const deleteFilter = (index: number) => {
        setFields(fields.filter(field => field !== fields[index]));
    }

    useEffect(() => {
        const selectedFields = fields.filter(field => {
            if (field.type === 'class' && !field.class_id) {
                return false;
            }

            if (field.type === 'attribute' && !field.attribute_id) {
                return false;
            }

            return true;
        });

        onChange?.(selectedFields);
    }, [fields]);

    return (
        <div>
            <h4>Список фильтров</h4>
            {fields.map((field, i) => {
                return (
                    <div
                        key={i}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            width: '100%',
                            padding: 4,
                            marginBottom: 8,
                        }}
                    >
                        <div onClick={() => deleteFilter(i)} style={{ marginRight: 16 }}>
                            <ButtonDeleteRow />
                        </div>

                        {field.type === 'class' && (
                            <ECSimpleFiltersFormClass onChange={v => onClassIdChange(v, i)} value={field} />
                        )}
                        {field.type === 'attribute' &&
                            <ECSimpleFiltersFormAttribute onChange={v => onAttributeIdChange(v, i)} value={field} />
                        }
                        {!['class', 'attribute'].includes(field.type)
                            && <ECSimpleFiltersFormCustomField field={field} />}
                    </div>
                )
            })}

            <Divider style={{ backgroundColor: '#888888', margin: '16px 0' }} />

            <div>
                <span style={{ cursor: 'pointer' }} onClick={() => setModalOpen(true)}>
                    <ButtonAddRow />
                    <span style={{ marginLeft: 8 }}>
                        Добавить поле фильтра
                    </span>
                </span>
            </div>

            <Modal
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                onOk={() => addFilter()}
                title="Добавление фильтра"
            >
                <ECSelect
                    selectProps={{
                        style: {
                            width: 200,
                        },
                        options: selectFilterTypeOptions,
                        value: selectedFilterType,
                        onSelect: selectFilterType,
                    }}
                />
            </Modal>
        </div>
    )
}