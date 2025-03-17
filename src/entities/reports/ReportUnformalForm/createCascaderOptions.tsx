import { IClass } from '@shared/types/classes'
import { IRelation } from '@shared/types/relations'
import { getClassFromClassesStore } from '@shared/utils/common'
import { Divider } from 'antd'
import { ReactNode } from 'react'

type TCascaderOption = { 
    value: string, 
    label: string | ReactNode, 
    children: TCascaderOption[]
}
type TCreateCascaderOptions = (data: {
    allClasses: IClass[],
    selectedClasses: IClass[] 
    relations: IRelation[], 
    parent?: string
}) => TCascaderOption[]

export const createCascaderOptions: TCreateCascaderOptions = ({ 
    selectedClasses,
    allClasses,
    relations,
    parent 
}) => {
    return selectedClasses.filter((cls) => cls.package_id === 1).reduce((menu, cls) => {
        const classReactKey = `${parent ? `${parent}__` : ''}classId-${cls.id}`
        const attributes = cls?.attributes || []

        return [
            ...menu,
            {
                value: `${classReactKey}`,
                label: <div style={{ color: 'black', fontWeight: 600, cursor: 'default' }}>{cls.name}</div>,
                disabled: true,
            },
            {
                value: `${classReactKey}__attributes`,
                label: (
                    <div>
                        {/* название класса обязательно должно быть в "кавычках", т.к. парсится при выборе атрибута */}
                        {/* см. displayRender в Cascader'e в ReportUnformalForm */}
                        {`Атрибуты класса "${cls.name}"`}
                        <Divider style={{ margin: 0 }} />
                    </div>
                ),
                children: attributes.map((attr) => ({
                    value: `${classReactKey}__attributeId-${attr.id}`,
                    label: `${attr.name}`,
                }))
            },
            ...relations
                .filter(
                    (rel) =>
                        rel.left_class_id === cls.id && getClassFromClassesStore(rel.right_class_id)?.package_id === 1
                )
                .map((rel) => {
                    const childClasses = allClasses.filter((childClass) => {
                        return (
                            childClass.id === rel.right_class_id &&
                            getClassFromClassesStore(rel.right_class_id)?.package_id === 1
                        )
                    })

                    return {
                        value: `${classReactKey}__relationId-${rel.id}__rightClassId-${rel.right_class_id}`,
                        label: getClassFromClassesStore(rel.right_class_id)?.name,
                        children: createCascaderOptions({
                            selectedClasses: childClasses,
                            allClasses,
                            relations,
                            parent: classReactKey,
                        }),
                    }
                }),
        ]
    }, [])
}