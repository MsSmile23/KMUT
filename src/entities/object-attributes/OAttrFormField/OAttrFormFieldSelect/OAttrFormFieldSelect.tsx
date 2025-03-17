import { ECSelect } from '@shared/ui/forms'

const OAttrFormFieldSelect = (initialProps) => {

    const {
        options,
        ...props
    } = initialProps

    let newOptions = {}

    const general = {
        label: <span>Общие</span>,
        title: 'Общие',
        options: []
    }

    options?.forEach(option => {
        const newObject = {
            label: <span>{option.label}</span>,
            value: option.value
        };

        if (option.ogroup) {
            if (!newOptions[option.ogroup]) {
                newOptions[option.ogroup] = {
                    label: <span>{option.ogroup}</span>,
                    title: option.ogroup,
                    options: []
                };
            }
            newOptions[option.ogroup].options.push(newObject);
        } else {
            general.options.push(newObject);
        }
    });

    if (general?.options?.length > 0 && Object.keys(newOptions).length > 0) {
        newOptions = {
            'general': { ...general },
            ...newOptions
        }
    }

    return (
        <ECSelect
            dropdownStyle={{ maxWidth: '60%' }}
            placeholder="Выберите значение"
            options={Object.keys(newOptions).length > 0
                ? Object.values(newOptions)
                : options}
            {...props}
        />
    )
}

export default OAttrFormFieldSelect