import React from 'react'

import { WorkerContextProvider } from '@pages/dev/artem/ArtemDev/ArtemWorker/useWorker'
import ArtemWorkerTest from '@pages/dev/artem/ArtemDev/ArtemWorker/ArtemWorkerTest'

const ArtemWorker = () => {
    return (
        <WorkerContextProvider workerPoolNum={2}>
            <ArtemWorkerTest />
        </WorkerContextProvider>
    )
}

export default ArtemWorker