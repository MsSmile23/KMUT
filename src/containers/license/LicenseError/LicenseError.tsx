import { useDocumentTitle } from '@shared/hooks/useDocumentTitle'
import { useLayoutSettingsStore } from '@shared/stores/settingsLayout'
import { ECPage418 } from '@shared/ui/ECUIKit/errors/ECPage418/ECPage418'
import { useEffect } from 'react'

const LicenseError = () => {
    useDocumentTitle('Ошибка лицензии')
    const { setFullScreen } = useLayoutSettingsStore()

    useEffect(() => {
        setFullScreen(true)
    }, [])

    return <ECPage418 />
}

export default LicenseError