import { FC } from 'react'
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HCtreeMapInit from 'highcharts/modules/treemap'
import DebugECTreeMapChart from './settings/DebugECTreeMapChart';
import MokupData from './settings/MokupData';

HCtreeMapInit(Highcharts)

export const ECTreeMapChart: FC = () => (
    <div>
        <HighchartsReact
            highcharts={Highcharts}
            options={ DebugECTreeMapChart?.DEBUG_ENABLED ? MokupData : {}}
        />
    </div>
)