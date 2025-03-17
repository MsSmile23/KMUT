import { IClass } from '@shared/types/classes';
import { Card, CardProps } from 'antd';
import {  Typography } from 'antd';

const colors = ['red', 'green', 'blue', 'magenta', 'orange']

interface IProps extends CardProps {
    cl?: IClass
    index?: number
}

export const ObjectCountWidgetClassCard: React.FC<IProps> = ({ cl, index, ...cardProps }) => {
    return (
        <Card
            className="ObjectCountWidgetClassCard" 
            style={{ border: `1px solid ${colors[(index || 0) % 4]}`, height: '100%' }}
            bodyStyle={{ height: '100%' }}
            {...cardProps}
        >
            {/* удобнее сделать через стандартный div flex flex dir columns ??? */}
            <div 
                style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'space-between',
                    height: '100%',
                }}
            >
                <div style={{ textAlign: 'center' }}>
                    <Typography.Text type="secondary">
                        {cl?.name || `Класс ${cl?.id}`}
                    </Typography.Text>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <Typography.Text style={{ fontWeight: 700 }}>
                        {cl?.objects?.length || 0}
                    </Typography.Text>
                </div>
            </div> 
        </Card>
    )
}