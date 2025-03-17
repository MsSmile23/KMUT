import { ObjectLinkedShares } from '@entities/statuses/ObjectLinkedShares/ObjectLinkedShares';
import { forumThemeConfig } from '@app/themes/forumTheme/forumThemeConfig';
import { ReactNode } from 'react';
import ObjectCableTable from '@entities/objects/ObjectCableTable/ObjectCableTable';
import ObjectAttributesAndChildStates from '@containers/objects/ObjectAttributesAndChildStates/ObjectAttributesAndChildStates';
import { IObjectAttributesAndChildStates } from '@containers/objects/ObjectAttributesAndChildStates/ObjectAttributesAndChildStates';

export const forumWidgets: { mnemo: string, title: string, component: ReactNode} [] = [
    {
        mnemo: 'main.deviceStatuses',
        title: 'Статусы оборудования на главной',
        component:
            <ObjectLinkedShares
                {...forumThemeConfig.main.deviceStatuses.chart}
            />
    },
    {
        mnemo: 'object.ObjectCables',
        title: 'Кабельный журнал Объекта',
        component:
            <ObjectCableTable
                //object={object} //Внимание, нужна прокидка объекта
                relationsPortDevice ={forumThemeConfig.build.cableTable.relationsPortDevice}
                relationsCablePort = {forumThemeConfig.build.cableTable.relationsCablePort}
                cableClasses = {forumThemeConfig.build.cableTable.cableClasses}
            />
    },
    {
        mnemo: 'object.ObjectAttributesAndChildStates',
        title: 'Виджет здания (атрибуты, услуги, оборудование)',
        component:
        //@ts-ignore
            <ObjectAttributesAndChildStates
                //object={object} //Внимание нужна прокидка объекта
                sections={
                    {
                        objectAttributesWidgetProps: {
                            oaAtrrWidgetProps: {
                                attributesIds: forumThemeConfig.build.deviceStatuses.attributes.attributeIds
                            }
                        },
                        objectStatusLabelsProps: {
                            statusLabelsProps: {
                                classes_id: forumThemeConfig.build.deviceStatuses.stateLabels.classes_id
                            }
                        },
                        statusChartProps: {
                            title: 'Состояние оборудования',
                            chartProps: forumThemeConfig.build.deviceStatuses.chart
                        }
                    } as IObjectAttributesAndChildStates['sections']
                }
            />
    }

]