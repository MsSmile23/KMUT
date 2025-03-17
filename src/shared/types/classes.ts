import { VISIBILITY } from '@shared/config/const'
import { IAttribute } from '@shared/types/attributes'
import { IECIconView } from '@shared/ui/ECUIKit/common/ECIconView/ECIconView'
import { IRelation, relationsTypes } from './relations'
import { PACKAGE_AREA } from '@shared/config/entities/package'
import { IClassStereotype } from './classes-stereotypes'

export interface IClass {
    id: number
    name: string
    icon: IECIconView['icon'] | null
    package_id: number
    visibility: keyof typeof VISIBILITY
    multiplicity_right: number | null
    multiplicity_left: number | null
    is_abstract: boolean
    class_stereotype_id: number
    class_stereotype?: IClassStereotype
    codename?: string | number | null
    objects?: Array<{
        id: number
        class_id: number
        name: string
        codename: string | number | null
    }> | null
    operations?: any[]
    attributes?: IAttribute[]
    pivot?: {
        attribute_id: IAttribute['id']
        class_id: IClass['id']
    }
    has_anonymous_objects?: boolean
}

export type TFindChildsByBaseClasses = (params: {
    relations: IRelation[]
    classIds: number[]
    relationTypes?: Array<keyof typeof relationsTypes>
    classFilters?: any[]
    depth?: number
    levels?: number[][]
    proxyChildClasses?: number[]
    package_area?: keyof typeof PACKAGE_AREA
}) => any[]