<script setup lang="ts">
import { Button, Column, ContextMenu, DataTable, DatePicker, IconField, InputIcon, InputText, Message, MultiSelect, Tag, Dialog } from 'primevue';
import { ref } from 'vue';
import '../../assets/style/work-items.css'
import { getTypeColor, getStateColor } from '@/data/formFields';
import { useFormCache } from '@/composables/useFormCache'
import { useTableDialogs } from '@/composables/useTableDialogs';
import { useContextMenu } from '@/composables/useContextMenu';
import { useTableFilters } from '@/composables/useTableFilters';
import { useTableExport } from '@/composables/useTableExport';
import AddNewItem from '../Dialogs/AddNewItem.vue';
import ViewItemDialog from '../Dialogs/ViewItemDialog.vue';
import EditItemDialog from '../Dialogs/EditItemDialog.vue';
import DeleteConfirmDialog from '../Dialogs/DeleteConfirmDialog.vue';

const { cache: products, save, update, remove, clear } = useFormCache<Record<string, any>>('workItems')

const columns = ref([
    { field: 'id', header: 'Id' },
    { field: 'type', header: 'Type' },
    { field: 'title', header: 'Title' },
    { field: 'state', header: 'State' },
    { field: 'created', header: 'Created' },
    { field: 'iteration', header: 'Iteration' },
    { field: 'parentId', header: 'Parent Id' },
    { field: 'tags', header: 'Tags' },
]);

// filters global and each column 
const filterFields = ['id', 'title', 'type', 'state', 'tags', 'parentId', 'iteration', 'created'];
const { filters, initFilters: initFiltersComposable, clearFilters } = useTableFilters(columns);

initFiltersComposable(filterFields);

const clearFilter = () => {
    clearFilters(filterFields);
    selectedColumns.value = [...columns.value];
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
const { dt, generateCSV } = useTableExport();
const exportCSV = () => {
    generateCSV(products.value, columns.value, columns.value.map((c: any) => c.field), 'WorkItems.csv');
};

// context menu and dialogs
const {
    visibleAddNewModal,
    visibleViewModal,
    visibleEditModal,
    visibleDeleteModal,
    viewedRow,
    editedRow,
    rowToDelete,
    openAddDialog,
    openViewDialog,
    openEditDialog,
    openDeleteDialog,
} = useTableDialogs();

const { contextMenu, selectedRow, menuModel, onRowContextMenu, clearSelection } = useContextMenu(
    openViewDialog,
    openEditDialog,
    openDeleteDialog
);

const confirmDelete = async () => {
    if (!rowToDelete.value?.id) return;
    try {
        await remove(rowToDelete.value.id);
        console.log('Row deleted:', rowToDelete.value.title);
        clearSelection();
        rowToDelete.value = null;
    } catch (e) {
        console.error('Failed to delete row', e);
    }
};
</script>

<template>
    <AddNewItem v-model:visible="visibleAddNewModal" :items="products" :save="save" :update="update" :remove="remove" :clear="clear"/>
    <ViewItemDialog v-model:visible="visibleViewModal" :rowData="viewedRow" :items="products"/>
    <EditItemDialog v-model:visible="visibleEditModal" :rowData="editedRow" :update="update" :items="products"/>
    <DeleteConfirmDialog v-model:visible="visibleDeleteModal" :rowData="rowToDelete" @confirm="confirmDelete"/>
    <div class="card">
        <ContextMenu ref="contextMenu" :model="menuModel" @hide="clearSelection" />
        <DataTable  ref="dt" :value="products" dataKey="id" 
            v-model:contextMenuSelection="selectedRow" contextMenu @row-contextmenu="onRowContextMenu" 
            :reorderableColumns="true" @columnReorder="onColReorder" @rowReorder="onRowReorder" 
            :size="'small'" 
            scrollable
            removableSort stripedRows 
            paginator :rows="15" :rowsPerPageOptions="[15, 25, 50, 75, 100]" 
            tableStyle="min-width: 50rem"
            v-model:filters="filters" filterDisplay="menu" :globalFilterFields="['title', 'type', 'state', 'tags','created','id','parentId','iteration']"
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
                        <Button type="button" icon="pi pi-plus" label="Add" variant="outlined" severity="info" @click="openAddDialog()" ></Button>
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
