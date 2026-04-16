<script setup lang="ts">
import { Button, Column, ContextMenu, DataTable, IconField, InputIcon, InputText, Message, MultiSelect, Tag, Dialog } from 'primevue';
import { ref, computed } from 'vue';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
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
    { field: 'parentId', header: 'Parent Id' },
    { field: 'tags', header: 'Tags' },
]);

// Group products by iteration
const groupedByIteration = computed(() => {
    const groups: Record<string, Array<Record<string, any>>> = {};
    products.value.forEach((item: any) => {
        const iteration = item.iteration || 'No Iteration';
        if (!groups[iteration]) {
            groups[iteration] = [];
        }
        groups[iteration].push(item);
    });
    
    // Sort by iteration (descending)
    return Object.entries(groups)
        .sort(([a], [b]) => b.localeCompare(a))
        .map(([iteration, items]) => ({
            iteration,
            items,
            id: iteration
        }));
});

// filters global and each column 
const filterFields = ['id', 'title', 'type', 'state', 'tags', 'parentId', 'iteration', 'created'];
const nestedFilterFields = ['id', 'title', 'type', 'state', 'tags', 'parentId', 'created'];
const { filters, initFilters: initFiltersComposable, clearFilters } = useTableFilters(columns);
const { filters: nestedFilters, initFilters: initNestedFiltersComposable } = useTableFilters(columns);

initFiltersComposable(filterFields);
initNestedFiltersComposable(nestedFilterFields);

const clearFilter = () => {
    clearFilters(filterFields);
    selectedColumns.value = [...columns.value];
};

// hide-show rows
const selectedColumns = ref(columns.value);

const onToggle = (val: any) => {
    selectedColumns.value = columns.value.filter(col => val.includes(col));
};

// export to csv
const { dt, generateCSV } = useTableExport();
const exportCSV = () => {
    const allItems = groupedByIteration.value.flatMap(group =>
        group.items.map((item: any) => ({
            ...item,
            iteration: group.iteration,
        }))
    );
    const exportColumns = ['iteration', 'id', 'type', 'title', 'state', 'created', 'parentId'];
    generateCSV(allItems, columns.value, exportColumns, 'Backlogs.csv');
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

const expandAll = () => {
    expandedRows.value = groupedByIteration.value.reduce((acc, group) => {
        acc[group.id] = true;
        return acc;
    }, {} as Record<string, boolean>);
};

const collapseAll = () => {
    expandedRows.value = {};
};

const onRowExpand = (event: any) => {
    console.log('Iteration expanded:', event.data.iteration);
};

const onRowCollapse = (event: any) => {
    console.log('Iteration collapsed:', event.data.iteration);
};

// expand/collapse
const expandedRows = ref({});

const expandNestedRows = ref({});

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

// Group items by parent ID within an iteration
const groupItemsByParent = (items: any[]) => {
    const childrenMap: Record<string, Array<Record<string, any>>> = {};
    
    // Build map of children grouped by parent ID
    items.forEach(item => {
        if (item.parentId) {
            if (!childrenMap[item.parentId]) {
                childrenMap[item.parentId] = [];
            }
            childrenMap[item.parentId].push(item);
        }
    });
    
    // Get top-level items (no parent) and add their children
    return items
        .filter(item => !item.parentId)
        .map(item => ({
            ...item,
            children: childrenMap[item.id] || [],
        }));
};
</script>

<template>
    <AddNewItem v-model:visible="visibleAddNewModal" :items="products" :save="save" :update="update" :remove="remove" :clear="clear"/>
    <ViewItemDialog v-model:visible="visibleViewModal" :rowData="viewedRow" :items="products"/>
    <EditItemDialog v-model:visible="visibleEditModal" :rowData="editedRow" :update="update" :items="products"/>
    <DeleteConfirmDialog v-model:visible="visibleDeleteModal" :rowData="rowToDelete" @confirm="confirmDelete"/>
    <div class="card">
        <ContextMenu ref="contextMenu" :model="menuModel" @hide="clearSelection" />
        <DataTable 
            ref="dt" 
            :value="groupedByIteration" 
            dataKey="id"
            v-model:expandedRows="expandedRows"
            @rowExpand="onRowExpand"
            @rowCollapse="onRowCollapse"
            :size="'small'" 
            scrollable
            removableSort stripedRows 
            paginator :rows="15" :rowsPerPageOptions="[15, 25, 50, 75, 100]" 
            tableStyle="min-width: 50rem"
            v-model:filters="filters" filterDisplay="menu" :globalFilterFields="['iteration']"
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
                    <div class="wi__header-toolbar--left">
                        <Button type="button" icon="pi pi-plus" label="Expand All" variant="outlined" severity="info" @click="expandAll()" ></Button>
                        <Button type="button" icon="pi pi-minus" label="Collapse All" variant="outlined" severity="secondary" @click="collapseAll()" ></Button>
                    </div>
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
            <Column expander style="width: 3rem" />
            <Column field="iteration" header="Iteration" sortable></Column>
            <Column field="children" header="Number of Items" sortable>
                <template #body="{ data }">
                    {{ data.items.length }}
                </template>
            </Column>
            
            <template #expansion="slotProps">
                <div class="p-4">
                    <DataTable 
                        :value="groupItemsByParent(slotProps.data.items)"
                        dataKey="id"
                        v-model:expandedRows="expandNestedRows"
                        v-model:contextMenuSelection="selectedRow" 
                        contextMenu 
                        @row-contextmenu="onRowContextMenu"
                        :reorderableColumns="true"
                        :size="'small'" 
                        scrollable
                        removableSort 
                        stripedRows 
                        paginator 
                        :rows="10" 
                        :rowsPerPageOptions="[5, 10, 25, 50]"
                        v-model:filters="nestedFilters" 
                        filterDisplay="menu" 
                        :globalFilterFields="['id', 'title', 'type', 'state', 'tags', 'created', 'parentId']"
                        :pt="{
                            table: { style: 'min-width: 50rem' },
                            column: {
                                bodycell: ({ state }: { state: Record<string, any> }) => ({
                                    class: [{ '!py-0': state['d_editing'] }]
                                })
                            }
                        }"
                    >
                        <template #empty> No items for this iteration. </template>
                        <Column expander style="width: 3rem" />
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
                        <Column field="children" header="Number of Children" sortable>
                            <template #body="{ data }">
                                {{ data.children.length }}
                            </template>
                        </Column>
                        <template #expansion="childSlotProps">
                            <div class="p-4">
                                <DataTable 
                                    :value="childSlotProps.data.children"
                                    dataKey="id"
                                    v-model:contextMenuSelection="selectedRow"
                                    contextMenu
                                    @row-contextmenu="onRowContextMenu"
                                    :size="'small'"
                                    scrollable
                                    removableSort
                                    stripedRows
                                    :pt="{
                                        table: { style: 'min-width: 50rem' },
                                        column: {
                                            bodycell: ({ state }: { state: Record<string, any> }) => ({
                                                class: [{ '!py-0': state['d_editing'] }]
                                            })
                                        }
                                    }"
                                >
                                    <template #empty> No child items. </template>
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
                                    </Column>
                                </DataTable>
                            </div>
                        </template>
                    </DataTable>
                </div>
            </template>
        </DataTable>
    </div>
</template>
