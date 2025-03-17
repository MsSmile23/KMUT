/* eslint-disable react/jsx-no-useless-fragment */
import React, { FC, Fragment, useEffect, useState } from 'react'
import { IRelation, IRelationsByTypeArrayItem, relationsTypes, relationTypesLeft } from '@shared/types/relations'
import { SERVICES_RELATIONS } from '@shared/api/Relations'
import { IClass } from '@shared/types/classes'
import { Card, Col, Divider, Row, Space } from 'antd'

import { ILinkField, ILink } from '@shared/types/links'
import {
    LinkFormField,
    LinkFormFieldButtons,
} from '@containers/objects/ObjectFormContainer/LinksForm/LinkFormField/LinkFormField'
import { SERVICES_OBJECTS } from '@shared/api/Objects'
import { IObject } from '@shared/types/objects'
import { UTILS } from '@shared/utils'
import { getObjectLinks } from '@shared/utils/objects'
import { Buttons } from '@shared/ui/buttons'
import { useOpen } from '@shared/hooks/useOpen'
import { DefaultModal2 } from '@shared/ui/modals/DefaultModal2/DefaultModal2'
import ObjectFormContainer from '../ObjectFormContainer/ObjectFormContainer'

const LinksForm: FC<{
    objectId: IObject['id']
    classId: IClass['id']
    onLinksChange: (linkFields: ILinkField[]) => void
    objectSaved?: boolean
}> = ({ objectId, classId, onLinksChange, objectSaved }) => {
    const [compState, setCompState] = useState<{
        isLoading: boolean
        relationsByType: IRelationsByTypeArrayItem[]
        linkFields: ILinkField[]
        objectsToRelation: Record<IRelation['id'], IObject[]>
    }>({
        isLoading: true,
        relationsByType: [
            { type: relationsTypes.association, relations: [] },
            { type: relationsTypes.aggregation, relations: [] },
            { type: relationsTypes.composition, relations: [] },
            { type: relationsTypes.generalization, relations: [] },
            { type: relationsTypes.dependency, relations: [] },
        ],
        linkFields: [],
        objectsToRelation: {},
    })

    const modal = useOpen()

    const onLinkAdd = (relation: IRelation) => {
        const linkFields = [...compState.linkFields]
        const relationProps = UTILS.Relations.getRelationProps(relation)

        linkFields.push({
            id: 0,
            value: null,
            name: `${relation.id}_${linkFields.length}`,
            relation_id: relation.id,
            relation: relation,
            isDeletable: true,
            isNextAddable: linkFields.length < relationProps.multiplicity_right,
            isRequired: false,
        })

        setCompState({ ...compState, linkFields: linkFields })
    }

    const onLinkDelete = (name: string) => {
        const linkFields = compState.linkFields.filter((linkField) => linkField.name != name)

        setCompState({ ...compState, linkFields: linkFields })
    }

    const getData = async () => {
        const relationsByTypes = await SERVICES_RELATIONS.Services.getRelationsByClassGroupByType({ classId })
        const objects = await SERVICES_OBJECTS.Models.getObjects({ all: true })
        const object = objects.data.find((el) => el.id === objectId)

        const objectLinks: ILink[] = getObjectLinks(object)
        let linkFields: ILinkField[] = []
        const objectsToRelation: Record<IRelation['id'], IObject[]> = {}

        relationsByTypes.data.forEach((relationType) => {
            relationType.relations.map(async (relation) => {
                const relationProps = UTILS.Relations.getRelationProps(relation)

                objectsToRelation[relation.id] = objects.data.filter(
                    (object) => object.class_id == relationProps.classId
                )

                const relationLinks = objectLinks.filter((link) => link.relation.id === relation.id)

                linkFields = [...linkFields, ...await UTILS.Relations.getLinksFields(relation, relationLinks)]
            })
        })
        setCompState({
            ...compState,
            isLoading: false,
            relationsByType: relationsByTypes.data,
            linkFields,
            objectsToRelation,
        })
    }

    useEffect(() => {
        getData().then()
    }, [])

    const RelationTypeRender: FC<{ relationType: IRelationsByTypeArrayItem }> = ({ relationType }) => {
        return (
            <Fragment key={`relationType__render_${relationType.type}`}>
                {relationType.relations.map((relation: IRelation) => {
                    const key = `${relation.relation_type}_${relation.id}`

                    return relationTypesLeft.includes(relationType.type) ? (
                        <RelationRender key={key} relation={relation} />
                    ) : (
                        <Card key={key} style={{ marginBottom: 10 }}>
                            <RelationRender relation={relation} />
                        </Card>
                    )
                })}
            </Fragment>
        )
    }

    const RelationRender: FC<{ relation: IRelation }> = ({ relation }) => {
        return (
            <div style={{ marginTop: 10 }}>
                {compState.linkFields
                    .filter((linkField) => linkField.relation_id == relation.id)
                    .map((linkField, index, linkFields) => {
                        return (
                            <React.Fragment key={linkField.id}>
                                <Card>
                                    <Col span={100}>
                                        <Row
                                            gutter={1}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            <Space>{UTILS.Relations.getRelationProps(relation).name}</Space>
                                            <Space>
                                                Кратность от:
                                                {UTILS.Relations.getRelationProps(relation).multiplicity_left}
                                                до:
                                                {UTILS.Relations.getRelationProps(relation).multiplicity_left}
                                            </Space>

                                            <Space>
                                                <Buttons.ButtonLink
                                                    onClick={modal.open}
                                                    disabled={!objectSaved}
                                                    color="#3465fd"
                                                />
                                                <Buttons.ButtonLink />
                                            </Space>
                                        </Row>
                                    </Col>
                                    <Col span={100} style={{ marginTop: 20 }}>
                                        <Row
                                            gutter={1}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            <Space>
                                                {' '}
                                                <Buttons.ButtonLook />
                                                <Buttons.ButtonEditRow color="#3465fd" />
                                            </Space>
                                            <Space>
                                                <Buttons.ButtonUnlink />
                                                <Buttons.ButtonDeleteRow />
                                            </Space>
                                        </Row>
                                    </Col>
                                </Card>
                                <DefaultModal2
                                    title="Создание нового объекта"
                                    open={modal.isOpen}
                                    onCancel={() => {
                                        modal.close()
                                    }}
                                    destroyOnClose
                                    footer={null}
                                    width={1400}
                                >
                                    <Row gutter={[0, 12]}>
                                        <Col xs={24}>
                                            <Divider style={{ margin: 0 }} />
                                        </Col>
                                        <Col xs={24}>
                                            <ObjectFormContainer
                                                id={String(linkField.relation.id)}
                                                classId={UTILS.Relations.getRelationProps(relation).classId}
                                            />
                                        </Col>
                                    </Row>
                                </DefaultModal2>
                                <LinkFormField
                                    key={linkField.name}
                                    objects={compState.objectsToRelation[relation.id] ?? []}
                                    value={linkField.value}
                                    onChange={(value) => {
                                        const tmpLinkFields = [...compState.linkFields]
                                        const indexOfField = tmpLinkFields.findIndex(
                                            (item) => item.name === linkField.name
                                        )

                                        tmpLinkFields[indexOfField].value = value
                                        setCompState({ ...compState, linkFields: tmpLinkFields })
                                        onLinksChange(tmpLinkFields)
                                    }}
                                    linkFormFieldButtons={
                                        <LinkFormFieldButtons
                                            relation={relation}
                                            index={index}
                                            linkField={linkField}
                                            isLast={index + 1 == linkFields.length}
                                            onAdd={() => {
                                                onLinkAdd(relation)
                                            }}
                                            onDelete={() => {
                                                onLinkDelete(linkField.name)
                                            }}
                                        />
                                    }
                                />
                            </React.Fragment>
                        )
                    })}
            </div>
        )
    }

    return (
        <>
            {compState?.relationsByType?.map((relationType) => {
                return (
                    relationType.relations.length > 0 && (
                        <Fragment key={`relationType__section_${relationType.type}`}>
                            {relationTypesLeft.includes(relationType.type) ? (
                                <Card key={`${relationType.type}`} style={{ marginBottom: 10 }}>
                                    <RelationTypeRender relationType={relationType} />
                                </Card>
                            ) : (
                                <RelationTypeRender relationType={relationType} />
                            )}
                        </Fragment>
                    )
                )
            })}
        </>
    )
}

export default LinksForm