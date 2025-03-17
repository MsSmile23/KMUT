import { FC } from 'react'
import ReactPlayer from 'react-player'

interface IPlayer {
    url: string
}
const Player: FC<IPlayer> = ({ url }) => {
    return <ReactPlayer controls url={url} />
}

export default Player