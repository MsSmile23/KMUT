import { Col, Divider, Input, Modal, Row, Select } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { FilterFormPreset } from './types';
import { ButtonAddRow, ButtonDeleteRow, ButtonEditRow } from '@shared/ui/buttons';
import { FilterOutlined } from '@ant-design/icons';
import { selectClasses, useClassesStore } from '@shared/stores/classes';
import { FilterForm, FilterOption } from '@features/objects/FilterForm/FilterForm';

interface IFitlerPresetsFormProps {
    onChange?: (value: {
        presets: FilterFormPreset[],
        defaultPresetId: number,
    }) => void,
    value?: {
        presets: FilterFormPreset[],
        defaultPresetId: number,
    }
}

export const FitlerPresetsForm = ({ onChange, value }: IFitlerPresetsFormProps) => {
    const [openedPresetId, setOpenedPresetId] = useState<number | null>(null);
    const [defaultPresetId, setDefaultPresetId] = useState<null | number>(null);
    const isFirstRenderRef = useRef(true);

    const [presetEditName, setPresetEditName] = useState('');
    const [presetEditTargetClassIds, setPresetEditTargetClassIds] = useState<number[]>([]);
    const [presetEditFilters, setPresetEditFilters] = useState<FilterOption[]>([]);

    const [presets, setPresets] = useState<FilterFormPreset[]>([]);

    const classes = useClassesStore(selectClasses);

    const removePreset = (id: number) => {
        setPresets(presets => {
            const newPresets = [...presets];
            const deletedPreset = presets.find(preset => preset.id === id);

            if (deletedPreset) {
                deletedPreset.id = 0;
            }

            return newPresets;
        });
    }

    const onDeletePreset = (id: number) => {
        Modal.confirm({
            title: 'Вы точно хотите удалить этот пресет?',
            onOk: () => {
                removePreset(id);
            }
        })
    }

    const onEditPreset = (id: number) => {
        const preset = presets.find(preset => preset.id === id);

        if (preset) {
            setOpenedPresetId(id);
            setPresetEditName(preset.name);
            setPresetEditTargetClassIds(preset.targetClassesIds);
            setPresetEditFilters(preset.filters);
        }
    }

    const onSavePreset = () => {
        const newPresets = [...presets];

        const selectedPreset = newPresets.find(preset => preset.id === openedPresetId);

        if (selectedPreset) {
            selectedPreset.name = presetEditName;
            selectedPreset.targetClassesIds = presetEditTargetClassIds;
            selectedPreset.filters = presetEditFilters;
        }

        setPresets(newPresets);
    }

    const newCreatePreset = () => {
        setPresets(prev => [
            ...prev,
            {
                filters: [],
                id: Math.random(),
                name: 'Новый пресет',
                targetClassesIds: [],
            }
        ])
    }

    useEffect(() => {
        if (!presets.find(preset => preset.id === defaultPresetId)) {
            if (presets.length > 0) {
                setDefaultPresetId(presets[0].id);
            } else {
                setDefaultPresetId(null);
            }
        }
    }, [presets]);

    useEffect(() => {
        if (isFirstRenderRef.current === true) {
            isFirstRenderRef.current = false;
        } else {
            onChange?.({
                defaultPresetId,
                presets,
            });
        }
    }, [presets, defaultPresetId]);

    useEffect(() => {
        if (!value || !presets) {
            return;
        }

        const equal = JSON.stringify(value.presets) === JSON.stringify(presets);

        if (!equal && value) {
            if (value.defaultPresetId) {
                setDefaultPresetId(value.defaultPresetId);
            }

            if (value.presets) {
                setPresets(value.presets);
            }
        }
    }, [value]);

    return (
        <>
            <Row gutter={[32, 8]} align="middle" style={{ marginTop: 16 }}>
                <Col>
                    <span style={{ cursor: 'pointer' }} onClick={newCreatePreset}>
                        <ButtonAddRow />
                        <a style={{ marginLeft: 8 }}>Создать новый пресет</a>
                    </span>
                </Col>

                <Col style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ whiteSpace: 'nowrap', margin: 0 }}>Пресет по умолчанию</span>
                    <Select
                        style={{ width: 220 }}
                        options={presets.filter(preset => preset.id !== 0).map(preset => ({
                            label: preset.name,
                            value: preset.id,
                        }))}
                        value={defaultPresetId}
                        onChange={value => setDefaultPresetId(value)}
                        disabled={presets.length === 0}
                    />
                </Col>
            </Row>

            <Divider style={{ margin: '16px 0' }} />

            {
                presets.map(preset => {
                    if (preset.id === 0) {
                        // удалённые пресеты
                        return null;
                    }

                    return (
                        <Row key={preset.id} style={{ width: '100%', marginBottom: 16 }}>
                            <Row gutter={[4, 0]}>
                                <Col>
                                    <ButtonEditRow onClick={() => onEditPreset(preset.id)} />
                                </Col>
                                <Col>
                                    <ButtonDeleteRow onClick={() => onDeletePreset(preset.id)} />
                                </Col>
                            </Row>

                            <Col style={{ marginLeft: 24, display: 'flex', alignItems: 'center', gap: 4 }}>
                                <FilterOutlined />
                                {preset.filters.length}

                                <span style={{ marginLeft: 8 }}>
                                    {preset.name}
                                </span>
                            </Col>
                        </Row>
                    )
                })
            }

            <Modal
                open={openedPresetId !== null}
                onCancel={() => setOpenedPresetId(null)}
                onOk={() => {
                    onSavePreset();
                    setOpenedPresetId(null);
                }}
                title="Редактирование пресета"
                width={800} key={openedPresetId || -1}
            >
                <h4 style={{ marginBottom: 4 }}>Название пресета</h4>
                <Input
                    value={presetEditName}
                    onChange={e => setPresetEditName(e.target.value)}
                    style={{ maxWidth: 300 }}
                />

                <h4 style={{ marginBottom: 4 }}>Целевые классы</h4>
                <Select
                    style={{ width: '100%' }}
                    mode="multiple"
                    options={classes.map(class_obj => ({
                        label: class_obj.name,
                        value: class_obj.id,
                    }))}
                    value={presetEditTargetClassIds}
                    onChange={values => setPresetEditTargetClassIds(values)}
                />

                <h4 style={{ marginBottom: 4 }}>Фильтры</h4>
                <FilterForm
                    filterOptions={presetEditFilters}
                    onChange={(filters) => setPresetEditFilters(filters)}
                    targetClassIds={presetEditTargetClassIds}
                />
            </Modal>
        </>
    )
}