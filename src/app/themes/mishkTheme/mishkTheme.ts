import { commonTheme } from '@app/themes/const'
import ObjectInfoContainer from '@containers/objects/ObjectCardContainer/ObjectInfoContainer/ObjectInfoContainer'
import MainDefault from '@containers/vtemplates/mishk/MainDefault'
import ObjectARM from '@containers/vtemplates/mishk/ObjectARM'
import ObjectConnectionChannel from '@containers/vtemplates/mishk/ObjectConnectionChannel'
import ObjectSchool from '@containers/vtemplates/mishk/ObjectSchool'
import ObjectUserARM from '@containers/vtemplates/mishk/ObjectUserARM'
import { mergeTheme } from '@shared/utils/theme';
import { ITheme } from '@app/themes/types';


const localTheme = {
    vtemplates: {
        dashboards: {
            title: 'Макет главной',
            default: { title: 'Инфопанель 1', component: MainDefault },
            items: [],
        },
        classes: {
            title: 'Макеты объектов по классам',
            default: { title: 'По умолчанию 1', component: ObjectInfoContainer },
            items: [
                { class_id: 95, component: ObjectSchool },
                { class_id: 41, component: ObjectConnectionChannel },
                { class_id: 42, component: ObjectARM },
                { class_id: 43, component: ObjectUserARM },
            ],
        },
    },
    
}
const mishkTheme = mergeTheme(commonTheme, localTheme) as ITheme

export default mishkTheme