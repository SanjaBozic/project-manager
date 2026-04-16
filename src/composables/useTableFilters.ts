import { ref } from 'vue';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';

export function useTableFilters(columns: any) {
    const filters = ref();

    const createFilterConfig = (filterFields: string[]) => {
        const config: any = {
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        };

        filterFields.forEach(field => {
            if (field === 'created') {
                config[field] = { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] };
            } else {
                config[field] = { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] };
            }
        });

        return config;
    };

    const initFilters = (filterFields: string[]) => {
        filters.value = createFilterConfig(filterFields);
    };

    const clearFilters = (filterFields: string[]) => {
        initFilters(filterFields);
    };

    return {
        filters,
        initFilters,
        clearFilters,
        createFilterConfig,
    };
}
