import HR from 'highcharts-react-official'

export const initialOptions = () => {
    const options: HR.Props['options'] = {
        chart: {
            type: 'column',
            
        }
    }

    return options
}