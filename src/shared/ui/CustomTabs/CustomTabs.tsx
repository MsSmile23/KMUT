import { selectThemeName, useThemeStore } from '@shared/stores/theme'
import { Col, Row, Tabs, TabsProps } from 'antd'
import { FC } from 'react'
import './CustomTabsStyle.css';

interface CustomTabsProps extends TabsProps {
    isCustomLayout?: boolean
}

const CustomTabs: FC<CustomTabsProps> = (props) => {

    const currentTheme = useThemeStore(selectThemeName)

    const { isCustomLayout, ...args } = props

    return (
        <Row className="ObjectCardContainer" gutter={[20, 20]} style={{ marginBottom: '-12px' }}>
            <Col xs={24}>
                <Tabs
                    defaultActiveKey="1"
                    tabBarGutter={0}  //10
                    className={`${isCustomLayout ? 'tabs-align-right' : ''} 
                    ${currentTheme}-no-underline ${currentTheme}-header-no-margin
                    ${currentTheme}-ant-tabs-nav-list`}
                    {...args}
                />
            </Col>
        </Row>
    )
}

export default CustomTabs