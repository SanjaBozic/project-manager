import { ref } from 'vue';

export function useContextMenu(
    onView: (row: any) => void,
    onEdit: (row: any) => void,
    onDelete: (row: any) => void
) {
    const contextMenu = ref();
    const selectedRow = ref<Record<string, any> | null>(null);

    const menuModel = ref([
        { label: 'View', icon: 'pi pi-fw pi-search', command: () => onView(selectedRow.value) },
        { label: 'Edit', icon: 'pi pi-fw pi-pen-to-square', command: () => onEdit(selectedRow.value) },
        { label: 'Delete', icon: 'pi pi-fw pi-times', command: () => onDelete(selectedRow.value) },
    ]);

    const onRowContextMenu = (event: any) => {
        contextMenu.value.show(event.originalEvent);
    };

    const clearSelection = () => {
        selectedRow.value = null;
    };

    return {
        contextMenu,
        selectedRow,
        menuModel,
        onRowContextMenu,
        clearSelection,
    };
}
