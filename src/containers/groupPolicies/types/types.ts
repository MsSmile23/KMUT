export interface ITargetBlockItem {
    key: number,
    label: string,
    icon: JSX.Element,
    target_class_id?: number | string,
    children?: IRuleItem[]
}

export interface IRuleItem extends Omit<ITargetBlockItem, 'children' | 'classId'> {
    onClick?: () => void,
    filter_class_id: number,
    path_classes?: number[],
    filter_objects?: number[],
    path_direction_up?: string,
    except_path_classes?: number[],
}

export enum ModalType {
    CHANGE_TARGET_CLASS = 'changeTargetClass',
    TABLE_PREVIEW = 'tablePreview',
    DEFAULT = ''
}

export const textModalTitle = {
    [ModalType.CHANGE_TARGET_CLASS]: 'Целевой класс',
    [ModalType.TABLE_PREVIEW]: 'Выбранные объекты',
}