/* eslint-disable max-len */
// Функция для объединения массивов в новом объекте
function combineArrays(arrays) {
    const combinedArray = {
        'seriesData': [],
        'categories': [],
        'colors': []
    };

    arrays.forEach(array => {

        if (combinedArray.seriesData.length > 0) {
            array.seriesData.forEach((item, index) => {
                combinedArray.seriesData[index].data.push(item.data[0])
            })
        } else {
            array.seriesData.forEach((item, index) => {
                combinedArray.seriesData.push({ data: [] })
                combinedArray.seriesData[index].data.push(item.data[0])
            })
        }
        combinedArray.categories.push(array.categories[0])
        combinedArray.colors.push(array.colorLabel)
    });

    return combinedArray;
}

// Объединяем массивы в новом объекте

export const prepareData = (dataArray, onlyActiveColor) => {


    //*Для одинакового отображения шагов в процентых и абсолютных значениях приводим всё к единой системе 
    const seriesAndCategories = dataArray.map(data => {
        const intervalsCount =  Math.floor((100 - (data?.interval?.start * 100 / data?.interval.end )) / data?.step);

        // const intervalsCount = Math.floor((data.interval.end - data.interval.start) / data.step);
        const dataCount = data.data.length;
        const dataValues = data.data.map(({ value }) => value);

        const intervalColors = data?.intervalColors?.map(item => {
            return ({
                ...item, 
                range: {
                    start: item.range?.start * 100 / data?.interval.end,
                    end: item?.range?.end * 100 / data?.interval.end
                }
            })
        })

        const sortedIntervalColors = intervalColors.sort((a, b) => a.range.start - b.range.end);
        let colorStops

        if (!onlyActiveColor) {
            colorStops = sortedIntervalColors.flatMap(({ range, activeColor, inactiveColor }) => [range.end, inactiveColor, activeColor]);
        }

        if (onlyActiveColor) {
            const activeAndInactiveColors = sortedIntervalColors.find(obj => obj.range.start <= dataValues[0] && dataValues[0] < obj.range.end);

            colorStops = sortedIntervalColors.flatMap(({ range, inactiveColor }) => [range.end, inactiveColor, activeAndInactiveColors.activeColor]);
        }

        let colorLabel = '#000'


        const intervalData = Array.from({ length: intervalsCount }, (_, index) => {
            const virtualData = {
                name: data.XAxisName,
                data: []
            };

            if (Number(colorStops[0]) <= Number(data.step * index)) {
                colorStops.splice(0, 3);
            }

            for (let dataIndex = 0; dataIndex < dataCount; dataIndex++) {
                const dataValue = dataValues[dataIndex] * 100 / data.interval.end;


                
                const isWithinRange = dataValue >= Number(data.step * index) && dataValue <= Number(data.step * (index + 1));
                const color = dataValue <= Number(data.step * index) && dataValue <= Number(data.step * (index + 1)) 
                    ? colorStops[1] : colorStops[2];
                const fillSize = 1 - ((dataValue - Number(data.step * index)) / data.step);

                colorLabel = isWithinRange ? colorStops[2] : colorLabel

                if (isWithinRange && !data.renderWithTransparentColumn) {
                    
                    virtualData.data.push({
                        y: data.step - (Number(data.step * (index + 1)) - dataValue),
                        color: colorStops[2]
                    });

                } else {

                    virtualData.data.push({
                        y: dataValue < Number(data.step * (index + 1)) && !data.renderWithTransparentColumn ? 0 : data.step,
                        color: isWithinRange ? {
                            linearGradient: { x1: 0, y1: fillSize, x2: 0, y2: -1 },
                            stops: [
                                [0, colorStops[2]],
                                [0, colorStops[1]],
                            ]
                        } : color
                    });

                }
            }

            return virtualData;
        });

        const categories = data.data.map(({ categoryNameXAxis }) => categoryNameXAxis);

        return {
            seriesData: intervalData.reverse(),
            categories: categories,
            colorLabel: colorLabel
        };
    });

    return combineArrays(seriesAndCategories)
};