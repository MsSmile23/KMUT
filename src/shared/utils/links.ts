import { RELATION_STEREOTYPE } from '@shared/config/relation_stereotypes';
import { IObject } from '@shared/types/objects';

/**
 * Находит необходимый линк (связь) объекта по мнемонике
 * 
 * @param mnemo - мнемоника стереотипа релейшена (отношения)
 * @param objectAttributes - объект с массивами линков
 * @returns линк (связь) объекта
 */
export const findObjectLinkByRelationStereotype = (mnemo: keyof typeof RELATION_STEREOTYPE, object: IObject) => {
    return [
        ...object.links_where_left,
        ...object.links_where_right
    ].find((link) => link?.relation?.relation_stereotype?.mnemo === RELATION_STEREOTYPE?.[mnemo])
}