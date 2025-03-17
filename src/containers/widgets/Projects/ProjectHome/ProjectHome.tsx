import { Divider } from 'antd';
import { useNavigate } from 'react-router-dom';

const panelOptions = [
    {
        title: 'Контроль состояния объектов в режиме реального времени',
        url: '/monitoring-online'
    },
    {
        title: 'Отчёты',
        url: '/monitoring-download'
    },
    {
        title: 'Утилизация сети (измерения по загрузке каналов)',
        url: '/traffic-utilization'
    },
    {
        title: 'Потребление трафика за месяц. Визуализация',
        url: '/regions-map'
    },
    {
        title: 'Утилизация сети отчёты',
        url: '/traffic-downloads'
    },
]

const ProjectHome = () => {
    const navigate = useNavigate();

    return (
        <div style={{ padding: 32 }}>
            <h1 style={{ fontWeight: 400 }}>
                Мониторинг СЗО
            </h1>

            <Divider style={{ background: '#FFFFFF', margin: '16px 0 24px' }} />

            <div style={{ display: 'flex' }}>
                {panelOptions.map((option, i) => (
                    <div
                        key={i}
                        style={{
                            width: 210,
                            height: 210,
                            marginRight: 20,
                            marginBottom: 20,
                            backgroundColor: '#ebebeb',
                            cursor: 'pointer',
                            color: '#414141',
                            padding: 16,
                            fontSize: 22,
                        }}
                        onClick={() => {
                            navigate(option.url);
                        }}
                    >
                        {option.title}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ProjectHome;