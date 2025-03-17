import React, { useEffect, useState } from 'react';
import {
    getAttributeHistoryById
} from '@shared/api/AttributeHistory/Models/getAttributeHistoryById/getAttributeHistoryById';
import { useApi2 } from '@shared/hooks/useApi2';
import CustomPreloader from '@shared/ui/preloader/CustomPreloader';

export const ArtemWrapper:FC<{data: any}> = ({data, ...props}) => {
    return (<div></div>)
}

const ArtemWithWrapper = () => {
    const [point, setPoint] = useState(null)

    const data = useApi2(getAttributeHistoryById, {})

    useEffect(() => {
        data.request({id: 12345}).then()
    }, [])

    return (
        <ArtemWrapper data={data.data} onChange={() => setPoint}>
            {point
                ? <CustomPreloader />
                : <div>{/* выводим поинт как нужно*/}</div>
            }
        </ArtemWrapper>
    );
};

export default ArtemWithWrapper;