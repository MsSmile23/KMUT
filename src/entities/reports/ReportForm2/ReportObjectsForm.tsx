import { searchObjects } from '@shared/api/Objects/Models/searchObjects/SearchObjects'
import { useTheme } from '@shared/hooks/useTheme'
import { selectAccount, useAccountStore } from '@shared/stores/accounts'
import { selectClasses, useClassesStore } from '@shared/stores/classes'
import { selectClassStereotypes, useClassStereotypesStore } from '@shared/stores/classStereotypes/useClassStereotypes'
import { selectObjectByIndex, useObjectsStore } from '@shared/stores/objects'
import { selectRelationByIndex, useRelationsStore } from '@shared/stores/relations'
import { EditTable } from '@shared/ui/tables/ECTable2/EditTable/EditTable'
import { darkenColor } from '@shared/utils/common'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'
import { useWatch } from 'antd/es/form/Form'
import { Button } from 'antd/lib'
import { useEffect, useMemo, useState } from 'react'

const reportObjectsColumns = [
    {
        title: 'ID',
        dataIndex: 'id',
        sorter: (a, b) => a.id - b.id,
        defaultSortOrder: 'descend',
        width: 100
    },
    {
        title: 'Название',
        dataIndex: 'name',
    },
].map((col) => ({ ...col, key: col.dataIndex }))

const ReportObjectsForm = ({
    form,
    selectedObjects,
    setSelectedObjects,
    selectedFilters,
    setFilters,
    onlyFiltersMode,
    setOnlyFiltersMode
}) => {

    const theme = useTheme();
    const accountData = useAccountStore(selectAccount);
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode || 'light';
    const textColor = createColorForTheme(theme?.filter?.filtersTextColor, theme?.colors, themeMode);
    const borderColor = createColorForTheme(theme?.filter?.filtersBorderColor, theme?.colors, themeMode);
    const backgroundColor = createColorForTheme(theme?.widget?.background, theme?.colors, themeMode);

    const handleSelectChange = (selected) => {
        const newSelectedKeys = selectedObjects.includes(selected.key)
            ? selectedObjects.filter(key => key !== selected.key) // Убираем из выбранных
            : [...selectedObjects, selected.key]; // Добавляем в выбранные

        setSelectedObjects(newSelectedKeys); // Обновляем состояние в родительском компоненте
    };

    const reportType = form.getFieldValue('report_type_id')

    const selectedRoot = form.getFieldValue('root_class')
    const rootClasses = form.getFieldValue('rootClasses')

    // const getObject = useObjectsStore.getState().getObjectById
    const classesStore = useClassesStore(selectClasses)
    const getRelations = useRelationsStore(selectRelationByIndex)
    // const getRelationById = useRelationsStore(selectRelationByIndex)
    const getObjects = useObjectsStore(selectObjectByIndex)
    const stereotypeStore = useClassStereotypesStore(selectClassStereotypes)
    const stereotypeIds = useMemo(() => rootClasses?.map(mnemo => {
        return stereotypeStore?.find(el => el.mnemo === mnemo)?.id
    }), [rootClasses, stereotypeStore])
    const classesIds = useMemo(() => {
        if (selectedRoot) {
            return [selectedRoot]
        }

        return stereotypeIds?.map(sterId => {
            return classesStore?.find(cls => cls?.class_stereotype?.id === sterId)?.id
        })
    }, [stereotypeIds, classesStore, selectedRoot])

    const [objects, setObjects] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            const resp = await searchObjects({
                'class_id[]': classesIds,
            })

            setObjects(resp?.data)
            // console.log('resp', resp)
        }

        fetchData()

    }, [classesIds])

    // const objects = useMemo(() => classesIds
    // ?.flatMap(clsId => getObjects('class_id', clsId)), [classesIds]) //TODO будет метод с бэка

    // const relations = useMemo(() => classesIds?.flatMap(clsId => [
    //     ...getRelations('left_class_id', clsId),
    //     ...getRelations('right_class_id', clsId)
    // ]), [classesIds])

    const getRelationsForObject = (object, link, mode?) => {
        const links = object?.links.filter(el => el.relation_id === link.relation_id)

        const values = links.map(link => {

            return { name: link?.name || '', key: link?.id, relation_id: link.relation_id };
        });

        if (mode === 'getObjectsIds') {
            return values.map(value => value.key)
        }

        return values.map((value) => {
            if (value) {
                return <div key={`relation-${value.relation_id}-${value.key}`}>{value.name}<br /></div>
            }
        }
        );

    };

    // * Старый формат получения релейшенов без интеграции с бэком
    // const getRelationsForObject = (object, relation, mode?) => {
    //     const links = [ //TODO Здесь будут просто Links
    //         ...object.links_where_left,
    //         ...object.links_where_right,
    //         ...object.links_where_assoc
    //     ] //TODO заменить
    //         .filter(link => link.relation_id == relation.id)

    //     const values = links.map(link => {
    //         const relatedObject =
    //             link?.left_object_id === object?.id
    //                 ? getObject(link?.right_object_id)
    //                 : getObject(link?.left_object_id);

    //         return { name: relatedObject?.name || '', key: relatedObject?.id };
    //     });

    //     if (mode === 'getObjectsIds') {
    //         return values.map(value => value.key)
    //     }

    //     return values.map((value) => {
    //         if (value) {
    //             return <div key={`relation-${relation.id}-${value.key}`}>{value.name}<br /></div>
    //         }
    //     }   
    //     );

    // };

    const getFilterSelectOptions = (relation) => {

        const targetClass = classesIds?.includes(relation.left_class_id)
            ? relation.right_class_id
            : relation.left_class_id

        return getObjects('class_id', targetClass)
            ?.map(object => ({ value: object.id, label: object.name }))

    };

    const extensionColumns = useMemo(() => {
        return [
            ...reportObjectsColumns,
            ...(objects.length > 0 ? (objects[0]?.links || []).map(link => {
                const relation = getRelations('id', link.relation_id);

                return {
                    key: `relation_column_${relation.id}`,
                    title: relation.name,
                    dataIndex: `relation_${relation.id}`,
                    width: 250,
                    valueIndex: {
                        filter: `relation_${relation.id}_filter`
                    },
                    filterType: 'multiselect',
                    filterSelectOptions: getFilterSelectOptions(relation),
                    filteredValue: selectedFilters[`relation_column_${relation.id}`] || []
                };
            }) : [])
        ];
    }, [objects, selectedFilters]);

    // * Старый формат колонок без интеграции с бэком
    // const extensionColumns = useMemo(() => {
    //     return [
    //         ...reportObjectsColumns,
    //         ...(relations ? relations.map(relation => ({
    //             key: `relation_column_${relation?.id}`,
    //             title: relation?.name,
    //             dataIndex: `relation_${relation?.id}`,
    //             width: 250,
    //             valueIndex: {
    //                 filter: `relation_${relation?.id}_filter`
    //             },
    //             filterType: 'multiselect',
    //             filterSelectOptions: getFilterSelectOptions(relation),
    //             filteredValue: selectedFilters[`relation_column_${relation.id}`] || []
    //         })) : [])
    //     ];
    // }, [relations, selectedFilters])

    const onSelectAll = (selected) => {
        const allKeys = selected ? rows.map(row => row.key) : [];

        setSelectedObjects(allKeys); // Обновляем состояние в родительском компоненте
    };

    const rowSelection = {
        selectedRowKeys: selectedObjects, // Используем переданные выбранные ключи
        onSelect: handleSelectChange, // Обработчик для изменения выбора строки
        onSelectAll: onSelectAll, // Обработчик для выбора всех строк
        getCheckboxProps: () => ({
            disabled: onlyFiltersMode // Отключить все чекбоксы при включённом режиме фильтров
        }),
    };

    useEffect(() => {
        if (onlyFiltersMode) {
            setSelectedObjects([])
        }
    }, [onlyFiltersMode])

    const rows = useMemo(() => {
        return objects?.map(object => {
            const relationValues = object?.links?.reduce((acc, link) => {
                // Предполагается, что нужно добавить значение отношения (может быть объект или свойство объекта)
                const relationKey = `relation_${link?.relation_id}`;
                const filterKey = `relation_${link?.relation_id}_filter`

                acc[relationKey] = getRelationsForObject(object, link)
                acc[filterKey] = getRelationsForObject(object, link, 'getObjectsIds')

                return acc;
            }, {});

            return {
                key: object?.id,
                id: object?.id,
                name: object?.name,
                ...relationValues,
            };
        });
    }, [objects, onlyFiltersMode, selectedFilters]);

    //* Старый формат строк без интеграции с бэком
    // const rows = useMemo(() => {
    //     return objects?.map(object => {
    //         const relationValues = relations?.reduce((acc, relation) => {
    //             // Предполагается, что нужно добавить значение отношения (может быть объект или свойство объекта)
    //             const relationKey = `relation_${relation?.id}`;
    //             const filterKey = `relation_${relation?.id}_filter`

    //             acc[relationKey] = getRelationsForObject(object, relation)
    //             acc[filterKey] = getRelationsForObject(object, relation, 'getObjectsIds')

    //             return acc;
    //         }, {});

    //         return {
    //             key: object?.id,
    //             id: object?.id,
    //             name: object?.name,
    //             ...relationValues,
    //         };
    //     });
    // }, [objects, relations, onlyFiltersMode, selectedFilters]);

    // console.log('rows', rows)
    // console.log('objects', objects)

    const customStyles = useMemo(() => (
        `
            .ant-table-cell-row-hover {
                background-color: ${darkenColor(backgroundColor, 20)} !important;
            }
            .ant-table-filter-dropdown {
                background-color: ${backgroundColor} !important;
                color: ${textColor} !important;
                border: 1px solid ${borderColor} !important;
            }
            .ant-select-selector {
                background-color: ${backgroundColor} !important;
                color: ${textColor} !important;
            }
            .ant-select-arrow {
                color: ${textColor} !important;
                background-color: ${backgroundColor} !important;
            }
            .ant-input-affix-wrapper {
                background-color: ${backgroundColor} !important;
            }
            .ant-input {
                background-color: ${backgroundColor} !important;
                color: ${textColor} !important;
            }
            .ant-input-clear-icon {
                color: ${textColor} !important;
                background-color: ${backgroundColor} !important;
            }
        `
    ), [])

    return (
        <>
            <style>{customStyles}</style>
            <EditTable
                columns={extensionColumns}
                tableId="report_objects_table"
                rows={rows}
                rowSelection={rowSelection}
                onChange={(table, filters) => {
                    setFilters(filters)
                }}
                scroll={{ y: 500 }}
                buttons={{
                    left: [
                        <Button
                            // type={onlyFiltersMode ? 'dashed' : 'primary'}
                            style={{
                                backgroundColor: onlyFiltersMode ? '#137afd' : '#e5e5e5',
                                color: onlyFiltersMode ? 'white' : 'black'
                            }}
                            key="button"
                            onClick={() => setOnlyFiltersMode(prev => !prev)}
                        >
                            {`Все объекты ${Object.values(selectedFilters).some(value => value?.length > 0)
                                ? ', удовлетворяющие фильтрам'
                                : ''}`}
                        </Button>
                    ]
                }}
            />
        </>

    )
}

export default ReportObjectsForm