const defaultColDef = {
    filter: true,
    icons: {
        filter: `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="22px" height="22px" margin-top="2px" viewBox="0 0 32 32">
            <title>filter</title>
            <path d="M26 8.184c-0.066 2.658-4.058 5.154-6.742 7.974-0.168 0.196-0.252 0.424-0.258 0.682v3.66l-6 4.5c0-2.74 0.066-5.482-0.002-8.222-0.018-0.234-0.102-0.442-0.256-0.62-2.716-2.854-6.682-5.548-6.742-7.974v-2.184h20v2.184zM8 8c0 0.304 0.060 0.612 0.258 0.842 2.716 2.854 6.682 5.548 6.742 7.974v4.184l2-1.5v-2.684c0.066-2.658 4.058-5.154 6.742-7.974 0.198-0.23 0.258-0.538 0.258-0.842h-16z"></path>
            </svg>`,
    },
};

export const classGridOptions = {
    defaultColDef,
    onFilterChanged: onFilterChanged,
    // rowBuffer: 50
}

function onFilterChanged(event) {
    const filterModel = event.api.getFilterModel();
    console.log('Current filter model:', filterModel);
    // You can perform additional actions based on the filter model here
}