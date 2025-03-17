// import React from 'react';
import {
    BarChartOutlined,
    // CaretRightOutlined,
    // EditOutlined,
    InfoCircleOutlined,
    FullscreenOutlined,
    DownloadOutlined
    // PauseOutlined,
    // TableOutlined,
} from '@ant-design/icons';
export type TButtonMnemo = 'info' | 'pause_resume' | 'edit' | 'full_chart' | 'full_screen' | 'export_data'
export interface IButtons {
    mnemo: TButtonMnemo
    icon: React.ReactNode
    label: string
    onClick: () => void
}
export const buttonsMnemo = [
    'info',
    'pause_resume',
    'edit',
    'full_chart',
    'full_screen',
    'export_data'
] as const

export const wrapperBaseSize = '12px'
export const buttonsData: IButtons[] = [
// export const buttonsData: {
//     mnemo: typeof buttonsMnemo[number],
//     [key: string]: any
// }[] = [
    {
        mnemo: 'info',
        icon: <InfoCircleOutlined />,
        label: 'Информация',
        onClick: () => {
            return
        }
    },
    {
        mnemo: 'export_data',
        icon: <DownloadOutlined />,
        label: 'Скачать данные',
        onClick: () => {
            return
        }
    },
    // {
    //     mnemo: 'edit',
    //     icon: <EditOutlined />,
    //     label: 'Редактировать',
    //     onClick: () => {
    //         return
    //     }
    // },
    // {
    //     mnemo: 'pause_resume',
    //     icon: <PauseOutlined />,
    //     label: 'Приостановить',
    //     onClick: () => {
    //         return
    //     },
    //     toggleButton: {
    //         mnemo: 'pause_resume',
    //         icon: <CaretRightOutlined />,
    //         label: 'Возобновить',
    //         onClick: () => {
    //             return
    //         },
    //     },
    // },

    {
        mnemo: 'full_chart',
        icon: <BarChartOutlined />,
        label: 'График в отдельном окне',
        onClick: () => {
            return
        }
    },
    {
        mnemo: 'full_screen',
        icon: <FullscreenOutlined />,
        label: 'Открыть в модальном окне',
        onClick: () => {
            return
        }
    },
    
]