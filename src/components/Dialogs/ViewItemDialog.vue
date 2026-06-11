<script setup lang="ts">
  import { Dialog } from 'primevue'
  import FormWrapper from '../form/FormWrapper.vue'
  import { ref } from 'vue'

  const props = defineProps<{
    visible: boolean
    rowData: Record<string, any> | null
    items?: Array<Record<string, any>>
  }>()

  const emit = defineEmits<{
    (e: 'update:visible', value: boolean): void
  }>()

  const dummySave = async () => Promise.resolve()

  // child modal state for viewing children
  const childVisible = ref(false)
  const childRow = ref<Record<string, any> | null>(null)

  const handleOpenChild = ({ row, readOnly }: { row: Record<string, any>, readOnly: boolean }) => {
    // Always open child in read-only mode when parent is view-only
    childRow.value = row
    childVisible.value = true
  }
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
        @open-child="handleOpenChild"
      />

      <Dialog :visible="childVisible" @update:visible="(v) => childVisible = v" modal header="View Child Item" :style="{ width: '1200px' }">
        <FormWrapper :visible="childVisible" @update:visible="(v) => childVisible = v" :save="dummySave" :isReadOnly="true" :initialData="childRow" :items="props.items" />
      </Dialog>
    </Dialog>
  </div>
</template>
