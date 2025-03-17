import { FC, ReactNode } from 'react'
import { Typography } from 'antd'
import './ECColorfulText.scss'

const { Text } = Typography

type ECColorfulTextProps = {
    textColor: string,
    backgroundColor: string,
    content: string | ReactNode,
    format?: 'text' | 'json'
}

export const ECColorfulText: FC<ECColorfulTextProps> = ({ textColor, backgroundColor, content, format }) => {

    if (format === 'json') {
        return (
            <div className="ColorfulContainer" style={{ backgroundColor }}>
                <div style={{ color: textColor }}>
                    <pre>
                        <code>{JSON.stringify(content, null, 4)}</code>
                    </pre>
                </div>
            </div>
        )
    }

    return (
        <div className="ColorfulContainer" style={{ backgroundColor }}>
            <Text style={{ color: textColor }}>{content}</Text>
        </div>
    )
}