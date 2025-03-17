const pageProtocolToWebsocketProtocol = {
    'http': 'ws',
    'https': 'wss'
}

export const websocketProtocolSelector = (websocketUrl) => {
    const protocol = window.location.href.split('://')[0]

    const address = websocketUrl.includes('://') 
        ? websocketUrl.split('://')[1] 
        : websocketUrl
  
    return `${pageProtocolToWebsocketProtocol[protocol]}://${address}`
}