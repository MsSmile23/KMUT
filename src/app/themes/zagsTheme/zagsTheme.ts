import { commonTheme } from '@app/themes/const'
import ObjectInfoContainer from '@containers/objects/ObjectCardContainer/ObjectInfoContainer/ObjectInfoContainer'
import MainDefault from '@containers/vtemplates/zags/MainDefault'
import ObjectZAGS from '@containers/vtemplates/zags/ObjectZAGS'

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
                { class_id: 10001, component: ObjectZAGS },
            ],
        },
    },
}

export default { ...commonTheme, ...localTheme }