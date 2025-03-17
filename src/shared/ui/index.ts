//export * as Buttons from '@shared/UI/buttons'
//export * as Form from '@shared/UI/forms'
//export *  as Table from '@shared/UI/tables'

import * as Buttons from '@shared/ui/buttons'
import * as Forms from '@shared/ui/forms'
import * as Tables from '@shared/ui/tables'
import * as Modals from '@shared/ui/modals'
import * as PageHeader from '@shared/ui/pageHeader'
import * as TelecomRack from '@shared/ui/custom'
import ECModal from '@shared/ui/ECUIKit/ECModal/ECModal';
import * as ECCharts from '@shared/ui/ECUIKit/charts'
import * as ECDatePickers from '@shared/ui/ECUIKit/ECDatePickers'
import * as ECForms from '@shared/ui/ECUIKit/forms'
import ECButtonDownload from './ECUIKit/buttons/ECButtonDownload/ECButtonDownload'
import * as ECSelectWithVirtualization from '@shared/ui/ECUIKit/ECSelectWithVirtualization/ECSelectWithVirtualization'

export const UIKit = {
    Buttons,
    Forms,
    Tables,
    Modals,
    PageHeader,
    TelecomRack,
}

export const ECUIKit = {
    common: {
        ECButtonDownload,
        ECModal,
        ECCharts,
        ECDatePickers,
        ECForms,
        ECSelectWithVirtualization
    }
}