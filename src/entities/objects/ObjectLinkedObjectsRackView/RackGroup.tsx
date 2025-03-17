import { ButtonSettings } from '@shared/ui/buttons'
import { Row, Col, Typography } from 'antd'
import { FC, PropsWithChildren } from 'react'
import { ShadowCard } from './ShadowCard'
import { useTheme } from '@shared/hooks/useTheme'
import { selectAccount, useAccountStore } from '@shared/stores/accounts'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'
import { generalStore } from '@shared/stores/general'

interface IRackGroupProps {
    sectionName: string
}

export const RackGroup: FC<PropsWithChildren<IRackGroupProps>> = ({ children, sectionName }) => {
    const theme = useTheme()
    const accountData = useAccountStore(selectAccount)
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode

    const interfaceView = generalStore((st) => st.interfaceView)
    const isShowcase = interfaceView === 'showcase'

    const color = isShowcase
        ? createColorForTheme(theme?.widget?.textColor, theme?.colors, themeMode) || '#000000'
        : '#000000'

    return (
        <Row gutter={[12, 12]}>
            <Col xs={24}>
                <ShadowCard>
                    <Row justify="space-between" align="middle">
                        <Col>
                            <Typography.Text style={{ fontSize: 16, fontWeight: 700, color: color ?? '#000000' }}>
                                {sectionName}
                            </Typography.Text>
                        </Col>
                        <Col>
                            <ButtonSettings shape="circle" />
                        </Col>
                    </Row>
                </ShadowCard>
            </Col>
            <Col xs={24}>{children}</Col>
        </Row>
    )
}