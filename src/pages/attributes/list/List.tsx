
import AttributesTableContainer from '@containers/attributes/AttributesTableContainer/AttributesTableContainer'
import { useDocumentTitle } from '@shared/hooks/useDocumentTitle';
import { useWindowResize } from '@shared/hooks/useWindowResize';
import { Card, Col } from 'antd';
import Title from 'antd/es/typography/Title';
import { FC } from 'react';

const tableOffset = 400

const List: FC = () => {
    const windowDimensions = useWindowResize()

    useDocumentTitle('Таблица атрибутов')
    
    return (
        <>
            <Card>
                <Title level={3}>Таблица атрибутов</Title>
            </Card>

            <Card style={{ marginTop: 20 }}>
                <AttributesTableContainer
                    tableScroll={{ y: windowDimensions.height - tableOffset, x: 2500 }}
                />
            </Card>
        </>
    )
}


export default List