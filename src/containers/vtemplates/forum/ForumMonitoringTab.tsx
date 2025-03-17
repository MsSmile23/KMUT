import { ObjectOAttrsWithHistory } from '@containers/attributes/ObjectOAttrsWithHistory/ObjectOAttrsWithHistory';
import { IObject } from '@shared/types/objects';
import WrapperWidget from '@shared/ui/wrappers/WrapperWidget/WrapperWidget';
import { Row, Col } from 'antd';
import { FC } from 'react';

interface IForumMonitoringTab {
    object: IObject
}
const ForumMonitoringTab: FC<IForumMonitoringTab> = ({ object }) => {
    return (
        <Row gutter={16}>
            <Col span={24}>
                <WrapperWidget>
                    <ObjectOAttrsWithHistory object={object} />
                </WrapperWidget>
          
            </Col>
        </Row>
    );
};

export default ForumMonitoringTab;