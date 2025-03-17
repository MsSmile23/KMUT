import { ECIconView, IECIconView } from '@shared/ui/ECUIKit/common/ECIconView/ECIconView'
import { ITargetBlockItem } from '../types/types'
import { IGroupPolicyRule } from '@shared/types/group-policies'

export const formatMenuToFlatList = (groupPolicyItems: ITargetBlockItem[]) => {
    return groupPolicyItems?.reduce((acc, item) => {
        const targetClassId = item.target_class_id
        const childObjects = item.children.map(child => {
            const pathCls = [
                ...(child?.except_path_classes || []).map(cls => ({ id: cls, use: false })),
                ...(child?.path_classes || []).map(cls => ({ id: cls, use: true }))
            ]

            return {
                target_class_id: targetClassId,
                filter_class_id: child?.filter_class_id,
                filter_objects: child?.filter_objects || [],
                path_direction_up: child?.path_direction_up !== 'false',
                path_classes: pathCls,
            }
        })

        return [...acc, ...childObjects]
    }, [])
}

export const createIcon = (icon: IECIconView['icon']) => <ECIconView icon={icon || 'FileOutlined'} />

export const getClass = (classId, getClassByIndex) => {
    return typeof classId === 'string' ? { name: 'Все', id: '*', icon: null } : getClassByIndex('id', classId)
}

export const formatValueToMenu =  (
    value: string | IGroupPolicyRule[],
    getClassByIndex: (field: string, value: number) => any,
    childrenKey: number,
    createIcon: (icon: IECIconView['icon']) => JSX.Element
) => {
    let localChildrenKey = childrenKey
    const parseValue: IGroupPolicyRule[] = typeof value === 'string' ? JSON.parse(value) : value
    const formatValue: ITargetBlockItem[] = parseValue?.reduce((acc, rule) => {
        const indexExistTarget = acc.findIndex(item => item.target_class_id === rule.target_class_id) 
        const targetClass = getClass(rule.target_class_id, getClassByIndex)
        const childClass = getClass(rule.filter_class_id, getClassByIndex)

        const newChild = {
            key: localChildrenKey++,
            label: childClass?.name,
            filter_class_id: rule?.filter_class_id,
            icon: createIcon(childClass?.icon),
            path_direction_up: rule?.path_direction_up === true ? 'true' : 'false',
            filter_objects: rule?.filter_objects,
            path_classes: rule?.path_classes?.filter(cls => cls.use === true).map(cls => cls.id),
            except_path_classes: rule?.path_classes?.filter(cls => cls.use === false).map(cls => cls.id),
        }

        if (indexExistTarget !== -1) {
            acc[indexExistTarget].children.push(newChild)
        } else {
            acc.push({
                key: localChildrenKey++,
                target_class_id: rule.target_class_id,
                label: targetClass?.name,
                icon: createIcon(targetClass?.icon),
                children: [newChild]
            })
        }

        return acc
    }, [])

    return { formatValue, localChildrenKey }
}