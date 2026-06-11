<script setup lang="ts">
  import { Dialog } from 'primevue'
  import FormWrapper from '../form/FormWrapper.vue'
  import EditItemDialog from './EditItemDialog.vue'
  import ViewItemDialog from './ViewItemDialog.vue'
  import { ref } from 'vue'

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

  const childVisible = ref(false)
  const childRow = ref<Record<string, any> | null>(null)
  const childReadOnly = ref(false)

  const handleOpenChild = ({ row, readOnly }: { row: Record<string, any>, readOnly: boolean }) => {
    childRow.value = row
    childReadOnly.value = readOnly
    childVisible.value = true
  }
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
    <FormWrapper :visible="visible" @update:visible="emit('update:visible', $event)" :save="props.save" :items="props.items" @open-child="handleOpenChild"/>
    <EditItemDialog v-if="!childReadOnly && childRow" :visible="childVisible" :rowData="childRow" :update="props.update" :items="props.items" @update:visible="(v) => childVisible = v" />
    <ViewItemDialog v-if="childReadOnly && childRow" :visible="childVisible" :rowData="childRow" :items="props.items" @update:visible="(v) => childVisible = v" />
    </Dialog>
  </div>
</template>
