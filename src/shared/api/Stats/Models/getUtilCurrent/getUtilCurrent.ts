/* eslint-disable */

import { API, IApiGetPayload } from '@shared/lib/ApiSPA';

//import { PAYLOAD_DEFAULT_GET } from "@api/const";
//import { API_STATS_SCHEME } from "../../settings";
import { PAYLOAD_DEFAULT_GET } from '@shared/api/const';
import { API_STATS_SCHEME } from '../../settings';

const forceMockData = false;

export const getUtilCurrent = async (
  payload: IApiGetPayload = { ...PAYLOAD_DEFAULT_GET }
) => {
  const endpoint = { ...API_STATS_SCHEME.endpoints.getUtilCurrent };
  const response = await API.apiQuery<any>({ method: endpoint.method, url: endpoint.url });

  return {
    success: response?.success ?? false,
    data: response?.data,
    error: response?.error ?? undefined,
  };
};
