<script setup lang="ts">
import { computed } from 'vue'
import { FormField } from '@primevue/forms'
import { InputText, Select, MultiSelect } from 'primevue'
import Editor from 'primevue/editor'
import FieldError from './FieldError.vue'
import { TYPES, STATES, ACTIVITY_OPTIONS, PRIORITY_OPTIONS, TAG_OPTIONS } from '@/data/formFields'
import type { FieldDef } from '@/data/formFields'

const { field, form, readonlyKeys, items, initialData, onParentIdChange } = defineProps<{
  field: FieldDef
  form: Record<string, any>
  readonlyKeys?: Set<string>
  items?: Array<Record<string, any>>
  initialData?: Record<string, any> | null
  onParentIdChange?: (parentId: string, formObj: Record<string, any>) => void
}>()

const handleParentIdSelect = (eventOrValue: any) => {
  if (field.key !== 'parentId' || !onParentIdChange) return
  const value = eventOrValue && eventOrValue.value !== undefined ? eventOrValue.value : eventOrValue
  onParentIdChange(value, form)
}

function handleIterationInput(e: Event | any) {
  const val = e?.target?.value ?? e
  if (form && form[field.key]) {
    form[field.key].value = val
  }
}
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
      const mapped = items
        .filter((item: any) => item.id != null && item.id !== currentId)
        .map((item: any) => ({ 
          id: item.id, 
          label: `${item.title || 'Untitled'} - ${item.id}`
        }))
      // prepend an option for no parent (empty string used to match initial default)
      return [{ id: '', label: '-' }, ...mapped]
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
      @change="handleParentIdSelect($event)"
    ></Select>

    <!-- iteration field: bind value directly so updates reflect immediately -->
    <InputText
      v-else-if="field.key === 'iteration'"
      :name="field.key"
      :type="field.type"
      :placeholder="field.placeholder"
      :disabled="readonlyKeys?.has(field.key)"
      :value="(form && form[field.key]) ? form[field.key].value : (initialData ? initialData[field.key] : '')"
      @input="handleIterationInput"
      fluid
    />

    <!-- generic input for other fields -->
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