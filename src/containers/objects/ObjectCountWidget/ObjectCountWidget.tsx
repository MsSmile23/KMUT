/* eslint-disable react/jsx-no-useless-fragment */
import { SERVICES_CLASSES } from '@shared/api/Classes'
import { SERVICES_PACKAGES } from '@shared/api/Packages'
import { IClass } from '@shared/types/classes'
import { IPackage } from '@shared/types/packages'
import { Card, Col, Row } from 'antd'
import { FC, useEffect, useState } from 'react'
import { useApi } from '@shared/hooks/useApi'
import { ObjectCountWidgetClassCard } from './ObjectCountWidgetClassCard'
import { IRelation, relationTypesRight } from '@shared/types/relations'
import { getRelations } from '@shared/api/Relations/Models/getRelations/getRelations'

export const ObjectCountWidget: FC = () => {
    const packages = useApi<IPackage[]>([], () => SERVICES_PACKAGES.Models.getPackages({ all: true }))
    const classes = useApi<IClass[]>([], () => SERVICES_CLASSES.Models.getClasses({ all: true }))
    const relations = useApi<IRelation[]>([], () => getRelations({ all: true }))
    //const classesByRole = filterClassesByDirection('left', relations.data)

    const [compState, setCompState] = useState<{
        pckg: IPackage | null,
        classes: IClass[]
    }>({
        pckg: null,
        classes: []
    })

    useEffect(() => {
        // console.log('ARDEV', packages.data)
        setCompState(prevState => ({ ...prevState, pckg: packages.data.find(item => item.id === 1 ) }) )
    }, [packages.data])

    useEffect(() => {
        if (!classes.loading && !relations.loading) {
            setCompState(prevState => ({
                ...prevState, classes: classes.data.filter(
                    cls => cls.package_id === 1
                        && cls.is_abstract === false
                        && relations.data.find(
                            relation =>
                                relation.left_class_id === cls.id
                                && relationTypesRight.includes(relation.relation_type)
                        ) == undefined
                )
            }))
        }
    }, [classes.data, relations.data])

    return (
        <>
            {!packages.loading && compState.pckg &&
                <Row
                    className="ObjectCountWidget"
                    align="stretch"
                    gutter={[20, 20]}
                    style={{ marginLeft: 0, marginRight: 0 }}
                >
                    <Col xs={24}>

                        <Card key={`pack-${compState.pckg.id}`} title={compState.pckg.name}>
                            <Row gutter={[10, 10]}>
                                <Col xs={12}>
                                    <Row gutter={[10, 10]} align="stretch">
                                        {compState.classes.map( (cl, index) =>
                                            <Col key={`cls-${cl.id}`} xs={12}>
                                                <ObjectCountWidgetClassCard cl={cl} index={index} />
                                            </Col>
                                        )}
                                    </Row>
                                </Col>
                            </Row>
                        </Card>

                    </Col>
                </Row>}

        </>
    )
}