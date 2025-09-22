<script setup lang="ts">
  import { Dialog } from 'primevue'
  import FormWrapper from './form/FormWrapper.vue'

  const props = defineProps<{
    visible: boolean
    items: Array<Record<string, any>>
    save: (values: Record<string, any>) => Promise<Record<string, any> | void>
    update?: (id: string, patch: Partial<Record<string, any>>) => Promise<any>
    remove?: (id: string) => Promise<any>
    clear?: () => Promise<void>
  }>()

  const emit = defineEmits<{
    (e: 'update:visible', value: boolean): void
  }>()
</script>

<template>
  <div>
    <Dialog
        :visible="visible"
        @update:visible="emit('update:visible', $event)"
        modal
        header="Add New Work Item"
        :style="{ width: '1200px' }"
        >
    <FormWrapper :visible="visible" @update:visible="emit('update:visible', $event)" :save="props.save" :items="props.items"/>
    </Dialog>
  </div>
</template>

