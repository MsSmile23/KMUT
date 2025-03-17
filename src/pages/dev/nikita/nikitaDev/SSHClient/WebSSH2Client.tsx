import { Button } from 'antd';
import { useState } from 'react';

const WebSSH2Client = () => {
  const [src, setSrc] = useState('');
  const [postData, setPostData] = useState({
    user: 'user',
    pass: 'user',
    port: '8022',
    ip: '192.168.1.156'
  });

  const hostTemplate = 'http://172.32.10.138/ssh/host/%ip%?port=%port%&header=WebSSH2&username=%user%&password=%pass%';

  const generateHost = () => {
    let host = hostTemplate;
    for (const key in postData) {
      host = host.replace(`%${key}%`, postData[key]);
    }
    return host;
  };

  const handleClick = (mode) => {
    const host = generateHost();

    if (mode === 'frame') {
      setSrc(host);
    } else if (mode === 'headless') {
      window.open(
        host,
        '_blank',
        'toolbar=0,location=0,menubar=0,scrollbars=0,resizable=0,width=800,height=600'
      );
    }
  };

  return (
    <>
      <Button style={{width: '130px', marginBottom: 15}} type='primary' onClick={() => handleClick('frame')}>In frame</Button>
      <Button style={{width: '130px'}} type='primary' onClick={() => handleClick('headless')}>In new Window</Button>
      <div style={{
        width: '1000px',
        height: '600px',
        margin: '10px auto 0',
        background: 'gray',
      }}>
        <iframe id="ssh_frame" src={src} title="SSH Terminal" style={{
          border: 'none',
          width: '100%',
          height: '100%',
        }}></iframe>
      </div>
    </>
  );
};


export default WebSSH2Client;
