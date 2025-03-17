import { deleteMassAction } from '@shared/api/Mass-actions/Models/deleteMassActions/deleteMassAction'
import { runMassAction } from '@shared/api/Mass-actions/Models/runMassActions/runMassAction'
import { getMediaFilesById } from '@shared/api/MediaFiles/Models/getMediaFilesById/getMediaFilesById'
import { selectCheckPermission, useAccountStore } from '@shared/stores/accounts'
import { useMediaFiles } from '@shared/stores/mediaFiles'
import { ECButtonRowPlay } from '@shared/ui/ECUIKit/buttons/ECButtonRowPlay/ECButtonRowPlay'
import ECConfirmationDialog from '@shared/ui/ECUIKit/modals'
import { ButtonDeleteRow, ButtonLook } from '@shared/ui/buttons'
import { ButtonDownload } from '@shared/ui/buttons/ButtonDownload/ButtonDownload'
import { Space } from 'antd'
import { useCallback } from 'react'


const ActionsTableColumn = ({ status, massAction, request, onLook }) => {
    const checkPermission = useAccountStore(selectCheckPermission)

    const getMediaFilesUrl = useMediaFiles().getMediaFileUrlById

    const getFileName = useCallback((id) => {
        const url = getMediaFilesUrl(id)

        return `${url?.split('-')[1]?.split('.')[0]}`
    }, [])

    return (
        <Space>
            {status?.buttons.includes('delete') && checkPermission(['delete tasks']) && (
                <ECConfirmationDialog
                    onConfirm={() => {
                        deleteMassAction(massAction.id).then(() => request())
                    }}
                    onConfirmMessage="Операция успешно удалена"
                    onCancelMessage="Удаление отменено"
                    title="Вы хотите удалить операцию?"
                >
                    <ButtonDeleteRow />
                </ECConfirmationDialog>
            )}
            {status?.buttons.includes('play') && checkPermission(['run tasks']) && (
                <ECButtonRowPlay
                    onClick={() => {
                        runMassAction(massAction.id).then(() => request())
                    }} 
                />
            )}
            {(status?.buttons.includes('show-result') ||
                status?.buttons.includes('show-error'))
                && (
                    <ButtonLook
                        onClick={onLook}
                    />
                )}
            {status?.buttons.includes('download') && checkPermission(['get files']) &&
                massAction?.source_file_ids?.length > 0
                && (
                    <ButtonDownload
                        filename={{ table: getFileName(massAction.source_file_ids[0]) }}
                        tooltip={{ title: 'Скачать файл' }}
                        buttonStyle={{ background: '#0099ff', color: 'white' }}
                        request={() => getMediaFilesById({ id: massAction.source_file_ids[0] })}
                        size="small"
                    />
                )}
            {massAction?.result_file_ids?.length > 0 && checkPermission(['get files']) && (
                <ButtonDownload
                    filename={{ table: getFileName(massAction.result_file_ids[0]) }}
                    tooltip={{ title: 'Скачать отчёт' }}
                    buttonStyle={{ background: '#33cc33', color: 'white' }}
                    request={() => getMediaFilesById({ id: massAction.result_file_ids[0] })}
                    size="small"
                />
            )}
        </Space>
    )
}

export default ActionsTableColumn