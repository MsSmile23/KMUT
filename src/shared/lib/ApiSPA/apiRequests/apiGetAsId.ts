import { apiQuery } from './apiQuery';
import { jsonParseAsObject } from '../../../../utils/common';
import { IApiReturn, ISchemeMethod } from '@shared/lib/ApiSPA';


interface IApiGetAsArrayProps {
  endpoint: ISchemeMethod;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const apiGetAsId = async <T>({ endpoint }: IApiGetAsArrayProps): Promise<IApiReturn<T>> => {
   
     
    const response = await apiQuery<T>({ 
        method: endpoint.method,
        url: endpoint.url 
    });
    const dataArr = response?.data ? response?.data : {} as IApiReturn<T>['data'];
    const dataOutput = (dataArr?.params && typeof dataArr?.params == 'string') 
        ? { ...dataArr, params: jsonParseAsObject(dataArr.params) } : dataArr
    // const dataOutput = dataArr.map((item) => {
    //     if (item?.params && typeof item?.params == 'string') {
    //         return { ...item, params: jsonParseAsObject(item.params) };
    //     }
            
    //     return item;
    // });
        
    return { ...response, data: dataOutput };
    
};