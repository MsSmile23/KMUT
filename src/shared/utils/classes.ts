import { IRelation } from '@shared/types/relations';
import { getRelationProps } from './relations';
import { IClass, TFindChildsByBaseClasses } from '@shared/types/classes';
import { getClassById } from '@shared/api/Classes/Models/getClassById/getClassById';
import { PACKAGE_AREA } from '@shared/config/entities/package';
import { getClassFromClassesStore } from './common';
import { selectClassByIndex, useClassesStore } from '@shared/stores/classes';
import { useRelationsStore } from '@shared/stores/relations';

export const filterClassesByDirection = (dirType: 'left' | 'right', relations: IRelation[]) => {
    return relations.reduce((result, rel) => {
        const relProps = getRelationProps(rel)
        const field = relProps.dirType === dirType ? 'main' : 'additional'

        return { ...result, [field]: Array.from(new Set([...result[field], relProps.classId ]).values()) }
    }, {
        main: [] as number[],
        additional: [] as number[]
    })
}

/**
 * Функция возвращает объект по пакету из двух массивов
 * - "основные" классы, то есть классы не участвующие в "правых" связях
 * - "дополнительные" классы, то есть связанные с другими через "правые" связи
 * @param relations
 * @param classes
 * @param package_id
 */
export const getMainAddsClasses = (relations: IRelation[], classes: IClass[], package_id = 1) => {
    const classesByRole = {
        all: [],
        main: [],
        additional: [],
    }

    const classesPackage = classes.filter(cls => cls.package_id == package_id && !cls.is_abstract)

    classesByRole.additional = relations.reduce( (acc, relation) => {
        const relProps = getRelationProps(relation)

        if (relProps.dirType == 'right' && getClassFromClassesStore(relation.left_class_id)?.package_id == package_id) {
            acc.push(relation.left_class_id)
        }

        return acc
    }, [] )

    classesByRole.main = classesPackage.reduce( (acc, cls) => {
        if (!classesByRole.additional.includes(cls.id)) {
            acc.push(cls.id)
        }

        return acc
    }, [] )

    classesByRole.all = classesPackage.map(item => item.id)

    return classesByRole
}


export const getRelationsForClassForm = (relations: IRelation[], classId?: number) => {
    const relationsToRender = classId
        ? [...relations]?.filter((el) => el.left_class_id === classId || el.right_class_id === classId)
        : relations

    return relationsToRender?.filter((relation) => relation.virtual !== true)
}
/**
 * поиск дочерних классов по композиции и агрегации
 */

export const findChildClasses = (relations: IRelation[], classId?: number) => {

    const childClasses = [];

    relations?.forEach((relation) => {

        if (relation.left_class_id === classId && relation.relation_type === 'composition' ||
        relation.left_class_id === classId && relation.relation_type === 'aggregation'
        ) {
            const childId = relation.right_class_id;

            if (childId !== classId) {
                childClasses.push(relation.right_class_id);
                const grandchildren = findChildClasses(relations, relation.right_class_id,)

                childClasses.push(...grandchildren);
            }

        }

    })

    return childClasses
}

//получение нескольких классов по массиву id
export const getClassesByIds = async (ids: number[]) => {
    try {

        const responses = await Promise.all(ids.map(id => getClassById({ id: String(id) })));

        return responses;
    } catch (error) {
        console.error('Error fetching data for classes:', error);
        throw error;
    }
};

/**
 * Получение дочерних классов на основе базовых классов
 * @param relations - массив релейшенов, по которому будет проводиться поиск классов
 * @param classIds - массив id базовых классов
 * @param relationTypes - массив искомых типов релейшенов (по умолчанию - aggregation, composition)
 * @param classFilters - массив фильтров для классов (если пусто = не фильтруем)
 * @param depth - глубина поиска
 * @param package_area - область пакета
 * @returns массив идентификаторов дочерних классов
 */
export const findChildsByBaseClasses: TFindChildsByBaseClasses = ({
    relations = [],
    classIds = [],
    relationTypes = ['aggregation', 'composition',],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    classFilters = [],
    depth,
    package_area
}) => {
    const convert = (arr: number[]) => JSON.stringify([...arr.sort()])

    let level = 0

    
    const childClassesByLevels = []
    const connectedClasses = 
    relations
        .filter((rel) => {
            const packageCondition = package_area && 
            getClassFromClassesStore(rel.left_class_id)?.package_id === PACKAGE_AREA?.[package_area] &&
            getClassFromClassesStore(rel.right_class_id)?.package_id === PACKAGE_AREA?.[package_area]  

            const isSourceInClassIds = classIds.includes(rel.right_class_id)

            return package_area 
                ? packageCondition && isSourceInClassIds
                : isSourceInClassIds
        })
        .filter((rel) => relationTypes.includes(rel.relation_type))
        .map((rel) => {
            return {
                childClassId: rel.left_class_id,
                abstract: getClassFromClassesStore(rel.left_class_id)?.is_abstract,
                baseClassesIds: relations
                    .filter((rel2) => rel2.left_class_id === rel.left_class_id)
                    .map(({ right_class_id }) => right_class_id)
            }
        })
        .reduce((acc, item) => {
            if (classIds.every((id) => item.baseClassesIds.includes(id))) {
            // if (convert(item.baseClassesIds) === convert(classIds)) {
                return [...acc, item]
            } else {
                return acc
            }
        }, [])
    
    // todo: типизировать item
    const childClassesIdsWithoutAbstract = connectedClasses
        .filter((item) => !item?.abstract)
        .map((item) => item?.childClassId)


    const filterUnique = (array: any[]) => [...new Set(array).values()]

    childClassesByLevels.push(filterUnique(childClassesIdsWithoutAbstract))

    const childClasses = filterUnique(connectedClasses.map((item) => item?.childClassId))

    const findChildsByConnectedClasses = (childClasses: number[]) => {
        if ((depth && level > depth) || childClasses.length === 0) {
            return []
        }

        const connectedClasses = relations
            .filter((rel) => {
                const packageCondition = package_area && 
                getClassFromClassesStore(rel.left_class_id)?.package_id === PACKAGE_AREA?.[package_area] &&
                getClassFromClassesStore(rel.right_class_id)?.package_id === PACKAGE_AREA?.[package_area]  

                const isClassInChildClasses = childClasses.includes(rel.right_class_id)

                return package_area 
                    ? packageCondition && isClassInChildClasses
                    : isClassInChildClasses       
            })
            .filter((rel) => [...relationTypes, 'generalization'].includes(rel.relation_type))
            .map((rel) => getClassFromClassesStore(rel.left_class_id))
            .filter((cls) => ![...new Set(childClassesByLevels.flat()).values()].includes(cls.id))

        const connectedClassesIds = connectedClasses.map(({ id }) => id)

        childClassesByLevels.push(connectedClasses.filter((cls) => !cls.is_abstract).map(({ id }) => id))
        level = level + 1

        return findChildsByConnectedClasses(connectedClassesIds)
    }

    findChildsByConnectedClasses(childClasses)

    return childClassesByLevels.filter((arr) => arr.length > 0).flat()
}

type TFindLinkedClassesByRootClass = {
    root_class: number
    relationTypes?: string[]
    depth?: number
    package_area?: number
    direction: 'childs' | 'parents'
}

/**
 * Получение дочерних/родительских классов на основе корневого
 * @param root_class - id базового класса
 * @param relationTypes - массив искомых типов релейшенов (по умолчанию - aggregation, composition)
 * @param depth - глубина поиска. Если не указана - ищет до упора
 * @param package_area - область пакета
 * @param direction - направление поиска (вверх/вниз)
 * @returns массив идентификаторов дочерних классов
 */
export const findLinkedClassesByRootClass = (
    root_class,
    direction,
    depth = null,
    relationTypes = ['aggregation', 'composition', 'association'], //TODO нужна ли association ???
    package_area = 1,
) => {
    const getRelByIndex = useRelationsStore.getState().getByIndex;

    // Результат с уровнями вложенности
    const levels = {};

    const targetClass = direction === 'childs'
        ? 'left_class'
        :  'right_class'

    // Рекурсивная функция для обхода дерева
    const traverse = (currentClass, currentDepth) => {
        // Проверяем, если depth указан и текущая глубина превышает его, выходим
        if (depth !== null && currentDepth > depth) {return}

        // Получаем релейшены для текущего класса
        const relations = direction === 'childs'
            ? getRelByIndex('right_class_id', currentClass)
            : getRelByIndex('left_class_id', currentClass);

        // Фильтруем релейшены по типам и области пакета
        let filteredRelations = relations?.filter(rel => 
            relationTypes.includes(rel.relation_type) && rel[targetClass]?.package_id === package_area
        );

        // Ограничение О-3
        if (direction === 'parents') { 
            filteredRelations = filteredRelations?.filter(rel => rel.right_multiplicity_right)
        }

        // Получаем идентификаторы связанных классов
        const linkedClassIds = direction === 'childs'
            ? filteredRelations.map(rel => rel.left_class_id)
            : filteredRelations.map(rel => rel.right_class_id);

        // Если нет связанных классов и depth не указан, завершаем обход
        if (linkedClassIds.length === 0 && depth === null) {return}

        // Добавляем идентификаторы в соответствующий уровень
        if (!levels[currentDepth]) {levels[currentDepth] = new Set();}
        linkedClassIds.forEach(id => levels[currentDepth].add(id));

        // Рекурсивно обходим каждый связанный класс
        linkedClassIds.forEach(id => traverse(id, currentDepth + 1));
    };

    // Начинаем с корневого класса
    traverse(root_class, 0);

    // Преобразуем уровни из Set в массивы
    const result = Object.fromEntries(
        Object.entries(levels).map(([level, ids]) => [level, Array.from(ids)])
    );

    return result;
};