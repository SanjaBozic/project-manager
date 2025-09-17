<script setup lang="ts">
import { ref, reactive } from 'vue';
import { Form, FormField } from '@primevue/forms';
import { InputText, Message, Button, Select, MultiSelect } from "primevue";
import Editor from 'primevue/editor'; // ensure quill dependency is installed
import { LEFT_FIELDS, DETAILS_FIELDS, TYPES, STATES, ACTIVITY_OPTIONS, PRIORITY_OPTIONS, TAG_OPTIONS } from '@/data/formFields';

const leftFields = ref(LEFT_FIELDS);
const detailsFields = ref(DETAILS_FIELDS);
const types = ref(TYPES);
const states = ref(STATES);
const activityOptions = ref(ACTIVITY_OPTIONS);
const priorityOptions = ref(PRIORITY_OPTIONS);
const tagOptions = ref(TAG_OPTIONS);

/* flat list used for resolver/initialValues */
const fields = [...leftFields.value, ...detailsFields.value];

/* derive sets from field metadata (single pass) */
const optionalKeys = new Set<string>();
const readonlyKeys = new Set<string>();
const fullWidthKeys = new Set<string>();

for (const f of fields) {
    if ((f as any).optional) optionalKeys.add(f.key);
    if ((f as any).readonly) readonlyKeys.add(f.key);
    if ((f as any).fullWidth) fullWidthKeys.add(f.key);
}

const today = new Date().toISOString().slice(0, 10);
const initialValues = reactive(Object.fromEntries(fields.map(f => [f.key, f.key === 'created' ? today : ''])) as Record<string, any>);

const resolver = ({ values }: any) => {
    const errors: Record<string, any> = {};
    Object.keys(values).forEach((k) => {
        const val = values[k];
        const empty = val === '' || val === null || (Array.isArray(val) && val.length === 0);
        if (!optionalKeys.has(k) && empty) {
            const field = fields.find((ff: any) => ff.key === k);
            const label = field?.label ?? k;
            errors[k] = [{ message: `${label} is required.` }];
        }
    });
    return { values, errors };
};

const onFormSave = ({ valid, values }: any) => {
    if (valid) {
        console.log('Saving ', values);
    }
};
</script>

<template>
  <div>
    <Form v-slot="$form" :initialValues="initialValues" :resolver="resolver" @submit="onFormSave">
      <div style="max-width: 1100px; display: flex; gap: 1.5rem; align-items: flex-start;">
        <!-- Left column -->
        <div style="flex: 1 1 520px; min-width: 360px;">
          <h4 style="margin: 0 0 0.75rem">Content</h4>
          <div style="display:flex;flex-direction:column;gap:1rem;">
            <template v-for="field in leftFields" :key="field.key">
              <div :style="fullWidthKeys.has(field.key) ? 'width:100%' : ''">
                <!-- title before description editor -->
                <div v-if="field.key === 'description'" style="margin-bottom:6px; font-weight:600; color:#333">
                  Description
                </div>

                <FormField :name="field.key" :label="field.label">
                  <MultiSelect filter
                    v-if="field.type === 'dropdown' && field.multiple"
                    :name="field.key"
                    :options="field.key === 'tags' ? tagOptions : null"
                    :placeholder="field.placeholder"
                    :disabled="readonlyKeys.has(field.key)"
                    style="width: 100%"
                  ></MultiSelect>

                  <Editor
                    v-else-if="field.type === 'editor'"
                    :name="field.key"
                    editorStyle="height: 260px"
                  />
                  <InputText
                    v-else
                    :name="field.key"
                    :type="field.type"
                    :placeholder="field.placeholder"
                    fluid
                  />
                </FormField>

                <Message
                  v-if="$form[field.key]?.invalid"
                  :key="`${field.key}-msg`"
                  severity="error"
                  size="small"
                  variant="simple"
                >
                  {{ $form[field.key].error?.message }}
                </Message>
              </div>
            </template>
          </div>
        </div>

        <!-- Right column -->
        <div style="flex: 1 1 480px; min-width: 320px;">
          <h4 style="margin: 0 0 0.75rem">Details</h4>

          <!-- two per row -->
          <div style="display:flex;flex-wrap:wrap;gap:1rem;">
            <template v-for="field in detailsFields" :key="field.key">
              <div style="flex: 1 1 calc(50% - 0.5rem); min-width: 160px;">
                <FormField :name="field.key" :label="field.label">

                  <Select
                    v-if="field.type === 'dropdown'"
                    :name="field.key"
                    :options="field.key === 'type' ? types : field.key === 'state' ? states : field.key === 'activity' ? activityOptions : field.key === 'tags' ? tagOptions : priorityOptions"
                    :placeholder="field.placeholder"
                    :disabled="readonlyKeys.has(field.key)"
                    style="width: 100%"
                  ></Select>

                  <InputText
                    v-else
                    :name="field.key"
                    :type="field.type"
                    :placeholder="field.placeholder"
                    :readonly="readonlyKeys.has(field.key)"
                    fluid
                  />
                </FormField>

                <Message
                  v-if="$form[field.key]?.invalid"
                  :key="`${field.key}-msg`"
                  severity="error"
                  size="small"
                  variant="simple"
                >
                  {{ $form[field.key].error?.message }}
                </Message>
              </div>
            </template>
          </div>
        </div>
      </div>

      <div style="display:flex;justify-content:flex-end;margin-top:0.75rem">
        <Button type="submit" severity="secondary" label="Save"></Button>
      </div>
      
    </Form>
  </div>
</template>