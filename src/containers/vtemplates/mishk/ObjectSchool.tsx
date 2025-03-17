import ObjectAdvancedTableWidget, {
    IObjectAdvancedTableWidget,
} from '@containers/objects/ObjectAdvancedTableWidget/ObjectAdvancedTableWidget'
import ObjectsCountByAttribute, {
    IObjectsCountByAttribute,
} from '@containers/objects/ObjectsCountByAttribute/ObjectsCountByAttribute'
import ObjectOAttrs from '@entities/objects/ObjectOAttrs/ObjectOAttrs'
import { IObjectsOverImageProps, ObjectsOverImage } from '@entities/stats/ObjectsOverImage/ObjectsOverImage'
import ValuesHistoryAggregationWidget from '@entities/stats/ValuesHistoryAggregationWidget/ValuesHistoryAggregationWidget'
import { IStatusProps, ObjectLinkedShares } from '@entities/statuses/ObjectLinkedShares/ObjectLinkedShares'
import { variants } from '@pages/dev/aptest/valueshistory/variants'
import { VTSettings } from '@shared/config/const'
import { IObject } from '@shared/types/objects'
import WrapperWidget from '@shared/ui/wrappers/WrapperWidget/WrapperWidget'
import { Row, Col } from 'antd'
import { FC } from 'react'

interface IObjectSchool {
    object: IObject
}
const ObjectSchool: FC<IObjectSchool> = ({ object }) => {
    const foundVariant1 = variants.find((v) => v.id === 1)
    const foundVariant5 = variants.find((v) => v.id === 5)
    const foundVarian2 = variants.find((v) => v.id === 2)

    return (
        <Row gutter={16}>
            <Col span={8}>
                <WrapperWidget title="Информация об объекте">
                    <ObjectOAttrs objectId={object.id} {...VTSettings.mishk.school.ObjectAttributesWidget} />
                </WrapperWidget>
                <WrapperWidget title="Приоритет заявок">
                    <ObjectsCountByAttribute
                        {...(VTSettings.mishk.school.ObjectsCountByAttribute_1 as IObjectsCountByAttribute)}
                    />
                </WrapperWidget>
            </Col>

            <Col span={8}>
                <WrapperWidget title="Статус заявок">
                    <ObjectsCountByAttribute
                        {...(VTSettings.mishk.school.ObjectsCountByAttribute_2 as IObjectsCountByAttribute)}
                    />
                </WrapperWidget>
            </Col>

            <Col span={8}>
                <WrapperWidget title="Оборудование">
                    <ObjectsCountByAttribute
                        {...(VTSettings.mishk.school.ObjectsCountByAttribute_3 as IObjectsCountByAttribute)}
                    />
                </WrapperWidget>
            </Col>
            <Col span={8}>
                <WrapperWidget height={475} title="Объём использованного трафика, МБ">
                    <ValuesHistoryAggregationWidget
                        {...(foundVariant5.props as any)}
                        fakeResponse={foundVariant5.response}
                    />
                </WrapperWidget>
            </Col>

            <Col span={16}>
                <WrapperWidget height={475}>
                    <ValuesHistoryAggregationWidget
                        {...(foundVariant1.props as any)}
                        fakeResponse={foundVariant1.response}
                    />
                </WrapperWidget>
            </Col>
            <Col span={8}>
                <WrapperWidget title="Статусы оборудования" height={475}>
                    <ObjectLinkedShares {...(VTSettings.mishk.school.StatusWrapper_1 as IStatusProps)} />
                </WrapperWidget>
            </Col>

            <Col span={16}>
                <WrapperWidget height={475}>
                    <ValuesHistoryAggregationWidget
                        {...(foundVarian2.props as any)}
                        fakeResponse={foundVarian2.response}
                    />
                </WrapperWidget>
            </Col>
            <Col span={24}>
                <WrapperWidget title="Статусы оборудования">
                    <ObjectLinkedShares {...(VTSettings.mishk.school.StatusWrapper_2 as IStatusProps)} />
                </WrapperWidget>
            </Col>

            <Col span={24}>
                <WrapperWidget>
                    <ObjectsOverImage
                        linkedObjectsSearchProps={{ parentObjectId: object.id }}
                        {...(VTSettings.mishk.school.SubjectSchemeWidget as IObjectsOverImageProps)}
                    />
                </WrapperWidget>
            </Col>
            <Col span={24}>
                <WrapperWidget>
                    <ObjectAdvancedTableWidget
                        {...(VTSettings.mishk.school.ObjectAdvancedTableWidget as IObjectAdvancedTableWidget)}
                    />
                </WrapperWidget>
            </Col>
        </Row>
    )
}

export default ObjectSchool