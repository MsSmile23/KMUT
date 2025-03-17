import { PortInfo } from './utils'

const PortCardView = ({ cardColor, portColor, portInfo }: {
    cardColor: string
    portColor: string
    portInfo: PortInfo
}) => {
    return (
        <div
            style={{
                width: '300px',
                height: '70px',
                backgroundColor: cardColor,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderRadius: 8,
            }}
        >
            <p
                style={{ fontSize: 25, marginLeft: 20, color: 'black' }}
            >{`${portInfo.service}`.toUpperCase()}
            </p>
            <div
                style={{
                    backgroundColor: portColor,
                    padding: '5px 0 5px 0',
                    marginRight: 20,
                    borderRadius: 6,
                    fontSize: 16,
                    width: 100,
                    textAlign: 'center'
                }}
            >
                {`${portInfo.proto}`.toUpperCase()}/{portInfo.port} 
            </div>
        </div>
    )
}

export default PortCardView