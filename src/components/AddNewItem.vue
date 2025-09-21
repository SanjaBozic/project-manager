<script setup lang="ts">
import { Dialog } from 'primevue'
import FormWrapper from './form/FormWrapper.vue'

defineProps<{
  visible: boolean
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
    <FormWrapper :visible="visible" @update:visible="emit('update:visible', $event)" />
    </Dialog>
  </div>
</template>

