import { ROUTES } from '@shared/config/paths';
import { Route } from 'react-router-dom';
import { Fragment, ReactNode } from 'react';

export interface ICustomRoute {
    page: {
        path: ROUTES
        component: ReactNode
    }
    subPages: {
        key: number | string
        path: string
        component: ReactNode,
        indexRoute?: boolean
    }[]
}

export const CustomRoutes = ({
    page,
    subPages
}: ICustomRoute) => {
    return (
        <Route
            path={page.path}
            element={page.component}
        >
            {subPages.map(({ key, path, component, indexRoute }) => {
                
                if (indexRoute && path) {
                    return (
                        <Fragment key={key}>
                            <Route
                                element={component}
                                index
                            />
                            <Route
                                path={path}
                                element={component}
                            />
                        </Fragment>
                    )
                }

                if (indexRoute) {
                    return (
                        <Fragment key={key}>
                            <Route
                                element={component}
                                index
                            />
                        </Fragment>
                    )
                }

                return (
                    <Fragment key={key}>
                        <Route
                            key={key}
                            path={path}
                            element={component}
                        />
                    </Fragment>
                )
            })}
        </Route>
    )
}