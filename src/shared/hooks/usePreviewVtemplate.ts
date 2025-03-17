import { dataVtemplateProps, paramsVtemplate } from '@shared/types/vtemplates'
import { useState } from 'react'

type UsePreviewVtemplateReturn = {
    openModal: boolean;
    vtemplate: dataVtemplateProps<paramsVtemplate> | undefined;
    handleOpen: (templateId: number) => void;
    closeModal: () => void;
  }

export const usePreviewVtemplate = (vTemplates: dataVtemplateProps<paramsVtemplate>[]): UsePreviewVtemplateReturn => {
    const [openModal, setOpenModal] = useState<boolean>(false)
    const [vtemplate, setVtemplate] = useState<dataVtemplateProps<paramsVtemplate>>()

    const handleOpen = (template: number) => {
        const currentVtemplate = vTemplates?.find(temp => temp.id === template)

        setVtemplate(currentVtemplate)
        setOpenModal(true)
    }

    const closeModal = () => {
        setOpenModal(false);
    }

    return {
        openModal,
        vtemplate,
        handleOpen,
        closeModal,
    }
}