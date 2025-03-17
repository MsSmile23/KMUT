import ECTabs from '@shared/ui/ECUIKit/tabs/ECTabs'
import { FC, useState } from 'react'
import ReportsTable from './ReportsTable'
import TasksTable from './TasksTable'

interface ReportsTableProps {
    tableHeight: number | string
}

const ReportsTableContainer2: FC<ReportsTableProps> = ({ tableHeight }) => {

    const [activeTab, setActiveTab] = useState('reports-table')

    return (
        <div style={{ padding: 24 }}>
            <ECTabs
                activeKey={activeTab}
                onChange={setActiveTab}
                headerStyle={{ paddingBottom: 5 }}
                items={[
                    {
                        key: 'reports-table',
                        label: 'Отчёты',
                        children: <ReportsTable tableHeight={tableHeight} initialPeriodicity="one_time" />,
                    },
                    {
                        key: 'tasks-table',
                        label: 'Задания',
                        // disabled: true,
                        children: <TasksTable tableHeight={tableHeight} initialPeriodicity="regular" />,
                    },
                ]}
            />
        </div>
    )
}

export default ReportsTableContainer2