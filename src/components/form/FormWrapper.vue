<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Form } from '@primevue/forms'
import { Button } from 'primevue'
import FormColumn from './FormColumn.vue'
import { LEFT_FIELDS, DETAILS_FIELDS } from '@/data/formFields'
import type { FieldDef } from '@/data/formFields'
import '@/assets/style/form.css'

const leftFields = ref([...LEFT_FIELDS])
const detailsFields = ref([...DETAILS_FIELDS])
const fields: FieldDef[] = [...leftFields.value, ...detailsFields.value]

const optionalKeys = new Set(fields.filter(f => f.optional).map(f => f.key))
const readonlyKeys = new Set(fields.filter(f => f.readonly).map(f => f.key))
const fullWidthKeys = new Set(fields.filter(f => f.fullWidth).map(f => f.key))

const today = new Date().toISOString().slice(0, 10)
const initialValues = reactive(Object.fromEntries(fields.map(f => [f.key, f.key === 'created' ? today : ''])))

const validation = ({ values }: any) => {
  const errors: Record<string, any> = {}
  for (const key in values) {
    const val = values[key]
    const empty = val === '' || val === null || (Array.isArray(val) && val.length === 0)
    if (!optionalKeys.has(key) && empty) {
      const field = fields.find(f => f.key === key)
      errors[key] = [{ message: `${field?.label ?? key} is required.` }]
    }
  }
  return { values, errors }
}

const onFormSave = ({ valid, values }: any) => {
  if (valid) {
    console.log('Saving', values)
  }
}
</script>

<template>
  <Form v-slot="$form" :initialValues="initialValues" :resolver="validation" @submit="onFormSave">
    <div class="form__layout">
      <FormColumn
        title="Content"
        :fields="leftFields"
        :form="$form"
        :fullWidthKeys="fullWidthKeys"
        :readonlyKeys="readonlyKeys"
      />
      <FormColumn
        title="Details"
        :fields="detailsFields"
        :form="$form"
        :readonlyKeys="readonlyKeys"
        layout="two-column"
      />
    </div>
    <div class="form__actions">
      <Button type="submit" severity="secondary" label="Save" />
    </div>
  </Form>
</template>