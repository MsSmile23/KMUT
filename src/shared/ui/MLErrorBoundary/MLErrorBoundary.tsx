import ErrorBoundary from 'antd/es/alert/ErrorBoundary'
import { FC } from 'react'

export const MLErrorBoundary: FC<ErrorBoundary['props']> = ({ children, ...props }) => {
    return (
        <ErrorBoundary {...props}>
            {children}
        </ErrorBoundary>
    )
}