import { Tabs } from 'antd'
import { FC } from 'react'
import { TabsArrType } from '../../types/types';

type MainVTProps = {
    tabsArr: TabsArrType[],
    preview: boolean,
    onEdit?: (targetKey: React.MouseEvent | React.KeyboardEvent | string,
        action: 'add' | 'remove') => void;
    activeKey: string;
    onChangeTab?: (newActiveKey: string) => void;
}

const MainVT: FC<MainVTProps> = (props) => {

    const { tabsArr, preview, onEdit, activeKey, onChangeTab } = props

    return (
        <div style={{ marginTop: 50 }}>
            <Tabs
                items={tabsArr}
                activeKey={activeKey}
                type={preview ? 'card' : 'editable-card'}
                size="small"
                onEdit={onEdit}
                onChange={onChangeTab}
            />
        </div>

    )
}

export default MainVT