import { getAttributeHistoryById } from '@shared/api/AttributeHistory/Models/getAttributeHistoryById/getAttributeHistoryById';
import moment from 'moment';

export const getUTCTodayStartAndEndOfDay = () => {
    const today = moment().startOf('day');
    const endOfDay = moment().endOf('day');

    return {
        start: today.valueOf(),
        end: endOfDay.valueOf()
    }
}

export const combineTimestampWithCurrentTime = (timestamp) => {
    const dateFromTimestamp = moment(timestamp);
    const currentTime = moment().startOf('day');

    currentTime.set({
        hour: dateFromTimestamp.hour(),
        minute: dateFromTimestamp.minute(),
        second: dateFromTimestamp.second()
    });

    return currentTime.valueOf();
}

// export const getUTCTodayStartAndEndOfDay = () => {
//     const today = new Date();
//     const startOfDay = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0));
//     const endOfDay = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59));

    
//     return {
//         start: startOfDay.getTime(),
//         end: endOfDay.getTime()
//     }
// }

// export const getUTCDateTodayAnd30daysAgo = () => {
//     const today = new Date();
//     const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    
//     return {
//         start: Math.floor(today.getTime() / 1000),
//         end: Math.floor(thirtyDaysAgo.getTime() / 1000)
//     }
// }

// export const combineTimestampWithCurrentTime = (timestamp) => {
//     const dateFromTimestamp = new Date(timestamp);
//     const today = new Date();
//     const currentTime = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0));

//     currentTime.setHours(dateFromTimestamp.getHours());
//     currentTime.setMinutes(dateFromTimestamp.getMinutes());
//     currentTime.setSeconds(dateFromTimestamp.getSeconds());

//     return currentTime.getTime();
// }

const prepareData = (data) => {
    const newData = data.map((data) => {
        return [combineTimestampWithCurrentTime(data[0] * 1000), Number(data[1])]
    })

    const oldData = data.map((data) => {
        return data[0] * 1000
    })

    return { newData, oldData }
}

const colorsForPrepareData = {
    0: {
        color: '#5CB85C',
        marker: 'triangle'
    },
    1: {
        color: '#FF5959',
        marker: 'square'
    },
}

export const getAndPrepareDataForScatterChart = async (OAttrs, limit?: number) => {
    const limitPayload = limit ? { limit } : {}

    const seriesData = []
    let oldData = []

    for (let index = 0; index < OAttrs.length; index++) {
        
        const color = colorsForPrepareData[index]?.color || null

        const series = {
            pointInterval: 1 * 3600 * 1000,
            name: OAttrs[index]?.attribute?.name,
            data: [],
            color: color,
            marker: {
                symbol: colorsForPrepareData[index]?.marker,
                radius: 5
            }
        }

        const response = await getAttributeHistoryById({ 
            id: OAttrs[index].id,
            ...limitPayload
        })

        if (response.success && response.data && response?.data?.series[0]?.data.length > 0) {
            series.data = prepareData(response?.data?.series[0]?.data).newData
            oldData = prepareData(response?.data?.series[0]?.data).oldData
            seriesData.push(series)
        }
    }

    return { seriesData, oldData }

}