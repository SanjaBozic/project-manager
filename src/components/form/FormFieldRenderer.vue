<script setup lang="ts">
import { computed } from 'vue'
import { FormField } from '@primevue/forms'
import { InputText, Select, MultiSelect } from 'primevue'
import Editor from 'primevue/editor'
import FieldError from './FieldError.vue'
import { TYPES, STATES, ACTIVITY_OPTIONS, PRIORITY_OPTIONS, TAG_OPTIONS } from '@/data/formFields'
import type { FieldDef } from '@/data/formFields'

const { field, form, readonlyKeys } = defineProps<{
  field: FieldDef
  form: Record<string, any>
  readonlyKeys?: Set<string>
}>()

const isMultiSelect = computed(() => field.type === 'dropdown' && field.multiple)

function getOptions(key: string): any[] {
  switch (key) {
    case 'type': return [...TYPES]
    case 'state': return [...STATES]
    case 'activity': return [...ACTIVITY_OPTIONS]
    case 'priority': return [...PRIORITY_OPTIONS]
    case 'tags': return [...TAG_OPTIONS]
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
    />
    <Select
      v-else-if="field.type === 'dropdown'"
      :name="field.key"
      :options="getOptions(field.key)"
      :placeholder="field.placeholder"
      :disabled="readonlyKeys?.has(field.key)"
      style="width: 100%"
    ></Select>
    <InputText
      v-else
      :name="field.key"
      :type="field.type"
      :placeholder="field.placeholder"
      :readonly="readonlyKeys?.has(field.key)"
      fluid
    />
  </FormField>

  <FieldError :form="form" :fieldKey="field.key" />
</template>