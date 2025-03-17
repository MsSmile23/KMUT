import dayjs, { Dayjs } from 'dayjs'
import { periods } from './data'
import { IObject } from '@shared/types/objects'
import { useObjectsStore } from '@shared/stores/objects'
import { uniqBy } from 'lodash'

/**
 * Создает стили для скрытия компонента
 * 
 * @param closed - флаг скрытия компонента
 * @returns стили для скрытия компонента
 */
export const createHiddenStyle = (closed: boolean) => ({ 
    opacity: closed ? 0 : 1,
    height: closed ? 0 : 'auto',
    visibility: closed ? 'hidden' : 'visible'
} as const)

/**
 * Управление завершение шагов формы создания отчета
 * 
 * @param name - название формы
 * @param forms - объекты, которое содержит ant design api всех используемых форм
 * @param setCompletedSteps - функция обновления состояния завершения всех шагов
 * @param setUnformalReportVisible - функция обновления видимости (наличия) нефрмализованного отчета
 * @param setStepCompleted - функция обновления состояния завершения текущего шага (проверяет заполнение поле ввода)
 * @param setClassesIds - функция обновления ключей классов
 */
export const handleFormsChange = ({
    name,
    forms,
    setCompletedSteps,
    unformalReportVisible,
    setUnformalReportVisible,
    setStepCompleted,
    setClassesIds
}: {
    name: string
    // невозможно экспортировать тип Forms из Antd
    forms: any,
    unformalReportVisible?: boolean
    setCompletedSteps: (value: React.SetStateAction<Record<string, boolean>>) => void,
    setUnformalReportVisible: (value: React.SetStateAction<boolean>) => void,
    setStepCompleted: (values: any, formName: string, nextFormName?: string) => void,
    setClassesIds: (value: React.SetStateAction<number[]>) => void
}) => {
    setCompletedSteps((steps) => ({ ...steps, created: false }))

    const form = forms[name]

    if (name === 'reportTypeForm') {
        const values = form.getFieldsValue(['reportType'])

        setUnformalReportVisible(values.reportType === 9999)
        setStepCompleted(values, name, 'formatsForm')
    }

    if (name === 'formatsForm') {
        const requiredFields = ['classes', 'formats']
        const values = form.getFieldsValue(requiredFields)
        
        setClassesIds(values?.classes || [])
        setStepCompleted(values, name, 'scheduleForm')
    }

    if (name === 'scheduleForm') {
        const { period = [null, null] } = form.getFieldsValue(true)

        setStepCompleted(period, name, unformalReportVisible ? 'unformalReportForm' : 'objectsForm')
    }

    if (name === 'unformalReportForm') {
        const values = form.getFieldsValue(true)

        setStepCompleted(values, name, 'objectsForm')
    }

    if (name === 'objectsForm') {
        const values = form.getFieldsValue(['objects'])

        setStepCompleted(values, name, 'created')
    }                
}

/**
 * Создает диапазон для DatePicker на основании выбранного предустановленного значения (названия)    
 * 
 * @param type - название предустановленного шаблона
 * @returns диапазон для DatePicker
 */
export const getRangeByDayjs = (type: keyof typeof periods.labels): [Dayjs, Dayjs] => {
    switch (type) {
        case 'hour':
            return [dayjs().subtract(1, 'hour'), dayjs()];
        case 'week':
            return [dayjs().subtract(1, 'week'), dayjs()];
        case 'month':
            return [dayjs().subtract(1, 'month'), dayjs()];

        case 'days':
            return [
                dayjs().subtract(1, 'days').startOf('day'),
                dayjs().subtract(1, 'days').endOf('day'),
            ];
        case 'today':
            return [dayjs().startOf('day'), dayjs().endOf('day')];
        case 'hours24':
            return [dayjs().subtract(1, 'days'), dayjs()];
        case 'lastWeek':
            return [
                dayjs().subtract(1, 'week').startOf('week'),
                dayjs().subtract(1, 'week').endOf('week'),
            ];
        case 'currentWeek':
            return [dayjs().startOf('week'), dayjs().endOf('week')];
        case 'lastMonth':
            return [
                dayjs().subtract(1, 'month').startOf('month'),
                dayjs().subtract(1, 'month').endOf('month'),
            ];
        case 'quarter':
            return [
                dayjs().subtract(1, 'quarter').startOf('quarter'),
                dayjs().subtract(1, 'quarter').endOf('quarter'),
            ];
        case 'currentQuarter':
            return [dayjs().startOf('quarter'), dayjs().endOf('quarter')];
        default:
            return [null, null];
    }
};

/**
 * Функция для поиска связанных родительских объектов выбранного объекта. Поиск происходит по линкам.
 * 
 * @param currentObject - текущий объект, относительно которого осуществляется поиск
 * @param linkedClassesIds - ключи классов, по которым фильтруются родительские классы объекта
 * @returns связанные объекты текущего объекта
 */
export const findParentsByClasses = (currentObject: IObject, linkedClassesIds: number[]) => {
    const findObject = (id: number) => useObjectsStore.getState().getByIndex('id', id)
    const checkLinked = (id: number) => linkedClassesIds.includes(id)

    const res: IObject[] = []

    const findParents = (currentObject: IObject) => {
        currentObject.links_where_left.forEach((link) => {
            const linkObject = findObject(link.right_object_id)

            if (checkLinked(linkObject?.class_id)) {
                res.push(linkObject)

                return
            }

            findParents(linkObject)
        })
    }

    findParents(currentObject)

    return uniqBy(res, 'id')
}

/**
 * Фильтрует массив объектов по принадлежности родительских классов объекта указанным связанным классам 
 * 
 * @param mainObjects - исходные объекты, которые необходимо отфильтровать
 * @param linkedClassesIds - ключи связанных классов
 * @returns массив объектов
 */
export const filterObjectsByLinkedClasses = (mainObjects: IObject[], linkedClassesIds: number[]) => {
    return mainObjects.filter((obj) => {
        const findObject = (id: number) => useObjectsStore.getState().getByIndex('id', id)
        const checkLinked = (id: number) => linkedClassesIds.includes(id)
    
        let linked = false
    
        const findParents = (currentObject: IObject) => {
            currentObject?.links_where_left?.forEach((link) => {
                const linkObject = findObject(link.right_object_id)
    
                if (checkLinked(linkObject?.class_id)) {
                    linked = true

                    return
                }

                findParents(linkObject)
            })
        }
    
        const findChilds = (currentObject: IObject) => {
            currentObject?.links_where_right?.forEach((link) => {
                const linkObject = findObject(link.left_object_id)
    
                if (checkLinked(linkObject?.class_id)) {
                    linked = true

                    return
                }
    
                findChilds(linkObject)
            })
        }
    
        findParents(obj)
        findChilds(obj)

        return linked
    })
}