import { getReports2 } from '@shared/api/Reports/Models/getReports2/getReports2'
import { useApi2 } from '@shared/hooks/useApi2'
import { generalStore } from '@shared/stores/general'
import { useTheme } from '@shared/hooks/useTheme'
import { selectAccount, useAccountStore } from '@shared/stores/accounts'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'
import { ButtonDeleteRow } from '@shared/ui/buttons'
import { deleteReportById2 } from '@shared/api/Reports/Models/deleteReportById2/deleteReportById2'
import { downloadReportById2 } from '@shared/api/Reports/Models/downloadReportById2/downloadReportById2'
import { ButtonDownload } from '@shared/ui/buttons/ButtonDownload/ButtonDownload'
import { message } from 'antd/lib'

const ReportsCompactList = ({ reports }) => {


    const interfaceView = generalStore((st) => st.interfaceView)
    const isShowcase = interfaceView === 'showcase'
    const theme = useTheme()
    const accountData = useAccountStore(selectAccount)
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode
    const textColor = isShowcase ? createColorForTheme(theme?.widget?.textColor, theme?.colors, themeMode) : 'black'
    const backgroundColor = isShowcase
        ? createColorForTheme(theme?.widget?.background, theme?.colors, themeMode)
        : 'white'

    const deleteReport = async (id) => {
        const resp = await deleteReportById2(id)

        return resp
    }

    const deleteAllReports = () => {
        return new Promise((resolve, reject) => {
            const deletePromises = reports?.data?.map(report => {
                return deleteReportById2(report.id).catch((error) => {
                    // Если удаление неуспешно, отклоняем промис
                    return Promise.reject(`Failed to delete report with id ${report.id}: ${error}`);
                });
            });

            // Ждем завершения всех удалений
            Promise.all(deletePromises)
                .then(() => {
                    reports.request();
                    message.success('Все отчёты удалены успешно')
                    resolve('All reports deleted successfully');
                })
                .catch((error) => {
                    message.error(`Ошибка удаления отчёта: ${error}`)
                    reject(error); // отклоняем, если хотя бы одно удаление не удалось
                });
        });
    };

    return (
        <div style={{ width: '100%' }}>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: `2px solid ${textColor ?? 'black'}`,
                    padding: 15,
                }}
            >
                <h2
                    style={{
                        color: textColor,
                        margin: 0,
                    }}
                >
                    Загрузки
                </h2>
                {
                    reports?.data?.length > 0 &&
                    <ButtonDeleteRow
                        withConfirm
                        disableMessage
                        onClick={() => deleteAllReports()}
                    />
                }

            </div>
            {reports?.data?.map((report) => (
                <div
                    style={{
                        color: textColor,
                        borderBottom: `1px solid ${textColor ?? 'black'}`,
                        padding: 15,
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'space-between'
                    }}
                    key={report.id}
                >

                    <span
                        style={{ cursor: report.status == 5 ? 'not-allowed' : 'pointer', fontSize: 16 }}
                    >
                        <ButtonDownload
                            key={report.id}
                            format="xlsx"
                            request={async () => {
                                return downloadReportById2(report.id, 'xlsx')
                            }}
                            disableClick={report.status == 5}
                            filename={{
                                // eslint-disable-next-line max-len
                                request: `Отчёт_[${report?.status ?? ''}]_${report?.report_type?.name}_${report?.id}`,
                            }}
                            icon={null}
                        >
                            {report.report_type.name} {report.start_datetime}
                        </ButtonDownload>
                    </span>
                    <ButtonDeleteRow
                        withConfirm
                        onClick={async () => {
                            const response = await deleteReport(report.id)

                            reports.request()

                            return response
                        }}
                    />
                </div>
            ))}
        </div>
    )
}

export default ReportsCompactList