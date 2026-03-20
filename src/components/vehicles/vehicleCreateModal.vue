<script setup>
import { ref, computed, watch } from 'vue';
import { useVehicles } from '@/composables/useVehicles.js';

const { 
  form, 
  handleCreateVehicle, 
  closeModal, 
  loading, 
  error,
  updateVehicle,
} = useVehicles();

const emit = defineEmits(['created', 'updated']);
const fileInput = ref(null);
const imagePreview = ref(null);

// 1. WATCH PARA MOSTRAR LA IMAGEN VIEJA
watch(() => form.image, (newImage) => {
  if (typeof newImage === 'string' && newImage !== '') {
    imagePreview.value = newImage.startsWith('http') 
      ? newImage 
      : `http://127.0.0.1:8000/storage/${newImage}`;
  } else if (!newImage) {
    imagePreview.value = null;
  }
}, { immediate: true });

const onFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    form.image = file;
    const reader = new FileReader();
    reader.onload = (e) => { imagePreview.value = e.target.result; };
    reader.readAsDataURL(file);
  }
};

const clearImage = () => {
  imagePreview.value = null;
  form.image = null;
  if (fileInput.value) fileInput.value.value = '';
};

// 2. COMPUTED REFORZADO PARA DETECTAR EL ID
const isEditing = computed(() => {
  const vehicleId = form.id || form._id;
  return vehicleId !== null && vehicleId !== undefined && vehicleId !== '';
});

const executeSubmit = async () => {
  if (loading.value) return;
  
  try {
    const currentId = form.id || form._id;
    let success = false;

    // 3. DECISIÓN: ¿CREAR O EDITAR?
    if (isEditing.value) {
      success = await updateVehicle(currentId);
    } else {
      success = await handleCreateVehicle();
    }

    if (success) {
      imagePreview.value = null;
      emit(isEditing.value ? 'updated' : 'created');
      closeModal();
    }
  } catch (err) {
    console.error("Error en ejecución:", err);
  }
};
</script>

<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <header class="modal-header">
        <h2>{{ isEditing ? 'Editar Vehículo' : 'Añadir Nuevo Vehículo' }}</h2>
        <button type="button" class="close-btn" @click="closeModal">&times;</button>
      </header>

      <div class="create-form">
        <span style="color: gray; font-size: 10px;">ID detectado: {{ form.id || form._id || 'Ninguno' }}</span>

        <div class="form-grid">
          <div class="form-group full-width">
            <label>Foto del Vehículo</label>
            <div 
              class="file-upload-zone" 
              :class="{ 'has-image': imagePreview }"
              @click="fileInput.click()" 
            >
              <input 
                type="file" 
                ref="fileInput" 
                class="hidden-input" 
                accept="image/*"
                @change="onFileChange"
              >
              <div v-if="!imagePreview" class="upload-placeholder">
                <span class="upload-icon">📸</span>
                <p>Haz clic para subir una foto</p>
                <span class="upload-hint">Formatos soportados: JPG, PNG, WebP</span>
              </div>
              <img v-else :src="imagePreview" alt="Preview" class="image-preview" />
              
              <button 
                v-if="imagePreview" 
                type="button" 
                class="change-photo-btn" 
                @click.stop="clearImage"
              >
                Cambiar Foto
              </button>
            </div>
          </div>

          <div class="form-group">
            <label>Marca</label>
            <input v-model="form.brand" type="text" placeholder="Ej: Ferrari">
          </div>
          <div class="form-group">
            <label>Modelo</label>
            <input v-model="form.model" type="text" placeholder="Ej: F8 Tributo">
          </div>
          <div class="form-group">
            <label>Año</label>
            <input v-model="form.year" type="number" placeholder="2024">
          </div>
          <div class="form-group">
            <label>Precio ($)</label>
            <input v-model="form.price" type="number" placeholder="Ej: 275000">
          </div>
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div class="form-actions">
          <button type="button" class="cancel-btn" @click="closeModal">Cancelar</button>
          <button 
            type="button" 
            class="submit-btn" 
            :disabled="loading || (!imagePreview && !isEditing)"
            @click="executeSubmit"
          >
            {{ loading ? 'Procesando...' : (isEditing ? 'Guardar Cambios' : 'Crear Vehículo') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped src="../../assets/styles/vehicleCreateModalScoped.css"></style>