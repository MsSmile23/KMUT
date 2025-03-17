import { IPackage } from './packages'

export interface IClassStereotype {
    id: number
    mnemo: string
    name: string
    package_id: number
    package: IPackage
}