import { selectGetClassById, useClassesStore } from '@shared/stores/classes'
import { ButtonAddRow, ButtonDeleteRow } from '@shared/ui/buttons'
import { ECSelect } from '@shared/ui/forms'
import { SortableList } from '@shared/ui/SortableList'
import { findLinkedClassesByRootClass } from '@shared/utils/classes'
import { Button } from 'antd/lib'
import { useEffect, useState } from 'react'
import { findAllChildClasses } from './utils'
import { IRootClassLinkFormProps, TFieldConstructionItemAtribute, TFieldConstructorItem } from './types'
import { DownOutlined, FolderOpenOutlined, FolderOutlined, RightOutlined } from '@ant-design/icons'
import { ECIconView } from '@shared/ui/ECUIKit/common/ECIconView/ECIconView'


const RootClassLinkForm = ({
    root,
    direction,
    items,
    setItems,
    agregationOptions
}: IRootClassLinkFormProps) => {

    const getClassById = useClassesStore(selectGetClassById)

    const [selectedClass, setSelectedClass] = useState<TFieldConstructorItem | null>({})
    const [selectedAtribute, setSelectedAtribute] = useState<Record<number, TFieldConstructionItemAtribute | null>>({})
    const [selectedAgregation, setSelectedAgregation] = useState<Record<number, string | null>>({})
    const [newClassParentItem, setNewClassParentItem] = useState<TFieldConstructorItem | null>(null)
    const [attributeFormVisible, setAttributeFormVisible] = useState({})
    const [openAtributeList, setOpenAtributeList] = useState({})
    const [openAll, setOpenAll] = useState(false)

    // console.log('selected', selectedClass)
    // console.log('items', items)
    // console.log('selectedAgregation', selectedAgregation)

    const handleClassChange = (parentId: number, newItem: TFieldConstructorItem) => {
        setSelectedClass((prev) => ({ ...prev, [parentId]: newItem }));
    };

    const handleAttributeChange = (classId: number, newAttr: TFieldConstructionItemAtribute) => {
        setSelectedAtribute((prev) => ({ ...prev, [classId]: newAttr }));
    };

    const handleAggregationChange = (classId: number, newAggr: string) => {
        setSelectedAgregation((prev) => ({ ...prev, [classId]: newAggr }));
    };

    const generateClassesOptions = (root_class: number, level: number): TFieldConstructorItem[] => {

        if (!root_class) { return }

        const childrenCls = findLinkedClassesByRootClass(root_class, direction, 0)[0]
            .filter((clsId: number) => {
                const clsOperation = getClassById(clsId).operations.map(operation => operation.mnemo)

                return clsOperation.includes('reportable')
            })

        const selectedItems = items?.map(item => item?.value)

        const selectedChildren = items.filter(item => item?.parentId == root_class)
        const selectedChildrenMultiplicity = selectedChildren
            ? selectedChildren?.map(item => {
                const itemCls = getClassById(item.value)

                return itemCls.multiplicity_right
            })
                .filter(Boolean)
            : []

        return childrenCls.map((clsId: number) => {
            const cls = getClassById(clsId)

            // // O-3 ограничение //TODO Отбрасывать по мультиплисити релейшена, а не класса
            // const targetMultiplicityFlag = direction === 'parents'
            //     ? (cls.multiplicity_right <= 1) && cls.multiplicity_right !== null
            //     : true

            const childrenMultiplicityFlag = selectedChildrenMultiplicity
                ?.every(value => (value <= 1) && (value !== null))

            if (!selectedItems.includes(cls.id)
                // && targetMultiplicityFlag 
                && childrenMultiplicityFlag) { //O-4 
                return {
                    value: cls.id,
                    name: cls.name,
                    label: cls.name,
                    level,
                    parentId: root_class,
                    attributes: []
                } as TFieldConstructorItem
            }
        })
            .filter(Boolean) as TFieldConstructorItem[]
    }

    const generateAttributeOptions = (id: number): TFieldConstructionItemAtribute[] => {

        const itemSelectedAttrs = items?.find(item => item.value === id)?.attributes.map(attr => attr.value)

        const attrs = getClassById(id)?.attributes.filter(attr => !itemSelectedAttrs.includes(attr.id))

        return attrs?.map(attr => ({
            id: attr?.id,
            value: attr?.id,
            label: attr?.name,
            hasAgregation: attr?.history_to_cache || attr?.history_to_db
        })) || []
    }

    //* Фунция проверки добавления класса
    //* Если хотя бы один флаг ложный, то класс добавить не можем
    const checkingClassCanBeAdded = (item) => {

        // Если нет опций, то отключаем кнопку
        const optionsFlag = generateClassesOptions(item?.value, item?.level + 1)?.length > 0

        //  O-3 в функции генерации опций для класса

        //O-4 - в функции генерации опций для класса

        // О-5
        const historyAtributeFlag = !item?.attributes
            ?.some(attr => attr?.hasAgregation && attr?.agregation == 'raw_values')

        return optionsFlag && historyAtributeFlag
    }

    useEffect(() => {

        const attributeLists = {}
        const itemsIds = items?.map(item => item.value) || []

        if (openAll) {
            for (let i = 0; i < itemsIds.length; i++) {
                attributeLists[itemsIds[i]] = true
            }
        } else {
            for (const [key] of Object.keys(openAtributeList)) {
                attributeLists[key] = false
            }
        }

        setOpenAtributeList(attributeLists)

    }, [openAll])

    const generateAgregationOptions = (item) => {
        if (items.find(el => el?.parentId == item?.value)) {
            return agregationOptions.filter(option => option.value !== 'raw_values')
        }

        return agregationOptions
    }

    return (
        <div style={{ overflow: 'auto', height: 400, width: '1000px' }} key={`${root}_${direction}`}>
            {generateClassesOptions(root, 0)?.length > 0 &&
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 20 }}>
                    <ECSelect
                        onChange={(id, newItem: TFieldConstructorItem) => handleClassChange(root, newItem)}
                        value={selectedClass[root] || null}
                        placeholder="Выберите связанный класс"
                        style={{ width: 600 }}
                        options={generateClassesOptions(root, 0)}
                        disabled={checkingClassCanBeAdded(root)} //TODO тоже ввести проверку на добавление
                        virtual
                    />
                    <ButtonAddRow
                        disabled={!selectedClass[root]}
                        onClick={() => {
                            setItems([...items, selectedClass[root]]);
                            handleClassChange(root, null);
                        }}
                    />
                </div>}
            {
                // openAll 
                // ? <FolderOpenOutlined onClick={() => setOpen}/>
                // : <FolderOutlined />
                <Button
                    style={{ marginTop: 10 }}
                    icon={openAll ? <FolderOpenOutlined /> : <FolderOutlined />}
                    onClick={() => setOpenAll((prev) => !prev)}
                />
            }
            {items.map((item, idx) => {

                return (
                    <>
                        <div
                            style={{
                                marginLeft: `${item?.level * 20}px`,
                                width: '650px',
                                border: '1px solid rgb(217, 217, 217)',
                                marginTop: 10,
                                borderRadius: 8
                            }}
                            key={item.value}
                        >
                            {/* Заголовок блока */}
                            <div
                                style={{
                                    // width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: 6,
                                    backgroundColor: 'rgba(217, 217, 217, 20%)'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <Button
                                        style={{ width: 60, padding: 0, height: 'max-content' }}
                                        title="Добавить атрибут"
                                        onClick={() => {
                                            setOpenAtributeList({
                                                ...openAtributeList, [item.value]: openAtributeList[item.value]
                                                    ? !openAtributeList[item.value]
                                                    : true
                                            })
                                        }}
                                    >
                                        {openAtributeList[item.value]
                                            ? <DownOutlined style={{ fontSize: 12 }} />
                                            : <RightOutlined style={{ fontSize: 12 }} />}
                                        {`( ${item?.attributes?.length || 0} )`}
                                    </Button>
                                    {item.name}
                                </div>
                                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>

                                    <Button
                                        style={{ width: 80, padding: 0, height: 'max-content' }}
                                        title="Добавить атрибут"
                                        onClick={() => {
                                            setAttributeFormVisible({
                                                ...attributeFormVisible, [item.value]: attributeFormVisible[item.value]
                                                    ? !attributeFormVisible[item.value]
                                                    : true
                                            })
                                        }}
                                        type={attributeFormVisible[item.value] ? 'primary' : 'default'}
                                        disabled={generateAttributeOptions(item.value)?.length == 0}
                                    >+ Атрибут
                                    </Button>
                                    <Button
                                        style={{ width: 80, padding: 0, height: 'max-content' }}
                                        title="Добавить класс"
                                        onClick={() => {
                                            setNewClassParentItem(item)
                                        }}
                                        // disabled={generateClassesOptions(item.value, item.level + 1).length == 0}
                                        disabled={!checkingClassCanBeAdded(item)}
                                    >+ Класс
                                    </Button>
                                    <ButtonDeleteRow
                                        onClick={() => {
                                            const childClasses = findAllChildClasses(item.value, items);
                                            const childClassIds = new Set(childClasses.map(child => child.value));

                                            childClassIds.forEach(id => setAttributeFormVisible({
                                                ...attributeFormVisible,
                                                [id]: false
                                            }))
                                            setAttributeFormVisible({ ...attributeFormVisible, [item.value]: false })
                                            setItems(items
                                                .filter(el => !childClassIds.has(el.value) && el.value !== item.value));
                                        }}
                                    />

                                </div>
                            </div>
                            {/* Форма добавления атрибута */}
                            <div
                                style={{
                                    display: attributeFormVisible[item.value] ? 'flex' : 'none',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: 5,
                                    borderTop: '1px solid rgb(217, 217, 217)',
                                    backgroundColor: 'rgba(217, 217, 217, 20%)'
                                }}
                            >
                                <ECSelect
                                    style={{
                                        width: 440,
                                        height: 24,
                                    }}
                                    placeholder="Выберите атрибут"
                                    options={generateAttributeOptions(item.value)}
                                    onChange={(idx, value: TFieldConstructionItemAtribute) =>
                                        handleAttributeChange(item.value, value)}
                                    value={selectedAtribute[item.value]?.value}
                                />
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    {selectedAtribute[item.value] && selectedAtribute[item.value]?.hasAgregation &&
                                        <ECSelect
                                            style={{
                                                width: 160,
                                                height: 24,
                                            }}
                                            placeholder="Выберите агрегацию"
                                            disabled={
                                                !selectedAtribute[item.value] ||
                                                !selectedAtribute[item.value]?.hasAgregation
                                            }
                                            options={generateAgregationOptions(item)}
                                            onChange={(idx, value: string) => {
                                                handleAggregationChange(item.value, value)
                                            }}
                                            value={selectedAgregation[item.value] || 'current_time'}
                                        />}

                                    <ButtonAddRow
                                        disabled={!selectedAtribute[item.value]}
                                        onClick={() => {
                                            setItems(items.map(el => {
                                                if (el.value == item.value) {
                                                    return {
                                                        ...el,
                                                        attributes: [
                                                            {
                                                                ...selectedAtribute[item.value],
                                                                ...(!!selectedAgregation[item.value] &&
                                                                    { agregation: selectedAgregation[item.value] }
                                                                )
                                                            },
                                                            ...el.attributes
                                                        ]
                                                    }
                                                }

                                                return el
                                            }))
                                            setAttributeFormVisible({ ...attributeFormVisible, [item.value]: false })
                                            handleAggregationChange(item.value, null)
                                            handleAttributeChange(item.value, null);
                                        }}
                                    />
                                </div>

                            </div>
                            <div
                                style={{
                                    display: openAtributeList[item.value] ? 'flex' : 'none',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderTop: '1px solid rgb(217, 217, 217)',
                                }}
                            >
                                {/* Сортируемый список */}
                                {item?.attributes?.length === 0 && <div>{'<'}Выберите атрибуты{'>'}</div>}
                                {item?.attributes &&
                                    <SortableList
                                        listStyle={{ padding: 6, margin: 0 }}
                                        items={item.attributes}
                                        onChange={(newAttributesOrder: TFieldConstructionItemAtribute[]) => {
                                            setItems((prevItems) =>
                                                prevItems.map((el) =>
                                                    el.value === item.value
                                                        ? { ...el, attributes: newAttributesOrder }
                                                        : el
                                                )
                                            );
                                        }}
                                        renderItem={(attrItem: TFieldConstructionItemAtribute) => (
                                            <SortableList.Item
                                                id={attrItem.value}
                                                customItemStyle={{
                                                    padding: 0,
                                                    margin: -2,
                                                    borderRadius: '8px',
                                                    height: 30,
                                                    width: 640
                                                }}
                                            >
                                                <div
                                                    key={attrItem.value}
                                                    style={{
                                                        width: '100%',
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center'
                                                    }}
                                                >
                                                    <div style={{ width: 400, marginLeft: 10 }}>
                                                        {attrItem?.label}
                                                    </div>
                                                    <div style={{ width: 160 }}>
                                                        {attrItem?.agregation?.label || 'Текущее значение'}
                                                    </div>
                                                    <ButtonDeleteRow
                                                        onClick={() => setItems(
                                                            items.map(el => {
                                                                if (item.value === el.value) {
                                                                    return {
                                                                        ...el,
                                                                        attributes: el.attributes
                                                                            .filter(attr => {
                                                                                return attr.value !== attrItem.value
                                                                            })
                                                                    }
                                                                }

                                                                return el
                                                            })
                                                        )}
                                                    />
                                                </div>
                                                <SortableList.DragHandle
                                                    customDragHandlerStyle={{
                                                        padding: '15px 10px',
                                                        alignSelf: 'baseline',
                                                        marginTop: '-5px',
                                                    }}
                                                />
                                            </SortableList.Item>
                                        )}
                                    />}
                            </div>
                        </div>
                        {newClassParentItem && newClassParentItem.value === item.value &&
                            <div
                                style={{
                                    marginLeft: `${item?.level * 10}px`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 10,
                                    marginTop: 10
                                }}
                            >
                                <ECSelect
                                    onChange={(id, newItem: TFieldConstructorItem) =>
                                        handleClassChange(item.value, newItem)}
                                    value={selectedClass[item.value] || null}
                                    placeholder="Выберите связанный класс"
                                    style={{ height: 24, width: 600, marginLeft: `${item?.level * 10}px` }}
                                    options={generateClassesOptions(item.value, item?.level + 1)}
                                    virtual
                                />
                                <ButtonAddRow
                                    disabled={!selectedClass[newClassParentItem.value]}
                                    onClick={() => {
                                        const updatedItems = [];

                                        items.forEach((el) => {
                                            updatedItems.push(el);

                                            if (el?.value === item?.value && selectedClass[item?.value]) {
                                                updatedItems.push(selectedClass[item?.value]);
                                            }
                                        });
                                        setItems(updatedItems);
                                        handleClassChange(item?.value, null);
                                        setNewClassParentItem(null);
                                    }}
                                />
                                <ButtonDeleteRow onClick={() => setNewClassParentItem(null)} />
                            </div>}
                    </>
                )
            })}
        </div>
    )
}

export default RootClassLinkForm