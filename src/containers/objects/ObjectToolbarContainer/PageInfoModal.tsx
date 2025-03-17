import { ECModal } from '@shared/ui/modals'


const PageInfoModal = ({ open, setOpen }) => {
    return (
        <ECModal
            title="Справка о странице"
            open={open}
            onCancel={() => { setOpen(false) }}
            footer={() => (<></>)}
        >
            {/* Справка о странице */}
        </ECModal>
    )
}

export default PageInfoModal