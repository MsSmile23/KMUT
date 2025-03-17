import { IAttr } from '@containers/attributes/ObjectOAttrsWithHistory/ObjectOAttrsWithHistory'
import { DefaultModal } from '@shared/ui/modals'
import { FC, PropsWithChildren, useEffect, useState } from 'react'
import ObjectCardContainer from '@containers/objects/ObjectCardContainer/ObjectCardContainer'
import { Card, Col, Flex, Row, Spin } from 'antd'
import { useApi2 } from '@shared/hooks/useApi2'
import { getAttributeHistoryProbeById } from '@shared/api/AttributeHistory/Models/getAttributeHistoryProbeById/getAttributeHistoryProbeById'
import { Buttons } from '@shared/ui/buttons'
import { selectAttributes, useAttributesStore } from '@shared/stores/attributes'

export const OAButtonInfo: FC<
    PropsWithChildren<{
        open: boolean
        toggleModalInfoIsVisible: () => void
        attrIds?: IAttr[]
    }>
> = ({ /* children,  */ open, toggleModalInfoIsVisible, attrIds }) => {
    const measurement = useApi2(getAttributeHistoryProbeById, { onmount: 'item' })

    const attributes = useAttributesStore(selectAttributes)

    const [dataForDownLoad, setDataForDownLoad] = useState<any>(null)

    const downloadBlobJSON = (content, filename, contentType) => {
        const blob = new Blob([content], { type: contentType })
        const url = URL.createObjectURL(blob)

        const pom = document.createElement('a')

        pom.href = url
        pom.setAttribute('download', filename)
        pom.click()
    }

    const downloadBlobCSV = (content, filename) => {
        let csv = ''

        for (const key of Object.keys(content)) {
            // Добавляем двойные кавычки вокруг значения, если оно содержит запятую или новую строку
            const escapedValue = String(content[key])
                .replace(/(\r\n|\n|\r)/gm, '')
                .replace(/(")/g, '"$1"')

            // Добавляем ключ и значение в строку CSV, разделяя их запятой и новой строкой
            csv += `"${key}",${escapedValue}\n`
        }
        const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=windows-1251' })

        const url = URL.createObjectURL(blob)

        const pom = document.createElement('a')

        pom.href = url
        pom.setAttribute('download', filename)
        pom.click()
    }

    useEffect(() => {
        if (open) {
            measurement.request(attrIds[0]?.oa?.id)
        }
    }, [open, attrIds])

    useEffect(() => {
        if (measurement?.data && measurement.loading == false && measurement.empty == false) {
            const attr = attrIds[0]
            const object = measurement.data

            const localDataForDownLoad: any = {}

            ;(localDataForDownLoad['Айди атрибута'] = attr?.id),
            (localDataForDownLoad['Айди Атрибута Объекта'] = attr?.oa?.attribute_id),
            (localDataForDownLoad['Название атрибута объекта'] = attr?.oa?.attribute.name),
            (localDataForDownLoad['Значение атрибута объекта'] = attr?.oa?.attribute_value),
            (localDataForDownLoad['Объект'] = object?.id),
            (localDataForDownLoad['Класс'] = object?.class.name),
            (localDataForDownLoad['Код'] = object?.codename),
            (localDataForDownLoad['Название'] = object?.name),
            object.object_attributes.forEach((oa) => {
                const attribute = attributes.find((attr) => attr.id == oa.attribute_id)

                localDataForDownLoad[attribute.name] = oa.attribute_value
            })

            setDataForDownLoad(localDataForDownLoad)
        }
    }, [measurement.data])

    if (measurement.loading) {
        return (
            <DefaultModal
                // title=""
                isModalVisible={open}
                isDraggable={true}
                width="80vw"
                handleCancel={toggleModalInfoIsVisible}
            >
                <Flex justify="center" style={{ height: '50vh' }}>
                    <Spin size="large" />
                </Flex>
            </DefaultModal>
        )
    }

    return measurement?.data?.id ? (
        <DefaultModal
            // height="auto"
            // title="Привет"
            isModalVisible={open}
            isDraggable={true}
            width="80vw"
            height="80vh"
            handleCancel={toggleModalInfoIsVisible}
        >
            <Card key={measurement.data.id} style={{ marginTop: 20 }}>
                <Row gutter={8}>
                    <Col>
                        {' '}
                        <Buttons.ButtonDownloadCSV
                            onClick={() => {
                                downloadBlobCSV(dataForDownLoad, 'measurement.csv')
                            }}
                        />
                    </Col>
                    <Col>
                        {' '}
                        <Buttons.ButtonDownloadJSON
                            onClick={() => {
                                downloadBlobJSON(JSON.stringify(dataForDownLoad), 'measurement.json', 'json')
                            }}
                        />
                    </Col>
                </Row>
                <ObjectCardContainer id={measurement.data.id} />
            </Card>
        </DefaultModal>
    ) : (
        <DefaultModal
            isModalVisible={open}
            // isDraggable={true}
            width="auto"
            height="auto"
            handleCancel={toggleModalInfoIsVisible}
        >
            <div
                style={{
                    margin: '0 20px',
                    textAlign: 'center',
                    fontWeight: 700,
                }}
            >
                Нет информации по связанному объекту
            </div>
        </DefaultModal>
    )
}