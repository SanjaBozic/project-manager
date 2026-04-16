<script setup lang="ts">
  import { Dialog } from 'primevue'
  import FormWrapper from '../form/FormWrapper.vue'

  const props = defineProps<{
    visible: boolean
    rowData: Record<string, any> | null
    items?: Array<Record<string, any>>
  }>()

  const emit = defineEmits<{
    (e: 'update:visible', value: boolean): void
  }>()

  const dummySave = async () => Promise.resolve()
</script>

<template>
  <div>
    <Dialog
        :visible="visible"
        @update:visible="emit('update:visible', $event)"
        modal
        header="View Work Item"
        :style="{ width: '1200px' }"
    >
      <FormWrapper 
        :visible="visible" 
        @update:visible="emit('update:visible', $event)" 
        :save="dummySave" 
        :isReadOnly="true"
        :initialData="rowData"
        :items="props.items"
      />
    </Dialog>
  </div>
</template>
