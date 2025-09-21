<script setup lang="ts">
import { Message } from 'primevue'

defineProps<{
  form: Record<string, any>
  fieldKey: string
}>()
</script>

<template>
  <Message
    v-if="form[fieldKey]?.invalid"
    :key="`${fieldKey}-msg`"
    severity="error"
    size="small"
    variant="simple"
  >
    {{ form[fieldKey].error?.message }}
  </Message>
</template>