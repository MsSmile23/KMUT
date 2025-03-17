import { Cascader } from 'antd'
import { FC, useEffect, useState } from 'react'
import { selectRelations, useRelationsStore } from '@shared/stores/relations'
import { selectClasses, useClassesStore } from '@shared/stores/classes'
import { IRelation } from '@shared/types/relations'
import { PACKAGE_AREA } from '@shared/config/entities/package'
import { IClass } from '@shared/types/classes'
import type { DefaultOptionType } from 'antd/es/cascader'
import './popup.css'
import { getClassFromClassesStore } from '@shared/utils/common'
interface IOption {
    value: string;
    label: string;
    children?: IOption[];
}

interface IPlainAbstractGroup {
    id: number
    name: string
    groupIds: string[]
}

export const ClassesCascader: FC<{
    onChange?: (value: number[]) => void
    value?: number[],
    placeholder?: string
    single?: boolean
    disabled?: boolean
}> = ({ 
    onChange,
    value,
    placeholder,
    single = false,
    disabled = false
}) => {
    const [cascaderClasses, setCascaderClasses] = useState<number[]>(value)

    const relations = useRelationsStore(selectRelations)
    const classes = useClassesStore(selectClasses)
    const abstrConditions = (rel: IRelation) => ([
        rel.left_class.package_id === PACKAGE_AREA.SUBJECT,
        rel.right_class.package_id === PACKAGE_AREA.SUBJECT,
        rel.relation_type === 'generalization',
        rel.right_class.is_abstract,
    ])


    const filteredClasses = relations.reduce((acc, rel) => {

        const newRel = {
            ...rel,
            left_class: getClassFromClassesStore(rel.left_class_id),
            right_class: getClassFromClassesStore(rel.right_class_id),
        }

        if (abstrConditions(newRel).every(item => item == true)) {
            if (!acc.grouped[rel.right_class_id]) {
                acc.grouped[rel.right_class_id] = []
                !newRel.left_class.is_abstract && acc.grouped[newRel.right_class_id].push(newRel.left_class)
            } else {
                !newRel.left_class.is_abstract && acc.grouped[newRel.right_class_id].push(newRel.left_class)
            }
            const isInArray = acc.plain.findIndex(item => item.id === newRel.left_class_id)

            if (isInArray === -1) {
                acc.plain.push({
                    id: newRel.left_class_id,
                    name: newRel.left_class.name,
                    groupIds: [String(rel.right_class_id)]
                })
            } else {
                acc.plain[isInArray].groupIds.push(String(newRel.right_class_id))
            }
        }

        return acc
    }, {
        plain: [] as IPlainAbstractGroup[],
        grouped: {
            0: [],
        } as Record<string, IClass[]>

    })

    for (const group in filteredClasses.grouped) {
        if (filteredClasses.grouped[group].length === 0 && group !== '0') {
            delete filteredClasses.grouped[group]
        } 
    }

    classes.forEach(sc => {
        if (sc.package_id === PACKAGE_AREA.SUBJECT &&
            !sc.is_abstract &&
            filteredClasses.plain.findIndex(absClass => absClass.id === sc.id) === -1
        ) {
            filteredClasses.plain.push({
                id: sc.id,
                groupIds: ['0'],
                name: sc.name
            })
            filteredClasses.grouped['0'].push(sc)
        }
    })

    const defaultPathsGroups: Record<string, string[]> = (Array.isArray(cascaderClasses) ? cascaderClasses : [])
        ?.reduce((acc, cl) => {
            const groups = filteredClasses.plain.find(pl => pl.id === cl)?.groupIds

            groups?.forEach(g => {
                if (!acc[g]) {
                    acc[g] = [String(cl)]
                } else {
                    acc[g].push(String(cl))
                }
            })

            return acc
        }, {} as Record<string, string[]>) ?? {}
    const defaultPaths: string[][] = Object.entries(defaultPathsGroups)?.reduce((acc, [groupId, arr]) => {
        if (arr.length === filteredClasses.grouped?.[groupId]?.length) {
            acc.push([groupId])
        } else {
            arr.forEach(item => {
                acc.push([groupId, item])
            })
        }

        return acc
    }, [] as string[][]) ?? []

    const cascaderOptions: IOption[] = Object.entries(filteredClasses.grouped).reduce((acc, [groupId, arr]) => {
        acc.push({
            value: groupId,
            label: groupId !== '0'
                ? classes.find(item => item.id === Number(groupId)).name
                : 'Классы без группы',
            // : 'Остальные классы',
            children: arr
                .map(item => ({
                    value: String(item.id),
                    label: item.name
                }))
                .sort((a, b) => a.label.localeCompare(b.label))
        })

        return acc
    }, [] as IOption[])

    const [cascaderPaths, setCascaderPaths] = useState<string[][]>(defaultPaths)

    const onCascaderChange = (selectedOptions: string[][]) => {
        const cpGrouped = cascaderPaths.reduce((acc, cp) => {
            if (cp.length === 1) {
                filteredClasses.grouped[cp[0]].forEach(item => {
                    if (!acc[item.id]) {
                        acc[item.id] = [cp[0]]
                    } else {
                        acc[item.id].push(cp[0])
                    }
                })
            } else {
                if (!acc[cp[1]]) {
                    acc[cp[1]] = [cp[0]]
                } else {
                    acc[cp[1]].push(cp[0])
                }
            }

            return acc
        }, {})

        const soGrouped = selectedOptions.reduce((acc, so) => {
            if (so.length === 1) {
                filteredClasses.grouped[so[0]].forEach(item => {
                    if (!acc[item.id]) {
                        acc[item.id] = [so[0]]
                    } else {
                        acc[item.id].push(so[0])
                    }
                })
            } else {
                if (!acc[so[1]]) {
                    acc[so[1]] = [so[0]]
                } else {
                    acc[so[1]].push(so[0])
                }

            }

            return acc
        }, {})

        const diffObj = {}
        const cpLength = Object.keys(cpGrouped).length
        const soLength = Object.keys(soGrouped).length

        if (cpLength < soLength) {
            Object.entries(soGrouped).forEach(([id, arr]) => {
                if (!cpGrouped[id]) {
                    diffObj[id] = arr
                }
            })
        }

        const diff = Object.keys(soGrouped).reduce((acc, id) => {
            if (cpGrouped[id]) {
                if (soGrouped[id].length < cpGrouped[id].length) {
                    acc[id] = 'delete'
                } else {
                    acc[id] = 'equal'
                }
            } else {
                acc[id] = 'add'
            }

            return acc
        }, {})

        Object.keys(cpGrouped).forEach((id) => {
            if (!diff[id]) {
                diff[id] = 'delete'
            }
        }, )

        const diffIds = Object.entries(diff).reduce((acc, [id, status]) => {
            if (status !== 'delete') {
                acc.push(Number(id))
            }

            return acc
        }, [] as number[])

        const groupsIsFull = Object.entries(filteredClasses.grouped).reduce((acc, [groupId, arr]) => {
            const isFull = arr.every(item => {
                return diffIds.includes(item.id)
            })
            
            acc[groupId] = isFull

            return acc
        }, {})
        
        const newPathsWithDiff: string[][] = Object.entries(groupsIsFull).reduce((acc, [id, isFull]) => {
            if (isFull) {
                acc.push([id])
            }

            return acc
        }, [] as string[][])

        Object.entries(diff).forEach(([id, status]) => {
            if (status !== 'delete') {      
                const currClassGroup = filteredClasses.plain.find(pl => pl.id === Number(id)).groupIds
                
                currClassGroup.forEach(group => {
                    if (!groupsIsFull[group]) {
                        newPathsWithDiff.push([group, id])
                    }
                })
            }

        })

        setCascaderPaths(newPathsWithDiff)

        setCascaderClasses(Object.keys(soGrouped).map(item => Number(item)))

        if (onChange) {
            onChange(Object.keys(soGrouped).map(item => Number(item)))
        }
        
    }

    useEffect(() => {
        if (value?.length === 0) {

            setCascaderPaths([])
            
            setCascaderClasses([])
        }
    }, [value])

    const handleClear = () => {
        setCascaderClasses([])
    }


    const filterCascader = (inputValue: string, path: DefaultOptionType[]) => path.some(
        (option) => (option.label as string).toLowerCase().indexOf(inputValue.toLowerCase()) > -1,
    )
        
    return (
        <Cascader
            style={{
                width: '100%',
            }}
            options={cascaderOptions}
            onChange={(selectedOptions: string[][]) => {
                onCascaderChange(selectedOptions)
            }}
            onClear={handleClear}
            multiple={single ? null : true}
            showSearch={{ filter: filterCascader }}
            autoClearSearchValue={false}
            maxTagCount="responsive"
            defaultValue={cascaderPaths}
            value={cascaderPaths}
            popupClassName="customPopup"
            placeholder={placeholder ?? 'Выберите классы'}
            disabled={disabled}
        />
    )
}