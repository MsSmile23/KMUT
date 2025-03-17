import { QuickTreeSettings } from './types';

// ключ главной собирательной ноды "все объекты"
export const QUICKTREE_MAIN_GROUP_KEY = 'all_objects';

// жизнь кэша статусов
export const STATUS_TAGS_CACHE_DURATION = 20000;

export const INITIAL_QUICKTREE_SETTINGS: QuickTreeSettings = {
    expandedKeys: [],
    horizontalScroll: true,
    textFilterValue: '',
}