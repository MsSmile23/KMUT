import { Alert } from 'antd'
import { getErrorDescription, message } from '../utils'


const ZondRegTaskError = ({ errors }) => {
    
    return (
        <Alert 
            style={{ textAlign: 'center' }} 
            type="error" message={message} 
            description={<span dangerouslySetInnerHTML={{ __html: getErrorDescription(errors) }} />}
        />
    )
}

export default ZondRegTaskError