import { Buttons } from '@shared/ui/buttons';
import { Button, Modal, Col, Row, Tooltip, message } from 'antd';
import { FC, useState } from 'react';
import { responseErrorHandler } from '@shared/utils/common';
import { selectLicense, useLicenseStore } from '@shared/stores/license';
import { imageSnapshot } from './utils';
import { ECLoader } from '@shared/ui/loadings';


const LicenseSnapshotFormContainer: FC = () => {

    const [loading, setLoading] = useState<boolean>(false)
    const licenseData = useLicenseStore(selectLicense)
    
    const submitHandler = () => {
        setLoading(true)
        imageSnapshot()
            .then((resp) => {
                if (resp.success) {
                    message.success(resp.codeMessage);
                } else {
                    responseErrorHandler({
                        response: resp,
                        modal: Modal,
                        errorText: `Ошибка получения снэпшота: ${resp.status}`,
                    })
                }
                setLoading(false)
            })
    }

    return (
        <Row>
            <Col style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <Col style={{ paddingBottom: '7px' }}>
                    Получить снэпшот
                </Col>
                {loading ? (
                    <Tooltip title="Идет скачивание">
                        <ECLoader
                            style={{ backgroundColor: 'white', boxShadow: '0 0 2px #f0f2f5' }}
                            size="large"
                        />         
                    </Tooltip>
                ) : 
                    (
                        <Tooltip>
                            {licenseData ? (
                                <Buttons.ButtonNewDownload
                                    color="#1890ff" text={false} onClick={submitHandler} 
                                    tooltipText="Скачать"
                                />
                            ) : (
                                <Buttons.ButtonNewDownload
                                    color="#1890ff" text={false} 
                                    tooltipText="Добавьте лицензию"
                                    disabled={true}
                                />
                            )}
                        </Tooltip>

                    )}
            </Col>
        </Row>
    )
}

export default LicenseSnapshotFormContainer