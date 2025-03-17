export const demoPages = [
    {
        mnemo: 'oa-indicators',
        name: 'Индикаторы атрибутов',
        component: 'DemoOAIndicators',
    },
    {
        mnemo: 'CAM',
        name: 'Центр анализа метрик',
        component: 'DemoCenterAnalysisMetrics',
    },
    // {
    //     mnemo: 'GuacamoleIframe1',
    //     name: 'GuacamoleIframe1',
    //     component: 'GuacamoleDemo',
    //     props: {
    //         initialSrc: 'http://172.32.10.137/guacamole/#/client/MTEAYwBwb3N0Z3Jlc3Fs&#039'
    //     }
    // },
    {
        mnemo: 'GuacamoleIframe',
        name: 'GuacamoleIframe',
        component: 'GuacamoleDemo',
        props: {
            initialSrc: '/guacamole/#/client/OQBjAHBvc3RncmVzcWw',
            initialHost: 'http://172.32.10.137'
        }
    },
]