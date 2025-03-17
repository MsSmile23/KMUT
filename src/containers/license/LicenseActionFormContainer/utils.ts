import { SERVICES_LICENSES } from '@shared/api/License';


export const onSubmit = async (data) => {
    try {
        const response = await SERVICES_LICENSES.Models.postLicense({ file: data.file });

        return response
    }
    catch (error) { 
        console.error('Ошибка добавления: ', error);
    }
    
};

export const imageSnapshot = async () => {
    try {
        const response = await SERVICES_LICENSES.Models.getSnapshot()

        if (response?.success === true) {
            const fileData = await response.data
            const hostname = window.location.hostname
            const file = new File([fileData], `Snapshot_${hostname}.txt`)
            const url = URL.createObjectURL(file);
            const a = document.createElement('a');
    
            a.href = url;
            a.download = file.name; 
            document.body.appendChild(a); 
            a.click(); 
            document.body.removeChild(a); 
            URL.revokeObjectURL(url); 

            return response
        } else {
            return response
        }
    }
    catch (error) {
        console.error('Ошибка добавления: ', error);
    } 
}