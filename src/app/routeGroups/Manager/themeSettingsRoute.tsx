import { ROUTES } from '@shared/config/paths'
import { CustomRoutes, ICustomRoute } from '../Constructor/CustomRoutes'
import Settings from '@pages/manager/settings/Settings'

const themeSettings: ICustomRoute = {
    page: {
        path: ROUTES.THEME_SETTINGS,
        component: (
            <Settings />
        ),
    },
    subPages: [
    ],
}

export const ThemeSettingsRoutes = CustomRoutes(themeSettings)