<template>
  <div :class="'col-' + colSize">
    <div class="form-floating mb-3">
      <input :type="type" class="form-control" :id="id" :placeholder="placeholder" :disabled="isDisabled"
        :value="modelValue" @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)">
      <label :for="id">{{ label }}</label>
    </div>

  </div>
</template>
<script setup lang="ts">
const props = defineProps<{
  colSize: string;
  type: string;
  id: string;
  label: string;
  placeholder: string;
  isDisabled: boolean;
  modelValue: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();
</script>