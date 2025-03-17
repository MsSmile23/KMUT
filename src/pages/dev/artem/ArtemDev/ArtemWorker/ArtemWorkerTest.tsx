import React from 'react'
import { useWorker } from '@pages/dev/artem/ArtemDev/ArtemWorker/useWorker'

const limit = 10

const ArtemWorkerTest = () => {
    const { callWorker } = useWorker();

    const sum = () => {
        callWorker({
            funcName: 'sum',
            args: Array(limit)
                .fill(0)
                .map((_, i) => i),
            cb: (total) => {
                console.log('done: ', total);
            },
            err: (e) => {
                console.error(e);
            },
        });
    };

    const log = () => {
        callWorker({
            funcName: 'log',
            args: Array(limit).fill('test'),
            cb: () => {
                console.log('done');
            },
            err: (e) => {
                console.error(e);
            },
        });
    };

    const logWithoutWorker = () => {
        for (let i = 0; i < limit; i++) {
            console.log('test');
        }
        console.log('done');
    };

    return (
        <div>
            <input type="text" />
            <button onClick={log}>Log</button>
            <button onClick={sum}>Sum</button>
            <button onClick={logWithoutWorker}>Log Without Worker</button>
        </div>
    );
};


export default ArtemWorkerTest