/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC } from 'react'
import { PageHeader } from '@shared/ui/pageHeader'
import { breadCrumbs } from './artemDevData'
import ArtemTree from '@pages/dev/artem/ArtemDev/ArtemTree/ArtemTree'


const ArtemDev: FC = () => {

    return (
        <>
            <PageHeader title="Тестовая страница Артём С" routes={breadCrumbs} />
            <ArtemTree/>
        </>
    )
}

export default ArtemDev