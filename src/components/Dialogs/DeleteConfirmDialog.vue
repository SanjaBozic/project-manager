<script setup lang="ts">
  import { Dialog } from 'primevue'
  import { Button } from 'primevue'
  import { Message } from 'primevue'

  const props = defineProps<{
    visible: boolean
    rowData: Record<string, any> | null
  }>()

  const emit = defineEmits<{
    (e: 'update:visible', value: boolean): void
    (e: 'confirm'): void
  }>()

  const handleConfirm = () => {
    emit('confirm')
    emit('update:visible', false)
  }

  const handleCancel = () => {
    emit('update:visible', false)
  }
</script>

<template>
  <Dialog
    :visible="visible"
    @update:visible="emit('update:visible', $event)"
    modal
    header="Delete Work Item"
    :style="{ width: '800px' }"
  >
    <div>
      <p class="text-base font-semibold mb-4">
        Are you sure you want to delete this work item? <br />
      </p>
      <p v-if="rowData?.title" class="p-3 surface-section border-round">
        <strong>Title:</strong> {{ rowData.title }}
      </p>
      
      <Message severity="error" :closable="false" class="mb-4">
        This action is permanent and cannot be undone. The data will be lost forever.
      </Message>
    </div>

    <template #footer>
      <Button label="Cancel" severity="secondary" @click="handleCancel" />
      <Button label="Delete" severity="danger" @click="handleConfirm" />
    </template>
  </Dialog>
</template>
