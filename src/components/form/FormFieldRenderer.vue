<script setup lang="ts">
import { computed } from 'vue'
import { FormField } from '@primevue/forms'
import { InputText, Select, MultiSelect } from 'primevue'
import Editor from 'primevue/editor'
import FieldError from './FieldError.vue'
import { TYPES, STATES, ACTIVITY_OPTIONS, PRIORITY_OPTIONS, TAG_OPTIONS } from '@/data/formFields'
import type { FieldDef } from '@/data/formFields'

const { field, form, readonlyKeys, items, initialData } = defineProps<{
  field: FieldDef
  form: Record<string, any>
  readonlyKeys?: Set<string>
  items?: Array<Record<string, any>>
  initialData?: Record<string, any> | null
}>()

const isMultiSelect = computed(() => field.type === 'dropdown' && field.multiple)

const isParentIdDisabled = computed(() => {
  if (field.key !== 'parentId') return false
  return !items || items.length === 0
})

function getOptions(key: string): any[] {
  switch (key) {
    case 'type': return [...TYPES]
    case 'state': return [...STATES]
    case 'activity': return [...ACTIVITY_OPTIONS]
    case 'priority': return [...PRIORITY_OPTIONS]
    case 'tags': return [...TAG_OPTIONS]
    case 'parentId': {
      if (!items || items.length === 0) return []
      const currentId = initialData?.id || null
      return items
        .filter((item: any) => item.id != null && item.id !== currentId)
        .map((item: any) => ({ 
          id: item.id, 
          label: `${item.id} - ${item.title || 'Untitled'}`
        }))
    }
    default: return []
  }
}
</script>

<template>
  <FormField :name="field.key" :label="field.label">
    <MultiSelect
      v-if="isMultiSelect"
      filter
      :name="field.key"
      :options="getOptions(field.key)"
      :placeholder="field.placeholder"
      :disabled="readonlyKeys?.has(field.key)"
      style="width: 100%"
    />
    <Editor
      v-else-if="field.type === 'editor'"
      :name="field.key"
      editorStyle="height: 260px"
      :readonly="readonlyKeys?.has(field.key)"
    />
    <Select
      v-else-if="field.type === 'dropdown'"
      :name="field.key"
      :options="getOptions(field.key)"
      :optionLabel="field.key === 'parentId' ? 'label' : undefined"
      :optionValue="field.key === 'parentId' ? 'id' : undefined"
      :placeholder="field.placeholder"
      :disabled="readonlyKeys?.has(field.key) || isParentIdDisabled"
      style="width: 100%"
    ></Select>
    <InputText
      v-else
      :name="field.key"
      :type="field.type"
      :placeholder="field.placeholder"
      :disabled="readonlyKeys?.has(field.key)"
      fluid
    />
  </FormField>

  <FieldError :form="form" :fieldKey="field.key" />
</template>