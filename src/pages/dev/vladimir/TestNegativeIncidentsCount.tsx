import { InOutChart } from '@shared/ui/charts/highcharts'

export const TestNegativeIncidentsCount = () => {
    const points = {
        '1711872000': {
            'time': 1711872000,
            'in': 0,
            'up': 10,
            'down': 0
        },
        '1711875600': {
            'time': 1711875600,
            'in': 10,
            'up': 0,
            'down': 5
        },
        '1711879200': {
            'time': 1711879200,
            'in': 5,
            'up': 3,
            'down': 10
        },
        '1711882800': {
            'time': 1711882800,
            'in': -3,
            'up': 10,
            'down': 3
        },
        '1711886400': {
            'time': 1711886400,
            'in': 4,
            'up': 10,
            'down': 10
        },
        '1711890000': {
            'time': 1711890000,
            'in': 4,
            'up': 5,
            'down': 1
        },
        '1711893600': {
            'time': 1711893600,
            'in': 8,
            'up': 2,
            'down': 6
        },
    }

    return (
        <InOutChart
            points={points}
            height={400}
        />
    )
}