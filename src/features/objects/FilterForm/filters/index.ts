import { applyFilter } from './applyFilter';
import { applyFiltersToObject } from './applyFiltersToObject';
import { attributeFilter } from './attributeFilter';
import { hasLinkFilter } from './hasLinkFilter';
import { propertyFilter } from './propertyFilter';
import { textFilter } from './textFilter';

const allFilters = {
    hasLinkFilter,
    attributeFilter,
    propertyFilter,
    textFilter,
}

const utils = {
    applyFiltersToObject,
    applyFilter,
}

export {
    utils,
    allFilters,
}