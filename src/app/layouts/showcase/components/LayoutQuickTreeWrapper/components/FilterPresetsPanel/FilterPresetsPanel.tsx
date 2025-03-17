import { CheckCircleFilled, CloseCircleOutlined, DeleteOutlined, PlayCircleOutlined, SaveOutlined } from '@ant-design/icons'
import { BaseButton } from '@shared/ui/buttons'
import { ECTooltip } from '@shared/ui/tooltips'
import { Col, Input, Modal, Row, Select } from 'antd'
import { useConfigSection } from '../../hooks/useFrontPageConfig'
import { useEffect, useMemo, useRef, useState } from 'react'
import { FilterFormPreset } from '@features/objects/FilterPresetsForm/types'
import { FilterOption } from '@features/objects/FilterForm/FilterForm'
import { SERVICES_ACCOUNTS } from '@shared/api/Accounts'
import { selectAccount, useAccountStore } from '@shared/stores/accounts'

interface IFilterPresetsPanelProps {
    onApplyPreset: (preset: FilterFormPreset) => void;
    appliedPresetId?: number;
    onUnapplyPreset: () => void;
    targetClassesIds: number[];
    selectedFilters?: FilterOption[];
}

export const FilterPresetsPanel = ({
    onApplyPreset,
    onUnapplyPreset,
    appliedPresetId,
    selectedFilters,
    targetClassesIds,
}: IFilterPresetsPanelProps) => {
    const config = useConfigSection('front_settings');
    const account = useAccountStore(selectAccount);

    const defaultSystemPresetid = config?.tree?.treeFilterPresets?.defaultPresetId || null;
    const userPresets = account.user.settings?.userFilterFormPresets || [];
    const systemPresets = config?.tree?.treeFilterPresets?.presets || [];

    const [presets, setPresets] = useState<FilterFormPreset[]>([...systemPresets, ...userPresets]);
    const [selectedPresetId, setSelectedPresetid] = useState<number | null>(defaultSystemPresetid);

    const [modalMode, setModalMode] = useState<'closed' | 'save' | 'edit'>('closed');
    const [editingPreset, setEditingPreset] = useState<FilterFormPreset | null>(null);
    const [presetName, setPresetName] = useState('');

    const isFirstRenderRef = useRef(true);

    const selectedPreset = useMemo(() => {
        return presets.find(presets => presets.id === selectedPresetId) || null;
    }, [selectedPresetId, presets]);

    const appliedPreset = useMemo(() => {
        return presets.find(presets => presets.id === appliedPresetId) || null;
    }, [appliedPresetId, presets]);

    const groupedPresetsOptions = useMemo(() => {
        const systemPresets = {
            label: 'Системные пресеты',
            options: [],
        }
        const userPresets = {
            label: 'Пользовательские пресеты',
            options: [],
        }

        for (const preset of presets) {
            const option = {
                label: preset.name,
                value: preset.id,
            }

            if (preset.isUserPreset) {
                userPresets.options.push(option);
            } else {
                systemPresets.options.push(option);
            }
        }

        const groups = [];

        if (userPresets.options.length) {
            groups.push(userPresets);
        }

        if (systemPresets.options.length) {
            groups.push(systemPresets);
        }

        return groups;
    }, [presets]);

    const onUnapplyPresetClick = () => {
        onUnapplyPreset();
    }

    const onApplyPresetClick = () => {
        onApplyPreset(selectedPreset);
    }

    const onSaveButtonClick = () => {
        if (appliedPresetId) {
            // Обновляем пресет
            setModalMode('edit');
            setPresetName(appliedPreset.name);
            setEditingPreset({ ...appliedPreset });
        } else {
            // Создаём новый пресет
            setModalMode('save');
            setPresetName('Новый пресет');
        }
    }

    const onSavePreset = () => {
        const newPreset: FilterFormPreset = {
            filters: selectedFilters || [],
            id: Math.random(),
            name: presetName,
            targetClassesIds,
            isUserPreset: true,
        }

        setPresets(presets => [newPreset, ...presets]);
        setSelectedPresetid(newPreset.id);
        onApplyPreset(newPreset);
        setModalMode('closed');
    }

    const onDeletePreset = () => {
        if (selectedPreset) {
            setPresets(presets => presets.filter(preset => preset.id !== selectedPreset.id));
            setSelectedPresetid(defaultSystemPresetid || null);

            if (appliedPresetId === selectedPresetId) {
                onUnapplyPreset();
            }
        }
    }

    const onEditPreset = () => {
        if (editingPreset) {
            const newPresets = [...presets];
            const presetIndex = newPresets.findIndex(preset => preset.id === editingPreset.id);

            if (presetIndex !== undefined) {
                editingPreset.filters = selectedFilters;
                editingPreset.name = presetName;
                newPresets[presetIndex] = { ...editingPreset };

                onApplyPreset({ ...editingPreset });
            }

            setPresets(newPresets);
        }
        setModalMode('closed');
    }

    useEffect(() => {
        if (isFirstRenderRef.current === true) {
            isFirstRenderRef.current = false;

            return;
        }

        const userPresets = presets.filter(preset => preset.isUserPreset);

        if (account.user.settings) {
            SERVICES_ACCOUNTS.Models.patchAccountMyself({
                settings: {
                    ...account.user.settings,
                    userFilterFormPresets: userPresets,
                }
            })
        }
    }, [presets]);

    return (
        <>
            <Row align="middle" style={{ padding: 8, gap: 4 }}>
                <ECTooltip title={appliedPresetId ? 'Обновить пресет' : 'Сохранить пресет'}>
                    <BaseButton
                        size="small"
                        shape="circle"
                        onClick={onSaveButtonClick}
                        icon={<SaveOutlined />}
                        disabled={appliedPreset && !appliedPreset?.isUserPreset}
                    />
                </ECTooltip>
                <ECTooltip title="Загрузить">
                    <BaseButton
                        size="small"
                        shape="circle"
                        onClick={() => onApplyPresetClick()}
                        icon={<PlayCircleOutlined />}
                        disabled={appliedPresetId === selectedPresetId || selectedPresetId === null}
                    />
                </ECTooltip>
                <Select
                    style={{ flex: 'auto' }}
                    // options={presets.map(preset => ({
                    //     label: preset.name,
                    //     value: preset.id,
                    // }))}
                    options={groupedPresetsOptions}
                    value={selectedPresetId}
                    onChange={value => setSelectedPresetid(value)}
                    optionRender={option => (
                        <span>
                            {option.label}
                            {option.value === appliedPresetId && (
                                <span style={{ marginLeft: 8, color: '#55BB55' }}>
                                    <CheckCircleFilled />
                                </span>
                            )}
                        </span>
                    )}

                />
                <ECTooltip title="Отменить">
                    <BaseButton
                        onClick={() => onUnapplyPresetClick()}
                        size="small"
                        shape="circle"
                        icon={<CloseCircleOutlined />}
                        disabled={appliedPresetId === undefined}
                    />
                </ECTooltip>
                <ECTooltip title="Удалить">
                    <BaseButton
                        onClick={onDeletePreset}
                        size="small"
                        shape="circle"
                        icon={<DeleteOutlined />}
                        disabled={!selectedPreset?.isUserPreset}
                    />
                </ECTooltip>
            </Row >

            <Modal
                open={modalMode !== 'closed'}
                onCancel={() => setModalMode('closed')}
                title={
                    modalMode === 'edit' ?
                        `Редактирование пресета ${editingPreset?.name}`
                        : 'Создание нового пресета'
                }
                onOk={modalMode === 'edit' ? onEditPreset : onSavePreset}
            >
                <Row>
                    <Col>
                        <h4 style={{ margin: 0 }}>Название пресета</h4>
                        <Input value={presetName} onChange={e => setPresetName(e.target.value)} />
                    </Col>
                </Row>
            </Modal >
        </>
    )
}