export interface IStateEntity {
    state: number
    entity: number
}

export interface IStateEntities {
    objects: IStateEntity[]
    object_attributes: IStateEntity[]
}