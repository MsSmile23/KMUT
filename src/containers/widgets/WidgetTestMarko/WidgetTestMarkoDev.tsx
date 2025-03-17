import { Row } from 'antd'
import { FC } from 'react'
import { TWidgetSettings } from '../widget-types'



interface IWidgetTestMarkoTest {
    backColor: string,
    textColor: string,
    fontSize: string
}
const WidgetTestMarkoDev: FC<TWidgetSettings<IWidgetTestMarkoTest>> = (props) => {
    const { settings } = props
    const { widget } = settings
    const { backColor = '#ffffff', textColor = '#000000', fontSize = '16px' } = widget

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '2%' }}>
            <Row style={{ color: textColor, backgroundColor: backColor, fontSize: fontSize }}> 
                In avis, in novas, farsoni
                Invere, vesu ves ni vox
                Ire vas sumeni doni
                Est vox menidis, varro
            </Row>
        </div>
    )
}

export default WidgetTestMarkoDev