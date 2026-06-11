<script setup lang="ts">
  import { ref, reactive, watch, computed } from 'vue'
  import { Form } from '@primevue/forms'
  import { Button, Badge } from 'primevue'
  import FormColumn from './FormColumn.vue'
  import { LEFT_FIELDS, DETAILS_FIELDS } from '@/data/formFields'
  import type { FieldDef } from '@/data/formFields'
  import '@/assets/style/form.css'
  import { useFormCache } from '@/composables/useFormCache'

  // props & emits
  const props = defineProps<{
    visible: boolean
    save: (values: Record<string, any>) => Promise<Record<string, any> | void>
    update?: (id: string, patch: Partial<Record<string, any>>) => Promise<any>
    items?: Array<Record<string, any>>
    isReadOnly?: boolean
    initialData?: Record<string, any> | null
  }>()

  const emit = defineEmits<{
    (e: 'update:visible', value: boolean): void
    (e: 'open-child', payload: { row: Record<string, any>, readOnly: boolean }): void
  }>()

  // fallback to a local composable instance if parent didn't pass save
  const fallback = useFormCache<Record<string, any>>('workItems')
  const saveFn = props.save ?? fallback.save
  const updateFn = props.update ?? fallback.update

  const currentId = computed(() => props.initialData?.id ?? initialValues.id ?? null)
  const children = computed(() => {
    if (!props.items || !currentId.value) return []
    return props.items.filter((it: any) => it.parentId === currentId.value)
  })

  // fields, initialValues
  const leftFields = ref([...LEFT_FIELDS])
  const detailsFields = ref([...DETAILS_FIELDS])
  const fields: FieldDef[] = [...leftFields.value, ...detailsFields.value]

  const optionalKeys = new Set(fields.filter(f => f.optional).map(f => f.key))
  const readonlyKeys = new Set(fields.filter(f => f.readonly).map(f => f.key))
  const fullWidthKeys = new Set(fields.filter(f => f.fullWidth).map(f => f.key))

  const today = new Date().toISOString().slice(0, 10)
  const currentYear = new Date().getFullYear().toString()
  const defaultIteration = `${currentYear}/`
  
  const initialValues = reactive(
    props.initialData 
      ? Object.fromEntries(fields.map(f => [f.key, props.initialData![f.key] ?? '']))
      : Object.fromEntries(fields.map(f => [f.key, f.key === 'created' ? today : f.key === 'iteration' ? defaultIteration : '']))
  )

  // Watch for parentId changes and automatically update iteration to parent's iteration
  const handleParentIdChange = (parentId: string, formObj?: Record<string, any>) => {
    if (!parentId || !props.items || props.items.length === 0) return

    const parentItem = props.items.find((item: any) => item.id === parentId)
    if (parentItem && parentItem.iteration) {
      initialValues.iteration = parentItem.iteration
      // Also update the live form field value (PrimeVue form slot API)
      if (formObj && formObj['iteration'] && typeof formObj['iteration'].value !== 'undefined') {
        formObj['iteration'].value = parentItem.iteration
      }
    }
  }

  watch(
    () => initialValues.parentId,
    (newParentId) => {
      handleParentIdChange(newParentId, initialValues)
    }
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
        :items="props.items"
        :initialData="props.initialData"
        :onParentIdChange="handleParentIdChange"
      />
      <FormColumn 
        title="Details" 
        :fields="detailsFields" 
        :form="$form"
        :readonlyKeys="props.isReadOnly ? new Set(fields.map(f => f.key)) : readonlyKeys"
        layout="two-column"
        :items="props.items"
        :initialData="props.initialData"
        :onParentIdChange="handleParentIdChange"
      >
        <template #after-fields>
          <div v-if="children.length" class="form-column__children">
            <h4 class="form-column__title">Children</h4>
            <div class="form-column__children-list">
              <div class="form-column__child-item" v-for="child in children" :key="child.id">
                <Button variant="text" size="small" class="child-button" @click="emit('open-child', { row: child, readOnly: !!props.isReadOnly })">
                  <span>{{ child.title || child.id }}</span>
                  <Badge :value="child.id" severity="secondary" />
                </Button>
              </div>
            </div>
          </div>
        </template>
      </FormColumn>
    </div>
    <div class="form__actions">
      <Button severity="secondary" label="Cancel" @click="onFormCancel"/>
      <Button v-if="!props.isReadOnly" type="submit" label="Save" />
    </div>
  </Form>
</template>
