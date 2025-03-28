/* eslint-disable max-len */
export const REL_TYPES_DESCRIPTION = {
    association: 'Описывает отношения независимых классов. Полюса обладают атрибутами множественности, ролями и т.д.',
    aggregation: 'Отношение подчиненных классов. Например: «В школе могут быть АРМы, каждый АРМ принадлежит только одной школе»',
    composition: 'Отношение «Целое-часть». Подчиненный класс описывает составной элемент родительского. Например: «У зонда может быть от 1 до 4 интерфейсов, каждый из них обладает IP .. ',
    generalization: 'Отношение наследования. Например: «Зонд x86 расширяет Зонд специфическими атрибутами и поведением»',
    dependency: 'Значения атрибутов классов предметной области зависят от поставщика данных и динамически меняются'
}