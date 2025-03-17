import { useOpen } from '@shared/hooks/useOpen'
import { IObject } from '@shared/types/objects'
import { findChildObjectsByBaseClasses, findParentsByBaseClasses } from '@shared/utils/objects'
import { FC, useMemo, useRef, useState, useLayoutEffect, Fragment } from 'react'
import { selectObjectStateEntity, useStateEntitiesStore } from '@shared/stores/state-entities';
import { selectState, useStatesStore } from '@shared/stores/states';
import { getStateViewParamsWithDefault } from '@shared/utils/states';
import { selectObjectByIndex, selectObjects, useObjectsStore } from '@shared/stores/objects'
import ObjectCardModal from '@features/objects/ObjectCardModal/ObjectCardModal'
import { MLGetObjectAttributeByBind } from '@shared/lib/MLKit/MLKit'
import { ECTooltip } from '@shared/ui/tooltips';
import { useMediaFiles } from '@shared/stores/mediaFiles';
import { ECIconView } from '@shared/ui/ECUIKit/common/ECIconView/ECIconView';
import { useGetObjects } from '@shared/hooks/useGetObjects';

/**
 * Отображает объекты поверх изображения на основе атрибутов.
 *
 * @param {IObjectsOverImageProps} props - Пропсы для компонента.
 * @param {number[]} props.objects - Массив идентификаторов объектов.
 * @param {boolean} props.loading - Флаг, указывающий на то, загружается ли компонент.
 * @param {number} props.height - Высота компонента.
 * @param {object} props.attributesBindProps - Объект атрибутов для изображения, координат.
 * @param {object} props.linkedObjectsSearchProps - Объект, содержащий свойства для поиска связанных объектов.
 * @param {boolean} props.fill - Флаг, указывающий, нужно ли заливать объекты.
 * @param {boolean} props.border - Флаг, указывающий, нужно ли отображать границу.
 * @param {'circle' | 'square' | 'squareWithState' | 'classIcon'} props.view - Тип отображения объектов.
 * @param {number} props.squareWidth - Ширина квадрата для отображения.
 * @param {number} props.squareHeight - Высота квадрата для отображения.
 * @param {number} props.stateWidth - Ширина отображения состояния.
 * @param {number} props.stateHeight - Высота отображения состояния.
 * @param {number} props.leftOffsetState - Смещение состояния влево.
 * @param {number} props.topOffsetState - Смещение состояния вверх.
 * @param {number} props.sideSize - Размер боковой области отображения.
 */

export interface IObjectsOverImageProps {
    objects?: number[]
    loading?: boolean
    height?: number,
    view?: 'circle' | 'square' | 'squareWithState' | 'classIcon',
    border?: boolean,
    fill?: boolean,
    squareWidth?: number,
    squareHeight?: number,
    stateWidth?: number,
    stateHeight?: number,
    leftOffsetState?: number,
    topOffsetState?: number,
    sideSize?: number,
    attributesBindProps?: {
        schemeAttributeId?: number,
        coordinateXAttributeId?: number,
        coordinateYAttributeId?: number,
        attributeMarkupId?: number,
        attributeSortId?: number,
    },
    linkedObjectsSearchProps?: {
        targetClasses?: number[]
        linkingClasses?: number[]
        parentObjectId?: number
        linksDirection: 'parents' | 'childs',
    }
}

export const ObjectsOverImage: FC<IObjectsOverImageProps> = ({
    objects,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    loading = false,
    height,
    attributesBindProps,
    linkedObjectsSearchProps,
    fill = true,
    border = true,
    view = 'circle',
    squareWidth = 2.6,
    squareHeight = 21,
    stateWidth = 44,
    stateHeight = 20,
    leftOffsetState = 28,
    topOffsetState = 80,
    sideSize = 15
}) => {
    const {
        targetClasses = [],
        linkingClasses,
        parentObjectId,
        linksDirection = 'childs'
    } = linkedObjectsSearchProps || {}

    const {
        schemeAttributeId,
        coordinateXAttributeId,
        coordinateYAttributeId,
        attributeMarkupId,
        attributeSortId,
    } = attributesBindProps || {}

    const modal = useOpen()
    const [objectId, setObjectId] = useState(0)
    const objectsStore = useGetObjects()

    const getObjectByIndex = useObjectsStore(selectObjectByIndex)
    const getState = useStateEntitiesStore(selectObjectStateEntity)
    const statuses = useStatesStore(selectState)
    const getFile = useMediaFiles(st => st.getMediaFileById)

    const [svgHeight, setSvgHeight] = useState<number | null>(null);
    const imgRef = useRef<HTMLImageElement>(null);

    const getObjectsById = () => {
        const objectsById: IObject[] = []

        objects.forEach((obj) => {
            const objectFull = getObjectByIndex('id', obj)

            if (objectFull) { objectsById.push(objectFull) }
        })

        return objectsById
    }

    const allObjects = objects?.length > 0 ? getObjectsById() : objectsStore

    // Находим сам объект
    const object = getObjectByIndex('id', parentObjectId)

    //Находим атрибут изображения
    const schemeImageId = schemeAttributeId ? JSON?.parse((object?.object_attributes || []).find((attr) => {
        return attr.attribute_id === schemeAttributeId
    })?.attribute_value) : undefined

    //Получаем url изображения (подложки)
    const schemeImageUrl = () => {
        const imageUrl = getFile(schemeImageId)?.url

        return {
            imageUrlFull: import.meta.env.VITE_API_SERVER + imageUrl,
            imageUrl: imageUrl
        }
    }

    useLayoutEffect(() => {
        const updateSvgHeight = () => {
            if (imgRef.current) {
                setSvgHeight(imgRef.current?.clientHeight);
            }
        };

        updateSvgHeight()

        const resizeObserver = new ResizeObserver(updateSvgHeight)

        if (imgRef.current) {
            resizeObserver.observe(imgRef.current);
        }

        return () => {
            if (imgRef.current) {
                resizeObserver.unobserve(imgRef.current);
            }
        }
    }, [])

    //Получаем значение атрибутов координат
    const getAttributeValue = (
        attributeId: number | undefined,
        objectAttributes: any[]) => {
        if (!attributeId) {
            return null
        }

        const result = MLGetObjectAttributeByBind({
            objectAttributeBindProps: { attribute_id: attributeId },
            objectAttributes
        });

        return result?.data?.attribute_value
    }

    const getCoordinatesFromParent = () => {
        const attrValue = getAttributeValue(attributeMarkupId, object?.object_attributes)

        if (attributeMarkupId) {
            return attrValue ? JSON.parse(attrValue) : []
        }

        return {}
    }

    //Получаем id связанных объектов для схемы
    const oidsFilter = useMemo(() => {
        switch (true) {
            //Поиск родительских объектов
            case object && linksDirection == 'parents': {
                return findParentsByBaseClasses({
                    object: object,
                    targetClasses: targetClasses,
                    linkedClasses: linkingClasses,
                    objects: objectsStore,
                }).map((item) => item.id)
            }
            //Поиск дочерних объектов
            case object && linksDirection == 'childs': {
                return findChildObjectsByBaseClasses({
                    childClassIds: linkingClasses,
                    targetClassIds: targetClasses,
                    currentObj: object,
                })
            }
            default:
                return undefined
        }
    }, [object, targetClasses, linkingClasses, linksDirection, objectsStore])

    //Находим объекты по id
    const objectsForSchemeTmp: IObject[] = JSON.parse(JSON.stringify(allObjects.filter((obj) => {
        return oidsFilter?.includes(obj.id)
    })))

    //Готовим объекты для схемы
    const objectsForScheme = objectsForSchemeTmp?.reduce((acc, obj, i) => {
        const getStateId = getState(obj.id)
        const state = statuses(getStateId?.state)
        const stateParams = getStateViewParamsWithDefault(state)
        const coordinates = getCoordinatesFromParent()

        if (coordinateXAttributeId && coordinateYAttributeId) {
            const coordinateXValue = getAttributeValue(
                coordinateXAttributeId,
                obj.object_attributes
            )

            const coordinateYValue = getAttributeValue(
                coordinateYAttributeId,
                obj.object_attributes
            )

            if (!coordinateXValue || !coordinateYValue || coordinateXValue === null || coordinateYValue === null) {

                return acc
            }

            acc.push({
                classId: obj.class_id,
                id: obj.id,
                name: obj.name,
                status: state,
                icon: obj.class.icon,
                stateParams: stateParams,
                x: coordinateXValue,
                y: coordinateYValue,
            })
        } else if (getCoordinatesFromParent() !== undefined && getCoordinatesFromParent() !== null) {
            const orderValue = getAttributeValue(attributeSortId, obj.object_attributes)
            const key = attributeSortId ? Object.keys(coordinates).find(key => key === orderValue) : i

            let x = null
            let y = null

            if (key) {
                x = parseFloat(coordinates[key]?.x)
                y = parseFloat(coordinates[key]?.y)
            }

            acc.push({
                classId: obj.class_id,
                id: obj.id,
                name: obj.name,
                status: state,
                icon: obj.class.icon,
                stateParams: stateParams,
                x: x,
                y: y
            })
        }

        return acc
    }, [])

    const openModal = (id: number) => {
        modal.open()
        setObjectId(id)
    }

    // Схема рендера
    // 1. Вывести schemeImageUrl.value как картинку
    // 2. Цикл по objectsForScheme и вывод маркеров
    // поверх картинки на основании x и y с name в названии и переходм на объект по id
    return (
        schemeImageUrl().imageUrl ?
            <>
                <div style={{ position: 'relative', height: height ?? svgHeight, width: '100%' }}>
                    <img
                        ref={imgRef}
                        src={schemeImageUrl().imageUrlFull}
                        style={{ display: 'block', position: 'absolute', width: '100%' }}
                    />
                    {objectsForScheme?.map((point) => (
                        <Fragment key={point.id}>
                            {view !== 'classIcon' &&
                                <ECTooltip
                                    placement="top"
                                    title={`${point.name} - ${point.stateParams.name}`}
                                >
                                    <div
                                        style={{
                                            position: 'absolute',
                                            borderRadius: view === 'circle' ? '50%' : 0,
                                            background: fill ? point?.stateParams?.fill : 'none',
                                            border: border ? `2px solid ${point?.stateParams?.fill}`
                                                : 'none',
                                            width: view === 'circle' ? Number(sideSize)
                                                : `${Number(squareWidth)}%`, //25, 
                                            height: view === 'circle' ? Number(sideSize)
                                                : `${Number(squareHeight)}%`, //25, 
                                            top: `${Number(point.y)}%`,
                                            left: `${Number(point.x)}%`,
                                            cursor: 'pointer',
                                            transform: 'translate(-50%, -50%)'
                                        }}
                                        onClick={() => openModal(point.id)}
                                    >
                                        {view === 'squareWithState' &&
                                            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                                <div
                                                    style={{
                                                        position: 'absolute',
                                                        width: `${Number(stateWidth)}%`,
                                                        height: `${Number(stateHeight)}%`,
                                                        top: `${Number(topOffsetState)}%`,
                                                        left: `${Number(leftOffsetState)}%`,
                                                        background: point?.stateParams?.fill ?? 'grey',
                                                    }}
                                                >
                                                </div>
                                            </div>}
                                    </div>
                                </ECTooltip>}
                            {view === 'classIcon' && point?.icon !== null &&
                                <div
                                    onClick={() => openModal(point.id)}
                                >
                                    <ECTooltip
                                        key={point.id}
                                        placement="top"
                                        title={`${point.name} - ${point.stateParams.name}`}
                                    >
                                        <ECIconView
                                            icon={point?.icon}
                                            style={{
                                                position: 'absolute',
                                                color: fill ? point?.stateParams?.fill : 'none',
                                                // width: 25, 
                                                // height: 25,
                                                fontSize: Number(sideSize),
                                                top: `${Number(point.y)}%`,
                                                left: `${Number(point.x)}%`,
                                                cursor: 'pointer',
                                                transform: 'translate(-50%, -50%)'
                                            }}
                                        />
                                    </ECTooltip>
                                </div>}
                        </Fragment>
                    ))}
                </div>
                <ObjectCardModal objectId={objectId} modal={{ open: modal.isOpen, onCancel: modal.close }} />
            </> :
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                Изображение отсутствует
            </div>
    )
}