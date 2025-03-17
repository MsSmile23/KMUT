import { Route } from 'react-router-dom'

export const createRoute = (path: string, component: any, type: 'main'|'sub') => {
    
    return (
        <Route
            path={path}
            element={component}
        >

            {/* {subPages.map(({ key, path, component }) => {
                return (
                    <Route
                        key={key}
                        path={path}
                        element={component}
                    />
                )
            })} */}
        </Route>
    )
}