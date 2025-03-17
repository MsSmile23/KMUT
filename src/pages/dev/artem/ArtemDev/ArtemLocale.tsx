import React from 'react';
import locale from 'antd/locale/ru_RU';
import dayjs from 'dayjs';

import 'dayjs/locale/ru';

import DatePicker from 'antd/es/date-picker';
import ConfigProvider from 'antd/es/config-provider';


const ArtemLocale = () => {
    return (
        <ConfigProvider locale={locale}>
            <DatePicker defaultValue={dayjs('2015-01-01', 'YYYY-MM-DD')} />
        </ConfigProvider>
    );
};

export default ArtemLocale;