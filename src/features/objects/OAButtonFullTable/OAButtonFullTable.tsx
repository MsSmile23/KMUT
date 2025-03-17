import { useState } from 'react';
import { Button } from 'antd';
import { TableOutlined } from '@ant-design/icons';
import { DefaultModal2 } from '@shared/ui/modals/DefaultModal2/DefaultModal2';
import { ECTooltip } from '@shared/ui/tooltips';

const OAButtonFullTable = () => {
    const [isModalVisible, setIsModalVisible] = useState(false)

    return (
        <>
            <ECTooltip key="full_table" title="Полная таблица" placement="topLeft" >
                <Button
                    size="small"
                    shape="circle"
                    onClick={() => setIsModalVisible(true)}
                >
                    <TableOutlined />
                </Button>
            </ECTooltip>
            <DefaultModal2
                open={isModalVisible}
                showFooterButtons={false}
                onCancel={() => setIsModalVisible(false)}
                tooltipText="История измерений"
            >
                Исторические значения по атрибуту в виде таблицы с управлением датами
            </DefaultModal2>
        </>
    );
};

export default OAButtonFullTable;