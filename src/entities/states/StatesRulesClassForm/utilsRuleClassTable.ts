import { createOptions } from '@shared/ui/forms/Select/createOptions';


export const MY_ATTRIBUTE = 'Мой атрибут'

export  const getAttributesOptions = (class_ids, stateMachines, classesIm, attributes) => {
    /**
* возвращает массив id атрибутов, имеющихся у всех поданных классов, принимает массив id классов
*/

    const getCommonAttributesIds = (classes) => {
        const attributeCounts = {};

        classes.forEach(obj => {

            obj.attributes.forEach(attr => {
                const { id } = attr;

                attributeCounts[id] = (attributeCounts[id] || 0) + 1;
            });
        });

        return Object.keys(attributeCounts).filter(key => attributeCounts[key] > 1);

    }

    const attributesIds = getCommonAttributesIds(classesIm)

    /**
* фильтр атрибутов, у которых есть привязанные стейт-машины
*/
    const attributesIdsWithStateMachines = attributesIds
        .filter(id => stateMachines
            .some(machine => machine.attributes
                .some(attribute => attribute.id === +id)));
    /**
* фильтр классов, у которых есть привязанные стейт-машины
*/
    // const classesIdsWithStateMachines = class_ids
    //     .filter(id => stateMachines
    //         .some(machine => machine.classes
    //             .some(cl => cl.id === +id)));

    /**
* фильтр стейт-машин, в которых присутствуют заданный(ые) класс(ы) и атрибут(ы)
*/
    const commonStateMachines = stateMachines.filter(machine =>
        machine.attributes.some(attribute =>
            attributesIds.some(id => attribute.id === Number(id))
        ) &&
                    machine.classes.some(cl =>
                        class_ids.some(id => cl.id === Number(id))
                    )
    );

    const attributeIds = commonStateMachines
        .flatMap(item => item.attributes
            .map(attribute => attribute.id))
        .filter(id => attributesIdsWithStateMachines.includes(String(id)))

    return createOptions(attributes.filter(attribute => attributeIds.includes(attribute.id)))

}

export const getStateOptionsForIm = (class_ids, stateMachines) => {
    const optionsArray = [];
    const uniqStateIds: number[] = []

    class_ids.forEach(id => {
        const classStates = stateMachines.filter(
            machine => machine.classes.find(cl => cl.id === id)
                && machine.attributes.length == 0
        );

        if (classStates.length > 0) {
            const [{ states }] = classStates;

            states
                .sort((a, b) => a.state_section_id - b.state_section_id)
                .forEach(state => {
                    if (!uniqStateIds.includes(state.id)) {
                        optionsArray.push({
                            value: state.id,
                            state_section_id: state.state_section_id,
                            label: state.view_params ? state.view_params.name : undefined
                        })
                        uniqStateIds.push(state?.id)
                    }
                })
        }
    });

    const newOptionsArray = [];

    for (let i = 0; i < optionsArray.length; i++) {
        newOptionsArray.push(optionsArray[i]);

        if (i < optionsArray.length - 1 &&
            optionsArray[i].state_section_id !== optionsArray[i + 1].state_section_id) {
            newOptionsArray.push({ value: 'separator', label: '–––Секция–––', disabled: true });
        }
    }

    return newOptionsArray;

};

export const getStateOptionsForClass = (id: number, stateMachines) => {

    if (stateMachines) {
        const classStateMachines = stateMachines
            .filter(machine => machine.classes.find(cl => cl.id === id) && machine.attributes.length == 0);
        const classStates = classStateMachines.map(classState => {
            return { states: classState.states, machineName: classState.name, machineId: classState.id }
        })
        const options = classStates?.map((item) => {
            const statesArray = item.states.map((state) => ({
                value: state.id,
                state_section_id: state.state_section_id,
                label: state.view_params ? state.view_params.name : undefined,
                machineName: item.machineName,
            }));

            statesArray.unshift(
                { value: 'separator',
                    label: `Обработчик состояний ${item.machineName}`,
                    disabled: true })

            return statesArray

        })

        const sortedOptionsArray = options.map((nestedArray) => {

            return nestedArray.sort((a, b) => a.state_section_id - b.state_section_id)

        });

        const flatSortedOptionsArray = sortedOptionsArray.flat();


        const newOptionsArray = [];

        for (let i = 0; i < flatSortedOptionsArray.length; i++) {
            newOptionsArray.push(flatSortedOptionsArray[i]);

            if (i < flatSortedOptionsArray.length - 1 &&
                flatSortedOptionsArray[i].state_section_id !== flatSortedOptionsArray[i + 1].state_section_id) {
                newOptionsArray.push({ value: 'separator', label: '–––Секция–––', disabled: true });
            }
        }


        return newOptionsArray;
    }

}

export const getStateOptionsForClassAttribute = (id: number, stateMachines, class_ids) => {

    if (stateMachines.length > 0) {

        const attributeStateMachines = stateMachines.map(machine => {

            const hasAttribute = machine.attributes.some(attribute => attribute.id === id);

            const hasClass = machine.classes.some(cl => class_ids.includes(cl.id));

            return hasAttribute && hasClass ? machine : null;
        }).filter(machine => machine !== null);

        const attributeStates = attributeStateMachines.map(attributeState => attributeState.states).flat()


        attributeStates.sort((a, b) => a.state_section_id
        - b.state_section_id);


        const options = attributeStates?.map(item => ({
            value: item.id,
            state_section_id: item.state_section_id,
            label: item.view_params ? item.view_params.name : undefined
        }));

        const newOptionsArray = [];

        for (let i = 0; i < options.length; i++) {
            newOptionsArray.push(options[i]);

            if (i < options.length - 1 &&
                    options[i].state_section_id !== options[i + 1].state_section_id) {
                newOptionsArray.push({ value: 'separator', label: '–––', disabled: true });
            }
        }
        
      

        return newOptionsArray;
    }
}

export const checkIndexes = (fieldValues) => {
    const resultArray = [];

    if (fieldValues !== null && fieldValues !== undefined) {
        const updatedRules = Object.values(fieldValues)

        let maxId = 0

        for (let i = 0; i < updatedRules.length; i++) {
            const keys = Object.keys(updatedRules[i])

            const currId = Number(keys[1].split('-')?.[1])

            maxId = currId > maxId ? currId : maxId

            resultArray?.push({
                [keys[0]]: updatedRules[i][keys[0]],
                [keys[1]]: updatedRules[i][keys[1]],
                [keys[2]]: updatedRules[i][keys[2]],
                [keys[3]]: updatedRules[i][keys[3]],
                [keys[4]]: updatedRules[i][keys[4]],
            });
        }

        return { maxId, resultArray }
    }

    return { maxId: -1, resultArray: [] }
}

export  const alignKeys = (data) => {
    const alignedData = [];

    let index = 0;

    for (const item of data) {
        const keys = Object.keys(item);
        const alignedItem = {};

        for (const key of keys) {
            const match = key.match(/(\D+)-(\d+)/);

            if (match) {
                const [, prefix, number] = match;

                alignedItem[`${prefix}-${index}`] = item[key];
            } else {
                alignedItem[key] = item[key];
            }
        }

        alignedData.push(alignedItem);
        index++;
    }

    return alignedData;
}

export const getClassesOptions = (childrenClasses, store) => {

    const childrenClassesData = store.data.filter(item => childrenClasses.includes(item.id));

    const optionsForClasses = createOptions(childrenClassesData);

    const iAmObject = { value: MY_ATTRIBUTE, label: MY_ATTRIBUTE };

    optionsForClasses.unshift(iAmObject);

    return optionsForClasses.map(item => ({
        ...item,
        disabled: false
    }))

};