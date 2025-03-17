export type IMassActions = {
    id?: number //ID таски
    names: string //Название таски
    description: string //Textarea на фронте, text блок на бэке описание файла
    type:  'objects-export' | 'objects-import' //Тип
    params: any //Типизированный относительно type объект 
    result_file_ids?: number[],
    source_file_ids?: number[],
    status?: 'queued_to_check' | 'checking' | 'checked' | 'queued_to_process' | 'processing' | 'success' | 'failed'
    report?: string
    created_at?: string
    updated_at?: string
}

export type IMassActionsPost = Omit<IMassActions, 'id'>