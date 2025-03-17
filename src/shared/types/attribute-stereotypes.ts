import { IPackage } from './packages'

export interface IAttributeStereotype {
    id: number
    mnemo: string
    name: string
    package_id: number
    params: any
    package: IPackage
}