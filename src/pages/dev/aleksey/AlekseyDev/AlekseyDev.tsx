import { objectsStore, selectObjects } from '@shared/stores/objects'
import React, { FC, useCallback, useEffect, useState } from 'react'
import { ForumIncident } from '@containers/vtemplates/forum/ForumIncident';
import { Form, Select, Input } from 'antd';
import WidgetObjectMapForm from '@containers/widgets/WidgetObjectsMap/WidgetObjectsMapForm';
import { TestFormVtemplate } from '@pages/dev/TestFormVtemplate';
import ObjectBuild from '@containers/vtemplates/forum/ObjectBuild';
import ForumDeviceVtemplate from '@containers/vtemplates/forum/ForumDeviceVtemplate';
import ForumServiceVtemplate from '@containers/vtemplates/forum/ForumServiceVtemplate';
import ForumObjectRacks from '@containers/vtemplates/forum/ForumObjectRacks';
import { ForumFavourVtemplate } from '@containers/vtemplates/forum/ForumFavourVtemplate';
import ObjectsMap2 from '@entities/objects/ObjectsMap/ObjectsMap2';
import AttributeCategoriesForm from '@entities/attribute-categories/AttributeCategoriesForm/AttributeCategoriesForm';
import { ObjectsOverImage } from '@entities/stats/ObjectsOverImage/ObjectsOverImage';
import { ECTableWithProgressBar } from '@shared/ui/ECUIKit/tables/ECTableWithProgressBar';
import StatePorts from '@entities/states/StatePorts/StatePorts';
import ECTemplatedTextInput from '@shared/ui/ECUIKit/ECTemplatedText/ECTemplatedTextInput/ECTemplatedTextInput';
import ECTextEditor from '@shared/ui/ECUIKit/ECTemplatedText/ECTextEditor/ECTextEditor';
import PagesHelpForm from '@entities/helps/HelpsForm/HelpsForm'
import PagesHelpTable from '@entities/helps/HelpsTable/HelpsTable';
import CustomEditor from '@shared/ui/CodeEditor/CodeEditor'
import { PAYLOAD_DEFAULT_GET } from '@shared/api/const';
import { API, IApiGetPayload, IApiReturnObject } from '@shared/lib/ApiSPA';
import { IEffects } from '@shared/types/effects';

 


const AlekseyDev: FC = () => {

    
    const getStateEffects = async (
        payload: IApiGetPayload = PAYLOAD_DEFAULT_GET
    ): Promise<IApiReturnObject<any[]>> => {
        const url = 'test-lic'
        const response = await API.apiQuery<any[]>(
            {
                method: 'GET',
                url: url,
                data: payload
            }
        );
    
        return {
            ...response,
            success: response?.success ?? false,
            data: response.data,
            errors: response?.errors,
        };
    };




    return (
        <div>
            <button onClick={() => {getStateEffects().then(resp=>{console.log('resp', resp)})}}>
                {'Запрос с ошибкой 418'}
            </button>
            {/*<CodeEditor value={value} onChange={onChange} mnemoThemeConfig={'customTheme1'} editable={editable} />*/}
            {/* <CustomEditor value={value} onChange={onChange} editable={editable} mnemonic={'postprocessing'} /> */}
        </div>
    )
}

export default AlekseyDev