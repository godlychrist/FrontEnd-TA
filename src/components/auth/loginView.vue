<template>
  <div class="auth-page">
    <div class="glow red-glow"></div>
    <div class="glow dark-glow"></div>
    <div class="mesh-background"></div>

    <div class="container">
      <div class="auth-wrapper" :class="{ 'is-register': !isLogin }">
        
        <!-- Brand Side -->
        <authBrandSide />

        <!-- Form Side -->
        <div class="form-side">
          <div class="form-content">
            
            <div class="header-text">
              <h2>{{ isLogin ? 'Bienvenido' : 'Crear Cuenta' }}</h2>
              <p>{{ isLogin ? 'Inicia sesión para continuar con tu viaje.' : 'Únete a la flota más exclusiva.' }}</p>
            </div>

            <form @submit.prevent="handleSubmit" class="auth-form">
              <!-- Solo para Registro: Pedir Cédula (Requerimiento Cris/Bladimir) -->
              <authInput 
                v-if="!isLogin"
                id="cedula"
                v-model="form.cedula"
                label="Cédula de Identidad"
                required
              />

              <!-- MENSAJE DE AUTOCOMPLETADO (NOMBRE LEGAL - Requerimiento Bladimir) -->
              <div v-if="legalName && !isLogin" class="welcome-legal-name">
                <span class="pulse-icon">✅</span> Bienvenido/a, <strong>{{ legalName }}</strong>
              </div>

              <authInput 
                id="username"
                v-model="form.username"
                label="Usuario"
                required
              />

              <!-- Solo para Registro: Pedir Email -->
              <authInput 
                v-if="!isLogin"
                id="email"
                v-model="form.email"
                type="email"
                label="Correo Electrónico"
                required
              />

              <authInput 
                id="password"
                v-model="form.password"
                type="password"
                label="Contraseña"
                required
              />

              <!-- Solo para Registro -->
              <authInput 
                v-if="!isLogin"
                id="confirmPassword"
                type="password"
                label="Confirmar Contraseña"
                required
              />

              <div v-if="error" class="login-error">
                {{ error }}
              </div>

              <button type="submit" class="submit-btn" :disabled="isLoading">
                <span class="btn-text">
                  {{ isLoading ? 'PROCESANDO...' : (isLogin ? 'INICIAR SESIÓN' : 'REGISTRARME') }}
                </span>
              </button>

              <!-- Botón de Google -->
              <div class="google-login-container">
                  <div class="separator">
                      <span>O continúa con</span>
                  </div>
                  <button type="button" @click="initGoogleLogin" class="google-btn">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" />
                      Google
                  </button>
              </div>
            </form>

            <div class="footer-links">
              <p v-if="isLogin">
                ¿No tienes una cuenta? 
                <a href="#" @click.prevent="isLogin = false" class="link red">Únete a la flota</a>
              </p>
              <p v-else>
                ¿Ya eres parte de TicoAutos? 
                <a href="#" @click.prevent="isLogin = true" class="link red">Inicia Sesión</a>
              </p>
              <p class="explore-without-account-wrapper">
                <a href="#" @click.prevent="$router.push('/vehicles')" class="link outline explore-btn">Explorar sin cuenta 🔍</a>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import authBrandSide from './authBrandSide.vue';
import authInput from './authInput.vue';
import { useAuth } from '@/composables/useAuth.js';

const { form, isLogin, isLoading, error, legalName, handleSubmit, initGoogleLogin } = useAuth();
</script>

<style src="../../assets/styles/auth.css"></style>
<style scoped src="../../assets/styles/loginViewScoped.css"></style>
