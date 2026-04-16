<script setup lang="ts">
  import { Dialog } from 'primevue'
  import FormWrapper from '../form/FormWrapper.vue'

  const props = defineProps<{
    visible: boolean
    rowData: Record<string, any> | null
    update: (id: string, patch: Partial<Record<string, any>>) => Promise<any>
  }>()

  const emit = defineEmits<{
    (e: 'update:visible', value: boolean): void
  }>()

  const handleUpdate = async (values: Record<string, any>) => {
    if (!props.rowData?.id) return Promise.resolve()
    return props.update(props.rowData.id, values)
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
      />
    </Dialog>
  </div>
</template>
