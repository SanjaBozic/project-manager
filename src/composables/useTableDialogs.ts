import { ref } from 'vue';

export function useTableDialogs() {
    const visibleAddNewModal = ref(false);
    const visibleViewModal = ref(false);
    const visibleEditModal = ref(false);
    const visibleDeleteModal = ref(false);
    const viewedRow = ref<Record<string, any> | null>(null);
    const editedRow = ref<Record<string, any> | null>(null);
    const rowToDelete = ref<Record<string, any> | null>(null);

    const openAddDialog = () => {
        visibleAddNewModal.value = true;
    };

    const openViewDialog = (row: any) => {
        viewedRow.value = row;
        visibleViewModal.value = true;
    };

    const openEditDialog = (row: any) => {
        editedRow.value = row;
        visibleEditModal.value = true;
    };

    const openDeleteDialog = (row: any) => {
        rowToDelete.value = row;
        visibleDeleteModal.value = true;
    };

    return {
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
    };
}
