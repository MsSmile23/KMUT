const openControlPanel = (url) => {

    const percent = 0.8

    const dualScreenLeft = window.screenLeft !==  undefined ? window.screenLeft : window.screenX;
    const dualScreenTop = window.screenTop !==  undefined   ? window.screenTop  : window.screenY;

    const width = (window.innerWidth
        ? window.innerWidth : document.documentElement.clientWidth
            ? document.documentElement.clientWidth
            : screen.width)

    const height =
        (window.innerHeight
            ? window.innerHeight
            : document.documentElement.clientHeight
                ? document.documentElement.clientHeight
                : screen.height)

    const w = width * percent
    const h = height * percent

    const systemZoom = width / window.screen.availWidth;
    const left = (width - w) / 2 / systemZoom + dualScreenLeft
    const top = (height - h) / 2 / systemZoom + dualScreenTop

    //const width = document.documentElement.clientWidth * percent;
    //const height = document.documentElement.clientHeight * percent;

    window.open(
        url,
        'device_control_panel',
        `toolbar=0,location=0,menubar=0,scrollbars=0,resizable=0,
              width=${w / systemZoom}, 
              height=${h / systemZoom}, 
              top=${top}, 
              left=${left}
        `
    );
}

const generateHost = (sshClientData) => {
    let host = import.meta.env.VITE_API_SERVER
        + '/ssh/host/%ip%'

    host = host.replace('%ip%', sshClientData['ip']);
    const data = []

    for (const key in sshClientData) {
        if (key != 'ip') {
            data.push({
                name: key,
                type: 'text',
                value: sshClientData[key]
            })
        }
    }

    return { host, data }
}

const openSSHTerminal = (sshClientData) => {
    const { host, data } = generateHost(sshClientData);
    const sshForm = document.createElement('form');

    sshForm.target = 'SSHTerminal';
    sshForm.method = 'POST'; // or "post" if appropriate
    sshForm.action = host;

    data.forEach(item => {
        const tmpInput = document.createElement('input');

        tmpInput.type = item.type;
        tmpInput.name = item.name;
        tmpInput.setAttribute('value', item.value);

        sshForm.appendChild(tmpInput);
    })

    document.body.appendChild(sshForm);

    const sshTerminalWindow = window.open(
        host,
        'SSHTerminal',
        'toolbar=0,location=0,menubar=0,scrollbars=0,resizable=0,width=800,height=600'
    );

    if (sshTerminalWindow) {
        sshForm.submit();
        document.body.removeChild(sshForm)
    } else {
        alert('Не удалось открыть терминал');
    }
}

export const ObjectToolbarUtils = {
    openControlPanel,
    openSSHTerminal
}