import { ConfigProvider, DatePicker } from 'antd'
// import DatePicker from 'antd/es/date-picker'
// import ConfigProvider from 'antd/es/config-provider'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import updateLocale from 'dayjs/plugin/updateLocale'
import locale from 'antd/es/locale/ru_RU'

dayjs.locale('ru')
dayjs.extend(updateLocale)
dayjs.updateLocale('ru', {
    weekStart: 1,
})

// console.log('locale', dayjs().locale('ru').localeData().weekdaysMin())
// console.log('locale', dayjs().locale('ru').localeData().months())
const { RangePicker } = DatePicker

export const LocaleDatePicker = () => {
    return (
        // <ConfigProvider 
        //     locale={locale}
        // >
        <RangePicker
            allowClear
            locale={locale.DatePicker}
            style={{
                width: 500
            }}
            showTime={{
                format: "HH:mm:ss",
            }}
            format="DD.MM.YYYY HH:mm:ss"
            onChange={(value, vs) => {
                console.log('value', value)
                console.log('vs', vs)
            }}
            onOk={(value) => {
                // console.log('value', value)
                // console.log('vs', vs)
            }}
            onCalendarChange={(value, vs) => {
                console.log('value', value)
                console.log('vs', vs)
            }}
        />
        // </ConfigProvider>
    )
}