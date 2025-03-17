import { FC } from 'react';
import { Card } from 'antd';

const DevNestedCard: FC<{isModal?: boolean}> = ({ isModal = false }) => {
    
    const arrayTest = [1, 2, 3, 4, 5]
    
    return (
        <Card>
            {!isModal
                ? 'Главная'
                : 'Вложенная'}
            {!isModal && arrayTest.map(i =>
                <DevNestedCard key={i} isModal={true} />
            )}
        </Card>
    );
};

export default DevNestedCard