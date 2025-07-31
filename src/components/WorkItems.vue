<template>
    <div class="card">
        <ContextMenu ref="contextMenu" :model="menuModel" @hide="selectedRow = null" />
        <DataTable  ref="dt"  :value="products" 
            v-model:contextMenuSelection="selectedRow" contextMenu @row-contextmenu="onRowContextMenu" 
            :reorderableColumns="true" @columnReorder="onColReorder" @rowReorder="onRowReorder" 
            :size="'small'" 
            scrollable scrollHeight="90vh" 
            removableSort stripedRows 
            paginator :rows="25" :rowsPerPageOptions="[25, 50, 75, 100]" 
            tableStyle="min-width: 50rem"
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
                <div style="text-align:left">
                    <MultiSelect :modelValue="selectedColumns" :options="columns" optionLabel="header" @update:modelValue="onToggle"
                        display="chip" placeholder="Select Columns" />
                </div>
            </template>
            <template #paginatorstart>
                <Button type="button" icon="pi pi-refresh" text />
            </template>
            <template #paginatorend>
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
            </Column>
        </DataTable>
    </div>
</template>

<script setup>
import { Button, Column, ContextMenu, DataTable, DatePicker, InputText, MultiSelect } from 'primevue';
import { ref } from 'vue';

const products = ref([
  {
    id: 101,
    type: 'PBI',
    title: 'Implement user authentication',
    state: 'In Progress',
    created: '2024-03-10',
    tags: ['backend', 'security', 'high priority'],
    sortable: true
  },
  {
    id: 102,
    type: 'Bug',
    title: 'Fix broken login redirect',
    state: 'Open',
    created: '2024-03-12',
    tags: ['frontend', 'critical'],
  },
  {
    id: 103,
    type: 'Task',
    title: 'Write unit tests for auth module',
    state: 'Pending Review',
    created: '2024-03-14',
    tags: ['testing'],
  },
  {
    id: 104,
    type: 'PBI',
    title: 'Add password reset feature',
    state: 'Completed',
    created: '2024-03-08',
    tags: ['backend', 'UX'],
  },
  {
    id: 105,
    type: 'Bug',
    title: 'Crash when uploading large files',
    state: 'Open',
    created: '2024-03-11',
    tags: ['file upload', 'bug'],
  },
  {
    id: 106,
    type: 'Task',
    title: 'Update project documentation',
    state: 'In Progress',
    created: '2024-03-15',
    tags: ['documentation'],
  },
])

const columns = ref([
    { field: 'id', header: 'Id' },
    { field: 'type', header: 'Type' },
    { field: 'title', header: 'Title' },
    { field: 'state', header: 'State' },
    { field: 'created', header: 'Created' },
    { field: 'tags', header: 'Tags' },
]);

// edit mode
const onCellEditComplete = (event) => {
    let { data, newValue, field } = event;

    switch (field) {
        default:
            if (newValue.trim().length > 0) data[field] = newValue;
            else event.preventDefault();
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