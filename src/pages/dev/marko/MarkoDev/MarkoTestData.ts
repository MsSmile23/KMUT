export const markoTestPagination = [10, 20, 30, 40, 50, 100, 500]


const onGridReady = async (params) => {
    // setGridApi(params.api);
    // setGridColumnApi(params.columnApi);

    // Устанавливаем серверный источник данных
    // const datasource = {
    //     getRows: async (params) => {
    //         console.log('Requesting rows', params);

    //         // Подготовка параметров для запроса
    //         const payload = {
    //             "filter[object_id]": '',
    //             page: 1,
    //             per_page: "10",
    //             sort: "-id",
    //             // Добавьте другие параметры, если необходимо
    //         };

    //         try {
    //             const response = await server.request(payload);
    //             tableRow = response; // Предполагается, что данные находятся в response.data
    //             const lastRow = response.totalCount; // Предполагается, что общее количество строк возвращается в response.totalCount

    //             // Успешный ответ
    //             // params.successCallback(rows, lastRow);
    //             console.log(response)
    //             params.successCallback(tableRow, lastRow);
    //         } catch (error) {
    //             console.error('Error fetching data:', error);
    //             params.failCallback();
    //         }
    //     },
    // };

    // console.log(datasource)

    // // params.api.setDatasource(datasource);
    // params.api.setGridOption("datasource", datasource);
    // // params.api.setDatasource(datasource)

    const payload = {
                    "filter[object_id]": '',
                    page: currentPage,
                    per_page: pageSize,
                    sort: "-id",
    };
    try {
            const response = await server.request(payload);
            tableRow = response; // Предполагается, что данные находятся в response.data
            const lastRow = response.totalCount; // Предполагается, что общее количество строк возвращается в response.totalCount          
            params.successCallback(tableRow, lastRow);
    } catch (error) {
            console.error('Error fetching data:', error);
            params.failCallback();
    }
};