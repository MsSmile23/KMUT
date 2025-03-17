import { FC } from 'react';
import { ObjectsInOutHistory } from '@entities/objects/ObjectsInOutHistory/ObjectsInOutHistory';
import { forumThemeConfig } from '@app/themes/forumTheme/forumThemeConfig';

export const TestCandleChart: FC = () => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 10
            }}
        >
            <ObjectsInOutHistory 
                height={400} 
                sourceClass={forumThemeConfig.build.clientIncidentsDynamics.sourceClassId}
            />
        </div>
    )
}