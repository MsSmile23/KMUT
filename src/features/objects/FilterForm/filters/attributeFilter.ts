import { FilterFunctionType } from '../types';

export type AttributeFilter = {
    attributeId: number,
    comparision:
        'equals' | 'not_equals' | 'string_includes' | 'not_string_includes' | 'greaterThan' |
        'greaterThanOrEqual' | 'lessThan' | 'lessThanOrEqual' | 'array_includes' |
        'not_array_includes',
    value: any,
}

export const attributeFilter: FilterFunctionType<AttributeFilter> = (object, { attributeId, comparision, value }) => {
    const object_attribute = object.object_attributes.find(obj_attr => obj_attr.attribute_id === attributeId);

    if (!object_attribute) {
        return false;
    }

    const attributeType = object_attribute.attribute.data_type?.inner_type;
    const attributeValue: any = object_attribute.attribute_value;

    if (comparision === 'equals') {
        return attributeValue === value;
    }

    if (comparision === 'not_equals') {
        return attributeValue !== value;
    }

    if (comparision === 'string_includes') {
        if (attributeType !== 'string' || typeof value !== 'string') {
            console.error(
                `Аттрибут ${object_attribute.attribute.name} должен быть типа string для ${comparision}`
            );
            
            return false;
        }
        
        return attributeValue.toLowerCase().includes(value.toLowerCase());
    }

    if (comparision === 'not_string_includes') {
        if (attributeType !== 'string' || typeof value !== 'string') {
            console.error(
                `Аттрибут ${object_attribute.attribute.name} должен быть типа string для ${comparision}`
            );
            
            return false;
        }
        
        return !attributeValue.toLowerCase().includes(value.toLowerCase());
    }

    if (comparision === 'greaterThan') {
        if (attributeType !== 'double' && attributeType !== 'integer' || typeof value !== 'number') {
            console.error(
                `Аттрибут ${object_attribute.attribute.name} должен быть типа double/integer для ${comparision}`
            );
            
            return false;
        }
        
        return attributeValue > value;
    }

    if (comparision === 'greaterThanOrEqual') {
        if (attributeType !== 'double' && attributeType !== 'integer' || typeof value !== 'number') {
            console.error(
                `Аттрибут ${object_attribute.attribute.name} должен быть типа double/integer для ${comparision}`
            );
            
            return false;
        }
        
        return attributeValue >= value;
    }

    if (comparision === 'lessThan') {
        if (attributeType !== 'double' && attributeType !== 'integer' || typeof value !== 'number') {
            console.error(
                `Аттрибут ${object_attribute.attribute.name} должен быть типа double/integer для ${comparision}`
            );
            
            return false;
        }
        
        return attributeValue < value;
    }

    if (comparision === 'lessThanOrEqual') {
        if (attributeType !== 'double' && attributeType !== 'integer' || typeof value !== 'number') {
            console.error(
                `Аттрибут ${object_attribute.attribute.name} должен быть типа double/integer для ${comparision}`
            );
            
            return false;
        }
        
        return attributeValue <= value;
    }

    if (comparision === 'array_includes') {
        if (attributeType !== 'array' || Array.isArray(value)) {
            console.error(
                `Аттрибут ${object_attribute.attribute.name} должен быть типа array для ${comparision}`
            );
            
            return false;
        }
        
        return attributeValue.includes(value);
    }

    if (comparision === 'not_array_includes') {
        if (attributeType !== 'array' || Array.isArray(value)) {
            console.error(
                `Аттрибут ${object_attribute.attribute.name} должен быть типа array для ${comparision}`
            );
            
            return false;
        }
        
        return !attributeValue.includes(value);
    }

    return true;
}