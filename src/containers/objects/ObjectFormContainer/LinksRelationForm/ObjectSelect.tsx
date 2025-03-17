import { Col, Row, Space, Spin,  } from 'antd'
import { IObject } from '@shared/types/objects'
import { FC, useEffect, useState } from 'react'
import { Buttons } from '@shared/ui/buttons'
import { Footer } from 'antd/es/layout/layout'
import { getObjectProps } from '@shared/utils/objects'
import { Select } from '@shared/ui/forms/Select/Select'
import { SERVICES_OBJECTS } from '@shared/api/Objects'
import { ECSelectWithVirtualization } from '@shared/ui/ECUIKit/ECSelectWithVirtualization'



export const ObjectSelect: FC<{
    objects: IObject[]
    onSubmit: (value: number[]) => void
    handleCancel: () => void
    allObjects?: any
    objectId?: any
    relation?: any
    linkFields?: any
    objectsForSelect?: any[]
    classId?: number

    dataForObjectModal?: any[]
    currentObject?: IObject
}> = ({
    objects = [],
    onSubmit,
    handleCancel,
    allObjects,
    relation,
    dataForObjectModal,

    objectId,
    linkFields,
    objectsForSelect,
    classId,
    currentObject
}) => {
    const [options, setOptions] = useState<any[]>([])
 
    const [currentClassObjects, setCurrentClassObjects] = useState<IObject[]>([])

    const [loading, setLoading] = useState(true)

    // const options = Array.from({ length: 60000 }, (_, i) => ({
    //     id: i + 1,
    //     name: `Object ${i + 1}`
    // }));

    useEffect(() => {

        //* Полуаем объекту по классу, либо, если класс абстрактный, то все его "дочерние" 
        const objectClass = currentObject?.class_id || classId
        const targetClass = relation?.left_class_id == objectClass ? relation.right_class_id : relation?.left_class_id
        const targetClasses = dataForObjectModal
            .filter((item) => item.original_id == relation.id)
            .map((item2) => {
                return item2.left_class_id == objectClass ? item2.right_class_id : item2.left_class_id
            })
        const finalFilter = targetClasses?.length > 0 ? targetClasses.join(',') : targetClass

        SERVICES_OBJECTS.Models.getObjectsByClassId({ 'filter[class_id]': finalFilter, all: true })
            .then(resp => {
                if (resp?.success) {
                    if (resp?.data) {
                        setCurrentClassObjects(resp.data)
                    }  
                }
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])



    //?Тестовый вариант вывода в селекте для привязки

    useEffect(() => {

        const localOptions: any[] = []
        let testObjects: any = []
        const objectClass = currentObject?.class_id || classId
        const targetClass = relation?.left_class_id == objectClass ? relation.right_class_id : relation?.left_class_id

        const virtualRelations = dataForObjectModal.filter((item) => item.original_id == relation?.id)

        // if (virtualRelations?.length == 0) {
        //     Object.values(allObjects).forEach((item: any) => {
        //         item.forEach((item2) => {
        //             if (
        //                 item2?.class_id == targetClass &&
        //                 linkFields.filter(
        //                     (link) =>
        //                         link?.object?.data?.id == item2?.id &&
        //                         (link?.originRelation?.id == relation?.id || link?.relation?.id == relation?.id)
        //                 ).length == 0
        //             ) {
        //                 testObjects.push(item2)
        //             }
        //         })
        //     })
        // } else {
        // const targetClasses = dataForObjectModal
        //     .filter((item) => item.original_id == relation.id)
        //     .map((item2) => {
        //         return item2.left_class_id == objectClass ? item2.right_class_id : item2.left_class_id
        //     })

        testObjects = [
            ...currentClassObjects.filter(
                (obj) =>
                    // targetClasses.includes(obj.class_id) &&
                    linkFields.filter(
                        (link) =>
                            link?.object?.data?.id == obj?.id &&
                                (link?.originRelation?.id == relation?.id || link?.relation?.id == relation?.id)
                    ).length == 0
            ),
        ]
        // }

        testObjects.forEach((object) => {
            const objectProps = getObjectProps(object as IObject)?.name

            if (localOptions.filter((item) => item.value == object.id)?.length == 0) {

                //*Узнаем кратность, для того, чтобы понять, можем ли мы привязать объект или же он уже занят

                const objectLinks = [...object.links_where_left, ...object.links_where_right]
                const objectLinksCount = objectLinks.filter(link => link.relation_id == relation.id)?.length

                const multiplicity = object.class_id == relation.left_class_id ?
                    relation.right_multiplicity_right :
                    relation.left_multiplicity_right
            
                if (objectLinksCount < multiplicity || multiplicity == null || multiplicity == undefined ) {
                    localOptions.push({
                        value: object.id,
                        label: `${objectProps} [${object.id}]`,
                        disabled: false,
                    })
                }
            }
        })

        
        setOptions(localOptions)
    }, [objects, currentClassObjects])



    const [value, setValue] = useState<number[]>([])

    return (
        <>
            <Row style={{ marginTop: 10, marginBottom: 10, display: 'flex', alignItems: 'center', width: '100%' }}>
                <Col xs={22}>

                    {/*  **!Подменяем селект на селект с виртуализцацей при большом количестве объектов */}

                    {options?.length > 1000 ?
                        <ECSelectWithVirtualization
                            popupMatchSelectWidth={false}
                            allowClear={true}
                            mode="multiple"
                            placeholder="Выберете значение"
                            style={{ width: '70%' }}
                            value={value}
                            onChange={(value) => setValue(value)}
                            options={options}
                            className="list-input"
                            // loading={loading}
                        />  : 
                        <Select
                            mode="multiple"
                            placeholder="Выберете значение"
                            style={{ width: '70%' }}
                            className="list-input"
                            allowClear={true}
                            popupMatchSelectWidth={false}
                            options={options}
                            value={value}
                            onChange={(value) => setValue(value)}
                            loading={loading}
                            notFoundContent={loading ? <Spin size="small" >Загружаем данные...</Spin> : null}
                        />}
                </Col>
            </Row>
            <Footer style={{ display: 'flex', justifyContent: 'flex-end', background: 0 }}>
                <Space>
                    <Buttons.ButtonSubmit
                        color="green"
                        customText="Создать связь"
                        onClick={() => {
                            onSubmit(value)
                        }}
                    />
                    <Buttons.ButtonClear customText="Отменить" onClick={handleCancel} />
                </Space>
            </Footer>
        </>
    )
}