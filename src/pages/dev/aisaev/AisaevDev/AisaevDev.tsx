import { PageHeader } from "@shared/ui/pageHeader";
import { breadCrumbs } from "./aisaevDevData";
import ProjectsMapRegions from "@containers/widgets/Projects/ProjectsMapRegions/ProjectsMapRegions";
import ProjectNetUtilization from "@containers/widgets/Projects/ProjectNetUtilization/ProjectNetUtilization";
import { ECSimpleFilters } from "@shared/ui/ECUIKit/filters/ECSimpleFilters/ECSimpleFilters";
import { ECDatePicker } from "@shared/ui/ECUIKit/forms/ECDatePicker/ECDatePicker";
import { RangePickerWithPresets } from "@shared/ui/forms";
import { WidgetECSimpleFiltersForm } from "@shared/ui/ECUIKit/filters/ECSimpleFilters/components/WidgetECSimpleFiltersForm/WidgetECSimpleFiltersForm";

function AisaevDev() {
    return (
        <>
            <PageHeader title="Тестовая страница Алексей И" routes={breadCrumbs} />
            <div style={{ width: '300px' }}>
                <ECSimpleFilters
                    fields={[
                        {
                            type: 'attribute',
                            attribute_id: 10005,
                            isMultiSelect: false,
                            tagCloud: false,
                        }
                    ]}
                    mainClassId={10001}
                    showHeader={false}
                    onChange={v => console.log('чп чендж', v)}
                // align
                />
                {/* <ECSimpleFilters
                    mainClassId={10001}
                    onChange={v => console.log('change', v)}
                    hideResetButton
                    fields={[
                        {
                            type: 'class',
                            class_id: 10001,
                        },
                        {
                            type: 'class',
                            class_id: 10002,
                        },
                        {
                            type: 'class',
                            class_id: 10003,
                        },
                        {
                            type: 'class',
                            class_id: 10010,
                        },
                        {
                            type: 'class',
                            class_id: 10011,
                        },
                        {
                            type: 'attribute',
                            attribute_id: 10018,
                        },
                        {
                            type: 'dates_last',
                        },
                        {
                            type: 'dates',
                        },
                        {
                            type: 'user_login',
                        },
                    ]}
                /> */}
            </div>
        </>
    )
}

export default AisaevDev;