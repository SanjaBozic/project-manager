<script setup lang="ts">
  import { ref, reactive } from 'vue'
  import { Form } from '@primevue/forms'
  import { Button } from 'primevue'
  import FormColumn from './FormColumn.vue'
  import { LEFT_FIELDS, DETAILS_FIELDS } from '@/data/formFields'
  import type { FieldDef } from '@/data/formFields'
  import '@/assets/style/form.css'
  import { useFormCache } from '@/composables/useFormCache'

  // props & emits
  const props = defineProps<{
    visible: boolean
    save: (values: Record<string, any>) => Promise<Record<string, any> | void>
    items?: Array<Record<string, any>>
    isReadOnly?: boolean
    initialData?: Record<string, any> | null
  }>()

  const emit = defineEmits<{
    (e: 'update:visible', value: boolean): void
  }>()

  // fallback to a local composable instance if parent didn't pass save
  const fallback = useFormCache<Record<string, any>>('workItems')
  const saveFn = props.save ?? fallback.save

  // fields, initialValues
  const leftFields = ref([...LEFT_FIELDS])
  const detailsFields = ref([...DETAILS_FIELDS])
  const fields: FieldDef[] = [...leftFields.value, ...detailsFields.value]

  const optionalKeys = new Set(fields.filter(f => f.optional).map(f => f.key))
  const readonlyKeys = new Set(fields.filter(f => f.readonly).map(f => f.key))
  const fullWidthKeys = new Set(fields.filter(f => f.fullWidth).map(f => f.key))

  const today = new Date().toISOString().slice(0, 10)
  const initialValues = reactive(
    props.initialData 
      ? Object.fromEntries(fields.map(f => [f.key, props.initialData![f.key] ?? '']))
      : Object.fromEntries(fields.map(f => [f.key, f.key === 'created' ? today : '']))
  )

  // validation
  const validation = ({ values }: any) => {
    if (props.isReadOnly) return { values, errors: {} }
    
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

  // Use the passed save prop
  const onFormSave = async ({ valid, values }: { valid: boolean; values: Record<string, any> }) => {
    if (!valid) return
    if (props.isReadOnly) {
      emit('update:visible', false)
      return
    }

    try {
      await saveFn(values) // await parent save or fallback save
      emit('update:visible', false) // close the dialog
    } catch (e) {
      console.error('Save failed', e)
    }
  }

  const onFormCancel = () => {
    emit('update:visible', false)
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
        :readonlyKeys="props.isReadOnly ? new Set(fields.map(f => f.key)) : readonlyKeys"
      />
      <FormColumn 
        title="Details" 
        :fields="detailsFields" 
        :form="$form"
        :readonlyKeys="props.isReadOnly ? new Set(fields.map(f => f.key)) : readonlyKeys"
        layout="two-column"
      />
    </div>
    <div class="form__actions">
      <Button severity="secondary" label="Cancel" @click="onFormCancel"/>
      <Button v-if="!props.isReadOnly" type="submit" label="Save" />
    </div>
  </Form>
</template>
