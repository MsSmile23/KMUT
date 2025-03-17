import { FC, useRef, useEffect, useState } from 'react'
import { CommonChart } from '@shared/ui/charts/highcharts/CommonChart';
import { IChartTypes } from '@shared/ui/charts/highcharts/types';

interface IECWordCloudChart {
    data: Highcharts.SeriesWordcloudOptions['data']
}
// const data = [
//     { name: 'Привет', weight: 10 },
//     { name: 'Мир', weight: 20 },
//     { name: 'Hello', weight: 5 },
//     { name: 'World', weight: 10 },
//     { name: 'Привет', weight: 15 },
//     { name: 'Мир', weight: 5 },
//     { name: 'Hello', weight: 5 },
//     { name: 'World', weight: 10, color: '#000' },
// ];

export const ECWordCloudChart: FC<any> = ({ data, backgroundColor }) => {
    const chartContainerRef = useRef(null);
    const [widthAndHeight, setWidthAndHeight] = useState({ width: null, height: null })

    const defaultOptions: Highcharts.Options = {
        chart: {
            margin: null,
            width: widthAndHeight.width,
            height: widthAndHeight.height,
            backgroundColor: backgroundColor
        },
        credits: {
            enabled: false
        },
        navigator: {
            enabled: false
        },
        rangeSelector: {
            enabled: false
        }, 
        scrollbar: { 
            enabled: false 
        },
        title: {
            text: ''
        },
        tooltip: {
            enabled: false,
            headerFormat: '<span style="font-size: 16px"><b>{point.key}</b></span><br>'
        },
        plotOptions: {
            wordcloud: {
                rotation: {
                    from: 0,
                    to: 0
                },
            }
        }
    }

    useEffect(() => {
        const handleResize = () => {
            if (chartContainerRef.current) {
                const { clientWidth, clientHeight } = chartContainerRef.current;

                setWidthAndHeight({ width: clientWidth, height: clientHeight });
            }
        };
      
        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    

    return (
        <div
            style={{ 
                width: '100%', 
                height: '100%', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'start' 
            }} ref={chartContainerRef}
        >
            <CommonChart
                seriesData={{
                    type: 'wordcloud',
                    data: data.map(item => ({
                        ...item,
                        weight: item.value
                    })),
                    name: 'Повторений',
                }}
                constructorType="chart"
                customOptions={defaultOptions}
                chartType={IChartTypes.WORDCLOUD}       
            />
        </div>
    )
}