import moment from 'moment/moment';

export const createTimeRange = (data) => {
    if (data?.groupBy === 'minute' && data?.view !== 'timeline') {
        return {
            left_bound: moment().subtract(1, 'days').unix(),
            right_bound: moment().unix()
        }
    }

    if (data?.groupBy === 'minute' && data?.view === 'timeline') {
        return {
            left_bound: moment().subtract(1, 'hour').unix(),
            right_bound: moment().unix()
        }
    }

    if (data?.groupBy === 'hour') {
        return {
            left_bound: moment().subtract(1, 'week').unix(),
            right_bound: moment().unix()
        }
    }

    if (data?.groupBy === 'day') {
        return {
            left_bound: moment().subtract(1, 'month').unix(),
            right_bound: moment().unix()
        }
    }

    return {
        left_bound: 0,
        right_bound: 9999999999,
    }
}