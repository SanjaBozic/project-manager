<script setup>
import { Button, Column, ContextMenu, DataTable, DatePicker, IconField, InputIcon, InputText, Message, MultiSelect, Tag } from 'primevue';
import { ref } from 'vue';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import '../assets/style/work-items.css'

// add dummy data
const products = ref([]);
const types = [
  'PBI',           // Product Backlog Item
  'Bug',           // An error or flaw in the systemž
  'Defect',        // A confirmed problem in the product that needs correction
  'Task',          // A unit of work to be completed
  'Feature',       // A new functional addition
  'Enhancement',   // An upgrade or polish to existing behavior
  'Epic',          // Large bodies of work broken into smaller stories
  'Story',         // User-focused requirement
  'Spike',         // Exploration task to learn or evaluate
  'Hotfix',        // Emergency bug fix
  'Refactor',      // Internal code cleanup
  'Research',      // Investigation task
  'Documentation'  // Update manuals, guides, etc.
];

const states = [
    'Open',
    'In Progress',
    'Pending Review',
    'Done',
    'On Hold',
    'Deployed',
    'Removed',
];

const sampleTitles = [
    'Implement user authentication',
    'Fix broken login redirect',
    'Write unit tests for auth module',
    'Add password reset feature',
    'Crash when uploading large files',
    'Update project documentation'
];
const sampleTags = [
    ['backend', 'security'],
    ['frontend', 'critical'],
    ['testing'],
    ['UX', 'backend'],
    ['bug', 'file upload'],
    ['documentation']
];

const getRandomDate = (start, end) => {
    const date = new Date(+start + Math.random() * (end - start));
    return date.toISOString().split('T')[0]; 
};

const startDate = new Date('2025-01-01');
const endDate = new Date('2025-08-31');

// Generate 100 dummy items
for (let i = 0; i < 100; i++) {
    const randomIndex = (arr) => Math.floor(Math.random() * arr.length);
    
    // randomly assign a parentId from existing ids (with some nulls)
    const possibleParentIds = products.value.map(p => p.id);
    const parentId = Math.random() < 0.5 && possibleParentIds.length > 0 
        ? possibleParentIds[randomIndex(possibleParentIds)] 
        : null;

    products.value.push({
        id: 100 + i,
        type: types[randomIndex(types)],
        title: sampleTitles[randomIndex(sampleTitles)],
        state: states[randomIndex(states)],
        created: getRandomDate(startDate, endDate),
        tags: sampleTags[randomIndex(sampleTags)],
        parent: parentId,
        sortable: true
    });
}

const columns = ref([
    { field: 'id', header: 'Id' },
    { field: 'type', header: 'Type' },
    { field: 'title', header: 'Title' },
    { field: 'state', header: 'State' },
    { field: 'created', header: 'Created' },
    { field: 'parent', header: 'Parent Id' },
    { field: 'tags', header: 'Tags' },
]);

// status render tags

const getSeverity = (status) => {
    switch (status) {
        case 'Open': return 'secondary';
        case 'In Progress': return 'info';
        case 'Pending Review': return 'warn';
        case 'Done': return 'success';
        case 'On Hold': return 'contrast';
        case 'Deployed': return 'primary';
        case 'Removed': return 'danger';
        default: return 'secondary'; // Fallback
    }
};

// type render as messages

const typeSeverityMap = {
  'Feature': 'warn',
  'Epic': 'warn',
  'Story': 'warn',

  'PBI': 'info',
  'Task': 'info',

  'Enhancement': 'secondary',
  'Spike': 'secondary',

  'Documentation': 'contrast',
  'Research': 'contrast',
  'Refactor': 'contrast',

  'Bug': 'error',
  'Defect': 'error',
  'Hotfix': 'error'
};

const getTypeSeverity = (type) => {
  return typeSeverityMap[type] || 'secondary'; // fallback for undefined types
};

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
const onCellEditComplete = (event) => {
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

const onToggle = (val) => {
    selectedColumns.value = columns.value.filter(col => val.includes(col));
};

// reorder
const onColReorder = () => {
    console.log('Column reordered');
};
const onRowReorder = (event) => {
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
const selectedRow = ref();
const menuModel = ref([
    {label: 'View', icon: 'pi pi-fw pi-search', command: () => viewRow(selectedRow)},
    {label: 'Delete', icon: 'pi pi-fw pi-times', command: () => deleteRow(selectedRow)}
]);

const onRowContextMenu = (event) => {
    contextMenu.value.show(event.originalEvent);
};

const viewRow = (data) => {
    console.log('Row viewed');
};

const deleteRow = (data) => {
    products.value = products.value.filter((p) => p.id !== data.value.id);
    console.log('Row deleted: ' + products.value.title);
    selectedRow.value = null;
};

</script>

<template>

    <div class="card">
        <ContextMenu ref="contextMenu" :model="menuModel" @hide="selectedRow = null" />
        <DataTable  ref="dt"  :value="products" dataKey="id" 
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
                        bodycell: ({ state }) => ({
                            class: [{ '!py-0': state['d_editing'] }]
                        })
                    }
                }"
        >
            <template #header>
                <div class="wi__header-toolbar">
                    <MultiSelect :modelValue="selectedColumns" :options="columns" optionLabel="header" @update:modelValue="onToggle" display="chip" placeholder="Select Columns" />
                    <div class="wi__header-toolbar--right">
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
                <Button type="button" icon="pi pi-download" text @click="exportCSV($event)" />
            </template>
            <Column rowReorder headerStyle="width: 3rem" :reorderableColumn="false" />
            <Column v-for="(col, index) of selectedColumns" :key="col.field + '_' + index" :field="col.field" :header="col.header" sortable>
                <template #editor="{ data, field }">
                    <template v-if="field !== 'created'">
                        <InputText v-model="data[field]" autofocus fluid />
                    </template>
                    <template v-else>
                        <DatePicker v-model="data[field]" autofocus fluid />
                    </template>
                </template>
                <template #body="{ data, field }">
                    <template v-if="field === 'type'">
                        <Message size="small" :severity="getTypeSeverity(data[field])" :closable="false" variant="simple">
                            {{ data[field] }}
                        </Message>
                    </template>
                    <template v-else-if="field === 'state'">
                        <Tag :severity="getSeverity(data[field])" :value="data[field]" />
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
                        {{ data[field] }}
                    </template>
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" placeholder="Search ..." />
                </template>
            </Column>
        </DataTable>
    </div>
</template>
