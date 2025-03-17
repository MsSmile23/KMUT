export interface IGroupPolicy {
    id?: number,
    name: string,
    super_admin: boolean,
    accounts?: any[],
    rules: IGroupPolicyRule[] | []
}

type TPathCLasses = {
    id: number,
    use: boolean,
}

export interface IGroupPolicyRule {
    id: number,
    group_policy_id: number,
    target_class_id: number | string,
    path_direction_up: boolean,
    path_classes: TPathCLasses[],
    filter_class_id: number,
    filter_objects: any
}