import { extensionsFilesSignature } from './extensionsFilesSignature';

/**
 * Асинхронно скачивает файл, полученный из запроса, с определенным именем и расширением.
 * @param request () => Promise<{ success: boolean; data: Blob } | null | undefined> - Функция, 
 * возвращающая Promise с объектом response,
 * который содержит Blob данных для скачивания. Может вернуть null или undefined в случае отсутствия данных.
 * @param name string (optional) - Необязательное имя файла для скачивания. 
 * Если не указано, будет использовано текущая дата и время.
 * @param extension string (optional) - Необязательное расширение файла для скачивания. 
 * Если не указано, будет определено автоматически.
 */
export const downloadBlobFile = async (
    request: () => Promise<{ success: boolean; data: Blob } | null | undefined>,
    extension?: string,
    name?: string, 
) => {
    const response = await request?.()

    if (response?.success) {
        const blob = new Blob([response.data]); // Создаем Blob из полученных данных
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        const defaultName = `Файл ${new Date().toLocaleString().split(',').join('')}`;

        getExtensionOfFile(blob)
            .then(res => { 
                if (!extension && res !== 'Unknown filetype') {
                    link.setAttribute('download', `${name || defaultName}.${res}`);
                
                    return
                }
                link.setAttribute('download', `${name || defaultName}.${extension?.toLocaleLowerCase()}`);
            })
            .then(() => {
                link.href = url;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            })
    }
}

/**
 * Асинхронно определяет расширение файла на основе его сигнатуры.
 * @param file Blob - Файл, для которого необходимо определить расширение.
 * @returns Promise<string> - Промис, который разрешается строкой с расширением файла 
 * или 'Unknown filetype', если расширение не найдено.
 */
export const getExtensionOfFile = async (file: Blob) => {

    return new Promise<string>((resolve) => {
        const fileReader = new FileReader();
    
        fileReader.onloadend = function(evt) {
            if (evt.target.readyState === FileReader.DONE) {
                const arrayBuffer = evt.target.result as ArrayBuffer;
                const uint = new Uint8Array(arrayBuffer.slice(0, 32));
                const hexSignature = Array
                    .from(uint, byte => ('00' + byte.toString(16)).slice(-2)).join('').toUpperCase();
    
                const mimeType = detectExtension(hexSignature);
    
                resolve(mimeType);
            }
        };
    
        fileReader.readAsArrayBuffer(file);
    });
}

/**
     * Функция для определения MIME-типа на основе шестнадцатеричной сигнатуры.
     * @param hexSignature string - Шестнадцатеричная сигнатура файла.
     * @returns string - Расширение файла на основе сигнатуры или 'Unknown filetype', если сигнатура не распознана.
     */
export const detectExtension = (hexSignature: string) => {
    for (const ext in extensionsFilesSignature) {
        const signatures = extensionsFilesSignature[ext].signs;

        for (const signature of signatures) {
            const pattern = signature.split(',')[1];

            if (pattern === hexSignature.slice(0, pattern.length)) {
                return ext
            }
        }
    }
    
    return 'Unknown filetype';
};