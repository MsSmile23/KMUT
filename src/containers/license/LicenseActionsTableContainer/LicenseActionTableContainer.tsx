import {  Row, Typography } from 'antd';
import { FC, useEffect, useMemo, useState, } from 'react';
import { licenseMockData, licenseTableHead, licenseTranslate, selectedMainKeys } from './utils';
import { SimpleTable } from '@shared/ui/tables';
import './module.license.css'
import { ECIconView } from '@shared/ui/ECUIKit/common/ECIconView/ECIconView';
import { ECTooltip } from '@shared/ui/tooltips';
import LicenseActionFormContainer from '../LicenseActionFormContainer/LicenseActionFormContainer';
import LicenseSnapshotFormContainer from '../LicenseActionFormContainer/LicenseSnapshotFormContainer';
import { ILicense, ILicenseRow } from '@shared/types/license';
import { useLicenseStore } from '@shared/stores/license';
import dayjs from 'dayjs';
import { useTheme } from '@shared/hooks/useTheme';

export const LicenseActionTableContent: FC = () => {

    const licenseBack = useLicenseStore((state) => state.store.data)
    const config = useTheme()
    const [licenseData, setLicenseData] = useState<ILicense>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (licenseBack && config?.licenseStatus !== undefined) {
            const newResult = config.licenseStatus ? licenseBack : licenseMockData;

            setLoading(false); 
            setLicenseData(newResult);
        } 
    }, [licenseBack, config]);

    const currentDate = useMemo(() => {
        return dayjs().format('YYYY-MM-DD')
    }, []) 
    
    const requiredData = useMemo(() => {
        if (licenseData  !== null) {
            const mainEntries = Object.entries(licenseData?.main)
                .filter(([key]) => selectedMainKeys.includes(key))
                .map(([key, value]) => ({ key, value, status: true }))
            const limitsEntries = Object.entries(licenseData?.limits)
                .map(([key, value]) => ({ key, value, status: true }))
                           
            return [...mainEntries, ...limitsEntries]
        }
    }, [config, licenseData])
    
    const currentArray = useMemo(() => { 
        return {
            from: currentDate,
            till: currentDate,
            classes: licenseData?.current?.classes,
            attributes: licenseData?.current?.attributes,
            objects: licenseData?.current?.objects,
            users: licenseData?.current?.users,
            vtemplates: licenseData?.current?.vtemplates
        }
    }, [config, licenseData])

    const isAllOkey = useMemo(() => {
        if (licenseData !== null) {
            return requiredData?.map((data) => {
                if (data?.key !== 'from') {
                    if (data?.value <= currentArray[data.key]) {
                        data.status = false
                    }
                }
            })
        }
    }, [requiredData, config])

    const getRowClassName = (record) => {
        return record.status ? 'row-active' : 'row-inactive'
    };

    const rows = useMemo(() =>  requiredData?.map((data, index) => ({
        id: index,
        key: 1000 + index,
        description: licenseTranslate[data?.key],
        limit: data?.value,
        status: data.status,
        current: (
            data.status ? currentArray[data?.key] : 
                <ECTooltip 
                    title="Лимит лицензии превышен"
                    placement="top"

                >
                    <ECIconView
                        icon="WarningOutlined"
                        style={{
                            color: 'black',
                            fontSize: 22,
                            cursor: 'pointer',
                        }}
                    />
                    <Typography.Text ellipsis={true} style={{ marginLeft: '10px' }}>
                        {currentArray[data?.key]}
                    </Typography.Text>
                </ECTooltip>    
        ),       
    } as ILicenseRow)), [requiredData, config])

    return ( 
        <>
            <Row style={{ marginBottom: '10px' }}>
                {licenseData?.main?.valid ? (
                    <ECTooltip 
                        title="Лицензия действительна"
                        placement="top"
                    >
                        <ECIconView
                            icon="CheckCircleOutlined"
                            style={{
                                color: '#1890ff',
                                fontSize: 22,
                                cursor: 'pointer',
                            }}
                        />                 
                    </ECTooltip>
                ) : 
                    (
                        <ECTooltip 
                            title="Лицензия не действительна"
                            placement="top"
                        >
                            <ECIconView
                                icon="WarningOutlined"
                                style={{
                                    color: 'red',
                                    fontSize: 22,
                                    cursor: 'pointer',
                                }}
                            />
                        </ECTooltip>
                    )}    
            </Row>
            <Row style={{ display: 'flex', justifyContent: 'space-between' }}>
                <LicenseActionFormContainer />
                <LicenseSnapshotFormContainer />
            </Row>
            {licenseBack !== null && Object.keys(licenseBack).length !== 0 ? (
                <SimpleTable
                    columns={licenseTableHead} rows={rows} scroll={{ x: '400px', y: '70vh' }} 
                    bordered
                    pagination={false}
                    rowClassName={getRowClassName}
                    loading={loading}
                />
            ) : (
                <Row
                    style={{ display: 'flex', justifyContent: 'center', 
                        fontSize: '24px', fontWeight: 'bold' }}
                >Лицензии нет
                </Row>
            )}
        </> 
    )   
}