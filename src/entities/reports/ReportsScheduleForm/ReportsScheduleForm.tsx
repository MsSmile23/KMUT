import { Radio, Row } from 'antd';
import { useEffect, useState } from 'react';
//import { ReportFormState, ReportFormStepper } from '../types';
import PastPeriod from './PastPeriod';
import Schedule from './Schedule';

/**
 * Компонент для выбора между разовым расписанием и регулярным расписанием (удалить)
 */
const ReportsScheduleForm: React.FC<{
    state: any
    setState: React.Dispatch<React.SetStateAction<any>>;
}> = ({ state, setState }) => {
    const [regular, setRegular] = useState(false);
    const [pastPeriod, setPastPeriod] = useState<[any, any]>([null, null]);

    useEffect(() => {
        setState((forms) => ({
            ...forms,
            second: {
                ...forms.second,
                regular,
                pastPeriod: pastPeriod || [null, null],
            },
        }));
    }, [pastPeriod, regular]);

    useEffect(() => {
        setRegular(false)
        setPastPeriod([null, null])
    }, [state.type, state.category])

    return (
        <>
            <Row style={{ marginBottom: 20 }}>
                <Radio.Group 
                    defaultValue={0} 
                    onChange={({ target }) => setRegular(Boolean(target.value))}
                >
                    <Radio value={0}>Разово</Radio>
                    <Radio value={1}>Регулярно</Radio>
                </Radio.Group>
            </Row>
            {!regular && (
                <PastPeriod period={pastPeriod} setPastPeriod={setPastPeriod} />
            )}
            {regular && <Schedule />}
        </>
    );
};

export default ReportsScheduleForm;