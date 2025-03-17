import { DefaultModal2 } from '@shared/ui/modals/DefaultModal2/DefaultModal2'
import { Button, Col, Divider, Row } from 'antd'
import ObjectFormContainer from '../../ObjectFormContainer/ObjectFormContainer'
import { UTILS } from '@shared/utils'
import { IRelation, RelationWithDirect } from '@shared/types/relations'
import { FC, useEffect, useState } from 'react'
import { objectsStore, selectObjects } from '@shared/stores/objects'
import { ModalState } from '../../LinksRelationForm/LinksRelationForm'
import { getClassFromClassesStore } from '@shared/utils/common'
import { useGetObjects } from '@shared/hooks/useGetObjects'


interface IObjectModal {
    modal: any
    relation: RelationWithDirect
    id?: number
    onLinkAdd: (id: number, relation: IRelation) => Promise<void>
    editLinkTrue: boolean
    setEditLinkTrue: React.Dispatch<React.SetStateAction<boolean>>
    className: string | number
    objectName: string | number
    dataForObjectAddModal?: IRelation[]
    setModalState: React.Dispatch<React.SetStateAction<ModalState>>
    onLinkUpdate: any
    setActiveKey: React.Dispatch<React.SetStateAction<string[]>>
    mainObjectClass?: number
}
export const ObjectModal: FC<IObjectModal> = ({
    modal,
    relation,
    id,
    onLinkAdd,
    editLinkTrue,
    setEditLinkTrue,
    className,
    objectName,
    dataForObjectAddModal,
    setModalState,
    onLinkUpdate,
    setActiveKey,
    mainObjectClass
}) => {
    const [classId, setClassId] = useState<number | undefined>(undefined)
    const [title, setTitle] = useState<string>('')
    const objects = useGetObjects()
    const [relationForLink, setRelationForLink] = useState<IRelation>(null)

    const [finalTitle, setFinalTitle] = useState<string>('')

    useEffect(() => {
       
        const virtualRelations = dataForObjectAddModal.filter((item) => item.original_id == relation?.id)



        if (virtualRelations?.length == 0) {
            setClassId(relation?.left_class_id == mainObjectClass
                ? relation?.right_class_id : relation?.left_class_id)
        } else {
            if (dataForObjectAddModal == undefined || id !== undefined) {
                setClassId(
                    id
                        ? objects.find((obj) => obj.id == id)?.class_id
                        : relation?.left_class_id == mainObjectClass
                            ? relation?.right_class_id : relation?.left_class_id
                )
            }
        }
    }, [relation, dataForObjectAddModal, id])
    const buttonHandler = (id) => {
        setClassId(id)
    }

    useEffect(() => {
        let finalString = ''

        if (!id) {
            finalString =
                classId == undefined
                    ? 'Создание объекта'
                    : `Создание объекта класса ${title ? title : className ?? ''} [${classId ?? ''}]`
        } else {
            finalString =
                classId == undefined
                    ? 'Редактирование объекта'
                    : `Редактирование объекта ${title ? title : objectName ?? ''} [${id ?? ''}]
    класса ${className ?? ''} [${classId ?? ''}]`
        }
        setFinalTitle(finalString)
    }, [classId, title, objectName, className])


    return (
        <DefaultModal2
            style={{ minHeight: '70vh' }}
            tooltipText={finalTitle}
            open={modal.isOpen}
            onCancel={() => {
                modal.close()
                setClassId(undefined)
                setModalState({
                    id: undefined,
                    relation: null,
                    object_id: undefined,
                    className: null,
                    objectName: null,
                })
                setTitle('')
            }}
            destroyOnClose
            footer={null}
            width="80%"
        >
            {dataForObjectAddModal && classId == undefined && id == undefined && (
                <Row gutter={8} align="middle">
                    {dataForObjectAddModal.filter(item => item?.original_id == relation?.id).map((item) => {
                        const calculatedSpan = Math.ceil(24 / Math.ceil(dataForObjectAddModal.length / 5))

                        return (
                            <Col
                                key={item?.id}
                                span={8 > calculatedSpan ? 8 : calculatedSpan}
                                style={{ textAlign: 'center' }}
                            >
                                <Button
                                    style={{ width: '100%', marginBottom: '10px', height: 'auto' }}
                                    onClick={() => {
                                        buttonHandler(
                                            item?.left_class_id == mainObjectClass
                                                ? item?.right_class_id
                                                : item?.left_class_id
                                        )
                                        setTitle(
                                            `${getClassFromClassesStore(item.left_class_id)?.name} - ${
                                                getClassFromClassesStore(item.right_class_id)?.name
                                            }`
                                        )
                                        setRelationForLink(item)
                                    }}
                                >
                                    <Col span={24} style={{ whiteSpace: 'pre-wrap' }}>
                                        {getClassFromClassesStore(item.left_class_id)?.name} -{' '}
                                        {getClassFromClassesStore(item.right_class_id)?.name}
                                    </Col>
                                </Button>
                            </Col>
                        )
                    })}
                </Row>
            )}
            {classId && (
                <Row gutter={[0, 12]}>
                    <Col xs={24}>
                        <Divider style={{ margin: 0 }} />
                    </Col>
                    <Col xs={24}>
                        <ObjectFormContainer
                            id={id}
                            classId={classId}
                            onSuccess={(object) => {
                                setModalState({
                                    id: undefined,
                                    relation: null,
                                    object_id: undefined,
                                    className: null,
                                    objectName: null,
                                })

                                if (editLinkTrue) {
                                    onLinkUpdate(object)
                                    setEditLinkTrue(false)
                                    modal.close()
                                } else if (!editLinkTrue) {
                                    onLinkAdd(object.id, relationForLink ? relationForLink : relation)
                                    modal.close()
                                }

                                if (setActiveKey !== undefined) {
                                    setActiveKey(['1'])
                                }
                            }}
                            isModal={true}
                        />
                    </Col>
                </Row>
            )}
        </DefaultModal2>
    )
}