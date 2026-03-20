<template>
  <div class="vehicle-card" :style="{ '--delay': index * 0.1 + 's' }">
    <div class="card-image-wrapper">
      <img 
        v-if="vehicle.image" 
        :src="imageUrl(vehicle.image)" 
        :alt="vehicle.model"
        class="vehicle-image"
      />
      <div :class="['badge', vehicle.status]">{{ vehicle.status === 'available' ? 'Disponible' : 'Vendido' }}</div>
      
      <!-- Botones de Acción Profesionales -->
      <div class="card-actions-overlay">
        <!-- Compartir  -->
        <div class="share-wrapper">
          <transition name="fade">
            <span v-if="showCopiedMessage" class="copied-tooltip">¡Copiado!</span>
          </transition>
          <button class="action-btn share" @click.stop="handleShare" title="Copiar enlace público">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
          </button>
        </div>

        <!-- Editar y Borrar (Solo dueño) -->
        <template v-if="isOwner">
          <button class="action-btn edit" @click.stop="handleEdit" title="Editar Vehículo">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
          </button>
          <button class="action-btn delete" @click.stop="handleDelete(vehicle._id || vehicle.id)" title="Eliminar Vehículo">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
          </button>
        </template>
      </div>
      

      <div class="overlay">
        <button class="view-details-btn" @click="goToDetail">Ver Detalles</button>
      </div>
    </div>
    
    <div class="card-info">
      <div class="header">
        <div class="brand-info">
          <span class="brand">{{ vehicle.brand }}</span>
        </div>
        <h3 class="name">{{ vehicle.model }}</h3>
      </div>
      
      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-label">Año</span>
          <span class="stat-value">{{ vehicle.year }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Estado</span>
          <span class="stat-value">{{ vehicle.status === 'available' ? 'Disponible' : 'Vendido' }}</span>
        </div>
      </div>
      
      <div class="card-footer">
        <div class="price-box">
          <span class="price-label">Precio</span>
          <span class="price">${{ formatPrice(vehicle.price) }}</span>
        </div>
        
        <!-- Si es el DUEÑO: Botón para cambiar estado -->
        <button 
          v-if="isOwner" 
          @click.stop="handleStatusToggle"
          :class="['book-btn', 'toggle-btn', vehicle.status]"
        >
          {{ vehicle.status === 'available' ? 'VENDIDO' : 'DISPONIBLE' }}
        </button>

        <!-- Si NO es el dueño: Botón de preguntar (Requisito UTN) -->
        <button 
          v-else 
          class="book-btn ask"
          @click="startChat(vehicle._id, vehicle.user_id)"
        >
          PREGUNTAR
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useVehicles } from '@/composables/useVehicles';
import { useMessages } from '@/composables/useMessages';

const { startChat } = useMessages();

const router = useRouter();

const props = defineProps({
  vehicle: Object,
  index: Number
});

// Importamos todo directo de useVehicles.js
const { 
  handleDeleteVehicle, openModal, imageUrl, updateVehicleStatus,
  checkIsOwner, formatPrice, showCopiedMessage, copyToClipboard
} = useVehicles();

const isOwner = computed(() => {
  const vehicleUserId = props.vehicle.user_id || props.vehicle.userId;
  return checkIsOwner(vehicleUserId);
});

const handleStatusToggle = async () => {
  const newStatus = props.vehicle.status === 'available' ? 'sold' : 'available';
  const vehicleId = props.vehicle._id || props.vehicle.id;
  await updateVehicleStatus(vehicleId, newStatus);
};

const handleDelete = async (id) => {
  const isConfirmed = window.confirm(`¿Estás seguro de que deseas eliminar el ${props.vehicle.brand} ${props.vehicle.model}?`);
  if (isConfirmed) {
    const success = await handleDeleteVehicle(id);
    if (!success) alert('Hubo un problema al eliminar el vehículo.');
  }
};

const handleEdit = () => {
  openModal(props.vehicle);
};

const handleShare = () => {
  const vehicleId = props.vehicle._id || props.vehicle.id;
  const shareUrl = `${window.location.origin}/vehicles/${vehicleId}`;
  copyToClipboard(shareUrl);
};

const goToDetail = () => {
  const id = props.vehicle._id || props.vehicle.id;
  router.push(`/vehicles/${id}`);
};
</script>

<style scoped src="../../assets/styles/vehicleCardScoped.css"></style>
