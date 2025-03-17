import { LayoutContainer } from '@app/layouts/showcase/LayoutContainer';
import { InterfacePreloader } from '@pages/auth/preload/InterfacePreloader';
import { FC, PropsWithChildren } from 'react';

export const ShowcaseInterfaceView: FC<PropsWithChildren> = ({ children }) => {

    return (
        <InterfacePreloader>
            <LayoutContainer>
                {children}
            </LayoutContainer>
        </InterfacePreloader>

    );
}