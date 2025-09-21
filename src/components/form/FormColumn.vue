<script setup lang="ts">
import { computed } from 'vue'
import FormFieldRenderer from './FormFieldRenderer.vue'
import type { FieldDef } from '@/data/formFields'
import '@/assets/style/form.css'

const {title, fields, form, layout = 'single-column', fullWidthKeys, readonlyKeys} = defineProps<{
  title: string
  fields: FieldDef[]
  form: Record<string, any>
  layout?: 'single-column' | 'two-column'
  fullWidthKeys?: Set<string>
  readonlyKeys?: Set<string>
}>()

const layoutClass = computed(() =>
  layout === 'two-column' ? 'form-column__grid' : 'form-column__stack'
)

const columnClass = computed(() =>
  layout === 'two-column' ? 'form-column--narrow' : 'form-column--wide'
)

function getFieldClass(field: FieldDef) {
  return layout === 'two-column' ? 'form-column__field--half' : fullWidthKeys?.has(field.key) ? 'form-column__field--full' : '';
}

</script>

<template>
  <div :class="columnClass">
    <h4 class="form-column__title">{{ title }}</h4>
    <div :class="layoutClass">
      <template v-for="field in fields" :key="field.key">
        <div :class="getFieldClass(field)">
          <div v-if="field.key === 'description'" class="form-column__description-label">Description</div>
          <FormFieldRenderer :field="field" :form="form" :readonlyKeys="readonlyKeys" />
        </div>
      </template>
    </div>
  </div>
</template>