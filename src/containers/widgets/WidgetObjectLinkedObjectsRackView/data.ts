import { IRelation } from '@shared/types/relations';
import { DefaultOptionType } from 'antd/es/select';

export const rackGroupingOptions: DefaultOptionType[] = [
    { label: 'Группировка по расположению', value: 'multi' },
    { label: 'Одиночная стойка', value: 'single' }
]

export const rackAttributesFormItemsProps = [
    { name: 'unitOrder', label: 'Расположение юнита в стойке' },
    { name: 'rackSize', label: 'Количество юнитов в стойке' },
    { name: 'deviceSize', label: 'Сколько юнитов занимает устройство' },
    { name: 'maxPower', label: 'Максимальная мощность стойки' },
    { name: 'currentPower', label: 'Потребляемая мощность стойки' },
    { name: 'temperature', label: 'Температура окружающей среды' },
    { name: 'humidity', label: 'Влажность' },
]

export const createOptions = (data: any[], key?: string) => {
    return data.map((el) => ({ label: key ? ` ${el?.[key]} - ${el?.name}` : el?.name, value: el?.id,  }))
}

export const createRelationOptions = (relations: IRelation[], leftClassIds: number[], rightClassIds: number[]) => {
    return relations
        .filter((rel) => leftClassIds.includes(rel.left_class_id) || rightClassIds.includes(rel.right_class_id))
        .map((rel) => ({
            value: rel.id,
            label: `${rel.id} - ${rel.name}`
        }))
}