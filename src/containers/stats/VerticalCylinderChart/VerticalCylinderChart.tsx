/* eslint-disable */

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React, {FC, useEffect} from "react";
import './verticalCylinderChart.scss';
import { SERVICES_STATS } from "@shared/api/Stats";

// require("highcharts/modules/exporting")(Highcharts);
// require("highcharts/highcharts-more")(Highcharts);
// require('highcharts/highcharts-3d')(Highcharts);
// require("highcharts/modules/funnel3d")(Highcharts);
// require("highcharts/modules/cylinder")(Highcharts);

import module1 from "highcharts/modules/exporting"
import module2 from "highcharts/highcharts-more"
import module3 from 'highcharts/highcharts-3d'
import module4 from "highcharts/modules/funnel3d"
import module5 from "highcharts/modules/cylinder"

module1(Highcharts)
module2(Highcharts)
module3(Highcharts)
module4(Highcharts)
module5(Highcharts)

const VerticalCylinderChart: FC<{
   width?: number
  value: any
  title: string
  values: Record<number, { start: number, end: number }>
  limits: {
    id: number
    description: string
    colors: string
  }[]
// eslint-disable-next-line react/display-name
}> = ({ 
  width,
  value,
  title,
  values,
  limits,
}) => {

 //  useEffect(() => {
 //    setTimeout(function() {
 //       Highcharts.charts[0]?.reflow();
 //    }, 300);
 // }, []);

  useEffect(() => {
    setTimeout(() => {
      for (let i = 0; i < Highcharts.charts.length; i++) {
        if (Highcharts.charts[i] !== undefined) {
          Highcharts.charts[i]?.reflow();
        }
      }
    }, 500)
  }, [])

  const limit = { colors: value.status.color, description: value.status.name, id: value.status.id }
  //SERVICES_STATS.Services.getStatus(value, values, limits)

  const optionsCylinder = {
    credits: {
        enabled: false
    },
    colors: ['#DBDBDB', limit.colors],
    chart: {
      type: 'funnel3d',
      options3d: {
        enabled: true,
        alpha: 10,
        depth: 50,
        viewDistance: 50
      }
    },
    title: {
      useHTML: true,
      text: `
        <div style="
          display: flex; 
          flex-direction: column; 
          align-items: center;
        ">
          <p style="margin: auto; font-size: 16px; transform: translateY(-71px)">
            <b>${title}</b>
          </p>
          <p style="
            font-size: 20px; 
            color: white; 
            text-shadow: 0 0 4px #000000; 
            font-weight: 900;
            transform: translateY(15px);
          ">${Math.floor(value.value)} %</p>
        </div>

      `,
      /*
      text: `
        <div style="
          display: flex; 
          flex-direction: column; 
          align-items: center;
        ">
          <p style="margin: auto; font-size: 16px; transform: translateY(-45px)">
            <b>${title}</b>
          </p>
          <p style="
            font-size: 20px; 
            color: white; 
            text-shadow: 0 0 4px #000000; 
            font-weight: 900;
            transform: translateY(15px);
          ">${Math.floor(value)} %</p>
          <p style="
            font-size: 16px; 
            color: white; 
            text-shadow: 0 0 4px #000000; 
            font-weight: 900
          ">${limit.description.toUpperCase()
        }</p>
        </div>

      `,

       */
      align: 'center',
      verticalAlign: 'middle',
      y: 20
    },
    tooltip: { enabled: false },
    exporting: { enabled: false },
    plotOptions: {
      series: {
        dataLabels: {
          enabled: false
        },
        neckWidth: 160,
        neckHeight: '50%',
        width: 160,
        height: '70%'
      }
    },
    series: [{
      data: [
        ['total', 100 - value.value],
        ['start', value.value]
      ]
    }]
  }

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={optionsCylinder}
      containerProps={{ style: { width: "28em", height: "16em" }}}
    />
  )
}

export default VerticalCylinderChart