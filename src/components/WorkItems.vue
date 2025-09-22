<script setup lang="ts">
    import { Button, Column, ContextMenu, DataTable, DatePicker, IconField, InputIcon, InputText, Message, MultiSelect, Tag, Dialog } from 'primevue';
    import { ref } from 'vue';
    import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
    import '../assets/style/work-items.css'
    import { getTypeColor, getStateColor } from '@/data/formFields';
    import { useFormCache } from '@/composables/useFormCache'
    import AddNewItem from './AddNewItem.vue';

    const { cache: products, save, update, remove, clear } = useFormCache<Record<string, any>>('workItems')

    const columns = ref([
        { field: 'id', header: 'Id' },
        { field: 'type', header: 'Type' },
        { field: 'title', header: 'Title' },
        { field: 'state', header: 'State' },
        { field: 'created', header: 'Created' },
        { field: 'parent', header: 'Parent Id' },
        { field: 'tags', header: 'Tags' },
    ]);

    // filters global and each column 

    const filters = ref();

    const initFilters = () => {
        filters.value = {
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            id: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            title: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            type: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            state: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            tags: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            parent: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            created: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
        };
    };

    initFilters();

    const clearFilter = () => {
        initFilters();
        selectedColumns.value = [...columns.value]; // Reset to show all columns
    };

    // edit mode
    const onCellEditComplete = (event: any) => {
        let { data, newValue, field } = event;

        switch (field) {
            default:
                if (typeof newValue === 'string') {
                    if (newValue.trim().length > 0) {
                        data[field] = newValue;
                    } else {
                        event.preventDefault();
                    }
                } else if (newValue !== null && newValue !== undefined) {
                    // Accept non-string valid data (e.g., Date, tags array)
                    data[field] = newValue;
                } else {
                    event.preventDefault();
                }
                break;
        }
    };

    // hide-show rows
    const selectedColumns = ref(columns.value);

    const onToggle = (val: any) => {
        selectedColumns.value = columns.value.filter(col => val.includes(col));
    };

    // reorder
    const onColReorder = () => {
        console.log('Column reordered');
    };
    const onRowReorder = (event: any) => {
        products.value = event.value;
        console.log('Row reordered');
    };

    // export to csv
    const dt = ref();
    const exportCSV = () => {
        dt.value.exportCSV();
    };

    // context menu right click
    const contextMenu = ref()
    const selectedRow = ref<Record<string, any> | null>(null)

    const menuModel = ref([
        { label: 'View', icon: 'pi pi-fw pi-search', command: () => viewRow(selectedRow.value) },
        { label: 'Delete', icon: 'pi pi-fw pi-times', command: () => deleteRow(selectedRow.value) }
    ])

    const onRowContextMenu = (event: any) => {
        contextMenu.value.show(event.originalEvent);
    };

    const viewRow = (row: any) => {
    console.log('Row viewed:', row)
    }

    const deleteRow = (row: any) => {
    products.value = products.value.filter((p) => p.id !== row.id)
    console.log('Row deleted:', row.title)
    selectedRow.value = null
    }

    let visibleAddNewModal = ref(false);
    const addNewItem = () => {
        visibleAddNewModal.value = true;
    };

</script>

<template>
    <AddNewItem v-model:visible="visibleAddNewModal" :items="products" :save="save" :update="update" :remove="remove" :clear="clear"/>
    <div class="card">
        <ContextMenu ref="contextMenu" :model="menuModel" @hide="selectedRow = null" />
        <DataTable  ref="dt" :value="products" dataKey="id" 
            v-model:contextMenuSelection="selectedRow" contextMenu @row-contextmenu="onRowContextMenu" 
            :reorderableColumns="true" @columnReorder="onColReorder" @rowReorder="onRowReorder" 
            :size="'small'" 
            scrollable
            removableSort stripedRows 
            paginator :rows="15" :rowsPerPageOptions="[15, 25, 50, 75, 100]" 
            tableStyle="min-width: 50rem"
            v-model:filters="filters" filterDisplay="menu" :globalFilterFields="['title', 'type', 'state', 'tags','created','id','parent']"
            editMode="cell" @cell-edit-complete="onCellEditComplete"
                :pt="{
                    table: { style: 'min-width: 50rem' },
                    column: {
                        bodycell: ({ state }: { state: Record<string, any> }) => ({
                            class: [{ '!py-0': state['d_editing'] }]
                        })
                    }
                }"
        >
            <template #header>
                <div class="wi__header-toolbar">
                    <MultiSelect :modelValue="selectedColumns" :options="columns" optionLabel="header" @update:modelValue="onToggle" display="chip" placeholder="Select Columns" />
                    <div class="wi__header-toolbar--right">
                        <Button type="button" icon="pi pi-plus" label="Add" variant="outlined" severity="info" @click="addNewItem()" ></Button>
                        <Button type="button" icon="pi pi-filter-slash" label="Clear" variant="outlined" @click="clearFilter()" ></Button>
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                        </IconField>
                    </div>
                </div>
            </template>
            <template #empty> No data found. </template>
            <template #paginatorstart>
                <Button type="button" icon="pi pi-download" text @click="exportCSV()" />
            </template>
            <Column rowReorder headerStyle="width: 3rem" :reorderableColumn="false" />
            <Column v-for="(col, index) of selectedColumns" :key="col.field + '_' + index" :field="col.field" :header="col.header" sortable>
                <template #editor="{ data }">
                    <template v-if="col.field !== 'created'">
                        <InputText v-model="data[col.field]" autofocus fluid />
                    </template>
                    <template v-else>
                        <DatePicker v-model="data[col.field]" autofocus fluid />
                    </template>
                </template>
                <template #body="{ data }">
                    <template v-if="col.field === 'type'">
                        <Message size="small" :severity="getTypeColor(data[col.field])" :closable="false" variant="simple">
                            {{ data[col.field] }}
                        </Message>
                    </template>
                    <template v-else-if="col.field === 'state'">
                        <Tag :severity="getStateColor(data[col.field])" :value="data[col.field]" />
                    </template>
                    <template v-else-if="col.field === 'tags'">
                        <span class="tag-wrap" style="display: flex; gap: 0.25rem; flex-wrap: wrap;">
                            <Tag
                                v-for="(tag, idx) in data[col.field]"
                                :key="idx"
                                severity="secondary"
                                :value="tag"
                            />
                        </span>
                    </template>
                    <template v-else>
                        {{ data[col.field] }}
                    </template>
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" placeholder="Search ..." />
                </template>
            </Column>
        </DataTable>
    </div>
</template>
