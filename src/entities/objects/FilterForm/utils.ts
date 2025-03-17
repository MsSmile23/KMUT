import { IFilterFormProps, IOption, IOptionList } from './types';

export const defaultFormValues: IFilterFormProps = {
    classFilter: {
        classIds: [],
        stereotypeClassIds: [],
        abstractClassIds: [],
    },
    attrFilter: [{
        currentAttr: undefined,
        attrValue: undefined
    }],
    stateFilter: {
        stateType: 'objects',
        stateStereotypeIds: [],
        stateMachineIds: [],
        stateIds: []
    },
    objectFilter: {
        objectIds: []
    },
    relationFilter: [{
        id: undefined,
        stereoId: undefined,
        type: undefined,
        objectIds: []
    }]
}

export const sortGroupedList = (list: IOptionList[]) => {
    return  list
        .reduce((acc, group) => {
            if (group.options?.length > 0) {
                acc.push({
                    ...group,
                    options: group.options.sort((a, b) => {
                        return a.label.localeCompare(b.label, undefined, { numeric: true })
                    })
                })
            }

            return acc
        }, [] as IOptionList[])
        .sort((a, b) => String(a.title).localeCompare(String(b.title)))
}

export const relationTypesList: IOption[] = [
    {
        value: 'aggregation',
        label: 'Агрегация',
    }, {
        value: 'association',
        label: 'Ассоциация',
    }, {
        value: 'generalization',
        label: 'Генерализация',
    }, {
        value: 'dependency',
        label: 'Зависимость',
    }, {
        value: 'composition',
        label: 'Композиция',
    }
]