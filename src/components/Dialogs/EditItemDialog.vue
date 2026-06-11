<script setup lang="ts">
  import { Dialog } from 'primevue'
  import FormWrapper from '../form/FormWrapper.vue'
  import { ref } from 'vue'

  const props = defineProps<{
    visible: boolean
    rowData: Record<string, any> | null
    update: (id: string, patch: Partial<Record<string, any>>) => Promise<any>
    items?: Array<Record<string, any>>
  }>()

  const emit = defineEmits<{
    (e: 'update:visible', value: boolean): void
  }>()

  const childVisible = ref(false)
  const childRow = ref<Record<string, any> | null>(null)
  const childReadOnly = ref(false)

  const handleOpenChild = ({ row, readOnly }: { row: Record<string, any>, readOnly: boolean }) => {
    childRow.value = row
    childReadOnly.value = readOnly
    childVisible.value = true
  }

  const handleUpdate = async (values: Record<string, any>) => {
    if (!props.rowData?.id) return Promise.resolve()
    return props.update(props.rowData.id, values)
  }

  const handleChildSave = async (values: Record<string, any>) => {
    if (!childRow.value?.id) return Promise.resolve()
    return props.update(childRow.value.id, values)
  }
</script>

<template>
  <div>
    <Dialog
        :visible="visible"
        @update:visible="emit('update:visible', $event)"
        modal
        header="Edit Work Item"
        :style="{ width: '1200px' }"
    >
      <FormWrapper 
        :visible="visible" 
        @update:visible="emit('update:visible', $event)" 
        :save="handleUpdate" 
        :initialData="rowData"
        :items="props.items"
        @open-child="handleOpenChild"
      />

      <Dialog :visible="childVisible" @update:visible="(v) => childVisible = v" modal header="Child Item" :style="{ width: '1200px' }">
        <FormWrapper :visible="childVisible" @update:visible="(v) => childVisible = v" :save="handleChildSave" :initialData="childRow" :items="props.items" />
      </Dialog>
    </Dialog>
  </div>
</template>
