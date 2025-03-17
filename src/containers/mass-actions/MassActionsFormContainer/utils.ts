import { postMassAction } from '@shared/api/Mass-actions/Models/postMassActions/postMassAction';
import { postMediaFiles } from '@shared/api/MediaFiles/Models/postMediaFiles/postMediaFiles';
import { useClassesStore } from '@shared/stores/classes';
import { useObjectsStore } from '@shared/stores/objects';
import { useRelationsStore } from '@shared/stores/relations';
import { IAttribute } from '@shared/types/attributes';
import { IRelation } from '@shared/types/relations';

export const onSubmit = async (data, resetFields) => {
    try {
        if (data.type === 'objects-import') {
            const response = await postMediaFiles({ files: [data.uploadedFile.file] });
            const id = response.data[0].id;
 
            await postMassAction({
                type: data.type,
                name: data.name,
                description: data.description,
                params: { write: true },
                source_file_ids: [id],
            }); 

            resetFields();
        }

        if (data.type === 'objects-export') {
            const newMassActionsObject = {
                type: data.type,
                names: data.name,
                description: data.description,
                params: {
                    name: data.output_object_name, 
                    class: data.classes_selector ?? [],
                    obj: data.object_selector ?? [],
                    'no-attr': data.output_atribute,
                    attr: data.selected_atribute ?? [],
                    'no-rel': data.output_relations,
                    rel: data.selected_relations ?? [],
                    'no-styles': data.output_styles,
                    'no-comment': data.output_comments
                },
            };

            await postMassAction(newMassActionsObject);

            resetFields();
        }
    } catch (error) {
        console.error('Ошибка добавления: ', error);
    }
};

export const getAttributeOptions = (
    objects_selector: number[] = [], 
    classes_selector: number[] = []
) => {

    const store = classes_selector?.length > 0 ? useClassesStore.getState() : useObjectsStore.getState();
    const selectedItems = classes_selector?.length > 0 ? classes_selector : objects_selector;

    const isClassesAttribute = store.getByIndex('id', selectedItems[0])?.class

    const attributes = selectedItems.reduce((accumulator, item) => {
        const itemAttributes = isClassesAttribute ? 
            store.getByIndex('id', item)?.class?.attributes :
            store.getByIndex('id', item)?.attributes;
        
        return itemAttributes ? accumulator.concat(itemAttributes) : accumulator;
    }, []);
    const uniqAttributes = uniqObjectsArray(attributes, ['id'])
    
    return uniqAttributes.map(
        attr => ({ value: attr.id, label: attr.name })
    )
}

export const getRelationsOptions = (
    objects_selector: number[] = [], 
    classes_selector: number[] = []
) => {
    let classesIds = classes_selector;
    const relationsStore = useRelationsStore.getState()
    const objectsStore = useObjectsStore.getState()

    if (classes_selector.length < 1) {
        classesIds = [...new Set(objects_selector
            .map(obj => objectsStore.getByIndex('id', obj).class_id))];
    } 

    const relationsObjectsArray = classesIds.reduce((accum: IRelation[], currentClass: number) => {
        return accum
            .concat(relationsStore.getByIndex('left_class_id', currentClass), 
                relationsStore.getByIndex('right_class_id', currentClass));
    }, []);

    const uniqueRelations = uniqObjectsArray(relationsObjectsArray, ['id']);

    return uniqueRelations.map(rel => ({ 
        value: rel.id, 
        label: `${rel.left_class.name} -> ${rel.right_class.name}`  
    }));
}

/**
 * Возвращает массив уникальных объектов на основе указанных ключей.
 * @template T
 * @param {T[]} sourceArray - Исходный массив объектов.
 * @param {(keyof T)[]} hashKeys - Массив ключей для создания хэша каждого объекта.
 * @returns {T[]} - Массив уникальных объектов.
 */

const uniqObjectsArray = <T>(
    sourceArray: T[], 
    hashKeys: (keyof T)[]
): T[] => {
    const uniqueObjectsHash = new Set<string>();
    const outputObjsArray: T[] = [];
    const arrayLength = sourceArray.length;

    for (let i = 0; i < arrayLength; i++) {
        const obj = sourceArray[i];
        const hash = hashKeys.map(key => String(obj[key])).join('');

        if (!uniqueObjectsHash.has(hash)) {
            outputObjsArray.push(obj);
            uniqueObjectsHash.add(hash);
        }
    }

    return outputObjsArray;
};

interface Filters {
    classesIds?: number[];
    objectIds?: number[];
}

type OutputType = 'attributes' | 'selectOptions';

type ResponseType = {
    attributes: IAttribute[];
    selectOptions: { value: number; label: string }[];
};

/**
 * Получает аттрибуты или опции аттрибутов на основе выбранных объектов или классов.
 * @param {Object} [filters={}] - Фильтры для выбора объектов или классов.
 * @param {number[]} [filters.classesIds] - Массив id классов.
 * @param {number[]} [filters.objectIds] - Массив id объектов.
 * @param {'attributes' | 'selectOptions'} [outputType='attributes'] - Тип возвращаемого значения.
 * @returns {(IAttribute[] | { value: number; label: string }[])} - Опции атрибутов или варианты выбора.
 */

export const getAttributes = (
    filters: Filters = {}, 
    outputType: OutputType = 'attributes'
): ResponseType[OutputType] => {
    const store = filters.classesIds?.length > 0 ? useClassesStore.getState() : useObjectsStore.getState();
    const selectedItems = filters.classesIds?.length > 0 ? filters.classesIds : filters.objectIds;

    if (!selectedItems || selectedItems.length === 0) {
        return outputType === 'attributes' ? [] : [];
    }

    const isClassesAttribute = store.getByIndex('id', selectedItems[0])?.class;

    const attributes = selectedItems.reduce((accumulator: IAttribute[], item: number) => {
        const itemData = store.getByIndex('id', item);
        const itemAttributes = isClassesAttribute ? 
            itemData?.class?.attributes :
            itemData?.attributes;
        
        return itemAttributes ? accumulator.concat(itemAttributes) : accumulator;
    }, []);

    const uniqAttributes = uniqObjectsArray(attributes, ['id']);

    if (outputType === 'attributes') {
        return uniqAttributes;
    } else {
        return uniqAttributes.map(attr => ({
            value: attr.id,
            label: attr.name
        }));
    }
};

export const warning = 'Выберите хотя бы один класс или объект для продолжения заполнения формы экспорта'