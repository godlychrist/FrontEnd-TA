<template>
  <div class="verify-page">
    <div class="verify-card">
      <div v-if="loading" class="state-loading">
        <div class="spinner"></div>
        <h2>Verificando tu cuenta...</h2>
        <p>Un momento por favor, estamos conectando con el servidor.</p>
      </div>

      <div v-else-if="success" class="state-success">
        <div class="icon-success">✓</div>
        <h2>¡Cuenta Activada!</h2>
        <p>{{ message }}</p>
        <button @click="goToLogin" class="btn-primary">Ir al Login</button>
      </div>

      <div v-else class="state-error">
        <div class="icon-error">!</div>
        <h2>Error de Verificación</h2>
        <p>{{ message }}</p>
        <button @click="goToLogin" class="btn-secondary">Volver al inicio</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth.js';

const route = useRoute();
const router = useRouter();
const loading = ref(true);
const success = ref(false);
const message = ref('');

const { handleVerifyEmail } = useAuth();

onMounted(async () => {
  const token = route.query.email_token;

  if (!token) {
    loading.value = false;
    message.value = 'Token de activación no encontrado en el correo.';
    return;
  }

  const result = await handleVerifyEmail(token);
  success.value = result.success;
  message.value = result.message;
  loading.value = false;
});

const goToLogin = () => router.push('/login');
</script>

<style scoped>
.verify-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #050507;
  color: white;
  font-family: 'Outfit', sans-serif;
}

.verify-card {
  background: rgba(255, 255, 255, 0.03);
  padding: 40px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  max-width: 400px;
  width: 90%;
  backdrop-filter: blur(10px);
}

.icon-success {
  font-size: 50px;
  color: #10B981;
  margin-bottom: 20px;
}

.icon-error {
  font-size: 50px;
  color: #EF4444;
  margin-bottom: 20px;
}

.btn-primary {
  background: #4A0D2B;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 10px;
  cursor: pointer;
  margin-top: 20px;
  font-weight: 600;
  transition: 0.3s;
}

.btn-primary:hover {
  background: #8B1A4A;
  transform: translateY(-2px);
}

.btn-secondary {
  background: transparent;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 12px 30px;
  border-radius: 10px;
  cursor: pointer;
  margin-top: 20px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-top: 4px solid #4A0D2B;
  border-radius: 50%;
  margin: 0 auto 20px;
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
