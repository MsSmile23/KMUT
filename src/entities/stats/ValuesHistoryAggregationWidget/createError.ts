import { message } from 'antd'

export const createError = (title: string, duration = 3) => {
    message.error(title, duration)
}