import React, { пшFC } from 'react';
import ErrorBoundary from 'antd/es/alert/ErrorBoundary';

const ArtemError:FC<ErrorBoundary['props']> = ({
    children,
    ...props
}) => {

    return (
        <ErrorBoundary {...props}>
            {children}
        </ErrorBoundary>
    );
};

export default ArtemError;