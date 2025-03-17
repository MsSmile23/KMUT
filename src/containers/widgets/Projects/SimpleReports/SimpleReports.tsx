import { getReportTypes } from '@shared/api/ReportTypes/Models/getReportTypes/getReportTypes'
import { TReportType } from '@shared/types/reports'
import { ECSimpleFilters } from '@shared/ui/ECUIKit/filters/ECSimpleFilters/ECSimpleFilters'
import { useCallback, useEffect, useMemo, useState } from 'react'
import ReportsTableStyles from './SimpleReports.module.css'
import { postReportsTasks } from '@shared/api/Reports/Models/postReportsTasks/postReportsTasks'
import { Button, message, Tooltip } from 'antd/lib'
import moment from 'moment-timezone'
import { ECLoader } from '@shared/ui/loadings'
import { useTheme } from '@shared/hooks/useTheme'
import { selectAccount, useAccountStore } from '@shared/stores/accounts'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'
import { useClassesStore } from '@shared/stores/classes'
import { selectObject, useObjectsStore } from '@shared/stores/objects'
import { getObjectById } from '@shared/api/Objects/Models/getObjectById/getObjectById'
import { getFilteredObjects } from '@shared/api/Objects/Models/getFilteredObjects/getFilteredObjects'


const SimpleReports = (props) => {

    const { settings } = props
    const { widget } = settings
    const [reportsTypes, setReportTypes] = useState([])
    const [filters, setFilters] = useState([])
    const [loading, setLoading] = useState({})

    const filterFields = useMemo(() => {
        return props.settings.widget.fields || [];
    }, [props.settings]);

    const name = settings?.baseSettings?.name

    const theme = useTheme()
    const accountData = useAccountStore(selectAccount)
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode
    const backgroundColor2 = createColorForTheme(theme?.backgroundColor, theme?.colors, themeMode) || 'white'
    // const getClassByIndex = useClassesStore((st) => st.getByIndex);

    useEffect(() => {
        const fetchData = async () => {

            const reportTypesResponse = await getReportTypes()

            // setReportTypes( //TODO вернуть после того, как сделают все типы на эндпоинте
            //     reportTypesResponse?.data?.map((type: TReportType) => {

            //         return {
            //             value: type?.id,
            //             label: type?.name,
            //         }
            //     }
            //     )
            //         .filter(el => widget?.selectedTypes.includes(el.value))
            // )

            //! временное решение с мок данными
            setReportTypes(
                [
                    ...reportTypesResponse?.data?.map((type: TReportType) => {

                        return {
                            value: type?.id,
                            label: type?.name,
                        }
                    }
                    )
                        .filter(el => widget?.selectedTypes.includes(el.value)) ?? [],
                ]
            )
        };

        fetchData();
    }, []);

    const saveReport = async (report_type_id) => {

        const dateFields = filters?.find(el => el.filterType === 'dates')?.values ?? {}

        //TODO сделать запрос объектов по фильтрам

        setLoading({
            ...loading,
            [report_type_id]: true
        })

        const objectsIds = await getFilteredObjects({ filters })

        // console.log('filters', filters)
        // console.log('objectsIds', objectsIds)

        const payload = {
            report_type_id,
            objects: objectsIds?.data,
            formats: ['xlsx'],
            frequency_type: 'one_time',
            construction_period: 'arbitrary',
            start_datetime: dateFields['date_from'] ?? moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
            end_datetime: dateFields['date_to'] ?? moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
        }

        // console.log('payload', payload)

        try {
            const response = await postReportsTasks(payload)

            if (response?.success) {
                message.success('Отчёт отправлен на создание');

                return
            }

            message.error(`Ошибка при сохранении 
                ${payload.frequency_type == 'regular' ? 'задания' : 'отчёта'}: 
                ${response?.error && Object.values(response?.error?.errors)}`);
        } catch (error) {
            console.error('Error saving report:', error);
            message.error('Ошибка при сохранении отчёта. Попробуйте ещё раз.');
        } finally {
            setLoading({
                ...loading,
                report_type_id: false
            })
        }

    }

    const checkDisable = useCallback((report_type_id) => {

        if (report_type_id === 19) {
            const municipalities = filters?.length > 0
                ? filters?.find(el => el.backFilterName === 'municipalityByIds')?.values ?? []
                : []
            const regions = filters?.length > 0
                ? filters?.find(el => el.backFilterName === 'regionByIds')?.values ?? []
                : []
            const address = filters?.length > 0
                ? filters?.find(el => el.backFilterName === 'objectsByAttributeAddressValue')?.values ?? []
                : []

            return (municipalities?.length < 1 && regions?.length < 1 && address?.length < 1)
        }

        if (filters?.length > 0) {
            const instituteFilters = filters.find(el => el.backFilterName === 'instituteTypeByIds')?.values

            if (report_type_id === 17) {
                return instituteFilters.length > 0
                    ? !(instituteFilters.includes(67911) || instituteFilters.includes(67912))
                    : false
            }

            if (report_type_id === 18) {
                return instituteFilters.length > 0
                    ? !(instituteFilters.includes(67910))
                    : false
            }
        }

        { return false }
    }, [filters])

    const getDisabledText = (report_type_id) => {

        if (report_type_id === 19) {
            return 'Выберите хотя бы один регион/муниципалитет/адрес'
        }

        if (report_type_id === 17) {
            return 'Должен быть выбран тип учреждения СПО или Гос. МОУ'
        }

        if (report_type_id === 18) {
            return 'Должен быть выбран тип учреждения ЦИК'
        }
    }


    // const checkDisable = useCallback(async (name) => {
    //     const instituteFilters = filters?.length > 0
    //         ? filters?.find(el => el.backFilterName === 'instituteTypeByIds')?.values
    //         : [];

    //     if (instituteFilters?.length > 0) {
    //         const objects = await Promise.all(instituteFilters.map(value => getObjectById(value)));

    //         return !objects.some(obj => name.includes(obj.data?.name));
    //     }

    //     return false;
    // }, [filters]);

    // useEffect(() => {
    //     const checkButtons = async () => {
    //         const disabled = {};

    //         for (const el of reportsTypes) {
    //             disabled[el.value] = await checkDisable(el.label);
    //         }
    //         setDisabledButtons(disabled);
    //     };

    //     checkButtons();
    // }, [filters, reportsTypes, checkDisable]);


    return (
        <div style={{ display: 'flex', width: '100%' }}>
            <div style={{ marginLeft: 40, marginTop: 30, width: '320px' }}>
                <ECSimpleFilters
                    onChange={setFilters}
                    mainClassId={10001}
                    fields={filterFields}
                />
            </div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                    marginTop: 10,
                    alignItems: 'center',
                    flexGrow: 1
                }}
            >
                <div style={{ width: '100%', justifyContent: 'flex-start' }}>
                    <h1 style={{ marginLeft: 70 }}>{name}</h1>
                </div>
                <div
                    style={{
                        width: '95%',
                        display: 'flex',
                        height: '90%',
                        backgroundColor: backgroundColor2
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 10,
                            marginTop: 20,
                            alignItems: 'center',
                            flexGrow: 1,
                        }}
                    >
                        {reportsTypes.length < 1 && <ECLoader size="large" />}
                        {reportsTypes.map(el => {
                            const disabled = checkDisable(el.value)

                            return (
                                <Tooltip title={disabled ? getDisabledText(el.value) : null} key={el.value}>
                                    <Button
                                        key={el.value}
                                        className={ReportsTableStyles.ReportTypeButton}
                                        onClick={() => saveReport(el.value)}
                                        disabled={loading[el.value] || disabled}
                                    >
                                        <span className={ReportsTableStyles.buttonContent}>
                                            {loading[el.value] ? <ECLoader size="small" /> : el.label}
                                        </span>
                                    </Button>
                                </Tooltip>

                            )
                        })}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default SimpleReports