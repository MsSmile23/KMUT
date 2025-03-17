/* eslint-disable */

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import './utilisationStatsWidget.scss';
import { FC } from "react";
import { SERVICES_STATS } from "@shared/api/Stats";

const UtilisationStatsChart: FC<{
  value: any
  title: string
  values: Record<number, { start: number, end: number }>
  limits: {
    id: number
    description: string
    colors: string
  }[]
}> = ({ 
  value,
  title,
  values,
  limits
}) => {

  const limit = { colors: value.status.color, description: value.status.name, id: value.status.id } //SERVICES_STATS.Services.getStatus(value, values, limits)
  const statusStyle = `
    margin: auto; font-size: 14px; color: ${limit.colors}; font-weight: 600
  `;

  const options = {
    credits: {
        enabled: false
    },
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: 0,
      plotShadow: false,
    },
    exporting: { enabled: false },
    title: {
      useHTML: true,
      text: `
        <div style="display: flex; flex-direction: column; align-items: center;">
          <p style="margin: auto; font-size: 16px; transform: translateY(-74px)">
            <b>${title}</b>
          </p>
          <p style="${statusStyle}">${Math.floor(value.value)}%</p>
          <p style="${statusStyle}">${(limit.description || 'Нет статуса').toUpperCase()
        }</p>
        </div>

      `,
      align: 'center',
      verticalAlign: 'middle',
      y: 30
    },
    tooltip: {
      enabled: false
    },
    plotOptions: {
      series: {
        animation: false,
        states: {
          inactive: {
            opacity: 1,
          },
          hover: {
            enabled: false
          }
        }
      },
      pie: {
        borderColor: 'rgba(0,0,0,0)',
        dataLabels: {
          enabled: true,
          distance: -50,
          style: {
            fontWeight: 'bold',
            color: 'white'
          }
        },
        startAngle: -110,
        endAngle: 110,
        center: ['50%', '75%'],
        size: '110%'
      }
    },
    series: [{
      type: 'pie',
      name: 'half-pie-chart',
      innerSize: '70%',
      data: [
        {
          name: '',
          y: value.value,
          color: limit.colors
        },
        {
          name: '',
          y: 100 - value.value,
          color: 'rgba(0,0,0,0.05)'
        },
      ]
    }]
  }

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
      containerProps={{ className: "container-stats" }}
    />
  )
};

export default UtilisationStatsChart