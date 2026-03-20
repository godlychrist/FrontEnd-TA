<template>
  <div class="input-field">
    <input 
      :type="type" 
      :id="id" 
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      placeholder=" "
    />
    <label :for="id">{{ label }}</label>
    <div class="underline"></div>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  modelValue: String,
  type: {
    type: String,
    default: 'text'
  },
  id: String
});

defineEmits(['update:modelValue']);
</script>
