import { ClassesCascader } from '@entities/classes/ClassesCascader/ClassesCascader'
import { PACKAGE_AREA } from '@shared/config/entities/package'
import { useGetObjects } from '@shared/hooks/useGetObjects'
import { selectClasses, useClassesStore } from '@shared/stores/classes'
import { selectObjectByIndex, selectObjects, useObjectsStore } from '@shared/stores/objects'
import { Select } from '@shared/ui/forms'
import { findChildObjectsByBaseClasses, findParentsByBaseClasses } from '@shared/utils/objects'
import { Card, Form, Switch } from 'antd'
import { FC, useEffect, useMemo } from 'react'

/* 
Для применения в компонентах, необходимо передать коллбек в getFormValues (откуда можно получить параметры)
и передать пропс (пример из виджета {...widget?.linkedObjectsForm}). 
В типизации добавить поле {linkedObjectsForm?: ILinkedObjectsForm,}
Параметры:
- baseObject - конкретный объект, задается, если макет создается только под него;
- targetClasses - id целевых классы;
- connectingClasses - id классов связующих классов;
- linksDirection - направление поиска (вверх/вниз);
- chosenObjectsIds - выборочные объекты (из целевых классов);
- linkedObjectsIdsByBaseObject - связанные объекты базового объекта (если он выбран);
*/

const linksDirectionList = [
    { value: 'parents', label: 'Вверх' },
    { value: 'childs', label: 'Вниз' }
]

export interface ILinkedObjectsForm {
    baseObject?: number,
    targetClasses: number[],
    connectingClasses: number[],
    linksDirection: 'parents' | 'childs',
    chosenObjectsIds?: number[],
    linkedObjectsIdsByBaseObject?: number[],
    showFilters?: boolean
    linkedObjectsClasses?: number
    linkedObjects?: number[]
}

interface ILinkedObjectsProps extends ILinkedObjectsForm {
    getFormValues: (data: ILinkedObjectsForm ) => void
}

const LinkedObjects: FC<ILinkedObjectsProps> = ({ getFormValues, ...props }) => {
    const linkedObjectsValues = props
    const [form] = Form.useForm()
    const valuesForm: ILinkedObjectsForm = Form.useWatch([], form)
    // const objectsStore = useObjectsStore(selectObjects)
    const objectsStore = useGetObjects()
    const getObjectByIndex = useObjectsStore(selectObjectByIndex)
    const objectOptions = objectsStore?.map((obj) => ({ label: obj.name, value: obj.id }))

    //Получаем объекты целевых классов
    const objectsTargetClassesOptions = valuesForm?.targetClasses?.flatMap((cl) => getObjectByIndex('class_id', cl))
        ?.map(({ id, name }) => ({ label: name, value: id }))?.filter(
            (item, index, array) =>
                array.findIndex((element) => element.value === item.value) === index)

    //Если задан базовый объект, находим его связанные объекты
    const linkedObjectsIdsByBaseObject = useMemo(() => {
        const object = getObjectByIndex('id', valuesForm?.baseObject)

        switch (true) {
            //Поиск родительских объектов
            case object && valuesForm?.linksDirection == 'parents': {
                return findParentsByBaseClasses({
                    object: object,
                    targetClasses: valuesForm?.targetClasses,
                    linkedClasses: valuesForm?.connectingClasses,
                    objects: objectsStore,
                }).map((item) => item.id)
            }
            //Поиск дочерних объектов
            case object && valuesForm?.linksDirection == 'childs': {
                return findChildObjectsByBaseClasses({
                    childClassIds: valuesForm?.connectingClasses,
                    targetClassIds: valuesForm?.targetClasses,
                    currentObj: object,
                })
            }
            default:
                return undefined
        }
    }, [valuesForm?.baseObject,  
        valuesForm?.targetClasses, 
        valuesForm?.connectingClasses, 
        valuesForm?.linksDirection, 
        objectsStore])

    //Если задан базовый объект, выводим его связанные объекты либо все объекты целевых классов
    const chosenObjectsIdsOptions = valuesForm?.baseObject 
        ? objectOptions.filter(obj => linkedObjectsIdsByBaseObject?.includes(obj.value))
        : objectsTargetClassesOptions

    useEffect(() => {
        getFormValues({ ...form.getFieldsValue(), linkedObjectsIdsByBaseObject })
    }, [valuesForm, linkedObjectsIdsByBaseObject])
    const filterOption = (input, option, ) => {
        return (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
    }
    const storeClasses = useClassesStore(selectClasses)
        .reduce((acc, item) => {
            if (!item.is_abstract && item.package_id === PACKAGE_AREA.SUBJECT) {
                acc.push({
                    value: item?.id,
                    label: item?.name
                })
            }

            return acc
        }, [])
        .sort((a, b) => a?.label.localeCompare(b?.label))

    const linkedObjectsOptions = useMemo(() => {
        let localLinkedObjects = []

        if (valuesForm?.linkedObjectsClasses) {
            localLinkedObjects = getObjectByIndex('class_id', valuesForm?.linkedObjectsClasses)
        }

        return localLinkedObjects
    }, [valuesForm?.linkedObjectsClasses])

    return (
        <Card style={{ marginBottom: 10 }} title="Поиск связанных объектов" type="inner">
            <Form
                form={form}
                layout="vertical"
                initialValues={linkedObjectsValues}
            >
                <div style={{ display: 'flex', gap: 20 }}>
                    <Form.Item name="targetClasses" label="Целевые классы" style={{ width: '40%' }}>
                        <ClassesCascader />
                    </Form.Item>
                    <Form.Item name="connectingClasses" label="Связующие классы" style={{ width: '40%' }}>
                        <ClassesCascader />
                    </Form.Item>
                    <Form.Item label="Направление поиска" name="linksDirection" style={{ width: '20%' }}>
                        <Select placeholder="Направление поиска" options={linksDirectionList} />
                    </Form.Item>
                </div>
                <div style={{ display: 'flex', gap: 20 }}>
                    <Form.Item name="baseObject" label="Базовый объект" style={{ width: 'calc(40% - 20px)' }} >
                        <Select placeholder="Текущий объект" options={objectOptions} virtual={true} />
                    </Form.Item>
                    <Form.Item name="chosenObjectsIds" label="Объекты для вывода" style={{ width: 'calc(40% - 10px)' }}>
                        <Select
                            placeholder="Все найденные объекты"
                            mode="multiple"
                            options={chosenObjectsIdsOptions}
                        />
                    </Form.Item>
                </div>

                <div style={{ display: 'flex', alignItems: 'center' }}>
                        Дополнительная фильтрация
                    <Form.Item
                        valuePropName="checked"
                        name="showFilters"
                        style={{
                            flex: 1,
                            marginBottom: 0,
                            marginLeft: '5px',
                        }}
                    >
                        <Switch />
                    </Form.Item>
                </div>

                {valuesForm?.showFilters && (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: 24,
                            padding: 10,
                            border: '1px solid #d9d9d9',
                            marginBottom: 10,
                        }}
                    >
                        <Form.Item
                            name="linkedObjectsClasses"
                            label="Класс связанных объектов"
                            style={{
                                flex: 1,
                                marginBottom: 0,
                            }}
                        >
                            <Select
                                // style={{ maxWidth: 300 }}
                                placeholder="Выберите класс объекта"
                                options={storeClasses}
                                allowClear
                                autoClearSearchValue={true}
                                showSearch
                                filterOption={filterOption}
                            />
                        </Form.Item>
                        <Form.Item
                            name="linkedObjects"
                            label="Связанные объекты"
                            style={{
                                flex: 1,
                                marginBottom: 0,
                            }}
                        >
                            <Select
                                placeholder="Выберите объекты"
                                options={linkedObjectsOptions?.map((item) => {
                                    return {
                                        value: item?.id,
                                        label: item?.name,
                                    }
                                })}
                                allowClear
                                showSearch
                                autoClearSearchValue={false}
                                filterOption={filterOption}
                                mode="multiple"
                            />
                        </Form.Item>
                    
                    </div>
                )}

                
            </Form>
        </Card>
    )
}

export default LinkedObjects